console.log('Background script start');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('TCL: msg', msg);

  // First, validate the message's structure.
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
});

console.log('Background script end');
