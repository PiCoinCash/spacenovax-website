
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('nav');
 document.getElementById('hamb')?.addEventListener('click',()=>nav.classList.toggle('open'));
 const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();

 const c=document.getElementById('starfield');
 if(c){
   const x=c.getContext('2d'); let stars=[];
   function resize(){
     c.width=innerWidth; c.height=innerHeight;
     stars=Array.from({length:Math.min(220,Math.floor(innerWidth*innerHeight/9000))},()=>({
       x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.2,
       a:Math.random()*.55+.1,t:Math.random()*.015+.003
     }));
   }
   function draw(){
     x.clearRect(0,0,c.width,c.height);
     for(const s of stars){
       s.a+=(Math.random()>.5?1:-1)*s.t; s.a=Math.max(.08,Math.min(.7,s.a));
       x.globalAlpha=s.a; x.fillStyle='#fff'; x.beginPath(); x.arc(s.x,s.y,s.r,0,Math.PI*2); x.fill();
     }
     x.globalAlpha=1; requestAnimationFrame(draw);
   }
   addEventListener('resize',resize); resize(); draw();
 }

 const log=document.getElementById('chatLog'), inp=document.getElementById('aiInput');
 function ask(q){
   if(!log)return;
   let a='SpaceNovaX is a Space, AI, Gaming and Web3 ecosystem. Ask about tokenomics, mining, roadmap or Genesis Launch.';
   let k=q.toLowerCase();
   if(k.includes('token'))a='Total supply is 10B SPNX. Community 65%, Liquidity 10%, Ecosystem 10%, Team 5%, Marketing 5%, Treasury 3%, Advisors 2%. No future mint.';
   if(k.includes('mining'))a='Base mining is 30 SPNX Point per 24 hours. Final conversion requires KYC.';
   log.innerHTML+=`<p><b>You:</b> ${q}</p><p><b>Captain AI:</b> ${a}</p>`;
 }
 document.getElementById('aiSend')?.addEventListener('click',()=>{if(inp.value.trim()){ask(inp.value.trim());inp.value=''}});

 const game=document.getElementById('gameCanvas');
 if(game){
   const g=game.getContext('2d'); let sc=0,run=false,p={x:70,y:250};
   document.getElementById('startGame')?.addEventListener('click',()=>{run=true;sc=0});
   function loop(){
     g.fillStyle='#020a18'; g.fillRect(0,0,900,520);
     for(let i=0;i<60;i++){g.fillStyle='rgba(255,255,255,.45)';g.fillRect((i*97+sc)%900,(i*53)%520,2,2)}
     g.fillStyle='#26dcff'; g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x+48,p.y-18); g.lineTo(p.x+48,p.y+18); g.fill();
     if(run)sc++; let e=document.getElementById('score'); if(e)e.textContent=sc;
     requestAnimationFrame(loop)
   }
   loop();
 }
});
