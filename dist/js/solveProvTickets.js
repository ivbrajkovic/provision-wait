// ------------------------------------------------------------------
// Solve all provisioning tickets - async
// ------------------------------------------------------------------
//
async function solveProvTickets() {
  const token = document.querySelector("input[name='_token']").value;

  const tickets = document.querySelectorAll(
    '#odrada[data-is_provisioning="true"]'
  );

  const ticketIDs = [...tickets].map((ticket) =>
    ticket.getAttribute('ticket-id')
  );

  for (let i = ticketIDs.length; i; i--) {
    const ticketID = ticketIDs[i - 1];
    // Get urls
    const [checkUrl, solveUrl, formData] = getUrls(ticketID, token);

    const isClosed = await (await fetch(checkUrl)).text();
    if (isClosed === 'Da') {
      try {
        // const res = await fetch(solveUrl);
        const res = await fetch(solveUrl, {
          method: 'POST',
          // headers: {
          //   // 'Content-Type': 'application/json'
          //   'Content-Type': 'application/x-www-form-urlencoded'
          // },
          body: formData
        });

        // Remove element form page
        document
          .querySelector(`[ticket-id="${ticketID}"]`)
          .parentNode.parentNode.remove();

        console.log(`TCL: solveProvTickets -> ticket ${ticketID} removed`);
      } catch (err) {
        console.log('solveProvTickets -> err', err);
      }
    }
  }

  // Reload page
  window.location.pathname = pathnameObradaKartica;

  // odradaKartica.js, line: 741;
  //sdslam3p.ad.local/tms/ObradaKartica/solve?razlog=&vrsta=provisioning&akcija=done&KarticaID=45026876&parkiraj_prebaci=action_do&vratiSaParkinga=&usluga=prov&mjestoSmetnje=&razlogSmetnje=&nacinOtklonaS=&koristeniAlatiS=&izvor=&razlog_text3=&pf=

  // Request URL: http://sdslam3p.ad.local/tms/ObradaKartica/solve
  // Content-Type: application/x-www-form-urlencoded; charset=UTF-8
  // _token: 63PZCb4KFHiGeGjMdmZ1tAfk3RAoi3HF1ZFiPSPT
  // vrsta: provisioning
  // akcija: done
  // KarticaID: 45027981
  // parkiraj_prebaci: action_do
  // vratiSaParkinga:
  // usluga: prov
  // mjestoSmetnje:

  // raw: _token=63PZCb4KFHiGeGjMdmZ1tAfk3RAoi3HF1ZFiPSPT&vrsta=provisioning&akcija=done&KarticaID=45027981&parkiraj_prebaci=action_do&vratiSaParkinga=&usluga=prov&mjestoSmetnje=&razlogSmetnje=

  // Get formated urls
  http: function getUrls(ticketID, token) {
    const checkWWMSRoute =
      `http://sdslam3p.ad.local/tms/ObradaKartica/WMMSCheck?` +
      `KarticaID=${ticketID}`;

    const solveTicketRoute = `http://sdslam3p.ad.local/tms/ObradaKartica/solve`;

    // Build formData object.
    const formData = new FormData();
    formData.append('_token', token);
    formData.append('vrsta', 'provisioning');
    formData.append('akcija', 'done');
    formData.append('KarticaID', ticketID);
    formData.append('parkiraj_prebaci', 'action_do');
    formData.append('vratiSaParkinga', null);
    formData.append('usluga', 'prov');
    formData.append('mjestoSmetnje', null);

    // const data = {
    //   _token: token,
    //   vrsta: 'provisioning',
    //   akcija: 'done',
    //   KarticaID: ticketID,
    //   parkiraj_prebaci: 'action_do',
    //   vratiSaParkinga: null,
    //   usluga: 'prov',
    //   mjestoSmetnje: null
    // };

    // const solveTicketRoute =
    //   `http://sdslam3p.ad.local/tms/ObradaKartica/solve?` +
    //   `_token=${token}&` +
    //   `razlog=&` +
    //   `vrsta=provisioning&` +
    //   `akcija=done&` +
    //   `KarticaID=${ticketID}&` +
    //   `parkiraj_prebaci=action_do&` +
    //   `vratiSaParkinga=&` +
    //   `usluga=prov&` +
    //   `mjestoSmetnje=&` +
    //   `razlogSmetnje=&` +
    //   `nacinOtklonaS=&` +
    //   `koristeniAlatiS=&` +
    //   `izvor=&` +
    //   `razlog_text3=&` +
    //   `pf=`;

    return [checkWWMSRoute, solveTicketRoute, formData];
  }
}
//
// ------------------------------------------------------------------

// $.ajax({
//   method : "POST",
//   url : solveTicketRoute,
//   data : {
//     _token:token,
//     razlog				: razlog,
//     vrsta 				: vrsta,
//     akcija 				: akcija,
//     KarticaID 			: ticketID,
//     parkiraj_prebaci 	: parkiraj_prebaci,
//     vratiSaParkinga		: vratiSaParkinga,
//     usluga 				: usluga,
//     mjestoSmetnje 		: mjestoSmetnje,
//     razlogSmetnje 		: razlogSmetnje,
//     nacinOtklonaS		: koristeniOznaceni,
//     koristeniAlatiS		: koristeniAlatiOznaceni,
//     izvor				: izvor,
//     razlog_text3		: razlog_text3,
//     pfr					: pfr
//   }
// }).done(function(msg) {
//   //alert(msg);
//   //window.location.reload();
//   window.location = "ObradaKartica";
// });
