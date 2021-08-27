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

    if(ottoRegExec){
        const otto = curseConfig.otto;
        const yulu = otto[parseInt(Math.random()*otto.length)];
        const message = yulu;
        replyMsg(bot, context, message, false, at);
    }
    // 指定人
    if(curseRegExec){
        const regGroup = curseRegExec.groups || {};   
        let keyword = regGroup.keyword ? regGroup.keyword.split('&') : undefined;
        
        // 截取到QQ
        if(keyword!== undefined && keyword[0].slice(10,-1) !=='' ){
            keyword = keyword[0].slice(10,-1);
            // 指定骂人时候的语录
            if(keyword == curseConfig.admin){
                // console.log(context);
                const message ="想骂你爹？"+CQ.at(context.sender.user_id);
                return replyMsg(bot, context, message, false, at);
            }
            const curseDictionary = curseConfig.curseDictionary;
            const yulu = curseDictionary[parseInt(Math.random()*curseDictionary.length)];
            const message = yulu+CQ.at(keyword);
            replyMsg(bot, context, message, false, at);
        }else{
            message = curseConfig.NotFound;
            replyMsg(bot, context, message, false, at);
        }
        
        
        
    }
    
}