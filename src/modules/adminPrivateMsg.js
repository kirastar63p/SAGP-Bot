const { parseArgs, replyMsg } = require('../utils/index.js');
module.exports = (bot, context) => {
    // 解析变量
    const args = parseArgs(context.message);
    replyMsg(bot, context, '测试管理员权限');
};