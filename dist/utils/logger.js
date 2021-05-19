"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchLogger = exports.successLogger = exports.writeLogger = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const moment = require("moment");
const network_1 = require("./network");
// 判断日志根目录是否存在,不存在则创建
const loggerPath = path_1.resolve(__dirname, "../../runtime");
fs_1.existsSync(loggerPath) || fs_1.mkdirSync(loggerPath);
// 写入流列表
const wsList = {};
// 写入日志
const writeLogger = (logName, context) => {
    // 获取当前日期
    const dateTime = moment().format("YYYY-MM-DD");
    // 获取写入流状态
    let wsObj = Reflect.get(wsList, logName);
    // 判断当前写入对象是否存在。并且为当天的写入流
    if (!(wsObj && wsObj.dateTime == dateTime)) {
        // 判断今天的日志是否存在,不存在则创建
        const todayLoggerPath = path_1.resolve(loggerPath, dateTime);
        fs_1.existsSync(todayLoggerPath) || fs_1.mkdirSync(todayLoggerPath);
        const urlLoggerPath = path_1.resolve(todayLoggerPath, `${logName}.log`);
        // 创建写入流，保存到列表中
        const ws = fs_1.createWriteStream(urlLoggerPath, {
            encoding: "utf8",
            flags: "a"
        });
        wsObj = {
            dateTime: dateTime,
            ws: ws
        };
        Reflect.set(wsList, logName, wsObj);
    }
    // 将数据写入到写入流
    wsObj.ws.cork();
    wsObj.ws.write(`${moment().format("YYYY-MM-DD HH:mm:ss")} ${context}` + "\n\n");
    // 写入完成释放内存
    process.nextTick(() => {
        wsObj.ws.uncork();
    });
};
exports.writeLogger = writeLogger;
// 响应成功日志保存
const successLogger = (req, res) => {
    exports.writeLogger("success", `[${network_1.getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}` + "\n"
        + `body: ${JSON.stringify(req.body)}`);
};
exports.successLogger = successLogger;
// 响应异常日志保存
const catchLogger = (req, res, err) => {
    exports.writeLogger("error", `[${network_1.getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}` + "\n"
        + `body: ${JSON.stringify(req.body)}` + "\n"
        + `errMsg: ${err}`);
};
exports.catchLogger = catchLogger;
//# sourceMappingURL=logger.js.map