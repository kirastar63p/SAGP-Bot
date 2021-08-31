const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg } = require('../../utils');
const CQ = require('../../utils/CQ');
const { getCitycode, getConfig } = require('./utils');
const API_URL = 'https://restapi.amap.com/v3/weather/weatherInfo';
var util = require('util');
const wetherForecastConfig = getConfig();

module.exports = function sendWeatherForecast(bot, context, config, at = true) {
    const weatherForecastReg = new NamedRegExp(wetherForecastConfig.reg);
    const weatherForecastExec = weatherForecastReg.exec(CQ.unescape(context.message));
    const replys = wetherForecastConfig.replys;


    if (weatherForecastExec) {
        const regGroup = weatherForecastExec.groups || {};
        const city = regGroup.city ? regGroup.city.split('&') : undefined;
        const appkey = wetherForecastConfig.appkey;

        if (city !== undefined && getCitycode(city) !== 0) {

            const cityCode = getCitycode(city);
            Axios.get(API_URL, {
                params: {
                    city: cityCode,
                    key: appkey
                }
            })
                .then(ret => ret.data)
                .then(async ret => {
                    // console.log(ret);
                    if (ret.error) return replyMsg(bot, context, ret.error, at);
                    // 104状态码为用完了
                    if (ret.status != 1) return replyMsg(bot, context, replys.cityError, at);
                    const { province, city, adcode, weather, temperature, winddirection, windpower, humidity, reporttime } = ret.lives[0];;
                    const messages = util.format(`%s\n天气情况为:%s,温度为:%s\n风力为:%s\n湿度为:%s\n报告时间:%s。`, city, weather, temperature, windpower, humidity, reporttime);
                    return replyMsg(bot, context, messages, at);
                })
        }else{
            return replyMsg(bot, context, replys.cityNotFind, at);
        }
    }
}