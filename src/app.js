const {resolve} = require("path");
const express = require("express");
const {json, urlencoded} = require("body-parser");
const {getBreadthFileList} = require("@ninggure/utils/fileList");
const {successLogger, catchLogger, writeLogger} = require("./utils/logger");
const {port} = require("./config");
// 实例化express对象
const app = express();
const router = express.Router()
app.set("trust proxy", true);
app.set("x-powered-by", false);
app.use(json());
app.use(urlencoded({ extended: true })); 
/** 配置路由 **/
// 控制器路径
const ctrlPath = resolve(__dirname, "./controllers");
getBreadthFileList(ctrlPath).forEach((item) => {
    const path = item.replace(/\.[^.]*$/, '');
    const ctrlRoute = require(path);
    const routePath = path.replace(ctrlPath, "").replace("\\", "/").replace(/index$/, "").replace(/index\//, "/");
    Object.keys(ctrlRoute).forEach((key) => {
        const route = String(key);
        router.all(`/api${routePath}${routePath == "/"?"": "/"}${route == "index"?"": route}`, async (req, res) => {
            try{
                await ctrlRoute[route](req, res);
                successLogger(req, res);
            }catch(err){
                res.json({statusCode: 500, message: "Server Error", data: null});
                catchLogger(req, res, err.stack || "");
            }
        });
    })
});
// 404处理
router.all("*", (req, res) => {
    catchLogger(req, res, "Not Found");
    res.json({statusCode: 404, message: "Page not Found", data: null});
});
app.use(router);
app.listen(port, () => {
    writeLogger("system", `Server running on http://0.0.0.0:${port}`);
});