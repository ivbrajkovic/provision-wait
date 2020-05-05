// Obrada kartica
if (window.location.pathname === pathnameObradaKartica) {
  console.log('ObradaKartica script start');

  // Show page action on startup
  chrome.runtime.sendMessage({ from: 'content', subject: 'Show page action' });

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
  // -------------------------------------------------
  // Create refresh controls
  const refreshControls =
    '<input type="text" class="form-control input-md" style="width: 5rem;" id="refresh-input">' +
    '<button id="refresh-button" class="btn btn-success" style="' +
    'margin-left: 1rem;' +
    '">Start</button>' +
    '<button id="odradi-button" class="btn btn-success" style="' +
    'margin-left: 1rem;' +
    '">Odradi</button>';
  const refreshControlsContainerStyles =
    'float: left;' +
    'display: flex;' +
    'align-items: center;' +
    'height: 100%;' +
    'margin: 0 1rem;';
  //
  // Inject refersh controls
  const refreshControlsContainer = document.createElement('div');
  refreshControlsContainer.style = refreshControlsContainerStyles;
  refreshControlsContainer.innerHTML = refreshControls;
  const navbarRight = document.querySelector('.navbar-right');
  navbarRight.insertBefore(refreshControlsContainer, navbarRight.childNodes[0]);
  //
  // Refresh controls event handlers
  const refreshInput = document.getElementById('refresh-input');
  refreshInput.onkeypress = e => {
    if (e.key === 'Enter')
      chrome.storage.sync.set({ refresh: +refreshInput.value * 1000 });
  };
  //
  const refreshBtn = document.getElementById('refresh-button');
  refreshBtn.onclick = e => {
    if (e.target.innerHTML === startText) {
      if (+refreshInput.value > 0)
        chrome.storage.sync.set({ refresh: +refreshInput.value * 1000 });
    } else {
      chrome.storage.sync.set({ refresh: 0 });
    }
  };
  //
  const odradiProv = document.getElementById('odradi-button');
  odradiProv.onclick = () => solveProvTickets();
  //
  // -------------------------------------------------
  // Get storage on startup
  chrome.storage.sync.get(['count', 'refresh'], ({ count, refresh }) => {
    console.log('TCL: content -> storage -> count, refresh', count, refresh);

    // Start wait func
    obj.count = count || 0;
    if (obj.count > 0) waitProvTickets(obj);

    // Start refresh timeout
    refreshObj.timeout = +refresh || 0;
    refreshInput.value = refreshObj.timeout / 1000;

    if (refreshObj.timeout > 0) {
      refreshBtn.innerHTML = stopText;
      refreshObj.timeoutId = setTimeout(() => {
        window.location.pathname = pathnameObradaKartica;
      }, refreshObj.timeout);
    }
  });
  //
  // -------------------------------------------------
  // Listen on storage change
  chrome.storage.onChanged.addListener(({ count, refresh }) => {
    console.log(
      'TCL: content -> addListener -> count, refresh',
      count,
      refresh
    );

    // Start wait func
    if (!obj.stop && count) {
      obj.count = count.newValue || 0;
      waitProvTickets(obj);
    } else if (obj.stop) obj.stop = false;

    // Start refresh timeout
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
  // -------------------------------------------------
  // Listen on messages
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

  // Get all provision tasks
  const tickets = document.querySelectorAll(
    '#odrada[data-is_provisioning="true"]'
  );

  if (tickets.length > 0) {
    chrome.storage.sync.set({ refresh: 0 });
    chrome.runtime.sendMessage({
      from: 'content',
      subject: 'Set active tab',
      data: pathnameObradaKartica
    });
  }

  console.log('ObradaKartica script end');
}
