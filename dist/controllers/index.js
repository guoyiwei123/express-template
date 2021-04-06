"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test_1 = require("../models/test");
const test = async (req, res) => {
    test_1.default.find().then((ctx) => {
        console.log(ctx);
        res.status(200).end("111");
    });
};
exports.test = test;
//# sourceMappingURL=index.js.map