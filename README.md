# mirai-tuling-bot

一个由 Node.js 编写的小程序，通过调用 [图灵机器人](http://www.turingapi.com/) API 来让其谈笑风生

本项目在 [mirai-api-http](https://github.com/project-mirai/mirai-api-http) 环境下调试，两者搭配食用更佳~

## 使用方法

1. 克隆本项目 `git clone https://github.com/Talaxy009/mirai-tuling-bot.git`

2. 移动到本地仓库 `cd ./mirai-tuling-bot`

3. 安装依赖 `npm install`

4. 复制一份 `config.default.json` 修改名字为 `config.json` 后对其进行编辑，设置文件相关说明在此 → [点我](https://github.com/Talaxy009/mirai-tuling-bot/blob/master/docs/config.md)

5. 启动 `npm start`

若一切正常，你应该会收到一个消息，并在控制台内看到一些设置信息

## TODO 🕊

~~划线~~为已完成，🕊 为部分完成

- 实现配置文件热重载

- ~~实装每个 QQ 限制调用次数功能~~

- 支持更多的图灵机器人功能 🕊

→ 目前已实现接收图片和发送 Url 功能，其余功能由于只有免费版图灵暂时无法进行调试
