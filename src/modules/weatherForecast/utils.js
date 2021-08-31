const { loadJSON } = require('../../utils');
const path = require('path');
const { default: axios } = require('axios');
const CONFIG_PATH = path.resolve(__dirname, '../../config/weatherForecast.jsonc');
const DATA_PATH = path.resolve(__dirname, './data.json');

const getConfig = () => {
    return loadJSON(CONFIG_PATH);
};




const getCitycode = (cityName) => {
    const data = loadJSON(DATA_PATH);
    const getAdcode = data.schema.find(function (array) {
        return array.name == cityName;
    })
    if (getAdcode !== undefined) {
        return getAdcode.adcode;
    } else {
        return 0;
    }
};



module.exports = {
    getCitycode,
    getConfig,

}