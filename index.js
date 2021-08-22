
// 引入依赖
import path from 'path';
// 引入文件
import checkConfig from './src/utils/checkConfig.js';
import LoadConfig from './src/utils/LoadConfig.js';
import initBot from './src/modules/main.js';
// 定义常量
const __dirname = path.resolve(path.dirname(''));
const CONFIG_PATH = path.resolve(__dirname, './src/config/index.jsonc');

// const myEmitter = new EventEmitter();

checkConfig({ CONFIG_PATH });
const config = LoadConfig({ CONFIG_PATH }, true);
initBot(config);
