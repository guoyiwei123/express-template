import {resolve} from "path";
import {existsSync, mkdirSync, createWriteStream, WriteStream} from "fs";
import {Request, Response} from "express";
import * as moment from "moment";
import {getRealIp} from "./network";
import {WsObjType} from "../types/utils";
// 判断日志根目录是否存在,不存在则创建
const loggerPath = resolve(__dirname, "../../runtime");
existsSync(loggerPath) || mkdirSync(loggerPath)
// 写入流列表
const wsList = {}
// 写入日志
export const writeLogger = (logName: string, context: string) => {
    // 获取当前日期
    const dateTime = moment().utcOffset(8).format("YYYY-MM-DD");
    // 获取写入流状态
    let wsObj: WsObjType = Reflect.get(wsList, logName);
    // 判断当前写入对象是否存在。并且为当天的写入流
    if(!(wsObj && wsObj.dateTime == dateTime)){
        // 判断今天的日志是否存在,不存在则创建
        const todayLoggerPath: string = resolve(loggerPath, dateTime);
        existsSync(todayLoggerPath) || mkdirSync(todayLoggerPath);
        const urlLoggerPath: string = resolve(todayLoggerPath, `${logName}.log`);
        // 创建写入流，保存到列表中
        const ws: WriteStream = createWriteStream(urlLoggerPath, {
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
export const successLogger = (req: Request, res: Response) => {
    writeLogger("success", `[${getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}`+ "\n" 
    + `body: ${JSON.stringify(req.body)}`);
}
// 响应异常日志保存
export const catchLogger = (req: Request, res: Response, err: string) => {
    writeLogger("error", `[${getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}`+ "\n" 
    + `body: ${JSON.stringify(req.body)}` + "\n" 
    + `errMsg: ${err}`);
}