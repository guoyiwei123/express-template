const {validationResult} = require("express-validator");
exports.validator = (schemas, handler) => {
    return async(req, res) => {
        await schemas.run(req);
        // 校验结果
        const validateRes = validationResult(req);
        const errResList = validateRes.array();
        // 判断错误列表是否为空
        if(errResList.length){
            return res.json({
                statusCode: 400,
                message: errResList[0].msg,
                data: null
            })
        }
        return await handler(req, res);
    }
}