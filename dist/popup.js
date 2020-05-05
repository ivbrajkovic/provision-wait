// popup.js

const countInput = document.getElementById('count-input');
const actionBtn = document.getElementById('action-btn');
const odradiBtn = document.getElementById('odradi-btn');
const vratiBtn = document.getElementById('vrati-btn');
// const refreshInput = document.getElementById('refresh-input');
// const refreshBtn = document.getElementById('refresh-btn');

// ------------------------------------------------------------------
// OnKeyPress handler
// ------------------------------------------------------------------
//
countInput.onkeypress = e => {
  if (e.key === 'Enter') chrome.storage.sync.set({ count: +countInput.value });
};
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Button click handlers
// ------------------------------------------------------------------
//
actionBtn.onclick = function() {
  if (this.innerHTML === 'start') {
    if (+countInput.value < 1) return;
    chrome.storage.sync.set({ count: +countInput.value });
  } else {
    chrome.storage.sync.set({ count: 0 });
  }
};
//
// refreshBtn.onclick = function() {
//   if (this.innerHTML === start) {
//     if (+refreshInput.value < 1) return;
//     chrome.storage.sync.set({ refresh: +refreshInput.value });
//   } else {
//     chrome.storage.sync.set({ refresh: 0 });
//   }
// };
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Odradi provision kartice
// ------------------------------------------------------------------
//
odradiBtn.onclick = () => {
  sendMessageToActiveTab({
    from: 'popup',
    subject: 'Odradi provision kartice'
  });

  // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //   chrome.tabs.sendMessage(tabs[0].id, {
  //     from: 'popup',
  //     subject: 'Odradi provision kartice'
  //   });
  // });
};
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Vrati provision parkirane
// ------------------------------------------------------------------
//
vratiBtn.onclick = () => {
  sendMessageToActiveTab({
    from: 'popup',
    subject: 'Vrati provision kartice'
  });

  // chrome.tabs.executeScript(null, {
  //   code:
  //     'document' +
  //     '.querySelectorAll(".CheckBox_Uklj")' +
  //     '.forEach(item => item.setAttribute("checked", true));' +
  //     '' +
  //     'const submit = document.getElementById("submit_button_tmUKLJ1");' +
  //     'if(submit) {' +
  //     'submit.removeAttribute("disabled");' +
  //     'submit.click();' +
  //     '}' +
  //     'else console.log("Submit button not found");'
  // });
};
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// OnLoad - get storage data
// ------------------------------------------------------------------
//
// Retreive storage on startup
chrome.storage.sync.get('count', ({ count }) => {
  countInput.value = count || 0;
  actionBtn.innerHTML = count > 0 ? 'stop' : 'start';
});
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// OnLoad - listen for storage change
// ------------------------------------------------------------------
//
// Listen on storage change
chrome.storage.onChanged.addListener(({ count }) => {
  console.log('TCL: count', count);

  count && setInput(count.newValue || 0);
});
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Change control text on storage data change
// ------------------------------------------------------------------
//
function setInput(value) {
  const count = value;
  if (count > 0) {
    countInput.value = value;
    actionBtn.innerHTML = 'stop';
  } else {
    countInput.value = 0;
    actionBtn.innerHTML = 'start';
  }
}
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Send message to active tab
// ------------------------------------------------------------------
//
function sendMessageToActiveTab(obj) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, obj);
  });
}
//
// ------------------------------------------------------------------
