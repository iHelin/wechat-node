const express = require('express')
const sha1 = require('sha1');
//引入auth模块
const auth = require('./src/wx/auth')
const Wechat = require('./src/wx/wechat')
const {appID, url} = require('./src/config')

const app = express();
const wechat = new Wechat();

app.engine('.html', require('ejs').__express);
app.set('views', './src/views');
app.set('view engine', 'html');
app.get('/search', async (req, res) => {
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


app.use(auth());

const port = process.env.PORT || 3000;
const host = process.env.HOST || '';

app.server = app.listen(port, host, () => {
    console.log('服务器启动成功');
});

module.exports = app;
