const rp = require('request-promise-native')


const {appID, appsecret} = require('../config')
const menu = require('./menu')
const api = require('../utils/api');
const {writeFileAsync, readFileAsync} = require('../utils/tool')

class Wechat {
    constructor() {

    }

    /**
     * 获取access_token(getAccessToken)
     * @returns {Promise<unknown>}
     */
    getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        return new Promise((resolve, reject) => {
            rp({method: 'GET', url, json: true}).then(res => {
                console.log("远程获取accessToken");
                //设置过期时间-5分钟
                res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                resolve(res);
            }).catch(err => {
                reject('getAccessToken请求失败' + err);
            });
        });
    }

    /**
     * 保存accessToken到文件`accessToken.txt`
     * @param accessToken 要保存的凭据
     * @returns {Promise<unknown>}
     */
    saveAccessToken(accessToken) {
        return writeFileAsync(accessToken, 'accessToken.txt');
    }

    /**
     * 读取accessToken
     * @returns {Promise<unknown>}
     */
    readAccessToken() {
        return readFileAsync('accessToken.txt');
    }


    /**
     * 判断是否过期 isValidAccessToken
     * @param data
     * @returns {boolean}
     */
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        //检测access_token是否在有效期内
        return data.expires_in > Date.now();
    }

    /**
     * 获取没有过期的access_token
     * @returns {Promise<{access_token: unknown.access_token, expires_in: unknown.expires_in}>|Promise<PromiseConstructor.resolve>}
     */
    fetchAccessToken() {
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //token有效 直接使用
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            });
        }
        return this.readAccessToken().then(async res => {
            //本地有文件
            if (this.isValidAccessToken(res)) {
                return Promise.resolve(res);
            } else {
                const res = await this.getAccessToken();
                await this.saveAccessToken(res);
                return Promise.resolve(res);
            }
        }).catch(async err => {
            const res = await this.getAccessToken();
            await this.saveAccessToken(res);
            return Promise.resolve(res);
        }).then(res => {
            this.access_token = res.access_token;
            this.expires_in = res.expires_in;
            return Promise.resolve(res);
        });
    }

    /**
     * 获取jsapi_ticket
     * @returns {Promise<unknown>}
     */
    getTicket() {
        return new Promise(async (resolve, reject) => {
            const data = await this.fetchAccessToken();
            const url = `${api.ticket}&access_token=${data.access_token}`;
            rp({method: 'GET', url, json: true}).then(res => {
                console.log("远程获取Ticket");
                //设置过期时间-5分钟
                resolve({
                    ticket: res.ticket,
                    expires_in: Date.now() + (res.expires_in - 300) * 1000
                });
            }).catch(err => {
                reject('getTicket请求失败' + err);
            });
        });
    }

    /**
     * 保存jsapi_ticket到文件`ticket.txt`
     * @param ticket 要保存的凭据
     * @returns {Promise<unknown>}
     */
    saveTicket(ticket) {
        return writeFileAsync(ticket, 'ticket.txt');
    }

    /**
     * 读取ticket
     * @returns {Promise<unknown>}
     */
    readTicket() {
        return readFileAsync('ticket.txt');
    }


    /**
     * 判断是否过期
     * @param data
     * @returns {boolean}
     */
    isValidTicket(data) {
        if (!data || !data.ticket || !data.expires_in) {
            return false;
        }
        //检测ticket是否在有效期内
        return data.expires_in > Date.now();
    }

    /**
     * 获取没有过期的ticket
     * @returns {Promise}
     */
    fetchTicket() {
        if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
            //ticket有效 直接使用
            return Promise.resolve({
                ticket: this.ticket,
                expires_in: this.ticket_expires_in
            });
        }
        return this.readTicket().then(async res => {
            //本地有文件
            if (this.isValidTicket(res)) {
                return Promise.resolve(res);
            } else {
                const res = await this.getTicket();
                await this.saveTicket(res);
                return Promise.resolve(res);
            }
        }).catch(async err => {
            const res = await this.getTicket();
            await this.saveTicket(res);
            return Promise.resolve(res);
        }).then(res => {
            this.ticket = res.ticket;
            this.ticket_expires_in = res.expires_in;
            return Promise.resolve(res);
        });
    }

    createMenu(menu) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken()
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                const result = await rp({method: 'POST', url, json: true, body: menu});
                resolve(result);
            } catch (e) {
                reject('createMenu', e);
            }
        })
    }

    deleteMenu() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken()
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
                const result = await rp({method: 'GET', url, json: true});
                resolve(result);
            } catch (e) {
                reject('deleteMenu', e);
            }
        })
    }
}


//模拟测试

// (async () => {
//     const w = new Wechat()

// let token = await w.fetchAccessToken();
// console.log(token);

// const res = await w.fetchTicket();
// console.log(res);

// let res = await w.deleteMenu();
// console.log(res);
// res = await w.createMenu(menu);
// console.log(res);
// })();

module.exports = Wechat;
