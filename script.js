
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  document.getElementById('menuButton')?.addEventListener('click', () => nav.classList.toggle('open'));

  function starCanvas(id, divisor, opacity, drift=false){
    const c = document.getElementById(id);
    if(!c) return;
    const ctx = c.getContext('2d');
    let pts = [];
    function resize(){
      c.width = innerWidth; c.height = innerHeight;
      const count = Math.min(900, Math.floor(innerWidth * innerHeight / divisor));
      pts = Array.from({length: count}, () => ({
        x: Math.random()*c.width, y: Math.random()*c.height,
        r: Math.random()*1.05+.15, a: Math.random()*.65+.08,
        t: Math.random()*.010+.002, v: Math.random()*.18+.03
      }));
    }
    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      for(const p of pts){
        p.a += (Math.random()>.5?1:-1)*p.t;
        p.a = Math.max(.06, Math.min(.85, p.a));
        if(drift){ p.x -= p.v; if(p.x<0) p.x=c.width; }
        ctx.globalAlpha = p.a*opacity;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1; requestAnimationFrame(draw);
    }
    resize(); draw(); addEventListener('resize', resize);
  }
  starCanvas('starfield', 2400, 1, false);
  starCanvas('dustfield', 9000, .35, true);

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    function tick(now){
      const t = Math.min(1,(now-start)/1250);
      el.textContent = Math.floor(target*(1-Math.pow(1-t,3))).toLocaleString();
      if(t<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  const nameInput = document.getElementById('captainName');
  const saveBtn = document.getElementById('saveCaptain');
  const novaText = document.getElementById('novaText');
  const mouth = document.getElementById('mouthPulse');
  const savedName = localStorage.getItem('spacenovax_captain_name');
  if(savedName && nameInput){
    nameInput.value = savedName;
    novaText.innerHTML = `Welcome back, Captain ${savedName}.<br>Mining systems online.<br>Mission briefing available.`;
  }
  saveBtn?.addEventListener('click', () => {
    const n = (nameInput.value || '').trim();
    if(!n) return;
    localStorage.setItem('spacenovax_captain_name', n);
    novaText.innerHTML = `Welcome back, Captain ${n}.<br>Your systems are ready.`;
    speakNova(true);
  });

  function pickVoice(){
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => /female|zira|samantha|google us english/i.test(v.name)) ||
           voices.find(v => /en/i.test(v.lang)) || voices[0];
  }
  function speakNova(short=false){
    if(!('speechSynthesis' in window)){
      alert('This browser does not support voice playback.');
      return;
    }
    const cap = localStorage.getItem('spacenovax_captain_name') || '';
    const hello = cap ? `Welcome back, Captain ${cap}.` : 'Welcome aboard, Captain.';
    const text = short
      ? `${hello} SpaceNovaX systems are online.`
      : `${hello} I am Nova, your AI Fleet Commander. Mining systems are online. Today's mission is ready.`;
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US'; msg.rate = .92; msg.pitch = 1.08;
    const voice = pickVoice(); if(voice) msg.voice = voice;
    msg.onstart = () => mouth?.classList.add('speaking');
    msg.onend = () => mouth?.classList.remove('speaking');
    msg.onerror = () => mouth?.classList.remove('speaking');
    speechSynthesis.speak(msg);
  }
  document.getElementById('novaSpeak')?.addEventListener('click', () => speakNova(false));
  document.getElementById('novaStop')?.addEventListener('click', () => {
    if('speechSynthesis' in window) speechSynthesis.cancel();
    mouth?.classList.remove('speaking');
  });
  if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = pickVoice;

  let greeted = sessionStorage.getItem('spacenovax_nova_greeted') === '1';
  function firstInteraction(){
    if(greeted) return;
    greeted = true;
    sessionStorage.setItem('spacenovax_nova_greeted','1');
    setTimeout(() => speakNova(false), 650);
    removeEventListener('pointerdown', firstInteraction);
  }
  addEventListener('pointerdown', firstInteraction);

  const panel = document.getElementById('novaPanel');
  const handle = document.getElementById('novaDragHandle');
  if(panel && handle){
    const saved = localStorage.getItem('spacenovax_nova_panel_position');
    if(saved){
      try{
        const p = JSON.parse(saved);
        panel.classList.add('is-floating');
        panel.style.left = Math.max(8, Math.min(innerWidth-80, p.left))+'px';
        panel.style.top = Math.max(8, Math.min(innerHeight-80, p.top))+'px';
      }catch(e){}
    }
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    function begin(x,y){
      const r = panel.getBoundingClientRect();
      panel.classList.add('is-floating');
      panel.style.left = r.left+'px'; panel.style.top = r.top+'px';
      dragging=true; sx=x; sy=y; sl=r.left; st=r.top;
    }
    function move(x,y){
      if(!dragging) return;
      const r = panel.getBoundingClientRect();
      panel.style.left = clamp(sl+x-sx,8,Math.max(8,innerWidth-r.width-8))+'px';
      panel.style.top = clamp(st+y-sy,8,Math.max(8,innerHeight-r.height-8))+'px';
    }
    function end(){
      if(!dragging) return;
      dragging=false;
      const r = panel.getBoundingClientRect();
      localStorage.setItem('spacenovax_nova_panel_position', JSON.stringify({left:r.left,top:r.top}));
    }
    handle.addEventListener('mousedown', e => { e.preventDefault(); begin(e.clientX,e.clientY); });
    addEventListener('mousemove', e => move(e.clientX,e.clientY));
    addEventListener('mouseup', end);
    handle.addEventListener('touchstart', e => { const t=e.touches[0]; if(t) begin(t.clientX,t.clientY); }, {passive:false});
    addEventListener('touchmove', e => { const t=e.touches[0]; if(t) move(t.clientX,t.clientY); }, {passive:false});
    addEventListener('touchend', end);
    handle.addEventListener('dblclick', () => {
      localStorage.removeItem('spacenovax_nova_panel_position');
      panel.classList.remove('is-floating');
      panel.style.left=''; panel.style.top='';
    });
  }
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
});


// Update 02: Mobile Nova compact mode.
// This keeps Nova from covering the entire phone screen.
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('novaPanel');
  const toggle = document.getElementById('novaToggle');
  if(!panel || !toggle) return;

  const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

  function setMobileState(){
    if(!isMobile()){
      panel.classList.remove('mobile-collapsed','mobile-expanded');
      toggle.textContent = '—';
      return;
    }
    const expanded = localStorage.getItem('spacenovax_nova_mobile_expanded') === '1';
    panel.classList.toggle('mobile-expanded', expanded);
    panel.classList.toggle('mobile-collapsed', !expanded);
    toggle.textContent = expanded ? 'HIDE' : 'OPEN';
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isMobile()) return;
    const expanded = !panel.classList.contains('mobile-expanded');
    localStorage.setItem('spacenovax_nova_mobile_expanded', expanded ? '1' : '0');
    setMobileState();
  });

  // On mobile, tapping the compact Nova pill opens it.
  panel.addEventListener('click', (e) => {
    if(!isMobile()) return;
    if(!panel.classList.contains('mobile-collapsed')) return;
    e.preventDefault();
    localStorage.setItem('spacenovax_nova_mobile_expanded', '1');
    setMobileState();
  });

  window.addEventListener('resize', setMobileState);
  setMobileState();
});
