import * as express from "express";
import {Express, Router} from "express";
import {connect} from "mongoose";
import {port, mongoDB} from "./config";
import routes from "./config/router";
import {Route} from "./types/config";

// 实例化express对象
const app: Express = express();
// 配置路由
const router: Router = Router();
routes.forEach((route: Route) => router[route.type](route.path, route.handler));
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
    console.log("connect db success");
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })
}).catch(err => {
    throw err;
})
app.listen()