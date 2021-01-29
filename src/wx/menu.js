const Wechat = require('./wechat')
const menus = {
    "button": [{
        "type": "click",
        "name": "来一句",
        "key": "sentences"
    }, {
        "type": "click",
        "name": "再来一句",
        "key": "hitokoto"
    }, {
        "type": "view",
        "name": "搜索🔍",
        "url": "http://helinux.cn1.utools.club/search"
    }]
};

(async () => {
    const wechat = new Wechat();
    let res = await wechat.deleteMenu();
    console.log(res);
    res = await wechat.createMenu(menus);
    console.log(res);
})();
