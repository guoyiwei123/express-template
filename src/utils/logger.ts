import {resolve} from "path";
import {existsSync, mkdirSync, writeFile} from "fs";
import {Request, Response} from "express";
import * as moment from "moment";
const loggerPath = resolve(__dirname, "../../runtime");

// 写入日志
export const writeLogger = (logName: string, context: string) => {
    // 判断日志根目录是否存在,不存在则创建
    existsSync(loggerPath) || mkdirSync(loggerPath)
    // 判断今天的日志是否存在,不存在则创建
    const todayLoggerPath = resolve(loggerPath, moment().format("YYYY-MM-DD"));
    existsSync(todayLoggerPath) || mkdirSync(todayLoggerPath);
    // 判断是否有日志文件，没有则创建
    const urlLoggerPath = resolve(todayLoggerPath, `${logName}.log`);
    writeFile(urlLoggerPath, context, {
        encoding: "utf8",
        flag: "a"
    },() => {})
}

// 响应成功日志保存
export const successLogger = (req: Request, res: Response) => {
    writeLogger("success", moment().format("YYYY-MM-DD HH:mm:ss") + "\n" 
    + `url: ${req.protocol}://${req.hostname}${req.originalUrl}`+ "\n" 
    + `status: ${res.statusCode}`+ "\n" 
    + `method: ${req.method}`+ "\n" 
    + `body: ${JSON.stringify(req.body)}` + "\n\n");
}

// 响应异常日志保存
export const catchLogger = (req: Request, res: Response, err: string) => {
    writeLogger("error", moment().format("YYYY-MM-DD HH:mm:ss") + "\n" 
    + `url: ${req.protocol}://${req.hostname}${req.originalUrl}`+ "\n" 
    + `method: ${req.method}`+ "\n" 
    + `body: ${JSON.stringify(req.body)}` + "\n" 
    + `errMsg: ${err}` + "\n\n");
}