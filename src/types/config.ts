import {Request, Response} from "express";
export interface CtrlRoute{
    [propName: string]: (req: Request, res: Response) => Promise<void> | void;
}
// mongodb连接配置
export interface MongoDB{
    host?: string
    port?: string
    username?: string
    password?: string
    database?: string
}
