//验证服务器有效性
const sha1 = require('sha1')

//定义配置对象
const config = require('../config')

//引入工具模块
const {getUserDataAsync, formatData, parserXMLDataAsync} = require('../utils/tool')
module.exports = () => {
    return async (req, res, next) => {
        console.log('query:', req.query);
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
            //验证消息是否来自服务器
            if (sha1Str === signature) {
                const xmlData = await getUserDataAsync(req);
                const jsData = await parserXMLDataAsync(xmlData)
                //格式化数据
                const message = formatData(jsData)
                let content = '';
                if (message.MsgType === 'text') {
                    if (message.Content === '1') {   //全匹配
                        content = '哈哈哈';
                    } else if (message.Content === '2') {
                        content = '呵呵呵';
                    } else {
                        content = '你说啥？';
                    }
                }

                const replyMessage = `<xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${Date.now()}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${content}]]></Content>
                </xml>`;
                //返回相应给服务器
                //UnhandledPromiseRejectionWarning: Error: Can't set headers after they are sent.
                res.send(replyMessage);
            } else {
                res.end('error');
            }
        } else {
            res.end('error');
        }
    }
}

