"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchLogger = exports.successLogger = exports.writeLogger = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const moment = require("moment");
const network_1 = require("./network");
const loggerPath = path_1.resolve(__dirname, "../../runtime");
// 写入日志
const writeLogger = (logName, context) => {
    // 判断日志根目录是否存在,不存在则创建
    fs_1.existsSync(loggerPath) || fs_1.mkdirSync(loggerPath);
    // 判断今天的日志是否存在,不存在则创建
    const todayLoggerPath = path_1.resolve(loggerPath, moment().format("YYYY-MM-DD"));
    fs_1.existsSync(todayLoggerPath) || fs_1.mkdirSync(todayLoggerPath);
    // 判断是否有日志文件，没有则创建
    const urlLoggerPath = path_1.resolve(todayLoggerPath, `${logName}.log`);
    fs_1.writeFile(urlLoggerPath, context, {
        encoding: "utf8",
        flag: "a"
    }, () => { });
};
exports.writeLogger = writeLogger;
// 响应成功日志保存
const successLogger = (req, res) => {
    exports.writeLogger("success", `${moment().format("YYYY-MM-DD HH:mm:ss")} [${network_1.getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}` + "\n"
        + `body: ${JSON.stringify(req.body)}` + "\n\n");
};
exports.successLogger = successLogger;
// 响应异常日志保存
const catchLogger = (req, res, err) => {
    exports.writeLogger("error", `${moment().format("YYYY-MM-DD HH:mm:ss")} [${network_1.getRealIp(req)}] ${req.method} ${res.statusCode} ${req.protocol}://${req.hostname}${req.originalUrl}` + "\n"
        + `body: ${JSON.stringify(req.body)}` + "\n"
        + `errMsg: ${err}` + "\n\n");
};
exports.catchLogger = catchLogger;
//# sourceMappingURL=logger.js.map