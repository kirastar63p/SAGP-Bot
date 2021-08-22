/* 
 本文件为bot主逻辑，包含建立连接，注册监听等 
 */
import { CQWebSocket } from 'cq-websocket';
import adminPrivateMsg from './adminPrivateMsg.js';
import { getTime, sendMsg2Admin } from '../utils/index.js';
export default (config) => {
    // 新建bot实例，注册监听
    const bot = new CQWebSocket(config.cqws);
    bot.on('message.private', (e, context) => adminPrivateMsg(bot, context, config));

    // 连接相关监听
    bot
        .on('socket.connecting', (wsType, attempts) => console.log(`${getTime()} 连接中[${wsType}]#${attempts}`))
        .on('socket.failed', (wsType, attempts) => console.log(`${getTime()} 连接失败[${wsType}]#${attempts}`))
        .on('socket.error', (wsType, err) => {
            console.error(`${getTime()} 连接错误[${wsType}]`);
            console.error(err);
        })
        .on('socket.connect', (wsType, sock, attempts) => {
            console.log(`${getTime()} 连接成功[${wsType}]#${attempts}`);
            if (wsType === '/api') {
                setTimeout(() => {
                    sendMsg2Admin(bot, config, `已上线#${attempts}`);
                }, 1000);
            }
        });

    // connect
    bot.connect();

    return bot;
};
