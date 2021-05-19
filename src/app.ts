import {resolve} from "path";
import * as express from "express";
import {Express, Router, Request, Response} from "express";
import {connect} from "mongoose";
import {json, urlencoded} from "body-parser";
import {getBreadthFileList} from "@ninggure/utils/fileList";
import {successLogger, catchLogger, writeLogger} from "./utils/logger";
import {port, mongoDB} from "./config";
import {CtrlRouteType} from "./types/config";

// 实例化express对象
const app: Express = express();
app.set("trust proxy", true);
app.set("x-powered-by", false);
app.use(json());
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
        router.all(`/api${routePath}${routePath == "/"?"": "/"}${route == "index"?"": route}`, async (req: Request, res: Response) => {
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
router.all("*", (req: Request, res: Response) => {
    catchLogger(req, res, "Not Found");
    res.json({statusCode: 404, message: "Page not Found", data: null});
})
app.use(router);
// mongoDb连接
const url: string = `mongodb+srv://${mongoDB.username?`${mongoDB.username}:${mongoDB.password}@`: ""}${mongoDB.host}${mongoDB.port?`:${mongoDB.port}`:""}/${mongoDB.database}`;
connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 4
}).then(() => {
    writeLogger("system", `connect mongodb success!!`);
    app.listen(port, () => {
        writeLogger("system", `Server running on http://0.0.0.0:${port}`);
    })
}).catch(err => {
    writeLogger("system", `connect mongodb error: ${err.stack || ""}`);
    app.listen(port, () => {
        writeLogger("system", `Server running on http://0.0.0.0:${port}`);
    })
})

app.listen()