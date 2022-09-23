    "use strict";
chrome.browserAction.onClicked.addListener(function (n) {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    // iconOpen && chrome.runtime.openOptionsPage()
});