const {resolve} = require("path");
const {existsSync, mkdirSync, createWriteStream} = require("fs");
const moment =  require("moment");
const {getRealIp} = require("./network");
// 判断日志根目录是否存在,不存在则创建
const loggerPath = resolve(__dirname, "../runtime");
existsSync(loggerPath) || mkdirSync(loggerPath)
// 写入流列表
const wsList = {}
// 写入日志
const writeLogger = (logName, context) => {
    // 获取当前日期
    const dateTime = moment().utcOffset(8).format("YYYY-MM-DD");
    // 获取写入流状态
    let wsObj = Reflect.get(wsList, logName);
    // 判断当前写入对象是否存在。并且为当天的写入流
    if(!(wsObj && wsObj.dateTime === dateTime)){
        // 判断今天的日志是否存在,不存在则创建
        const todayLoggerPath = resolve(loggerPath, dateTime);
        existsSync(todayLoggerPath) || mkdirSync(todayLoggerPath);
        const urlLoggerPath = resolve(todayLoggerPath, `${logName}.log`);
        // 创建写入流，保存到列表中
        const ws = createWriteStream(urlLoggerPath, {
            encoding: "utf8",
            flags: "a"
        })
        wsObj = {
            dateTime: dateTime,
            ws: ws
        }
        Reflect.set(wsList, logName, wsObj);
    }
    // 将数据写入到写入流
    wsObj.ws.cork();
    wsObj.ws.write(`${moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")} ${context}` + "\n\n");
    // 写入完成释放内存
    process.nextTick(() => {
        wsObj.ws.uncork();
    })
}
// 响应成功日志保存
const successLogger = (ctx, responseData) => {
    writeLogger("success", `[${getRealIp(ctx.req)}] ${ctx.req.method} ${ctx.statusCode} ${ctx.req.protocol}://${ctx.req.hostname}${ctx.req.originalUrl}`+ "\n" 
    + `body: ${JSON.stringify(ctx.req.body)}` + "\n"
    + `response: ${JSON.stringify(responseData)}`)
}
// 响应异常日志保存
const catchLogger = (req, res, err) => {
    writeLogger("error", `[${getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}`+ "\n" 
    + `body: ${JSON.stringify(req.body)}` + "\n" 
    + `errMsg: ${err}`);
}
module.exports = {
    writeLogger,
    successLogger,
    catchLogger
}