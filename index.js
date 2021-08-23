
// 引入依赖
const path = require('path');
// 引入文件
const checkConfig = require('./src/utils/checkConfig');
const LoadConfig = require('./src/utils/LoadConfig');
const initBot = require('./src/modules/main');
// 定义常量
const CONFIG_PATH = path.resolve(__dirname, './src/config/index.jsonc');

// const myEmitter = new EventEmitter();

checkConfig({ CONFIG_PATH });
const config = LoadConfig({ CONFIG_PATH }, true);
initBot(config);
