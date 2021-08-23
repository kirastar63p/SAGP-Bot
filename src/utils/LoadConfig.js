const { jsonc } = require('jsonc');
const { getTime, sendMsg2Admin } = require('./index');

function loadJSON(path) {
    try {
        return jsonc.readSync(path);
    } catch (e) {
        const { code, message } = e;
        let notice = '';
        if (code === 'ENOENT') {
            notice = `ERROR: 找不到配置文件 ${e.path}`;
        } else if (message && message.includes('JSON')) {
            notice = `ERROR: 配置文件 JSON 格式有误\n${message}`;
        } else notice = `${e}`;

        // 输出报错并同步至管理QQ
        console.error(getTime(), notice);
    }
}

module.exports = ({ CONFIG_PATH }, init = false) => {
    const conf = loadJSON(CONFIG_PATH);
    if (conf) {
        if (init) {
            // event.emit('init');
            console.log('配置已加载');
            console.log(getTime(), '配置已加载');
        } else {
            // event.emit('reload');
            console.log(getTime(), '配置已重载');
            // global.sendMsg2Admin('配置已重载');
        }
        return conf
    }
}