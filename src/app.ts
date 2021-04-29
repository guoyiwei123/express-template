import {resolve} from "path";
import * as express from "express";
import {Express, Router, Request, Response, NextFunction} from "express";
import {connect} from "mongoose";
import {json, urlencoded} from "body-parser";
import {getBreadthFileList} from "@ninggure/utils/fileList";
import {successLogger, catchLogger} from "./utils/logger";
import {port, mongoDB, openLogger} from "./config";
import {CtrlRouteType} from "./types/config";

// 实例化express对象
const app: Express = express();
// application/json
app.use(json());
// application/x-www-form-urlencoded
app.use(urlencoded({ extended: true })); 
/** 配置路由 **/
const router: Router = Router();
// 控制器路径
const ctrlPath: string = resolve(__dirname, "./controllers");
getBreadthFileList(ctrlPath).forEach((item: string) => {
    const path: string = item.replace(/\.[^.]*$/, '');
    const ctrlRoute: CtrlRouteType = require(path);
    const routePath: string = path.replace(ctrlPath, "").replace("\\", "/").replace(/index$/, "").replace(/index\//, "/");
    Object.keys(ctrlRoute).forEach((key: string | symbol) => {
        const route: string = String(key);
        router.all(`/api${routePath}${routePath == "/"?"": "/"}${route == "index"?"": route}`, async (req: Request, res: Response, next: NextFunction) => {
            try{
                await ctrlRoute[route](req, res);
                successLogger(req, res);
            }catch(e){
                next(e);
            }
        });
    })
});
// 404处理
router.all("*", (req: Request, res: Response) => {
    catchLogger(req, res, "Not Found");
    res.json({statusCode: 404, message: "Page not Found", data: null});
})
app.use(router);
// 错误处理
app.use((err: Error,req: Request, res: Response, next: NextFunction) => {
    catchLogger(req, res, err.stack || "");
    res.json({statusCode: 500, message: "Server Error", data: null});
    next();
});
// mongoDb连接
// const url: string = `mongodb+srv://${mongoDB.username?`${mongoDB.username}:${mongoDB.password}@`: ""}${mongoDB.host}${mongoDB.port?`:${mongoDB.port}`:""}/${mongoDB.database}`;
// connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     poolSize: 4
// }).then(() => {
//     console.log("connect db success");
//     app.listen(port, () => {
//         console.log(`Server running on http://localhost:${port}`);
//     })
// }).catch(err => {
//     throw err;
// })
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
app.listen()