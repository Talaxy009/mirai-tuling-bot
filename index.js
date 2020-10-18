const { default: Axios } = require('axios');
const { CQWebSocket } = require('cq-websocket');
const config = require('./config.json');
const bot = new CQWebSocket(config.cqws);
var url = "http://openapi.tuling123.com/openapi/api/v2";
var Msg = config.message;
Msg.userInfo.apiKey = config.bot.Apikey;

/**
 * 调用次数记录
 * @class Logger
 */
class Logger {
    constructor() {
        this.chattimes = [];
        this.date = new Date().getDate();

        //每日初始化
        setInterval(() => {
            let nowDate = new Date().getDate();
            if (this.date != nowDate) {
                this.date = nowDate;
                this.chattimes = [];
            }
        }, 60000);
    }

    //判断是否达到聊天限制次数
    canChat(u, limit) {
        if (limit == 0) return true;
        if (!this.chattimes[u]) this.chattimes[u] = 0;
        if (this.chattimes[u]++ < limit) return true;
        return false;
    }
}

var logger = new Logger();


//连接相关
bot.connect();

bot.on('socket.connecting', function (wsType, attempts) {
    console.log(new Date().toLocaleString() + ' 尝试第%d次连接[%s]中···', attempts, wsType,)
}).on('socket.connect', function (wsType, sock, attempts) {
    console.log(new Date().toLocaleString() + ' 第%d次连接[%s]成功! ( = v =)b', attempts, wsType);
    if (config.bot.admin > 0 && wsType === '/api') {
        setTimeout(() => {
            console.log(`APIKey: ${config.bot.Apikey}\n聊天限制次数: ${config.bot.PerQQLimit}/QQ\n是否需要@: ${config.bot.needAt ? '是' : '否'}`);
            bot('send_private_msg', {
                user_id: config.bot.admin,
                message: `${config.bot.greet}`
            });
        }, 1000)
    }
}).on('socket.failed', function (wsType, attempts) {
    console.log(new Date().toLocaleString() + ' 第%d次连接失败[%s]', attempts, wsType)
})

//设置监听
if (config.bot.needAt) {
    bot.on("message.group.@.me", GetMsg);
    bot.on("message.discuss.@.me", GetMsg);
    bot.on("message.private", GetMsg);
} else {
    bot.on("message.group", GetMsg);
    bot.on("message.discuss", GetMsg);
    bot.on("message.private", GetMsg);
};


/**
 * 获取消息
 * @param {object} e 
 * @param {object} context 
 */
function GetMsg(e, context) {
    e.stopPropagation();

    //判断聊天次数
    if (!logger.canChat(context.user_id, config.bot.PerQQLimit)) {
        SendMsg(context, config.bot.refuse);
        return;
    }

    //判断群组消息
    if (context.group_id) {
        Msg.userInfo.groupId = context.group_id;
    } else if (context.discuss_id) {
        Msg.userInfo.groupId = context.discuss_id;
    }

    Msg.userInfo.userId = context.user_id;
    var message = context.message;

    //判断消息类型
    if (isImg(message)) {
        Msg.reqType = 1;
        Msg.perception.inputImage.url = message.substring(58, message.length - 1);
    } else {
        Msg.reqType = 0;
        Msg.perception.inputText.text = message;
    }

    //调用API
    Axios.post(url, Msg
    ).then(function HandleMsg(response) {
        var GotMsg;
        if (response.data.results.length == 1) {
            GotMsg = response.data.results[0].values.text;
        } else {
            GotMsg = `${response.data.results[1].values.text}\n${response.data.results[0].values.url}`;
            Msg.perception.inputImage = ''; //清空图片URL
        }
        SendMsg(context, GotMsg);
    });

    return;
}


/**
 * 发送消息
 * @param {object} context 消息对象
 * @param {string} SendMsg 发送消息
 */
function SendMsg(context, SendMsg) {
    user = context.user_id;
    if (context.group_id) {
        var msg = `[CQ:at,qq=${user}]${SendMsg}`;
        var gd = context.group_id;
        bot('send_group_msg', {
            group_id: gd,
            message: msg,
        });
        console.log(`${new Date().toLocaleString()} 回复${gd}群, ${user}者:\n${msg}`);
        Msg.userInfo.groupId = ''; //清空群组信息
    } else if (context.discuss_id) {
        var msg = `[CQ:at,qq=${id}]${SendMsg}`;
        var gd = context.discuss_id;
        bot('send_discuss_msg', {
            discuss_id: gd,
            message: msg,
        });
        console.log(`${new Date().toLocaleString()} 回复${gd}讨论组, ${user}者:\n${msg}`);
        Msg.userInfo.groupId = ''; //清空群组信息
    } else {
        var msg = `${SendMsg}`;
        bot('send_private_msg', {
            user_id: context.user_id,
            message: msg,
        });
        console.log(`${new Date().toLocaleString()} 回复私聊${user}者:\n${msg}`);
    }
    return;
}


/**
 * 判断消息是否为图片
 * @param {string} str 接收的消息
 */
function isImg(str) {
    return (str.substring(0, 9) == "[CQ:image");
};