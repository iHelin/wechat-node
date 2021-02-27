const axios = require('axios')

module.exports = {
    sentences() {
        let url = `http://poetry.apiopen.top/sentences`;
        return axios.get(url);
    },

    hitokoto() {
        let url = `https://api.imjad.cn/hitokoto`;
        return axios.get(url);
    }
}
