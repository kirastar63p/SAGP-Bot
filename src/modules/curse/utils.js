const { random } = require ('lodash');
const { loadJSON } = require('../../utils');
const path = require('path');
const CONFIG_PATH = path.resolve(__dirname, '../../config/curse.jsonc');

const getConfig = () => {
    return loadJSON(CONFIG_PATH);
}



module.exports = {
    getConfig,
    
}
