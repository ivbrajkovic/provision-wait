// -------------------------------------------------
// Parkiranje kartica - asinkrono
// -------------------------------------------------
//
async function waitProvTickets(obj) {
  if (
    obj.count < 1 ||
    (!debug && window.location.pathname !== pathnameObradaKartica)
  )
    return;

  // Get all provision tasks
  const tickets = document.querySelectorAll(
    '#odrada[data-is_provisioning="true"]'
  );

  // If there are  no tasks refresh page after a timeout
  if (!tickets.length) {
    setTimeout(
      () => (window.location.pathname = pathnameObradaKartica),
      timeoutNoTasks
    );
    return;
  }

  // Signal to stop calling this function on store change
  obj.stop = true;

  // For every ticket on page
  for (let i = tickets.length; i && obj.count; i--, obj.count--) {
    const ticketID = tickets[i - 1].getAttribute('ticket-id');
    const url =
      `http://sdslam3p.ad.local/tms/ObradaKartica/solve?` +
      `razlog=aaaaaaaaaaaaaaaaaaa&` +
      `vrsta=provisioning&` +
      `akcija=wait&KarticaID=${ticketID}&` +
      `parkiraj_prebaci=action_do&` +
      `vratiSaParkinga=&` +
      `usluga=prov&` +
      `mjestoSmetnje=&` +
      `razlogSmetnje=&` +
      `CekanjeRazlog=5`;

    try {
      // await for parked ticket
      const res = await fetch(url);
      // const data = await res.text();
      if (res.ok) console.log('TCL: waitProvTickets -> fetch: SUCCESS');
      else console.log('TCL: waitProvTickets -> fetch: FAILED');
    } catch (err) {
      console.log('TCL: waitProvTickets -> fetch -> err', err);
    }

    // Remove element from page
    tickets[i - 1].parentNode.parentNode.remove();
  }

  // Update count in storage
  chrome.storage.sync.set({ count: obj.count });

  // If Last ticket on page and looking for more
  if (obj.count > 0) window.location.pathname = pathnameObradaKartica;
}
