"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const logger_1 = require("../utils/logger");
const test = async (req, res) => {
    // testModel.find().then((ctx: any) => {
    //     console.log(ctx);
    //     res.status(200).end("111");
    // })
    logger_1.writeLogger("test", "1111");
    throw new Error("12321");
    res.status(200).end("111");
};
exports.test = test;
//# sourceMappingURL=index.js.map