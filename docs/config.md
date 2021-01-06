# 设置文件介绍

一个默认的设置文件应该如下

``` json
{
    "mirai": {
        "host": "http://127.0.0.1:8080",
        "authKey": "",
        "qq": 123456,
        "enableWebsocket": false
    },
    "bot": {
        "admin": 0,
        "apikey": "",
        "perQQLimit": 50,
        "needAt": true,
        "greet": "哈喽，我准备聊天了！",
        "refuse": "今天聊得太多了，明天再聊吧~",
        "debug": false
    },
    "message": {
        "reqType": 0,
        "perception": {
            "inputText": {
                "text": ""
            },
            "inputImage": {
                "url": ""
            }
        },
        "userInfo": {
            "apiKey": "",
            "groupId": "",
            "userId": ""
        }
    }
}
```

## mirai 分支（连接相关）

- host——mirai-api-http 的地址和端口，默认是 `http://127.0.0.1:8080`

- authKey——mirai-api-http 的 authKey（建议手动指定）

- qq——当前 BOT 对应的 QQ 号

- enableWebsocket——是否启用 Websocket（需要和 mirai-api-http 的设置一致）

## bot 分支（机器人设置相关）

- admin——管理员 QQ（一般为你的 QQ，机器人连接成功后会发送消息到此 QQ 上）

- ApiKey——你在图灵机器人官网申请的 API

- PerQQLimit——每个 QQ 每天最高聊天次数限制（若为 0 则不限制）

- needAt——触发机器人聊天是否需要 @

- greet——机器人连接成功后向管理员发送的消息

- refuse——达到聊天次数上限后触发的回复

- debug——是否开启 debug 模式，此选项会在控制台内显示每次聊天发送和接受具体消息

## message 分支

不要修改，这是机器人发送请求所用的格式，我只是省力保存在这了 ( = v =)ok
