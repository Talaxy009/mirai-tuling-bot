const { default: Axios } = require('axios');
const { CQWebSocket } = require('cq-websocket');
const config = require('./config.json');
const bot = new CQWebSocket(config.cqws);
var url = "http://openapi.tuling123.com/openapi/api/v2";
var Msg = config.message;
Msg.userInfo.apiKey = config.bot.Apikey;


//连接
bot.connect();

bot.on('socket.connecting', function (wsType, attempts) {
    console.log(new Date().toLocaleString() + ' 尝试第%d次连接[%s]中···', attempts, wsType,)
}).on('socket.connect', function (wsType, sock, attempts) {
    console.log(new Date().toLocaleString() + ' 第%d次连接[%s]成功! ( = v =)b', attempts, wsType);
    if (config.bot.admin > 0 && wsType === '/api') {
        setTimeout(() => {
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
    bot.on("message.group.@.me", GroupMsg);
    bot.on("message.discuss.@.me", DiscussMsg);
    bot.on("message.private", PrivateMsg);
} else {
    bot.on("message.group", GroupMsg);
    bot.on("message.discuss", DiscussMsg);
    bot.on("message.private", PrivateMsg);
};

/** 
* 接受群消息
*/
function GroupMsg(e, context) {
    let group = context.group_id;
    let message = context.message;
    let user = context.user_id;

    e.stopPropagation();
    reply(group, user, message, 0);
};

/** 
* 接受讨论组消息
*/
function DiscussMsg(e, context) {
    let discuss = context.discuss_id;
    let message = context.message;
    let user = context.user_id;

    e.stopPropagation();
    reply(discuss, user, message, 1);
};

/** 
* 接受私聊消息
*/
function PrivateMsg(e, context) {
    let user = context.user_id;
    let message = context.message;

    e.stopPropagation();
    reply(null, user, message, 2);
};

/** 
* 发送消息&获取回复&发送回复
* @param gd 群/讨论组ID 
* @param id 消息发送者ID
* @param msg 发送消息
* @param type 消息类型
*/
function reply(gd, id, msg, type) {
    Msg.perception.inputText.text = msg;
    Msg.userInfo.userId = id;
    Msg.userInfo.groupId = gd;
    Axios.post(url, Msg
    ).then(function Send(response) {
        var GotMsg = response.data.results[0].values.text;
        var SendMsg = null;
        switch (type) {
            case 0:
                SendMsg = `[CQ:at,qq=${id}]${GotMsg}`;
                bot('send_group_msg', {
                    group_id: gd,
                    message: SendMsg,
                });
                console.log(`${new Date().toLocaleString()} 回复${gd}群, ${id}者:`);
                break;

            case 1:
                SendMsg = `[CQ:at,qq=${id}]${GotMsg}`;
                bot('send_discuss_msg', {
                    discuss_id: gd,
                    message: SendMsg,
                });
                console.log(`${new Date().toLocaleString()} 回复${gd}讨论组, ${id}者:`);
                break;

            default:
                SendMsg = `${GotMsg}`;
                bot('send_private_msg', {
                    user_id: id,
                    message: SendMsg,
                });
                console.log(`${new Date().toLocaleString()} 回复私聊${id}者:`);
                break;
        };
        console.log(GotMsg);
    }).catch(function (error) {
        console.log(error);
    });
};