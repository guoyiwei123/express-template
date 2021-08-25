const {checkSchema} = require("express-validator");
const {validator} = require("../utils/middleware");
exports.index = validator(checkSchema({
    
}), (req, res) => {
    res.sendData({message: "hello express"})
})