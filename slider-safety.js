(() => {
  const SAFE_HOLD_MS = 260;
  const ranges = [...document.querySelectorAll('input[type="range"]')]
    .filter(input => !input.disabled && input.id !== 'gorillaSlider');

  function wrapOf(input){
    return input.closest('.rangeWrap') || input.parentElement;
  }

  function emitInput(input){
    input.dispatchEvent(new Event('input', { bubbles:true }));
    input.dispatchEvent(new Event('change', { bubbles:true }));
  }

  ranges.forEach(input => {
    const wrap = wrapOf(input);
    if (!wrap) return;
    let armed = false;
    let timer = null;
    let lastValue = input.value;
    let activePointer = null;

    wrap.classList.add('sliderLocked');

    function arm(){
      armed = true;
      wrap.classList.add('sliderArmed');
      wrap.classList.remove('sliderLocked');
      lastValue = input.value;
      if (navigator.vibrate) navigator.vibrate(18);
    }

    function disarm(){
      clearTimeout(timer);
      timer = null;
      activePointer = null;
      armed = false;
      wrap.classList.remove('sliderArmed');
      wrap.classList.add('sliderLocked');
      lastValue = input.value;
    }

    input.addEventListener('pointerdown', event => {
      if (input.disabled) return;
      activePointer = event.pointerId;
      lastValue = input.value;
      clearTimeout(timer);
      timer = setTimeout(arm, SAFE_HOLD_MS);
    }, { passive:true });

    input.addEventListener('pointermove', event => {
      if (!armed) {
        clearTimeout(timer);
        if (input.value !== lastValue) {
          input.value = lastValue;
          emitInput(input);
        }
      }
    }, { passive:true });

    input.addEventListener('input', () => {
      if (!armed) {
        if (input.value !== lastValue) {
          input.value = lastValue;
          emitInput(input);
        }
        return;
      }
      lastValue = input.value;
    });

    input.addEventListener('change', () => {
      if (!armed && input.value !== lastValue) {
        input.value = lastValue;
        emitInput(input);
      }
    });

    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
      input.addEventListener(type, disarm, { passive:true });
    });

    input.addEventListener('keydown', event => {
      if (!armed && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) {
        event.preventDefault();
      }
    });
  });

  document.querySelectorAll('.collectLine .unit').forEach(unit => {
    const text = (unit.textContent || '').trim();
    if (text === '円') {
      unit.textContent = '（円）';
      unit.classList.add('unitParen');
    } else if (text === '人') {
      unit.textContent = '（人）';
      unit.classList.add('unitParen');
    }
  });
})();
