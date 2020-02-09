const countInput = document.getElementById('count-input');
const actionBtn = document.getElementById('action-btn');

// Send message to active tab
const sendMessage = msg => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(tabs[0].id, msg);
    // { from: 'popup', subject: 'count', content: value }
    // ...also specifying a callback to be called
    //    from the receiving end (content script).
    // setDOMInfo
  });
};

// Set or update object to storage
const setStorage = obj => {
  chrome.storage.sync.set(obj, () => {
    console.log('Value is set to ' + obj.value);

    // sendMessage({ from: 'popup', subject: 'start' });
  });
};

// Retreive storage on startup
chrome.storage.sync.get('count', ({ count }) => {
  console.log('Value currently is ' + count);

  countInput.value = count || 0;
});

// Listen on storage change
chrome.storage.onChanged.addListener(({ count }) => {
  const { newValue } = count;
  countInput.value = newValue;
});

// On button click
actionBtn.onclick = () => {
  setStorage({ count: countInput.value });
};

// On enter press
countInput.onkeypress = e => {
  if (e.key === 'Enter') setStorage({ count: countInput.value });
};
