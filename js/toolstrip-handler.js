var deliciousUrl = "http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=";
var url;
var title;

// Listener for messages posted via the content script
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        url = data.url;
        title = data.title;
        
        // Register the tab with the tagging page action
        chrome.pageActions.enableForTab("tag_page",
                                        { 
                                            tabId: port.tab.id,
                                            url: port.tab.url,
                                            title: "Click to tag this page on Delicious",
                                            iconId: 0
                                        });
    });
});

chrome.pageActions["tag_page"].addListener(function(pageActionId, reply) {
    console.log(reply);
    tagCurrentPage();
});

function tagCurrentPage() {
    window.open(deliciousUrl + url + '&title=' + title +' ','deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=550,height=550');
};

dojo.addOnLoad(function(){
    dojo.query(".menu").connect("onclick", function() {
		chrome.toolstrip.expand({height: 300});
	});
    
    dojo.query("body").connect("onmouseleave", function() {
	    chrome.toolstrip.collapse();
	});		
});
