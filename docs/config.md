# 设置文件介绍

一个默认的设置文件应该如下

``` json
{
    "cqws": {
        "host": "127.0.0.1",
        "port": 6700,
        "enableAPI": true,
        "enableEvent": true,
        "accessToken": "",
        "reconnection": true,
        "reconnectionAttempts": 10,
        "reconnectionDelay": 5000
    },
    "bot": {
        "admin": -1,
        "Apikey": "",
        "PerQQLimit": 50,
        "needAt": true,
        "greet": "哈喽，我准备聊天了！",
        "refuse": "今天聊得太多了，明天再聊吧~"
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

## cqws 分支（连接相关，一般不需要修改）

- host——websocket 服务器地址

- port——websocket 服务器端口

- enableAPI——启用 API

- enableEvent——启用 EVENT

- accessToken——连接令牌

- reconnection——是否重连

- reconnectionAttempts——尝试重连次数

- reconnectionDelay——每次重连尝试间隔

## bot 分支（机器人设置相关）

- admin——管理员 QQ（一般为你的 QQ，机器人连接成功后会发送消息到此 QQ 上）

- ApiKey——你在图灵机器人官网申请的 API

- PerQQLimit——每个 QQ 每天最高聊天次数限制（若为 0 则不限制）

- needAt——触发机器人聊天是否需要 @

- greet——机器人连接成功后向管理员发送的消息

## message 分支

不要修改，这是机器人发送请求所用的格式，我只是省力保存在这了 ( = v =)ok
