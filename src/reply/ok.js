const rp = require('request-promise-native')

module.exports = () => {
    let url = `http://poetry.apiopen.top/sentences`;
    return rp({method: 'GET', url, json: true});
}
