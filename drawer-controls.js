(() => {
  const sheet = document.getElementById('memoSheet');
  const backdrop = document.getElementById('memoBackdrop');
  if (!sheet) return;

  function openDrawer(from){
    if (sheet.classList.contains('open')) return;
    sheet.classList.remove('fromLeft', 'fromRight');
    sheet.classList.add(from === 'right' ? 'fromRight' : 'fromLeft');
    requestAnimationFrame(() => {
      sheet.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    });
  }

  function closeDrawer(){
    sheet.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  function addHotspots(){
    if (document.querySelector('.drawerHotspot')) return;

    const left = document.createElement('button');
    left.type = 'button';
    left.className = 'drawerHotspot left';
    left.setAttribute('aria-label', '左から支払い済みメモを開く');
    left.addEventListener('click', event => {
      event.preventDefault();
      openDrawer('left');
    });

    const right = document.createElement('button');
    right.type = 'button';
    right.className = 'drawerHotspot right';
    right.setAttribute('aria-label', '右から支払い済みメモを開く');
    right.addEventListener('click', event => {
      event.preventDefault();
      openDrawer('right');
    });

    document.body.append(left, right);
  }

  addHotspots();
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  let start = null;
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('input, textarea, select, button, .memoSheet, .memoBackdrop, .keypad, input[type="range"]')) return;
    start = { x:event.clientX, y:event.clientY, t:performance.now() };
  }, { passive:true });

  document.addEventListener('pointerup', event => {
    if (!start || sheet.classList.contains('open')) {
      start = null;
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const dt = performance.now() - start.t;
    start = null;

    if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy) * 1.08 && dt < 850) {
      openDrawer(dx > 0 ? 'left' : 'right');
    }
  }, { passive:true });
})();
