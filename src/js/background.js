browser.browserAction.onClicked.addListener(function (tab) {
    browser.tabs.create({ url: 'jsonviewer.html' })
});