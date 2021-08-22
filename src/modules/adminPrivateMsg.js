import { parseArgs, replyMsg } from '../utils/index.js';
export default (bot, context, config) => {
    // 判断是否管理员
    if (context.user_id !== config.bot.admin) return;
    // 解析变量
    const args = parseArgs(context.message);
    replyMsg(bot, context, '管理员');
};