const {sentences, hitokoto} = require('./ok');
/**
 * 处理用户发送的消息，返回不同的内容
 */
module.exports = async (message) => {
    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    };

    let content = '';
    if (message.MsgType === 'text') {
        content = await sentences();
        content = content.result.name + '\n' + content.result.from;
    } else if (message.MsgType === 'image') {
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl);
    } else if (message.MsgType === 'voice') {
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        console.log(message.Recognition);//语音识别结果
    } else if (message.MsgType === 'video') {
        options.msgType = 'video';
        options.mediaId = message.MediaId;
        options.title = '视频的标题';
        options.description = '视频的描述';
    } else if (message.MsgType === 'shortvideo') {
        options.msgType = 'video';
        options.mediaId = message.MediaId;
        options.title = '小视频的标题';
        options.description = '小视频的描述';
    } else if (message.MsgType === 'location') {
        content = `您的纬度：${message.Location_X}、经度：${message.Location_Y}、缩放：${message.Scale}、位置信息：${message.Label}`;
    } else if (message.MsgType === 'link') {
        content = `链接消息:${message.Title}`;
    } else if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            content = '欢迎您的关注~';
        } else if (message.Event === 'unsubscribe') {
            console.log('又一个人走了。。。');
        } else if (message.Event === 'SCAN') {
            content = '用户已经关注过，再次扫描带参数的二维码';
        } else if (message.Event === 'LOCATION') {
            // content = `您的纬度：${message.Latitude}、经度：${message.Longitude}、位置精度：${message.Precision}`;
        } else if (message.Event === 'CLICK') {
            if (message.EventKey === 'sentences') {
                let res = await sentences();
                content = res.result.name + '\n出自：' + res.result.from;
            } else if (message.EventKey === 'hitokoto') {
                content = await hitokoto();
            } else {
                content = '你点了啥';
            }
        }
    }

    options.content = content;
    console.log(options);
    return options;
}
