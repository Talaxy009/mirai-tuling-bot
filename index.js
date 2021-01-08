const { default: Axios } = require("axios");
const Mirai = require("node-mirai-sdk");
const { Plain, At, Image } = Mirai.MessageComponent;
const config = require("./config.json");
const bot = new Mirai(config.mirai);
const url = "http://openapi.tuling123.com/openapi/api/v2";
let PostBody = config.message;
PostBody.userInfo.apiKey = config.bot.apikey;

/**
 * 调用次数记录
 * @class Logger
 */
class Logger {
    constructor() {
        this.chattimes = [];
        this.date = new Date().getDate();

        // 每日初始化
        setInterval(() => {
            let nowDate = new Date().getDate();
            if (this.date != nowDate) {
                this.date = nowDate;
                this.chattimes = [];
            }
        }, 60000);
    }

    // 判断是否达到聊天限制次数
    canChat(u, limit) {
        if (limit == 0) return true;
        if (!this.chattimes[u]) this.chattimes[u] = 0;
        if (this.chattimes[u]++ < limit) return true;
        return false;
    }
}

var logger = new Logger();

// auth 认证
bot.onSignal("authed", () => {
    console.log(
        `${new Date().toLocaleString()} 通过: ${bot.sessionKey} 认证中···`
    );
    bot.verify();
});

// session 校验回调
bot.onSignal("verified", () => {
    let messageChain = [{ type: "Plain", text: config.bot.greet }];
    if (config.bot.admin) {
        bot.sendFriendMessage(messageChain, config.bot.admin);
    }
    console.log(
        `${new Date().toLocaleString()} 通过: ${bot.sessionKey} 认证成功!\n`
    );
    console.log(
        `APIKey: ${config.bot.apikey}\n聊天限制次数: ${
            config.bot.perQQLimit
        }/QQ\n是否需要@: ${config.bot.needAt ? "是" : "否"}\ndebug模式: ${
            config.bot.debug ? "是" : "否"
        }\n`
    );
});

// 设置监听
bot.onMessage(GetMsg);
bot.listen("all");

// 退出前向 mirai-http-api 发送释放指令
process.on("exit", () => {
    bot.release();
});

/**
 * 获取消息
 * @param {object} message 消息对象
 */
function GetMsg(message) {
    const { type, sender, messageChain, reply } = message;

    // 判断消息类型
    let at = [];
    let replyType = false;
    messageChain.forEach((chain) => {
        switch (chain.type) {
            case "At":
                at.push(At.value(chain).target);
                break;
            case "Plain":
                PostBody.perception.inputText.text = Plain.value(chain);
                break;
            case "Image":
                PostBody.perception.inputImage.url = Image.value(chain).url;
                PostBody.reqType = 1;
                break;
            default:
                break;
        }
    });

    switch (type) {
        case "GroupMessage":
            if (config.bot.needAt && !at.includes(bot.qq)) {
                Clean(PostBody);
                return;
            }
            PostBody.userInfo.groupId = sender.group.id;
            PostBody.userInfo.userId = sender.id;
            replyType = true;
            break;
        case "FriendMessage":
            PostBody.userInfo.groupId = "";
            PostBody.userInfo.userId = sender.id;
            replyType = false;
            break;
    }

    // 判断聊天次数
    if (!logger.canChat(sender.id, config.bot.perQQLimit)) {
        reply(config.bot.refuse);
        return;
    }

    // 调用API
    Axios.post(url, PostBody).then((response) => {
        let GotMsg;
        let results = response.data.results;

        if (results.length === 1) {
            GotMsg = results[0].values.text;
        } else {
            GotMsg = `${results[1].values.text}\n${results[0].values.url}`;
        }

        // debug模式
        if (config.bot.debug) {
            console.log("\n发送消息:");
            console.log(PostBody);
            console.log("接收消息:");
            console.log(results);
        } else {
            console.log(
                `${new Date().toLocaleString()}回复${sender.id}: ${GotMsg}`
            );
        }

        bot.reply(GotMsg, message, replyType);
        Clean(PostBody);
    });
    return;
}

/**
 * 清除 PostBody
 * @param {Object} item 清理对象
 */
function Clean(item) {
    item.reqType = 0;
    item.perception.inputText.text = item.perception.inputImage.url = "";
}
