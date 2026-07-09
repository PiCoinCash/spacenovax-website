
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
