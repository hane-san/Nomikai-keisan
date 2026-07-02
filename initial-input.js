(() => {
  function activateBill(){
    const bill = document.getElementById('bill');
    if (!bill) return;
    document.querySelectorAll('.activeInput').forEach(node => node.classList.remove('activeInput'));
    const box = bill.closest('.field');
    if (box) box.classList.add('activeInput');
    bill.dispatchEvent(new Event('focus'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(activateBill, 0), { once:true });
  } else {
    setTimeout(activateBill, 0);
  }
})();
