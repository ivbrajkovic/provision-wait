function setActiveTab(url) {
  const pattern = '*://' + url;
  chrome.tabs.query({ url: pattern }, tabs => {
    // chrome.tabs.sendMessage(tabs[0].id, obj);
  });
}
