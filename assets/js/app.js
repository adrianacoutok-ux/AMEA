const slideIds = ['hero','s1','s2','s3','s4','s5','s6','s7','s8','fechamento'];
  const slideEls = slideIds.map(id => document.getElementById(id));
  const railButtons = document.querySelectorAll('.rail button');
  const counterEl = document.getElementById('slideCounter');
  let current = 0;

  const REVEAL_SELECTOR = '.eyebrow, h2, .lede, .statement, .taglist li, .pull, .emph, .showcase span, .id-grid .chip, .aff-card, .pair .block, .close-mark, #fechamento .lead, .final-line, .final-closer, .brand-close';
  const STAGGER_SELECTOR = '.taglist li, .id-grid .chip, .showcase span, .aff-card';

  function activateReveals(el){
    const nodes = el.querySelectorAll(REVEAL_SELECTOR);
    let idx = 0;
    nodes.forEach(node=>{
      if(node.matches(STAGGER_SELECTOR)){
        node.style.transitionDelay = (idx % 8) * 55 + 'ms';
        idx++;
      }
      node.classList.add('revealed');
    });
  }

  function updateRail(){
    const id = slideIds[current];
    railButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
  }

  function updateCounter(){
    const n = String(current + 1).padStart(2,'0');
    counterEl.innerHTML = '<b>' + n + '</b> — ' + slideIds.length;
  }

  function showSlide(i){
    i = Math.max(0, Math.min(slideIds.length - 1, i));
    if(i === current){ return; }
    slideEls[current].classList.remove('active');
    current = i;
    const el = slideEls[current];
    el.classList.add('active');
    activateReveals(el);
    updateRail();
    updateCounter();
  }

  function next(){ showSlide(current + 1); }
  function prev(){ showSlide(current - 1); }

  // initial state
  slideEls[0].classList.add('active');
  activateReveals(slideEls[0]);
  updateRail();
  updateCounter();

  railButtons.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      showSlide(slideIds.indexOf(btn.dataset.target));
    });
  });

  document.getElementById('btnNext').addEventListener('click', (e)=>{ e.stopPropagation(); next(); });
  document.getElementById('btnPrev').addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });

  window.addEventListener('keydown', (e)=>{
    if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); next(); }
    else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); prev(); }
    else if(e.key === 'Home'){ e.preventDefault(); showSlide(0); }
    else if(e.key === 'End'){ e.preventDefault(); showSlide(slideIds.length-1); }
  });

  // click anywhere on the slide (left half = back, right half = forward)
  document.addEventListener('click', (e)=>{
    if(e.target.closest('.rail') || e.target.closest('.nav-btn')) return;
    const half = window.innerWidth / 2;
    if(e.clientX > half){ next(); } else { prev(); }
  });

  // basic touch swipe support
  let touchX = null;
  document.addEventListener('touchstart', e=>{ touchX = e.touches[0].clientX; }, {passive:true});
  document.addEventListener('touchend', e=>{
    if(touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 50){ dx < 0 ? next() : prev(); }
    touchX = null;
  }, {passive:true});
