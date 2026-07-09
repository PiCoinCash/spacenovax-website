
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('nav');
 document.getElementById('hamb')?.addEventListener('click',()=>nav.classList.toggle('open'));
 const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();
 const c=document.getElementById('starfield');
 if(c){const x=c.getContext('2d');let stars=[];function resize(){c.width=innerWidth;c.height=innerHeight;stars=Array.from({length:Math.min(260,Math.floor(innerWidth*innerHeight/7600))},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.25+.2,a:Math.random()*.6+.1,t:Math.random()*.012+.003}))}function draw(){x.clearRect(0,0,c.width,c.height);for(const s of stars){s.a+=(Math.random()>.5?1:-1)*s.t;s.a=Math.max(.08,Math.min(.75,s.a));x.globalAlpha=s.a;x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()}
 const log=document.getElementById('chatLog'), inp=document.getElementById('aiInput');
 document.getElementById('aiSend')?.addEventListener('click',()=>{if(inp.value.trim()){log.innerHTML += `<p><b>You:</b> ${inp.value}</p><p><b>Captain AI:</b> SpaceNovaX is a Space, AI, Gaming and Web3 ecosystem. Ask about mining, tokenomics, roadmap or missions.</p>`;inp.value=''}});
 const game=document.getElementById('gameCanvas');
 if(game){const g=game.getContext('2d');let sc=0,run=false;document.getElementById('startGame')?.addEventListener('click',()=>{run=true;sc=0});function loop(){g.fillStyle='#020817';g.fillRect(0,0,900,520);for(let i=0;i<70;i++){g.fillStyle='rgba(255,255,255,.45)';g.fillRect((i*91+sc)%900,(i*57)%520,2,2)}g.fillStyle='#2ee7ff';g.beginPath();g.moveTo(70,260);g.lineTo(135,235);g.lineTo(135,285);g.fill();if(run)sc++;let e=document.getElementById('score'); if(e)e.textContent=sc;requestAnimationFrame(loop)}loop()}
});
