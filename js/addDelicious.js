var deliciousUrl = "http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=";
var url;
var title;

// grabbed from delicious_content_script.js
chrome.self.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        url = data.url;
        title = data.title;
    });
});

function add_delicious() {
    window.open(deliciousUrl + url + '&title=' + title +' ','deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=550,height=550');
};
