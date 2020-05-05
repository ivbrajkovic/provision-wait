// ------------------------------------------------------------------
// Vrati sve provisioning parkirane kartice
// ------------------------------------------------------------------
//
function restoreProvTickets() {
  const checks = document.querySelectorAll('.CheckBox_Uklj');
  const submit = document.getElementById('submit_button_tmUKLJ1');

  if (!checks.length || !submit) return;

  checks.forEach(item => item.setAttribute('checked', true));
  submit.removeAttribute('disabled');
  submit.click();
}
//
// ------------------------------------------------------------------
