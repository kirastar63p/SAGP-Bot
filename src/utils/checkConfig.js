const { exit } = require('process');
const { jsonc } = require('jsonc');

const { readSync: readJsoncSync } = jsonc;

// 检查配置文件
module.exports =  ({ CONFIG_PATH }) => {
    try {
        // 配置检查
        readJsoncSync(CONFIG_PATH);
    } catch (e) {
        const { code, message } = e;
        const EOL = process.env.npm_execpath ? '\n' : '';
        if (code === 'ENOENT') {
            console.error(`ERROR: 找不到配置文件 ${e.path}${EOL}`);
        } else if (message && message.includes('JSON')) {
            // 报错信息会是解析JSON错误
            console.error(`ERROR: 配置文件 JSON 格式有误\n${message}${EOL}`);
        } else console.error(e);
        exit(1);
    }
};