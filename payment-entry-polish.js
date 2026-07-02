(() => {
  const vibrate = pattern => {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  };

  function pulse(el, className, ms = 520){
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
    window.setTimeout(() => el.classList.remove(className), ms);
  }

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

  function closePaymentEntry(){
    const active = document.activeElement;
    if (active && active.classList && active.classList.contains('nameInput')) {
      active.blur();
    }
    document.querySelectorAll('.card.payActive').forEach(card => card.classList.remove('payActive'));
    document.body.classList.remove('naming');
  }

  function focusPaymentInput(card){
    const input = card && card.querySelector('.nameInput');
    if (!input) return;
    input.setAttribute('lang', 'ja');
    input.setAttribute('inputmode', 'text');
    input.focus({ preventScroll:true });
    try { input.setSelectionRange(input.value.length, input.value.length); } catch (_) {}
  }

  function showIconFeedback(icon){
    const card = icon && icon.closest('.card');
    if (card) {
      document.querySelectorAll('.card.payActive').forEach(other => {
        if (other !== card) other.classList.remove('payActive');
      });
      card.classList.add('payActive');
      document.body.classList.add('naming');
      pulse(card, 'paymentDoneFlash', 620);
    }
    pulse(icon, 'paymentTapFlash', 360);
    vibrate(18);
    window.setTimeout(() => focusPaymentInput(card), 60);
  }

  function showDoneFeedback(input){
    const card = input && input.closest('.card');
    pulse(input, 'paymentDoneFlash', 540);
    pulse(card, 'paymentDoneFlash', 640);
    vibrate([12, 28, 18]);
    window.setTimeout(closePaymentEntry, 120);
  }

  function refocusPaymentInput(event){
    const icon = event.target.closest('.icon');
    if (!icon) return;
    showIconFeedback(icon);
  }

  function handleNameDone(event){
    const input = event.target.closest && event.target.closest('.nameInput');
    if (!input) return;

    if (event.type === 'keydown' && event.key !== 'Enter') return;
    const hasText = input.value && input.value.trim();
    if (hasText) {
      window.setTimeout(() => showDoneFeedback(input), 0);
    } else if (event.type === 'keydown' && event.key === 'Enter') {
      event.preventDefault();
      closePaymentEntry();
    }
  }

  function closeOnOutsideTap(event){
    if (!document.body.classList.contains('naming') && !document.querySelector('.card.payActive')) return;
    if (event.target.closest('.payEntry, .icon, .nameInput')) return;
    closePaymentEntry();
  }

  preparePaymentInputs();
  document.addEventListener('click', refocusPaymentInput, true);
  document.addEventListener('keydown', handleNameDone, true);
  document.addEventListener('pointerdown', closeOnOutsideTap, true);
})();
