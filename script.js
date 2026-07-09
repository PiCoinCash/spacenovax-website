
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('nav');
 document.getElementById('hamb')?.addEventListener('click',()=>nav.classList.toggle('open'));
 const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();

 const c=document.getElementById('starfield');
 if(c){
   const ctx=c.getContext('2d'); let stars=[];
   function resize(){c.width=innerWidth;c.height=innerHeight;stars=Array.from({length:Math.min(280,Math.floor(innerWidth*innerHeight/6800))},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.3+.2,a:Math.random()*.7+.1,t:Math.random()*.012+.003}))}
   function draw(){ctx.clearRect(0,0,c.width,c.height);for(const s of stars){s.a+=(Math.random()>.5?1:-1)*s.t;s.a=Math.max(.08,Math.min(.8,s.a));ctx.globalAlpha=s.a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;requestAnimationFrame(draw)}
   resize();draw();addEventListener('resize',resize);
 }

 const log=document.getElementById('chatLog'), inp=document.getElementById('aiInput');
 document.getElementById('aiSend')?.addEventListener('click',()=>{
   const q=(inp.value||'').trim(); if(!q)return;
   let a='SpaceNovaX is a Space, AI, Gaming and Web3 ecosystem. Ask about mining, missions, tokenomics or roadmap.';
   const l=q.toLowerCase();
   if(l.includes('token')||l.includes('supply')) a='Official tokenomics: Community 65%, Liquidity 10%, Ecosystem Development 10%, Team 5%, Marketing & Partnerships 5%, Treasury 3%, Advisors 2%. Total supply is 10B SPNX. No Future Mint.';
   if(l.includes('mine')||l.includes('mining')) a='Base mining is 30 SPNX Point per 24 hours. Referral bonus is +1% per verified referral. KYC is required for final conversion.';
   if(l.includes('mission')||l.includes('game')) a='Mission Center lets Captains pilot NOVA-X1, avoid meteors, collect SPNX Crystals and earn daily GameFi rewards.';
   if(l.includes('roadmap')) a='Roadmap: Premium UI, Arcade Ultimate, Control Center, then Solana Genesis Launch.';
   log.innerHTML += `<p><b>You:</b> ${q}</p><p><b>Nova:</b> ${a}</p>`;
   inp.value='';
 });

 const game=document.getElementById('gameCanvas');
 if(game){
   const g=game.getContext('2d'); let score=0, run=false, shipY=260;
   const meteors=Array.from({length:8},(_,i)=>({x:980+i*160,y:Math.random()*480+20,r:16+Math.random()*20,s:2+Math.random()*3}));
   const crystals=Array.from({length:5},(_,i)=>({x:700+i*210,y:Math.random()*450+35,r:10,s:1.5+Math.random()*2}));
   document.getElementById('startGame')?.addEventListener('click',()=>{run=true;score=0});
   window.addEventListener('keydown',e=>{if(e.key==='ArrowUp')shipY-=18;if(e.key==='ArrowDown')shipY+=18;shipY=Math.max(40,Math.min(480,shipY));});
   function loop(){
     g.fillStyle='#020817';g.fillRect(0,0,980,520);
     for(let i=0;i<80;i++){g.fillStyle='rgba(255,255,255,.45)';g.fillRect((i*97+score*2)%980,(i*53)%520,2,2)}
     g.fillStyle='#2ee7ff';g.beginPath();g.moveTo(80,shipY);g.lineTo(150,shipY-25);g.lineTo(150,shipY+25);g.fill();g.fillStyle='rgba(0,160,255,.35)';g.fillRect(150,shipY-8,60,16);
     if(run){
       for(const m of meteors){m.x-=m.s;if(m.x<-60){m.x=1040;m.y=Math.random()*480+20}g.fillStyle='#6b5148';g.beginPath();g.arc(m.x,m.y,m.r,0,Math.PI*2);g.fill();if(Math.abs(m.x-120)<m.r+30&&Math.abs(m.y-shipY)<m.r+25){score=Math.max(0,score-5)}}
       for(const cr of crystals){cr.x-=cr.s;if(cr.x<-40){cr.x=1040;cr.y=Math.random()*450+35}g.fillStyle='#2ee7ff';g.beginPath();g.moveTo(cr.x,cr.y-cr.r);g.lineTo(cr.x+cr.r,cr.y);g.lineTo(cr.x,cr.y+cr.r);g.lineTo(cr.x-cr.r,cr.y);g.closePath();g.fill();if(Math.abs(cr.x-120)<40&&Math.abs(cr.y-shipY)<35){score+=10;cr.x=1040;cr.y=Math.random()*450+35}}
       score++;
     }
     const s=document.getElementById('score'); if(s)s.textContent=score;
     requestAnimationFrame(loop);
   }
   loop();
 }
});
