## 目录结构
```
-   dist 打包之后目录
-   runtime 日志存放目录
-   src 主目录
    -   config 配置
        - index.js 基础配置
        - router.js 路由配置
    -   controllers 控制器
    -   types 自定义类型
    -   utils 工具方法
    -   app.js 应用入口
-   index.js 启动入口
```

## 命令
```
$ npm run dev 开启本地服务器
$ npm run watch 开启文件打包监听模式
$ npm run build 打包
```

## 日志模块
-   请求成功模块(success.log)
-   请求异常模块(error.log)
-   系统日志模块(system.log)

## 自定义方法
### 中间件
-   validator(校验器)
```
const {checkSchema} = require("express-validator");
const {validator} = require("../utils/middleware");
// 使用validator进行参数校验
exports.index = validator(checkSchema({
    id: {
        isLength: {
            errorMessage: "length error",
            options: {
                min: 2
            }
        }
    }
}), (req, res) => {})
```
> express-validator文档地址: https://express-validator.github.io/docs/

### 方法
-   res.sendData(响应方法)
```
exports.index = validator(checkSchema({
    
}), (req, res) => {
    // sendData默认值为{ statusCode: 0, message: "", data: {} }
    res.sendData({
        statusCode: 0,
        message: "",
        data: {}
    });
})
```