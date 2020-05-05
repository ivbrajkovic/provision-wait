// Moje kartice
if (window.location.pathname === pathnameObradaKartica) {
  console.log('MojeKartice script start');

  // Show page action on startup
  chrome.runtime.sendMessage({ from: 'content', subject: 'Show page action' });

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

  console.log('MojeKartice script end');
}
