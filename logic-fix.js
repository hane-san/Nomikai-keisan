(() => {
  const $ = id => document.getElementById(id);
  const nf = new Intl.NumberFormat('ja-JP');
  const roundValues = [1, 10, 50, 100, 500, 1000, 5000, 10000];

  const groupKeys = ['gorilla', 'monkey', 'butterfly'];
  const groups = groupKeys.map(key => ({
    key,
    people: $(key + 'People'),
    slider: $(key + 'Slider'),
    tilt: $(key + 'Tilt'),
    per: $(key + 'Per'),
    paidPeople: $(key + 'PaidPeople'),
    paidYen: $(key + 'PaidYen'),
    duePeople: $(key + 'DuePeople'),
    dueYen: $(key + 'DueYen')
  })).filter(g => g.people && g.slider && g.per);

  const bill = $('bill');
  const fund = $('fund');
  const roundSlider = $('roundSlider');

  if (!bill || !fund || !roundSlider || groups.length !== 3) return;

  const digits = value => String(value || '')
    .replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0))
    .replace(/[^0-9]/g, '');
  const num = el => Number(digits(el && el.value)) || 0;
  const numText = el => Number(digits(el && el.textContent)) || 0;
  const formatNum = value => nf.format(Math.max(0, Math.round(Number(value) || 0)));

  function unitNow(){
    return roundValues[Number(roundSlider.value)] || 100;
  }

  function forceGorillaFixed(){
    const gorilla = groups.find(g => g.key === 'gorilla');
    if (!gorilla) return;
    gorilla.slider.value = 100;
    gorilla.slider.disabled = true;
    if (gorilla.tilt) gorilla.tilt.textContent = '100%';
    const bar = gorilla.slider.closest('.barRow');
    if (bar) bar.classList.add('fixedBar');
  }

  function calcOptimal(){
    updating = true;
    forceGorillaFixed();

    const target = Math.max(num(bill) - num(fund), 0);
    const unit = unitNow();

    const peopleByKey = {};
    const percentByKey = {};
    groups.forEach(g => {
      peopleByKey[g.key] = num(g.people);
      percentByKey[g.key] = g.key === 'gorilla' ? 100 : Number(g.slider.value || 0);
    });

    const totalPeople = groups.reduce((sum, g) => sum + peopleByKey[g.key], 0);

    function perUnitsFromGorillaUnits(gorillaUnits, percent){
      if (!gorillaUnits || !percent) return 0;
      return Math.ceil((gorillaUnits * percent) / 100);
    }

    function dueForGorillaUnits(gorillaUnits){
      return groups.reduce((sum, g) => {
        const perUnits = perUnitsFromGorillaUnits(gorillaUnits, percentByKey[g.key]);
        return sum + peopleByKey[g.key] * perUnits * unit;
      }, 0);
    }

    let gorillaUnits = 0;
    if (target > 0 && totalPeople > 0) {
      let high = 1;
      while (dueForGorillaUnits(high) < target && high < 1_000_000_000) high *= 2;
      let low = 0;
      while (low + 1 < high) {
        const mid = Math.floor((low + high) / 2);
        if (dueForGorillaUnits(mid) >= target) high = mid;
        else low = mid;
      }
      gorillaUnits = high;
    }

    let totalDue = 0;
    let collectedPeople = 0;
    let collectedYen = 0;

    groups.forEach(g => {
      const people = peopleByKey[g.key];
      const percent = percentByKey[g.key];
      const per = perUnitsFromGorillaUnits(gorillaUnits, percent) * unit;
      const due = per * people;
      const doneCount = numText(g.paidPeople);
      const doneYen = doneCount * per;

      totalDue += due;
      collectedPeople += doneCount;
      collectedYen += doneYen;

      g.per.textContent = formatNum(per);
      g.tilt.textContent = percent + '%';
      g.paidYen.textContent = formatNum(doneYen);
      g.duePeople.textContent = formatNum(people);
      g.dueYen.textContent = formatNum(due);
    });

    if ($('totalPeople')) $('totalPeople').textContent = formatNum(totalPeople);
    if ($('totalPaid')) $('totalPaid').textContent = formatNum(totalDue);
    if ($('totalPaidPeople')) $('totalPaidPeople').textContent = formatNum(collectedPeople);
    if ($('totalPaidYen')) $('totalPaidYen').textContent = formatNum(collectedYen);
    if ($('totalDuePeople')) $('totalDuePeople').textContent = formatNum(totalPeople);
    if ($('totalDueYen')) $('totalDueYen').textContent = formatNum(totalDue);
    if ($('change')) $('change').textContent = 'お釣り ' + formatNum(Math.max(totalDue - target, 0)) + ' 円';
    if ($('roundNow')) $('roundNow').textContent = formatNum(unit) + ' 円';

    updating = false;
  }

  let pending = false;
  let updating = false;
  function schedule(){
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      calcOptimal();
    });
  }

  [bill, fund, roundSlider, ...groups.flatMap(g => [g.people, g.slider])]
    .filter(Boolean)
    .forEach(el => {
      ['input', 'change', 'pointerup', 'keyup'].forEach(type => el.addEventListener(type, schedule));
    });

  document.addEventListener('click', event => {
    if (event.target.closest('#calcLock, .memoName, .memoClose, .icon, .keys button')) {
      setTimeout(schedule, 0);
    }
  }, true);

  const observer = new MutationObserver(() => {
    if (!updating) schedule();
  });
  groups.forEach(g => {
    if (g.paidPeople) observer.observe(g.paidPeople, { childList:true, characterData:true, subtree:true });
  });

  setTimeout(schedule, 0);
})();
