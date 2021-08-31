const minimist = require('minimist');
const CQ = require('./CQ.js');
const { jsonc } = require('jsonc');

exports.parseArgs = (str, enableArray = false, _key = null) => {
  const m = minimist(
    str
      .replace(/(--\w+)(?:\s*)(\[CQ:)/g, '$1 $2')
      .replace(/(\[CQ:[^\]]+\])(?:\s*)(--\w+)/g, '$1 $2')
      .split(' '),
    {
      boolean: true,
    }
  );
  if (!enableArray) {
    for (const key in m) {
      if (key === '_') continue;
      if (Array.isArray(m[key])) m[key] = m[key][0];
    }
  }
  if (_key && typeof m[_key] === 'string' && m._.length > 0) m[_key] += ' ' + m._.join(' ');
  return m;
}

/**
 * 回复消息
 *
 * @param {*} context 消息对象
 * @param {string} message 回复内容
 * @param {boolean} at 是否at发送者
 * @param {boolean} reply 是否使用回复形式
 */
exports.replyMsg = (bot, context, message, at = false, reply = false) => {
  if (!bot.isReady() || typeof message !== 'string' || message.length === 0) return;
  if (context.message_type !== 'private') {
    message = `${reply ? CQ.reply(context.message_id) : ''}${at ? CQ.at(context.user_id) : ''}${message}`;
  }
  switch (context.message_type) {
    case 'private':
      // if (global.config.bot.debug) {
      //   console.log(`${global.getTime()} 回复私聊消息 qq=${context.user_id}`);
      // }
      return bot('send_private_msg', {
        user_id: context.user_id,
        message,
      });
    case 'group':
      // if (global.config.bot.debug) {
      //   console.log(`${global.getTime()} 回复群组消息 group=${context.group_id} qq=${context.user_id}`);
      // }
      return bot('send_group_msg', {
        group_id: context.group_id,
        message,
      });
    case 'discuss':
      // if (global.config.bot.debug) {
      //   console.log(`${global.getTime()} 回复讨论组消息 discuss=${context.discuss_id} qq=${context.user_id}`);
      // }
      return bot('send_discuss_msg', {
        discuss_id: context.discuss_id,
        message,
      });
  }
}

exports.getTime = () => new Date().toLocaleString();

exports.sendMsg2Admin = (bot, config, message) => {
  const admin = config.bot.admin;
  if (bot.isReady() && admin > 0 && admin !== bot._qq) {
    bot('send_private_msg', {
      user_id: admin,
      message,
    });
  }
}

exports.loadJSON = (path) => {
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
    
    console.error(notice);
  }
}

