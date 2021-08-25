
# Express-Template
该项目快速搭建`Express`项目, 包括`路由配置`，`日志系统`，`错误捕获`，及一些自定义方法等，方便使用。
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
```

## 配置
### 基础配置
-   port: 端口号
-   errorCatch: 是否开启错误捕获

### 路由配置
格式:
```
// 默认为支持所有请求方式
{route: "/", handler: index}

// 也可以设置请求方式
{route: "/", handler: index, method: "get"},
{route: "/setData", handler: index, method: "post"}

// method设置为all时支持所有请求方式
{route: "/setData", handler: index, method: "all"}
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