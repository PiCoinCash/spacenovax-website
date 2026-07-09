
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('nav');document.getElementById('menuButton')?.addEventListener('click',()=>nav.classList.toggle('open'));
 function stars(id,div,o,dr=false){const c=document.getElementById(id);if(!c)return;const x=c.getContext('2d');let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:Math.min(1000,Math.floor(innerWidth*innerHeight/div))},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1+.15,a:Math.random()*.7+.08,t:Math.random()*.01+.002,v:Math.random()*.15+.03}))}function d(){x.clearRect(0,0,c.width,c.height);for(const s of p){s.a+=(Math.random()>.5?1:-1)*s.t;s.a=Math.max(.06,Math.min(.85,s.a));if(dr){s.x-=s.v;if(s.x<0)s.x=c.width}x.globalAlpha=s.a*o;x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(d)}r();d();addEventListener('resize',r)}stars('starfield',2100,1,false);stars('dustfield',9000,.34,true);
 function speak(){if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const msg=new SpeechSynthesisUtterance('Welcome aboard, Captain. The fleet is ready. Shall we begin our mission?'); msg.lang='en-US'; msg.rate=.92; msg.pitch=1.08; speechSynthesis.speak(msg)}
 document.getElementById('novaSpeak')?.addEventListener('click',speak);
});
