
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  document.getElementById('hamb')?.addEventListener('click', () => nav.classList.toggle('open'));

  // Starfield
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      canvas.width = innerWidth; canvas.height = innerHeight;
      const count = Math.min(320, Math.floor(innerWidth * innerHeight / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.25 + .2,
        a: Math.random() * .65 + .1,
        t: Math.random() * .012 + .003
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.a += (Math.random() > .5 ? 1 : -1) * s.t;
        s.a = Math.max(.08, Math.min(.82, s.a));
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    resize(); draw(); addEventListener('resize', resize);
  }

  // Dust particles
  const dust = document.getElementById('dustfield');
  if (dust) {
    const ctx = dust.getContext('2d');
    let ps = [];
    function resizeDust(){
      dust.width = innerWidth; dust.height = innerHeight;
      ps = Array.from({length:90},()=>({x:Math.random()*dust.width,y:Math.random()*dust.height,v:.15+Math.random()*.35,r:Math.random()*1.8+.5}));
    }
    function drawDust(){
      ctx.clearRect(0,0,dust.width,dust.height);
      ctx.fillStyle='rgba(130,220,255,.45)';
      for(const p of ps){
        p.x -= p.v; p.y += p.v*.25;
        if(p.x<0){p.x=dust.width;p.y=Math.random()*dust.height}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(drawDust);
    }
    resizeDust(); drawDust(); addEventListener('resize', resizeDust);
  }

  // Counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    function tick(now){
      const t = Math.min(1, (now - start) / 1200);
      const val = Math.floor(target * (1 - Math.pow(1 - t, 3)));
      el.textContent = val.toLocaleString();
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // Captain name
  const nameInput = document.getElementById('captainName');
  const saveName = document.getElementById('saveCaptain');
  const novaText = document.getElementById('novaText');
  const savedName = localStorage.getItem('spacenovax_captain_name');
  if(savedName && nameInput){
    nameInput.value = savedName;
    novaText.innerHTML = `Welcome back, Captain ${savedName}.<br>Mining systems online.<br>New mission available.`;
  }
  saveName?.addEventListener('click', () => {
    const n = (nameInput.value || '').trim();
    if(n){
      localStorage.setItem('spacenovax_captain_name', n);
      novaText.innerHTML = `Welcome back, Captain ${n}.<br>Your NOVA-X1 is ready.<br>Mission briefing available.`;
      speakNova(true);
    }
  });

  // Voice
  const mouth = document.getElementById('mouthPulse');
  const speakBtn = document.getElementById('novaSpeak');
  const stopBtn = document.getElementById('novaStop');

  function getVoice(){
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => /female|woman|zira|samantha|google us english/i.test(v.name)) ||
           voices.find(v => /en/i.test(v.lang)) ||
           voices[0];
  }

  function speakNova(short=false){
    if(!('speechSynthesis' in window)){
      alert('This browser does not support AI voice playback.');
      return;
    }
    const captain = localStorage.getItem('spacenovax_captain_name') || '';
    const nameLine = captain ? `Welcome back, Captain ${captain}.` : 'Welcome aboard, Captain.';
    const text = short ? `${nameLine} Your NOVA X One is ready.`
      : `${nameLine} I am Nova, your AI Fleet Commander. Mining systems are online. Today's mission is ready. Shall we begin our journey?`;
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US'; msg.rate = .92; msg.pitch = 1.08; msg.volume = 1;
    const voice = getVoice(); if(voice) msg.voice = voice;
    msg.onstart = () => mouth?.classList.add('speaking');
    msg.onend = () => mouth?.classList.remove('speaking');
    msg.onerror = () => mouth?.classList.remove('speaking');
    speechSynthesis.speak(msg);
  }

  speakBtn?.addEventListener('click', () => speakNova(false));
  stopBtn?.addEventListener('click', () => { if('speechSynthesis' in window) speechSynthesis.cancel(); mouth?.classList.remove('speaking'); });
  if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = getVoice;

  // Auto greet: browsers block autoplay audio, so do it after first click/tap once.
  let greeted = sessionStorage.getItem('spacenovax_nova_greeted') === '1';
  function firstInteraction(){
    if(greeted) return;
    greeted = true;
    sessionStorage.setItem('spacenovax_nova_greeted','1');
    setTimeout(()=>speakNova(false), 550);
    window.removeEventListener('pointerdown', firstInteraction);
  }
  window.addEventListener('pointerdown', firstInteraction);

  // Quick buttons
  document.querySelectorAll('.quick-actions button').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.textContent.trim().toLowerCase();
      if(q.includes('mining')) novaText.innerHTML = 'Mining guide loaded.<br>Base mining: 30 SPNX Point / 24H.<br>KYC required for conversion.';
      if(q.includes('mission')) novaText.innerHTML = 'Mission briefing ready.<br>Pilot NOVA-X1, avoid meteors,<br>collect SPNX Crystals.';
      if(q.includes('token')) novaText.innerHTML = 'Tokenomics loaded.<br>Community 65%, Liquidity 10%,<br>Ecosystem 10%.';
      speakNova(true);
    });
  });

  // Draggable Nova
  const panel = document.getElementById('novaPanel');
  const handle = document.getElementById('novaDragHandle');
  if(panel && handle){
    const saved = localStorage.getItem('spacenovax_nova_panel_position');
    if(saved){
      try{
        const p = JSON.parse(saved);
        panel.classList.add('is-floating');
        panel.style.left = Math.max(8, Math.min(window.innerWidth - 80, p.left)) + 'px';
        panel.style.top = Math.max(8, Math.min(window.innerHeight - 80, p.top)) + 'px';
      }catch(e){}
    }
    let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    function begin(x,y){
      const r=panel.getBoundingClientRect();
      panel.classList.add('is-floating');
      panel.style.left=r.left+'px'; panel.style.top=r.top+'px';
      panel.style.right='auto'; panel.style.bottom='auto';
      dragging=true; startX=x; startY=y; startLeft=r.left; startTop=r.top;
    }
    function move(x,y){
      if(!dragging) return;
      const r=panel.getBoundingClientRect();
      const left=clamp(startLeft+x-startX,8,Math.max(8,window.innerWidth-r.width-8));
      const top=clamp(startTop+y-startY,8,Math.max(8,window.innerHeight-r.height-8));
      panel.style.left=left+'px'; panel.style.top=top+'px';
    }
    function end(){
      if(!dragging) return;
      dragging=false;
      const r=panel.getBoundingClientRect();
      localStorage.setItem('spacenovax_nova_panel_position', JSON.stringify({left:r.left,top:r.top}));
    }
    handle.addEventListener('mousedown',e=>{e.preventDefault();begin(e.clientX,e.clientY)});
    window.addEventListener('mousemove',e=>move(e.clientX,e.clientY));
    window.addEventListener('mouseup',end);
    handle.addEventListener('touchstart',e=>{const t=e.touches[0];if(t)begin(t.clientX,t.clientY)},{passive:false});
    window.addEventListener('touchmove',e=>{const t=e.touches[0];if(t)move(t.clientX,t.clientY)},{passive:false});
    window.addEventListener('touchend',end);
    handle.addEventListener('dblclick',()=>{
      localStorage.removeItem('spacenovax_nova_panel_position');
      panel.classList.remove('is-floating');
      panel.style.left=''; panel.style.top=''; panel.style.right=''; panel.style.bottom='';
    });
  }

  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
});
