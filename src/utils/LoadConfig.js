const { getTime, sendMsg2Admin, loadJSON } = require('./index');

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
            sendMsg2Admin('配置已重载');
        }
        return conf;
    }
}