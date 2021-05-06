## 目录结构
```
-   dist 打包之后目录
-   runtime 日志存放目录
-   src 主目录
    -   config 配置
    -   controllers 控制器
    -   models 数据库模型目
    -   types 自定义类型
    -   utils 工具方法
    -   app.ts 入口文件
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