const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg } = require('../../utils');
const CQ = require('../../utils/CQ');
const { getConfig } = require('./utils');
const API_URL = 'https://api.jisuapi.com/qqluck/query';
var util = require('util');
const { stubString } = require('lodash');
const curseConfig = getConfig();

// 整合了otto语录和指定人骂人都放在这了
module.exports = function sendCurse(bot, context, config, at = true) {
    // otto部分
    const ottoReg = new NamedRegExp(curseConfig.ottoreg);
    const ottoRegExec = ottoReg.exec(CQ.unescape(context.message));
    // 骂人部分
    const curseReg = new NamedRegExp(curseConfig.cursereg);
    const curseRegExec = curseReg.exec(CQ.unescape(context.message));
    const curseDictionary = curseConfig.curseDictionary;

    if (ottoRegExec) {
        const otto = curseConfig.otto;
        const yulu = otto[parseInt(Math.random() * otto.length)];
        const message = yulu;
        replyMsg(bot, context, message, false, at);
    }
    // 指定人
    if (curseRegExec) {
        const regGroup = curseRegExec.groups || {};
        const keyword = regGroup.keyword ? regGroup.keyword.split('&') : undefined;
        // 截取到QQ
        if (keyword !== undefined) {
            if (keyword == curseConfig.admin) return replyMsg(bot, context, "想骂你爹？" + CQ.at(context.sender.user_id), false, at);
            const message = curseDictionary[parseInt(Math.random() * curseDictionary.length)] + CQ.at(keyword);
            replyMsg(bot, context, message, false, at);
        } else {
            replyMsg(bot, context, curseConfig.NotFound, false, at);
        }
    }

}