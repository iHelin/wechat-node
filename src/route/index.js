const express = require('express');
const sha1 = require('sha1');
const Wechat = require('../wx/wechat')
const {appID, url} = require('../config')
const reply = require('../reply')

const router = express.Router();
const wechat = new Wechat();

router.get('/search', async (req, res) => {
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）,
    // 有效的jsapi_ticket,
    // timestamp（时间戳）,
    // url（当前网页的URL，不包含#及其后面部分） 。
    const {ticket} = await wechat.fetchTicket();
    const nonceStr = Math.random().toString().split('.')[1];
    const timestamp = Date.now();

    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${nonceStr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ];
    let str = arr.sort().join('&');
    const signature = sha1(str);

    res.render('search', {appID, signature, nonceStr, timestamp});
});
router.use(reply());

module.exports = router;
