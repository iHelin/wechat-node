const rp = require('request-promise-native')

module.exports = {
    sentences() {
        let url = `http://poetry.apiopen.top/sentences`;
        return rp({method: 'GET', url, json: true});
    },
    hitokoto() {
        let url = `https://api.imjad.cn/hitokoto`;
        return rp({method: 'GET', url, json: true});
    }
}
