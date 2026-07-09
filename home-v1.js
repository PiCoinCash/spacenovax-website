
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  document.getElementById('hamb')?.addEventListener('click', () => nav.classList.toggle('open'));

  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      const count = Math.min(300, Math.floor(innerWidth * innerHeight / 6500));
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
    resize();
    draw();
    addEventListener('resize', resize);
  }

  // keep no horizontal overflow even if mobile browser reports fractional width
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
});


// Captain AI Nova voice using browser Web Speech API.
// Works in modern Chrome/Edge. No paid API key needed for this first version.
(function(){
  const speakBtn = document.getElementById('novaSpeak');
  const stopBtn = document.getElementById('novaStop');

  const novaLines = [
    "Welcome back, Captain. I am Nova, your AI Fleet Commander.",
    "Mining systems are online. Your NOVA X One ship is ready.",
    "A new mission is available. Shall we begin our journey?",
    "SpaceNovaX is ready. Explore. Mine. Evolve."
  ];

  function getVoice(){
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => /female|woman|zira|samantha|google us english/i.test(v.name)) ||
           voices.find(v => /en/i.test(v.lang)) ||
           voices[0];
  }

  function speakNova(){
    if(!("speechSynthesis" in window)){
      alert("This browser does not support AI voice playback.");
      return;
    }
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(novaLines.join(" "));
    msg.lang = "en-US";
    msg.rate = 0.92;
    msg.pitch = 1.08;
    msg.volume = 1;
    const voice = getVoice();
    if(voice) msg.voice = voice;
    speechSynthesis.speak(msg);
  }

  speakBtn?.addEventListener('click', speakNova);
  stopBtn?.addEventListener('click', () => {
    if("speechSynthesis" in window) speechSynthesis.cancel();
  });

  if("speechSynthesis" in window){
    speechSynthesis.onvoiceschanged = getVoice;
  }
})();


// Draggable Captain AI Nova panel.
// Drag the top bar. Position is saved in localStorage.
// Double-click the top bar to return Nova to the original position.
(function(){
  const panel = document.getElementById('novaPanel');
  const handle = document.getElementById('novaDragHandle');
  if(!panel || !handle) return;

  const saved = localStorage.getItem('spacenovax_nova_panel_position');
  if(saved){
    try{
      const p = JSON.parse(saved);
      panel.classList.add('is-floating');
      panel.style.left = Math.max(8, Math.min(window.innerWidth - 80, p.left)) + 'px';
      panel.style.top = Math.max(8, Math.min(window.innerHeight - 80, p.top)) + 'px';
    }catch(e){}
  }

  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function beginDrag(clientX, clientY){
    const rect = panel.getBoundingClientRect();
    panel.classList.add('is-floating');
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    dragging = true;
    startX = clientX;
    startY = clientY;
    startLeft = rect.left;
    startTop = rect.top;
  }

  function moveDrag(clientX, clientY){
    if(!dragging) return;
    const rect = panel.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - 8;
    const maxTop = window.innerHeight - rect.height - 8;
    const left = clamp(startLeft + clientX - startX, 8, Math.max(8, maxLeft));
    const top = clamp(startTop + clientY - startY, 8, Math.max(8, maxTop));
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  function endDrag(){
    if(!dragging) return;
    dragging = false;
    const rect = panel.getBoundingClientRect();
    localStorage.setItem('spacenovax_nova_panel_position', JSON.stringify({left: rect.left, top: rect.top}));
  }

  handle.addEventListener('mousedown', (e)=>{ e.preventDefault(); beginDrag(e.clientX, e.clientY); });
  window.addEventListener('mousemove', (e)=>moveDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDrag);

  handle.addEventListener('touchstart', (e)=>{
    const t = e.touches[0];
    if(!t) return;
    beginDrag(t.clientX, t.clientY);
  }, {passive:false});
  window.addEventListener('touchmove', (e)=>{
    const t = e.touches[0];
    if(!t) return;
    moveDrag(t.clientX, t.clientY);
  }, {passive:false});
  window.addEventListener('touchend', endDrag);

  handle.addEventListener('dblclick', ()=>{
    localStorage.removeItem('spacenovax_nova_panel_position');
    panel.classList.remove('is-floating');
    panel.style.left = '';
    panel.style.top = '';
    panel.style.right = '';
    panel.style.bottom = '';
  });

  window.addEventListener('resize', ()=>{
    if(!panel.classList.contains('is-floating')) return;
    const rect = panel.getBoundingClientRect();
    panel.style.left = clamp(rect.left, 8, Math.max(8, window.innerWidth - rect.width - 8)) + 'px';
    panel.style.top = clamp(rect.top, 8, Math.max(8, window.innerHeight - rect.height - 8)) + 'px';
  });
})();
