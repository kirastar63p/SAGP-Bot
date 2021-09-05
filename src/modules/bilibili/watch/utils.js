const { random } = require('lodash');
const { loadJSON } = require('../../../utils');
const path = require('path');
const CONFIG_PATH = path.resolve(__dirname, '../../../config/bilibili/stream.jsonc');

const getConfig = () => {
    return loadJSON(CONFIG_PATH);
}

const watchStream = () => {
    console.log(123);
    const config = getConfig();
    const streamRoomList = config.uids;

    const API_URL = "https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids"
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
        .then(console.log(ret))
}


module.exports = {
    getConfig,
    watchStream
}
