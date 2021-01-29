//工具函数
const {parseString} = require('xml2js')

module.exports = {
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = ''
            req.on('data', data => {
                xmlData += data.toString();
            }).on('end', () => {
                resolve(xmlData);
            })
        })
    },

    parserXMLDataAsync(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {trim: true}, (err, result) => {
                if (err) {
                    console.log("parserXMLData方法出错了" + err);
                    reject("parserXMLData方法出错了" + err);
                } else {
                    resolve(result);
                }
            });
        })
    },

    formatMessage(newData) {
        const jsData = newData.xml;
        for (let item in jsData) {
            let value = jsData[item];
            //防止不是数组获取非法数据
            if (Array.isArray(value) && value.length) {
                jsData[item] = value[0];
            }
        }
        return jsData;
    }
}
