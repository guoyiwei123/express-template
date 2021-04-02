import {Request, Response} from "express";
// mongodb连接配置
export interface MongoDB{
    host?: string
    port?: string
    username?: string
    password?: string
    database?: string
}
// 路由配置
export interface Route{
    type: "get" | "post" | "put" | "delete"
    path: string | RegExp
    handler: (req: Request, res: Response) => Promise<void> | void
}
