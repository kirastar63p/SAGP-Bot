const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg } = require('../../../utils');
const CQ = require('../../../utils/CQ');
const { getConfig } = require('./utils');
var util = require('util');

// JSON.stringify('{"uids": [4711149,630928380]}')
const streamConfig = getConfig();
const API_URL = "https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids"

module.exports = function sendStreamStatus(bot, context, config, at = true) {
    const streamReg = new NamedRegExp(streamConfig.regs);
    const streamExec = streamReg.exec(CQ.unescape(context.message));
    const streamRoomList = streamConfig.uids;

    if (streamExec) {
        Axios(API_URL, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "uids": streamRoomList
            }
        })
            .then(ret => ret.data)
            .then(async ret => {
                if (ret.error) return replyMsg(bot, context, ret.error, at);
                if (ret.code == -111) return replyMsg(bot, context, "可能cookie过期了", at);
                const data = ret.data !='' ? ret.data  : undefined;
                var message = "";
                if(data == undefined) return replyMsg(bot, context, "所有直播间都找不到嘞", at);
                Object.keys(data).forEach(key => {
                    const {title,room_id,live_status,cover_from_user,uname} = data[key];
                    const liveStatus = live_status == 1 ? "直播中" :"未在直播";
                    const portal = "https://live.bilibili.com/"+room_id
                    const singleMessage = util.format("您所关注的主播:%s%s\n直播间标题:%s\n直播间传送门:%s\n直播间封面:%s-------------------------\n",uname,liveStatus,title,portal,CQ.img(cover_from_user));
                    message +=singleMessage;
                });
                return replyMsg(bot, context, message, at);
            })
    }
}