const express = require("express");
const {json, urlencoded} = require("body-parser");
const {successLogger, catchLogger, writeLogger} = require("./utils/logger");
const {port, errorCatch} = require("./config");
const routes = require("./config/router");
// 实例化express对象
const app = express();
const router = express.Router();
app.set("trust proxy", true);
app.set("x-powered-by", false);
app.use(json());
app.use(urlencoded({ extended: true })); 
app.response.sendData = function({statusCode=0, message="", data=null}){
    // 定义格式
    const responseData = {
        statusCode,
        message,
        data
    };
    // 写入日志
    successLogger(this, responseData);
    return this.send(responseData);
}
/** 配置路由 **/
// 设置路由
const setRouter = ({route, handler, method="all"}) => {
    router[method](`/api${route}`, async (req, res) => {
        try{
            await handler(req, res);
        }catch(err){
            catchLogger(req, res, err.stack || "");
            // 判断是否错误拦截
            errorCatch?
                res.json({statusCode: 500, message: "Server Error", data: null})
                : res.end(`${err.stack || ""}`);
        }
    });
}
routes.forEach(setRouter);
// 404处理
router.all("*", (req, res) => {
    catchLogger(req, res, "Not Found");
    res.json({statusCode: 404, message: "Page not Found", data: null});
});
app.use(router);
app.listen(port, () => {
    writeLogger("system", `Server running on http://0.0.0.0:${port}`);
});