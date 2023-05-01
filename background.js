
//请开发一个chrome浏览器插件，当选中网页上一段文字中包含英文时，将选中的文字中的英文翻译成中文展示出来。


// 定义一个函数，接收需要翻译的文本和翻译结果的回调函数作为参数
function translate(text, callback) {
    // 构造请求url
    //百度翻译服务，每月前100万字符免费，超出仅收取超出部分费用（QPS=10），按49元/百万字符计费；
    //appid和key获取地址：https://fanyi-api.baidu.com/api/trans/product/desktop
    const key = "百度翻译密钥";
    const appid = "百度翻译APP ID";

    const salt = (new Date).getTime();
    const sign = md5(appid+text+salt+key);
    //const str = appid+text+salt+key;

    //拼接appid=2015063000000001+q=apple+salt=1435660288+密钥=12345678得到字符串1：“2015063000000001apple143566028812345678”
    const params = new URLSearchParams();
    params.append('q', text);
    params.append('from', 'en');
    params.append('to', 'zh');
    params.append('appid', appid);
    params.append('salt', salt);
    params.append('sign', sign);
    const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';

    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
    })
    .then(response => response.json())
    .then(data => {
    // 解析翻译结果
    const translatedText = data.trans_result[0].dst;
    console.log("translate： "+translatedText);
    // 调用回调函数，将翻译结果传递给它
    callback(translatedText);
    })
    .catch(error => {
    console.error('翻译失败', error);
    });
  }
  // 定义一个函数，接收需要计算md5的字符串作为参数
function md5(str) {
  // 创建一个MD5对象
  const md5Obj = new SparkMD5();
  // 更新MD5对象的内容为传入的字符串
  md5Obj.append(str);
  // 计算MD5值并返回
  return md5Obj.end();
} 

//请使用HTML/CSS 非模态框代替如下的chrome通知框，非模态框显示在屏幕右侧，可以根据内容自动调节大小。上面有2个按钮，点“复制”按钮将内容复制到剪切板，点“取消”关闭。非模态框超过5s自动关闭。

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var selectedText;
    selectedText = request.text;
    console.log(selectedText); // 打印选中的文本

     // 将翻译结果显示在文本框中
  // 调用translate方法，将翻译结果放到translatedText
    translate(selectedText, function(translatedText) {

      chrome.tabs.sendMessage(sender.tab.id, {action: "showBubble", text: translatedText});
    });
  });

 




//用通知的形式展示出来
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     // 将request.text翻译成中文，并显示在通知消息中
//     translate(request.text, function(translatedText) {
//         // 创建一个临时的div元素，用于计算翻译文本的高度
//         const tempDiv = document.createElement('div');
//         tempDiv.style.position = 'absolute';
//         tempDiv.style.top = '-9999px';
//         tempDiv.style.left = '-9999px';
//         tempDiv.style.width = 'auto';
//         tempDiv.style.height = 'auto';
//         tempDiv.style.whiteSpace = 'nowrap';
//         tempDiv.style.fontSize = '14px';
//         tempDiv.style.fontFamily = 'Arial';
//         tempDiv.style.padding = '5px';
//         tempDiv.style.border = '1px solid #ccc';
//         tempDiv.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
//         tempDiv.style.zIndex = '999999';

//         // 设置临时div的文本内容为翻译结果
//         tempDiv.innerText = translatedText;

//         // 将临时div添加到body中
//         document.body.appendChild(tempDiv);

//         // 获取临时div的高度和宽度
//         const height = tempDiv.offsetHeight;
//         const width = tempDiv.offsetWidth;

//         // 移除临时div
//         document.body.removeChild(tempDiv);

//         // 创建通知消息
//         chrome.notifications.create({
//             type: 'basic',
//             iconUrl: 'icon.png',
//             title: '',
//             message: translatedText,
//             contextMessage: request.text,
//             requireInteraction: true,
//             priority: 2,
//             buttons: [
//                 {
//                     title: '复制'
//                 },
//                 {
//                     title: '取消'
//                 }
//             ],
//             }, function(notificationId) {
//             // 监听通知消息按钮的点击事件
//             chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
//                 if (buttonIndex === 0) {
//                     // 用户点击了确定按钮，将翻译结果复制到剪贴板中
//                     const input = document.createElement('input');
//                     input.style.position = 'absolute';
//                     input.style.top = '-9999px';
//                     input.style.left = '-9999px';
//                     input.value = translatedText;
//                     document.body.appendChild(input);
//                     input.select();
//                     document.execCommand('copy');
//                     document.body.removeChild(input);
//                     // 关闭通知消息窗口
//                     chrome.notifications.clear(notificationId);
//                 }
//                 // 如果用户点击了取消按钮，则关闭通知消息窗口
//                 if (buttonIndex === 1) {
//                     chrome.notifications.clear(notificationId);
//                 }
//           
//             });
//         });
//     });
// });


  
  
  
  
  
  
  
  