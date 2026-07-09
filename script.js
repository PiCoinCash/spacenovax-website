document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>document.querySelector(".nav")?.classList.toggle("open")));
  const y=document.querySelector("[data-year]"); if(y)y.textContent=new Date().getFullYear();

  const canvas=document.getElementById("starfield");
  if(canvas){
    const ctx=canvas.getContext("2d"); let stars=[];
    function resize(){
      canvas.width=innerWidth; canvas.height=innerHeight;
      const count=Math.min(280,Math.floor(innerWidth*innerHeight/6200));
      stars=Array.from({length:count},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.8+.25,a:Math.random()*.75+.15,tw:Math.random()*.025+.005}));
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const s of stars){
        s.a+=s.tw*(Math.random()>.5?1:-1); s.a=Math.max(.12,Math.min(.95,s.a));
        ctx.globalAlpha=s.a; ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1; requestAnimationFrame(draw);
    }
    addEventListener("resize",resize); resize(); draw();
  }
});
