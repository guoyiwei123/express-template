"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express = require("express");
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const body_parser_1 = require("body-parser");
const fileList_1 = require("@ninggure/utils/fileList");
const config_1 = require("./config");
// 实例化express对象
const app = express();
// application/json
app.use(body_parser_1.json());
// application/x-www-form-urlencoded
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
        router.all(`/api${routePath}${routePath == "/" ? "" : "/"}${route == "index" ? "" : route}`, async (req, res, next) => {
            try {
                await ctrlRoute[route](req, res);
            }
            catch (e) {
                next(e);
            }
        });
    });
});
// 404处理
router.all("*", (req, res) => {
    res.json({ statusCode: 404, message: "Page not Found", data: null });
});
app.use(router);
// 错误处理
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.json({ statusCode: 500, message: "Server Error", data: null });
    next();
});
// mongoDb连接
const url = `mongodb+srv://${config_1.mongoDB.username ? `${config_1.mongoDB.username}:${config_1.mongoDB.password}@` : ""}${config_1.mongoDB.host}${config_1.mongoDB.port ? `:${config_1.mongoDB.port}` : ""}/${config_1.mongoDB.database}`;
mongoose_1.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 4
}).then(() => {
    console.log("connect db success");
    app.listen(config_1.port, () => {
        console.log(`Server running on http://localhost:${config_1.port}`);
    });
}).catch(err => {
    throw err;
});
app.listen();
//# sourceMappingURL=app.js.map