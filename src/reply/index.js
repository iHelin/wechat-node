//验证服务器有效性
const sha1 = require('sha1');

const config = require('../config');
const {getUserDataAsync, formatMessage, parserXMLDataAsync} = require('../utils/tool');
const template = require('./template');
const reply = require('./reply');

module.exports = () => {
    return async (req, res, next) => {
        const {signature, echostr, timestamp, nonce} = req.query
        const {token} = config

        const sha1Str = sha1([timestamp, nonce, token].sort().join(''))

        //测试服务器发送方式

        if (req.method === 'GET') {
            //验证消息是否来自服务器
            if (sha1Str === signature) {
                res.send(echostr)
            } else {
                res.end('error')
            }
        } else if (req.method === 'POST') {
            if (sha1Str === signature) {
                const xmlData = await getUserDataAsync(req);
                const jsData = await parserXMLDataAsync(xmlData);
                //格式化数据
                const message = formatMessage(jsData)

                const options = await reply(message);

                const replyMessage = template(options);
                console.log(replyMessage);
                res.send(replyMessage);
            } else {
                res.end('error');
            }
        } else {
            res.end('error');
        }
    }
}

