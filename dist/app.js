"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express = require("express");
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const body_parser_1 = require("body-parser");
const fileList_1 = require("@ninggure/utils/fileList");
const logger_1 = require("./utils/logger");
const config_1 = require("./config");
// 实例化express对象
const app = express();
app.set("trust proxy", true);
app.set("x-powered-by", false);
app.use(body_parser_1.json());
app.use(body_parser_1.urlencoded({ extended: true }));
/** 配置路由 **/
const router = express_1.Router();
// 控制器路径
const ctrlPath = path_1.resolve(__dirname, "./controllers");
fileList_1.getBreadthFileList(ctrlPath).forEach((item) => {
    const path = item.replace(/\.[^.]*$/, '');
    const ctrlRoute = require(path);
    const routePath = path.replace(ctrlPath, "").replace("\\", "/").replace(/index$/, "").replace(/index\//, "/");
    Object.keys(ctrlRoute).forEach((key) => {
        const route = String(key);
        router.all(`/api${routePath}${routePath == "/" ? "" : "/"}${route == "index" ? "" : route}`, async (req, res) => {
            try {
                await ctrlRoute[route](req, res);
                logger_1.successLogger(req, res);
            }
            catch (err) {
                res.json({ statusCode: 500, message: "Server Error", data: null });
                logger_1.catchLogger(req, res, err.stack || "");
            }
        });
    });
});
// 404处理
router.all("*", (req, res) => {
    logger_1.catchLogger(req, res, "Not Found");
    res.json({ statusCode: 404, message: "Page not Found", data: null });
});
app.use(router);
// mongoDb连接
const url = `mongodb+srv://${config_1.mongoDB.username ? `${config_1.mongoDB.username}:${config_1.mongoDB.password}@` : ""}${config_1.mongoDB.host}${config_1.mongoDB.port ? `:${config_1.mongoDB.port}` : ""}/${config_1.mongoDB.database}`;
mongoose_1.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 4
}).then(() => {
    logger_1.writeLogger("system", `connect mongodb success!!`);
    app.listen(config_1.port, () => {
        logger_1.writeLogger("system", `Server running on http://0.0.0.0:${config_1.port}`);
    });
}).catch(err => {
    logger_1.writeLogger("system", `connect mongodb error: ${err.stack || ""}`);
    app.listen(config_1.port, () => {
        logger_1.writeLogger("system", `Server running on http://0.0.0.0:${config_1.port}`);
    });
});
app.listen();
//# sourceMappingURL=app.js.map