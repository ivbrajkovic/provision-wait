// Isolated namespace
// (() => {

console.log('Content script start');

// const windowLoaction = 'ObradaKartica';
const windowLoaction = '/test';

// Parkiranje taskova
const parkiraj = count => {
  const tasks = document.querySelectorAll('#obrada');

  // If there is no tasks or count is 0 or less
  if (!tasks || count < 1) return;

  // For all tasks
  let tmpCount = count;
  for (let task of tasks) {
    if (tmpCount) {
      const ticketID = task.getAttribute('ticket-id');
      // Defined in "provisioningWait.js"
      provisioningWait(ticketID);
      task.remove();
      --tmpCount;
    }
  }

  // Update count in storage
  chrome.storage.sync.set({ count: tmpCount });

  // Reload page
  if (tmpCount) window.location = windowLoaction;
};

// Show page action on startup
chrome.runtime.sendMessage({ from: 'content', subject: 'showPageAction' });

// Get storage on startup
const inputCount = document.getElementById('inputCount');
chrome.storage.sync.get('count', ({ count }) => {
  inputCount.value = count || 0;
  parkiraj(+count);
});

// Listen on storage change
chrome.storage.onChanged.addListener(({ count }) => {
  const { newValue } = count;
  inputCount.value = newValue;
  parkiraj(+newValue);
});

console.log('Content script end');

// })();
