/* 
 本文件为bot主逻辑，包含建立连接，注册监听,回复行为等 
 */
const { CQWebSocket } = require('cq-websocket');
const { getTime, sendMsg2Admin, replyMsg } = require('../utils');
const { version } = require('../../package.json');
// 引入其他模块
const adminPrivateMsg = require('./adminPrivateMsg');
const sendSetu = require('./setu');
module.exports = (config) => {
    // 新建bot实例，注册监听
    const bot = new CQWebSocket(config.cqws);
    // 连接相关监听
    bot
        .on('socket.connecting', (wsType, attempts) => console.log(`${getTime()} 连接中[${wsType}]#${attempts}`))
        .on('socket.failed', (wsType, attempts) => console.log(`${getTime()} 连接失败[${wsType}]#${attempts}`))
        .on('socket.error', (wsType, err) => {
            console.error(`${getTime()} 连接错误[${wsType}]`);
            console.error(err);
        })
        .on('socket.connect', (wsType, _, attempts) => {
            console.log(`${getTime()} 连接成功[${wsType}]#${attempts}`);
            if (wsType === '/api') {
                setTimeout(() => {
                    sendMsg2Admin(bot, config, `已上线#${attempts}`);
                }, 1000);
            }
        });

    // 自定义监听
    bot.on('message.private', (_, context) => {
        // 判断管理员回复
        if (context.user_id === config.bot.admin) {
            // adminPrivateMsg(bot, context);
        };
        // 回复私聊
        switch (context.message) {
            case '--version': {
                replyMsg(bot, context, version);
                break;
            }
            default: {
                sendSetu(bot, context, config, false);
                //通用处理
            }
        }
    });

    // 群聊
    bot.on('message.group', (_, context) => {
        sendSetu(bot, context, config, false);
    });

    // 发起连接
    bot.connect();
    return bot;
};
