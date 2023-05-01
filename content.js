// content script
document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString();
    if (selectedText && /[a-zA-Z]/.test(selectedText)) {
      chrome.runtime.sendMessage({text: selectedText});
    }
    console.log("content run!!!");
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showBubble") {
      var bubble = document.createElement("div");
      bubble.style.position = "absolute";
      bubble.style.zIndex = "999999999999";
      bubble.style.background = "#fff";
      bubble.style.border = "1px solid #ccc";
      bubble.style.borderRadius = "5px";
      bubble.style.padding = "10px";
      bubble.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
      bubble.style.maxWidth = "400px";
      bubble.style.wordWrap = "break-word";
      bubble.style.fontSize = "14px";
      bubble.style.lineHeight = "1.5";
      bubble.style.textAlign = "left";
      bubble.style.whiteSpace = "pre-wrap";
      bubble.textContent = request.text;
      document.body.appendChild(bubble);
      var rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      var bubbleTop = rect.top + scrollTop;
      var bubbleLeft = rect.left + scrollLeft;
      bubble.style.top = bubbleTop + "1px";
      bubble.style.left = bubbleLeft +rect.width+ "3px";
      bubble.style.width = "auto";
      bubble.style.height = "auto";

      // 在气泡上添加“复制”按钮
var copyButton = document.createElement("button");
      copyButton.textContent = "复制";
      copyButton.style.marginTop = "10px";
      copyButton.style.display = "block";
      copyButton.style.margin = "auto";
      // 给copyButton设置更好看的样式
      copyButton.style.background = "#4CAF50";
      copyButton.style.color = "white";
      copyButton.style.border = "none";
      copyButton.style.padding = "8px 16px";
      copyButton.style.textAlign = "center";
      copyButton.style.textDecoration = "none";
      copyButton.style.display = "inline-block";
      copyButton.style.fontSize = "14px";
      copyButton.style.margin = "4px 2px";
      copyButton.style.cursor = "pointer";
      bubble.appendChild(copyButton);


      // 点击按钮时，将气泡内容复制到剪切板
      copyButton.addEventListener("click", function() {
        var range = document.createRange();
        range.selectNode(bubble);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
      });
      

      
      bubble.addEventListener("blur", function() {
        document.body.removeChild(bubble);
      });
      bubble.focus();
      setTimeout(() => bubble.focus(), 100);
      bubble.addEventListener("click", function() {
        document.body.removeChild(bubble);
      });
      // 设置超过30s后气泡自动删除
    setTimeout(() => {
      document.body.removeChild(bubble);
    }, 30000);

    }
  });