const { random } = require ('lodash');
const Jimp = require('jimp');
const { loadJSON } = require('../../utils');
const path = require('path');
const CONFIG_PATH = path.resolve(__dirname, '../../config/setu.jsonc');

// 读取配置
const getConfig = () => {
    return loadJSON(CONFIG_PATH);
};

function checkBase64RealSize(base64) {
    return base64.length && base64.length * 0.75 < 4000000;
}

async function getAntiShieldingBase64(url, fallbackUrl) {
    try {
        const origBase64 = await imgAntiShielding(url);
        if (checkBase64RealSize(origBase64)) return origBase64;
    } catch (error) {
        // 原图过大
    }
    if (!fallbackUrl) return;
    const m1200Base64 = await imgAntiShielding(fallbackUrl);
    if (checkBase64RealSize(m1200Base64)) return m1200Base64;
}

async function imgAntiShielding(url, type) {
    const img = await Jimp.read(url);

    switch (type) {
        case '1': {
            const [w, h] = [img.getWidth(), img.getHeight()];
            const pixels = [
                [0, 0],
                [w - 1, 0],
                [0, h - 1],
                [w - 1, h - 1],
            ];
            for (const [x, y] of pixels) {
                img.setPixelColor(Jimp.rgbaToInt(random(255), random(255), random(255), 1), x, y);
            }
            break;
        }
    }

    return (await img.getBase64Async(Jimp.AUTO)).split(',')[1];
}

module.exports = {
    getConfig,
    getAntiShieldingBase64,
    imgAntiShielding,
}
