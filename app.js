const express = require('express')
//引入auth模块
const auth = require('./src/wx/auth')

const app = express();

app.use(auth())

const port = process.env.PORT || 3000;
const host = process.env.HOST || '';

app.server = app.listen(port, host, () => {
    console.log('服务器启动成功');
});

module.exports = app;
