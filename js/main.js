/* One Automatización — interacciones de la Home
   Motion de la Home (referencia técnica en docs/referencia-diseno.md):
   preloader con barrido, nav doble con desfase, galería que converge con el scroll,
   titulares letra por letra (IX3), entradas IX2, marquee de 25 s y tabs con hover. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  // IX2: overlay del logo 100%→0 (1 s, ease) y luego la cortina 100vh→0 (1 s outExpo, +0.5 s)
  var preloader = document.querySelector('.preloader');
  document.body.classList.add('is-loading');
  function endPreloader() {
    preloader.style.display = 'none';
    document.body.classList.remove('is-loading');
  }
  setTimeout(endPreloader, 5000); // tope: nunca bloquear la página si la animación se atrasa
  if (reduce || !hasGsap) {
    endPreloader();
  } else {
    gsap.timeline({ onComplete: endPreloader })
      .to('.preloader-logo-overlay', { width: '0%', duration: 1, ease: 'power1.inOut' }, 0.5)
      .to(preloader, { height: 0, duration: 1, ease: 'expo.out' }, '+=0.5');
  }

  /* ---------- Nav doble: la estática sube y la pill baja ---------- */
  // Aparece >100px, vuelve <40px, 450 ms + 120 ms de desfase.
  var top = document.querySelector('.nav--static');
  var pill = document.querySelector('.nav--pill');
  // la pill usa los mismos dropdowns que la nav estática
  var pillLinks = top.querySelector('.nav-links').cloneNode(true);
  pillLinks.removeAttribute('aria-label');
  pill.querySelector('.nav-inner').insertBefore(pillLinks, pill.querySelector('.nav-cta'));
  var SHOW_AT = 100, HIDE_AT = 40, SLIDE = 450, STAGGER = 120, TOTAL = SLIDE + STAGGER;
  var p = 0, target = 0, last = 0, running = false;
  function bez(x) { // cubic-bezier(.4,0,.2,1)
    var t = x;
    for (var i = 0; i < 8; i++) {
      var cx = 3 * .4 * t * (1 - t) * (1 - t) + 3 * .2 * t * t * (1 - t) + t * t * t - x;
      var d = 3 * .4 * (1 - t) * (1 - t) + 6 * (.2 - .4) * t * (1 - t) + 3 * (1 - .2) * t * t;
      if (Math.abs(cx) < 1e-5 || !d) break;
      t = Math.min(1, Math.max(0, t - cx / d));
    }
    return 3 * t * t * (1 - t) + t * t * t;
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function applyNav() {
    var t = p * TOTAL;
    var a = bez(clamp(t / SLIDE)), b = bez(clamp((t - STAGGER) / SLIDE));
    var dTop = top.offsetHeight + 8, dPill = pill.offsetTop + pill.offsetHeight + 24;
    top.style.translate = '0 ' + (-dTop * a).toFixed(2) + 'px';
    pill.style.translate = '-50% ' + (-dPill * (1 - b)).toFixed(2) + 'px';
    top.style.visibility = p >= 1 ? 'hidden' : '';
    pill.style.visibility = p <= 0 ? 'hidden' : 'visible';
    pill.style.pointerEvents = p >= 1 ? 'auto' : 'none';
  }
  function stepNav(now) {
    var dt = now - last; last = now;
    var dir = target > p ? 1 : -1;
    p += dir * dt / TOTAL;
    if ((dir > 0 && p >= target) || (dir < 0 && p <= target)) { p = target; running = false; }
    applyNav();
    if (running) requestAnimationFrame(stepNav);
  }
  function goNav(to) {
    if (to === target) return;
    target = to;
    pill.setAttribute('aria-hidden', to ? 'false' : 'true');
    pill.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = to ? 0 : -1; });
    if (reduce) { p = to; applyNav(); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(stepNav); }
  }
  function checkNav() {
    var y = window.pageYOffset;
    if (target === 0 && y > SHOW_AT) goNav(1);
    else if (target === 1 && y < HIDE_AT) goNav(0);
  }
  window.addEventListener('scroll', checkNav, { passive: true });
  window.addEventListener('resize', applyNav);
  applyNav();
  checkNav();

  /* ---------- Dropdowns de la nav ---------- */
  // IX2 DROPDOWN_OPEN: flecha 0→180°, lista y 20px→0 + opacity 0→1 (300 ms easeOut)
  // IX2 DROPDOWN_CLOSE: flecha →0°, lista →y -12px + opacity 0 (300 ms easeIn). Hover con 300 ms de demora al cerrar.
  var dds = [].slice.call(document.querySelectorAll('.dd'));
  function ddOpen(dd) {
    if (dd._open) return;
    dds.forEach(function (o) { if (o !== dd) ddClose(o); });
    dd._open = true;
    var list = dd.querySelector('.dd-list'), arrow = dd.querySelector('.dd-arrow');
    dd.querySelector('.dd-toggle').setAttribute('aria-expanded', 'true');
    list.hidden = false;
    if (window.gsap && !reduce) {
      gsap.killTweensOf([list, arrow]);
      gsap.fromTo(list, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3, ease: 'power1.out' });
      gsap.to(arrow, { rotation: 180, duration: .3, ease: 'power1.out' });
    }
  }
  function ddClose(dd) {
    if (!dd._open) return;
    dd._open = false;
    var list = dd.querySelector('.dd-list'), arrow = dd.querySelector('.dd-arrow');
    dd.querySelector('.dd-toggle').setAttribute('aria-expanded', 'false');
    if (window.gsap && !reduce) {
      gsap.killTweensOf([list, arrow]);
      gsap.to(arrow, { rotation: 0, duration: .3, ease: 'power1.in' });
      gsap.to(list, { opacity: 0, y: -12, duration: .3, ease: 'power1.in', onComplete: function () { if (!dd._open) list.hidden = true; } });
    } else list.hidden = true;
  }
  dds.forEach(function (dd) {
    var timer;
    dd.querySelector('.dd-toggle').addEventListener('click', function () { dd._open ? ddClose(dd) : ddOpen(dd); });
    if (canHover) {
      dd.addEventListener('mouseenter', function () { clearTimeout(timer); ddOpen(dd); });
      dd.addEventListener('mouseleave', function () { timer = setTimeout(function () { ddClose(dd); }, 300); });
    }
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) ddClose(dd); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dds.forEach(ddClose); });
  document.addEventListener('click', function (e) { dds.forEach(function (dd) { if (!dd.contains(e.target)) ddClose(dd); }); });
  window.addEventListener('scroll', function () { dds.forEach(ddClose); }, { passive: true });

  /* ---------- Menú móvil ---------- */
  var toggles = [].slice.call(document.querySelectorAll('.nav-toggle'));
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    toggles.forEach(function (t) {
      t.setAttribute('aria-expanded', String(open));
      t.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggles.forEach(function (t) { t.addEventListener('click', function () { setMenu(menu.hidden); }); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* ---------- Tabs de soluciones ---------- */
  var tablist = document.querySelector('.tabs');
  var tabs = [].slice.call(tablist.querySelectorAll('.tab'));
  var indicator = tablist.querySelector('.tab-indicator');
  function placeIndicator() {
    var cur = tablist.querySelector('[aria-selected="true"]');
    indicator.style.left = cur.offsetLeft + 'px';
    indicator.style.width = cur.offsetWidth + 'px';
  }
  function select(tab, focus) {
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var pane = document.getElementById(t.getAttribute('aria-controls'));
      pane.hidden = !on;
      pane.classList.toggle('is-active', on);
      // solo se reproduce el video del pane activo (cuando lleguen los videos de Control4)
      pane.querySelectorAll('video').forEach(function (v) {
        if (on && !reduce) { try { v.currentTime = 0; } catch (e) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    });
    if (focus) tab.focus();
    placeIndicator();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    if (canHover) { // selección al pasar el mouse, 110 ms
      var timer;
      t.addEventListener('mouseenter', function () { clearTimeout(timer); timer = setTimeout(function () { select(t); }, 110); });
      t.addEventListener('mouseleave', function () { clearTimeout(timer); });
    }
    t.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
  window.addEventListener('resize', placeIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);
  placeIndicator();

  /* ---------- Animaciones con GSAP ---------- */
  var fadeEls = [].slice.call(document.querySelectorAll('[data-fade-only], [data-rise], [data-split="load"]'));
  if (reduce || !hasGsap) {
    fadeEls.forEach(function (el) { el.style.opacity = 1; });
    document.querySelectorAll('.section-divider').forEach(function (el) { el.style.width = '100%'; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var canSplit = !!window.SplitText;
  if (canSplit) gsap.registerPlugin(SplitText);

  // Titulares letra por letra (IX3): opacity 0→1, y 25%→0, stagger .025 s
  function charReveal(el, opts) {
    if (!canSplit) return;
    var split = new SplitText(el, { type: 'words,chars', charsClass: 'split-char' });
    gsap.from(split.chars, Object.assign({ opacity: 0, yPercent: 25, ease: 'power2.out' }, opts));
  }
  // Hero: IX2 fade del titular (0→1, 1 s, +0.2 s) + IX3 letras al cargar (delay 1 s, velocidad 0.5)
  document.querySelectorAll('[data-split="load"]').forEach(function (el) {
    gsap.to(el, { opacity: 1, duration: 1, delay: .2, ease: 'power1.inOut' });
    charReveal(el, { duration: .5, stagger: .05, delay: 1 });
  });
  // .heading-stagger: al entrar (top 80%), .25 s por letra
  document.querySelectorAll('[data-split="scroll"]').forEach(function (el) {
    charReveal(el, { duration: .25, stagger: .025, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
  });
  // .text-h4: al entrar (top 80%), .1 s por letra
  document.querySelectorAll('[data-split="scroll-fast"]').forEach(function (el) {
    charReveal(el, { duration: .1, stagger: .025, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
  });

  // IX2 SCROLL_INTO_VIEW: fade 1 s (titulares: ease, +.25 s; features: outQuart, +.1 s)
  document.querySelectorAll('[data-fade-only]').forEach(function (el) {
    var feature = el.matches('.about-feature, .trust-item, .value');
    gsap.to(el, {
      opacity: 1, duration: 1,
      ease: feature ? 'power3.out' : 'power1.inOut',
      delay: feature ? .1 : .25,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
  // IX2 slide_from-bottom: y 100px→0 + fade, 1 s outQuart, +.2 s
  document.querySelectorAll('[data-rise]').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 100 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: .2,
      scrollTrigger: { trigger: el, start: 'top bottom', once: true }
    });
  });
  // IX2 a-5: divisor 0→100% (1 s outSine)
  document.querySelectorAll('[data-divider]').forEach(function (el) {
    gsap.to(el, { width: '100%', duration: 1, ease: 'sine.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // Galería que converge (IX2 SCROLLING_IN_VIEW, smoothing 90):
  // cada foto parte de una posición dispersa y llega al centro en su keyframe (% del scroll)
  var frames = [
    { sel: '.frame-05', x: 40, y: 70, at: 67 },
    { sel: '.frame-02', x: 50, y: -50, at: 78 },
    { sel: '.frame-03', x: -35, y: 50, at: 86 },
    { sel: '.frame-06', x: -68, y: 0, at: 86 },
    { sel: '.frame-04', x: 55, y: -10, at: 94 },
    { sel: '.frame-01', x: -40, y: -50, at: 100 }
  ];
  var conv = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.converge-track', start: 'top 90%', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true }
  });
  frames.forEach(function (f) {
    conv.fromTo(f.sel,
      { x: function () { return f.x * innerWidth / 100; }, y: function () { return f.y * innerHeight / 100; } },
      { x: 0, y: 0, duration: f.at }, 0);
  });
  conv.fromTo('.converge-title', { scale: .7 }, { scale: 1, duration: 100 }, 0)
      .to('.converge-title', { opacity: 0, duration: 2 }, 66);

  // Marquee de logos: dos filas, 25 s por vuelta, sentidos opuestos (IX2 loop)
  document.querySelectorAll('[data-marquee]').forEach(function (row) {
    var set = row.querySelector('.marquee-set');
    row.appendChild(set.cloneNode(true)).setAttribute('aria-hidden', 'true');
    var rev = row.getAttribute('data-marquee') === 'reverse';
    gsap.fromTo(row, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 25, ease: 'none', repeat: -1 });
  });

  // las fuentes web cambian alturas: recalcular posiciones de los triggers
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
