const {checkSchema} = require("express-validator");
const {validator} = require("../utils/middleware");
exports.index = validator(checkSchema({
    id: {
        isLength: {
            errorMessage: "length error",
            options: {
                min: 2
            }
        }
    }
}), (req, res) => {
    aaa.b = 1;
})