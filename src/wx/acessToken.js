//获取accessToken，有效期2小时
const {appID, appsecret} = require('../config')

const rp = require('request-promise-native')

const {writeFile, readFile} = require('fs')

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
                reject('getAccessToken请求失败' + err)
            })
        })
    }

    /**
     * 保存accessToken到文件`accessToken.txt`
     * @param accessToken 要保存的凭据
     * @returns {Promise<unknown>}
     */
    saveAccessToken(accessToken) {
        //将对象转换为字符串
        accessToken = JSON.stringify(accessToken)
        //将access_token保存文件
        return new Promise((resolve, reject) => {
            writeFile('./accessToken.txt', accessToken, err => {
                if (err) {
                    console.log("文件保存异常");
                    reject(err);
                } else {
                    console.log("文件保存成功");
                    resolve();
                }
            });
        });
    }

    /**
     * 读取accessToken
     * @returns {Promise<unknown>}
     */
    readAccessToken() {
        return new Promise((resolve, reject) => {
            readFile('./accessToken.txt', (err, data) => {
                if (err) {
                    reject("readAccessToken" + err);
                } else {
                    console.log("文件读取成功");
                    data = JSON.parse(data);
                    resolve(data);
                }
            })
        })
    }


    /**
     * 判断是否过期 isValidAccessToken
     * @param data
     * @returns {boolean}
     */
    isValidAccessToken(data) {
        //验证传入的参数是否是有效的
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }
        //检测access_token是否在有效期内
        return data.expires_in > Date.now();
    }

    /**
     * 用来获取没有过期的access_token
     * @returns {Promise<{access_token: unknown.access_token, express_in: unknown.expires_in}>|Promise<PromiseConstructor.resolve>}
     */
    fetchAccessToken() {
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //token有效 直接使用
            return Promise.resolve({
                access_token: this.access_token,
                express_in: this.expires_in
            })
        }
        return this.readAccessToken().then(async res => {
            //本地有文件
            if (this.isValidAccessToken(res)) {
                return Promise.resolve(res)
            } else {
                const res = await this.getAccessToken()
                //保存至本地
                await this.saveAccessToken(res)
                return Promise.resolve(res)
            }
        }).catch(async err => {
            const res = await this.getAccessToken();
            await this.saveAccessToken(res);
            return Promise.resolve(res);
        }).then(res => {
            this.access_token = res.access_token
            this.expires_in = res.expires_in
            return Promise.resolve(res)
        });
    }
}


//模拟测试
const w = new Wechat()

w.fetchAccessToken().then(res => {
    console.log('AccessToken:', res);
}).catch(err => {
    console.log(err);
})

