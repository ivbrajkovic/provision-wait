console.log('Background script start');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('TCL: msg', msg);

  // First, validate the message's structure.
  if (msg.from === 'content' && msg.subject === 'Show page action') {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  } else if (msg.from === 'content' && msg.subject === 'Set active tab') {
    setActiveTab(msg.data);
  }
});

function setActiveTab(url) {
  const pattern = ['*://127.0.0.1' + url, 'http://sdslam3p.ad.local' + url];
  chrome.tabs.query({ url: pattern }, tabs => {
    console.log('TCL: setActiveTab -> tabs', tabs);
    // chrome.tabs.sendMessage(tabs[0].id, obj);
    chrome.tabs.update(tabs[0].id, { highlighted: true });
  });
}

console.log('Background script end');
