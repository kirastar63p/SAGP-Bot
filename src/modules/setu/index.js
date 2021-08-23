const _ = require('lodash');
const NamedRegExp = require('named-regexp-groups');
const Axios = require("axios");
const { replyMsg, getTime } = require('../../utils');
const { getConfig, getAntiShieldingBase64 } = require('./utils');
const CQ = require('../../utils/CQ');

const setuConfig = getConfig();
const API_URL = 'https://api.lolicon.app/setu/v2';
const PIXIV_404 = Symbol('Pixiv image 404');

module.exports = function sendSetu(bot, context, config, at = true) {
    const setuReg = new NamedRegExp(setuConfig.reg);
    // 判断消息是否匹配
    const setuRegExec = setuReg.exec(CQ.unescape(context.message));
    if (setuRegExec) {
        const replys = setuConfig.replys;
        const isGroupMsg = context.message_type === 'group';

        // 普通
        const limit = {
            value: setuConfig.limit,
            cd: setuConfig.cd,
        };
        let delTime = setuConfig.deleteTime;

        const regGroup = setuRegExec.groups || {};
        const r18 = regGroup.r18 && !(isGroupMsg && setuConfig.r18OnlyInWhite && !setuConfig.whiteGroup.includes(context.group_id));
        const keyword = regGroup.keyword ? regGroup.keyword.split('&') : undefined;
        const privateR18 = setuConfig.r18OnlyPrivate && r18 && isGroupMsg;

        // 群聊还是私聊
        if (isGroupMsg) {
            // 群白名单
            if (setuConfig.whiteGroup.includes(context.group_id)) {
                limit.cd = setuConfig.whiteCd;
                delTime = setuConfig.whiteDeleteTime;
            } else if (setuConfig.whiteOnly) {
                replyMsg(bot, context, replys.setuReject);
                return true;
            }
        } else {
            if (!setuConfig.allowPM) {
                replyMsg(bot, context, replys.setuReject);
                return true;
            }
            limit.cd = 0; // 私聊无cd
        }

        Axios.post(API_URL, { r18, tag: keyword, size: ['original', 'regular'], proxy: null })
            .then(ret => ret.data)
            .then(async ret => {
                if (ret.error) return replyMsg(bot, context, ret.error, at);
                if (!ret.data.length) return replyMsg(bot, context, replys.setuNotFind, at);

                const setu = ret.data[0];
                const setuUrl = setu.urls.original;
                const urlMsgs = [`https://pixiv.net/i/${setu.pid} (p${setu.p})`];

                if (
                    r18 &&
                    setuConfig.r18OnlyUrl[
                    context.message_type === 'private' && context.sub_type !== 'friend' ? 'temp' : context.message_type
                    ]
                ) {
                    // 发送原图链接
                    replyMsg(bot, context, urlMsgs.join('\n'), false, at);
                    return;
                }
                if (privateR18) urlMsgs.push('※ 图片将私聊发送');
                // 发送原图链接
                replyMsg(bot, context, urlMsgs.join('\n'), at);

                // 暂且利用i.pixiv.cat来发图
                const catUrl = setuUrl.replace('i.pximg.net', 'i.pixiv.cat')
                // console.log(catUrl);

                // const getReqUrl = url => (proxy ? getSetuUrlByTemplate(proxy, setu, url) : getProxyURL(url));
                // const url = getReqUrl(setuUrl);
                // const fallbackUrl = setting.size1200 ? undefined : getReqUrl(setu.urls.regular);

                // 反和谐
                const base64 =
                    !privateR18 &&
                    isGroupMsg &&
                    setuConfig.antiShielding &&
                    (await getAntiShieldingBase64(catUrl, catUrl).catch(e => {
                        console.error(`${getTime()} [error] anti shielding`);
                        console.error(catUrl);
                        console.error(e);
                        if (String(e).includes('Could not find MIME for Buffer')) return PIXIV_404;
                        global.replyMsg(bot, context, '反和谐发生错误，图片将原样发送，详情请查看错误日志');
                    }));

                if (base64 === PIXIV_404) {
                    global.replyMsg(bot, context, '图片发送失败，可能是网络问题/插画已被删除/原图地址失效');
                    return;
                }

                const imgType = delTime === -1 ? 'flash' : null;
                if (privateR18) {
                    global.bot('send_private_msg', {
                        user_id: context.user_id,
                        group_id: setuConfig.r18OnlyPrivateAllowTemp ? context.group_id : undefined,
                        message: CQ.img(catUrl, imgType),
                    });
                } else {
                    replyMsg(bot, context, base64 ? CQ.img64(base64, imgType) : CQ.img(catUrl, imgType))
                        .then(r => {
                            const message_id = _.get(r, 'data.message_id');
                            if (delTime > 0 && message_id)
                                setTimeout(() => {
                                    global.bot('delete_msg', { message_id });
                                }, delTime * 1000);
                        })
                        .catch(e => {
                            console.error(`${getTime()} [error] delete msg`);
                            console.error(e);
                        });
                }
                success = true;
            })
            .catch(e => {
                console.error(`${getTime()} [error]`);
                console.error(e);
                replyMsg(bot, ontext, replys.setuError, at);
            })

        return true;
    };
    return false;
}