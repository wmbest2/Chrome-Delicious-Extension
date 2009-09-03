// Copyright (c) 2009, William Best and Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY WILLIAM BEST AND SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL WILLIAM BEST AND SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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

