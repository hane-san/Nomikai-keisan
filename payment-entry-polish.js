(() => {
  function preparePaymentInputs(){
    document.querySelectorAll('.nameInput').forEach(input => {
      input.setAttribute('lang', 'ja');
      input.setAttribute('inputmode', 'text');
      input.setAttribute('enterkeyhint', 'done');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('autocomplete', 'name');
      input.setAttribute('placeholder', 'なまえ');
    });

    document.querySelectorAll('.moneyInput, .peopleInput').forEach(input => {
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('pattern', '[0-9]*');
    });
  }

  function refocusPaymentInput(event){
    const icon = event.target.closest('.icon');
    if (!icon) return;
    setTimeout(() => {
      const card = icon.closest('.card');
      const input = card && card.querySelector('.nameInput');
      if (!input) return;
      input.setAttribute('lang', 'ja');
      input.setAttribute('inputmode', 'text');
      input.focus({ preventScroll:true });
      try { input.setSelectionRange(input.value.length, input.value.length); } catch (_) {}
    }, 60);
  }

  preparePaymentInputs();
  document.addEventListener('click', refocusPaymentInput, true);
})();
