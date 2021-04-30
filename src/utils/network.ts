import {Request} from "express";
// 获取真实ip
export const getRealIp = (req: Request) => {
    return req.ips[0] || req.ip || req.socket.localAddress;
}