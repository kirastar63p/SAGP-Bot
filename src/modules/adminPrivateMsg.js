const { parseArgs, replyMsg } = require('../utils/index.js');

class User {
    constructor(number) {
        this.status = {};
        this.status[number] = true;
    }
}

module.exports = (bot, context) => {
    // 解析变量
    // const args = parseArgs(context.message);
    // console.log(context.message);
    // // console.log(context);
    // if(context.message == 1){
    //     const qqNumber = context.sender.user_id;
    //     const user = new User(qqNumber);
    // }

    replyMsg(bot, context, '测试管理员权限');
};