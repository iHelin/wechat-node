//工具函数
const {parseString} = require('xml2js')
const {writeFile, readFile} = require('fs')
const path = require('path');

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
    },

    writeFileAsync(data, filename) {
        return new Promise((resolve, reject) => {
            writeFile(path.resolve(__dirname, filename), JSON.stringify(data), err => {
                if (err) {
                    console.log("writeFileAsync" + err);
                    reject(err);
                } else {
                    console.log("文件保存成功");
                    resolve();
                }
            });
        });
    },

    readFileAsync(filename) {
        return new Promise((resolve, reject) => {
            readFile(path.resolve(__dirname, filename), (err, data) => {
                if (err) {
                    reject("readFileAsync" + err);
                } else {
                    console.log(`读取本地${filename}成功`);
                    data = JSON.parse(data);
                    resolve(data);
                }
            })
        })
    }
}
