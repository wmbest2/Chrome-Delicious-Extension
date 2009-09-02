var deliciousUrl = "http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=";
var url;
var title;

// grabbed from delicious_content_script.js
chrome.self.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        url = data.url;
        title = data.title;

        // Register the tab with the tagging page action
        chrome.pageActions.enableForTab("tag_page",
                                        { 
                                            tabId: port.tab.id,
                                            url: port.tab.url
                                        });
    });
});

chrome.pageActions["tag_page"].addListener(function(actionId, reply) {
    tagCurrentPage();
});

function tagCurrentPage() {
    window.open(deliciousUrl + url + '&title=' + title +' ','deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=550,height=550');
};
