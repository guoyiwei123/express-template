"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealIp = void 0;
// 获取真实ip
const getRealIp = (req) => {
    return req.ips[0] || req.ip || req.socket.localAddress;
};
exports.getRealIp = getRealIp;
//# sourceMappingURL=network.js.map