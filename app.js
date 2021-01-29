const express = require('express')

const router = require('./src/route')


const app = express();


app.engine('.html', require('ejs').__express);
app.set('views', './src/views');
app.set('view engine', 'html');

app.use(router);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '';

app.server = app.listen(port, host, () => {
    console.log('服务器启动成功');
});

module.exports = app;
