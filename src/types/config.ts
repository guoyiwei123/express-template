import {Request, Response} from "express";
export interface CtrlRouteType{
    [propName: string]: (req: Request, res: Response) => Promise<void> | void;
}
// mongodb连接配置
export interface MongoDBType{
    host?: string
    port?: string
    username?: string
    password?: string
    database?: string
}
