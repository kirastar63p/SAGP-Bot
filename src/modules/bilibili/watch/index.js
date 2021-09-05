const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg } = require('../../../utils');
const CQ = require('../../../utils/CQ');
const { getConfig,watchStream } = require('./utils');
var util = require('util');

// JSON.stringify('{"uids": [4711149,630928380]}')
const streamConfig = getConfig();
const API_URL = "https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids"

module.exports = function watchStreamStatus(bot, context, config, at = true) {
    
    setInterval(watchStream,1000);

    
}