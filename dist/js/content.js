console.log('Content script start');

if (window.location.pathname !== pathnameObradaKartica) return;

// -------------------------------------------------
// Path obrada kartica
// -------------------------------------------------
//
// -------------------------------------------------
// VARIABLES
// -------------------------------------------------
//
const obj = { count: 0, stop: false };
const refreshObj = { timeout: 0, timeoutId: null };
//
// -------------------------------------------------

// -------------------------------------------------
// STARTUP
// -------------------------------------------------
//
// Show page action on startup
chrome.runtime.sendMessage({ from: 'content', subject: 'Show page action' });
//
// -------------------------------------------------
// Create refresh controls
const refreshControls =
  '<input type="text" class="form-control input-md" style="width: 5rem;" id="refresh-input">' +
  '<button id="refresh-button" class="btn btn-success" style="' +
  'margin-left: 1rem;' +
  '">Start</button>';
const refreshControlsContainerStyles =
  'float: left;' +
  'display: flex;' +
  'align-items: center;' +
  'height: 100%;' +
  'margin: 0 1rem;';

const refreshControlsContainer = document.createElement('div');
refreshControlsContainer.style = refreshControlsContainerStyles;
refreshControlsContainer.innerHTML = refreshControls;
const navbarRight = document.querySelector('.navbar-right');
navbarRight.insertBefore(refreshControlsContainer, navbarRight.childNodes[0]);

const refreshInput = document.getElementById('refresh-input');
refreshInput.onkeypress = e => {
  if (e.key === 'Enter')
    chrome.storage.sync.set({ refresh: +refreshInput.value * 1000 });
};

const refreshBtn = document.getElementById('refresh-button');
refreshBtn.onclick = () => {
  if (this.innerHTML === startText) {
    if (+refreshInput.value > 0)
      chrome.storage.sync.set({ refresh: +refreshInput.value * 1000 });
  } else {
    chrome.storage.sync.set({ refresh: 0 });
  }
};

//
// -------------------------------------------------
// Get storage on startup
chrome.storage.sync.get(['count', 'refresh'], ({ count, refresh }) => {
  console.log('TCL: content -> count, refresh', count, refresh);

  obj.count = count || 0;
  if (obj.count > 0) waitProvTickets(obj);

  // if (refresh) {
  refreshObj.timeout = +refresh || 0;
  refreshInput.value = refreshObj.timeout / 1000;

  // Start refresh timeout
  if (refreshObj.timeout > 0) {
    refreshBtn.innerHTML = stopText;
    refreshObj.timeoutId = setTimeout(() => {
      window.location.pathname = pathnameObradaKartica;
    }, refreshObj.timeout);
  }
  // }
});
//
// -------------------------------------------------
// Listen on storage change
chrome.storage.onChanged.addListener(({ count, refresh }) => {
  console.log('TCL: content -> addListener -> count, refresh', count, refresh);

  if (!obj.stop && count) {
    obj.count = count.newValue || 0;
    waitProvTickets(obj);
  } else if (obj.stop) obj.stop = false;

  if (refresh) {
    refreshObj.timeout = +refresh.newValue || 0;
    refreshInput.value = refreshObj.timeout / 1000;
    window.clearTimeout(refreshObj.timeoutId);

    if (refreshObj.timeout > 0) {
      refreshBtn.innerHTML = stopText;
      refreshObj.timeoutId = setTimeout(() => {
        window.location.pathname = pathnameObradaKartica;
      }, refreshObj.timeout);
    } else refreshBtn.innerHTML = startText;
  }
});

//
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === 'popup' && msg.subject === 'Odradi provision kartice') {
    solveProvTickets();
  } else if (
    msg.from === 'popup' &&
    msg.subject === 'Vrati provision kartice'
  ) {
    restoreProvTickets();
  }
});
//
// -------------------------------------------------

console.log('Content script end');
