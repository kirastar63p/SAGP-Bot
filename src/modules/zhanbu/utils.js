const { loadJSON } = require('../../utils');
const path = require('path');
const { default: axios } = require('axios');
const CONFIG_PATH = path.resolve(__dirname, '../../config/zhanbu.jsonc');

const getConfig = () => {
    return loadJSON(CONFIG_PATH);
};



const MakeSeed = (QQNumber) => {
    const seed = parseInt(Math.random()*10,10)*2+QQNumber;
    return seed;
};

module.exports = {
    MakeSeed,
    getConfig,
    
}