const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg } = require('../../utils');
const CQ = require('../../utils/CQ');
const { MakeSeed, getConfig } = require('./utils');
const API_URL = 'https://api.jisuapi.com/qqluck/query';
var util = require('util');
const zhanbuConfig = getConfig();

module.exports = function sendZhanbu(bot, context, config, at = true) {
    const setuReg = new NamedRegExp(zhanbuConfig.reg);
    const limit = {
        value: zhanbuConfig.limit,

    };
    // 判断消息是否匹配
    const zhanbuRegExec = setuReg.exec(CQ.unescape(context.message));
    if (zhanbuRegExec) {
        const appkey = zhanbuConfig.appkey;
        const replys = zhanbuConfig.replys;
        const seed = MakeSeed(context.sender.user_id);;
        Axios(API_URL, {
            params: {
                qq: seed,
                appkey: appkey
            }
        })
            .then(ret => ret.data)
            .then(async ret => {
                // console.log(ret);
                if (ret.error) return replyMsg(bot, context, ret.error, at);
                // 104状态码为用完了
                if (ret.status != 0) return replyMsg(bot, context, replys.zhanbuError, at);
                const score = ret.result.score;
                const luck = ret.result.luck;
                const content = ret.result.content;
                const character = ret.result.character;
                // `SELECT filename FROM files WHERE username = ? AND checksum = ?`, username, checksum
                const message =util.format(
                    `今日你的分数为: %s\n凶吉: %s \n今日处事提示: %s \n今日评价: %s `,score,luck,content,character);
            // console.log(message);
            replyMsg(bot, context, message, false, at);
            })
    }
}