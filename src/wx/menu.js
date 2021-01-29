const Wechat = require('./wechat')
const menus = {
    "button": [{
        "type": "view",
        "name": "🔍搜索",
        "url": "http://helinux.cn1.utools.club/search"
    }, {
        "name": "❎菜单",
        "sub_button": [{
            "type": "click",
            "name": "没啥",
            "key": "xxx"
        }]
    }, {
        "name": "🌹发送位置",
        "type": "location_select",
        "key": "rselfmenu_2_0"
    }]
};

(async () => {
    const wechat = new Wechat();
    let res = await wechat.deleteMenu();
    console.log(res);
    res = await wechat.createMenu(menus);
    console.log(res);
})();


/*
{
        "type": "click",
        "name": "未定义",
        "key": "V1001_TODAY_MUSIC"
    }
 */

// module.exports = menus;
