function provisioningWait(ticketID) {
  console.log('TCL: provisioningWait -> ticketID', ticketID);

  // $.ajax({
  //   method: 'GET',
  //   url: 'http://sdslam3p.ad.local/tms/ObradaKartica/solve',
  //   data: {
  //     razlog: 'aaaaaaaaaaaaaaaa',
  //     vrsta: 'provisioning',
  //     akcija: 'wait',
  //     KarticaID: ticketID,
  //     parkiraj_prebaci: 'action_do',
  //     vratiSaParkinga: '',
  //     usluga: 'prov',
  //     mjestoSmetnje: '',
  //     razlogSmetnje: '',
  //     nacinOtklonaS: '',
  //     koristeniAlatiS: '',
  //     izvor: '',
  //     razlog_text3: '',
  //     CekanjeRazlog: '5',
  //     pfr: ''
  //   }
  // }).done(function(msg) {
  //   if (typeof msg.key != 'undefined' && msg.key !== null) {
  //     alert('Kartica je već BSMC!');
  //   }

  // window.location = 'ObradaKartica';
  // });
}
