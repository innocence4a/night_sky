(() => {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');

  // ===== リサイズ対応 =====
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ===== 星の生成 =====
  const STAR_COUNT = 260;

  const stars = Array.from({ length: STAR_COUNT }, () => createStar());

  function createStar(fromScratch = true) {
    const twinkleSpeed = 0.003 + Math.random() * 0.008;
    return {
      x:       fromScratch ? Math.random() * canvas.width  : Math.random() * canvas.width,
      y:       fromScratch ? Math.random() * canvas.height : Math.random() * canvas.height,
      radius:  0.3 + Math.random() * 1.4,
      opacity: Math.random(),
      delta:   Math.random() < 0.5 ? twinkleSpeed : -twinkleSpeed,
      // 色味：白・薄青・薄黄をランダムに
      hue:     [0, 210, 50][Math.floor(Math.random() * 3)],
      sat:     Math.random() < 0.5 ? 0 : 30 + Math.floor(Math.random() * 30),
    };
  }

  // ===== 流れ星の生成 =====
  const MAX_SHOOTING = 3;
  const shootingStars = [];

  function spawnShootingStar() {
    const angle  = (15 + Math.random() * 25) * (Math.PI / 180); // 15〜40°
    const speed  = 8 + Math.random() * 10;
    const length = 120 + Math.random() * 180;
    return {
      x:       Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
      y:       Math.random() * canvas.height * 0.4,
      vx:      Math.cos(angle) * speed,
      vy:      Math.sin(angle) * speed,
      length,
      opacity: 1,
      fade:    0.012 + Math.random() * 0.01,
      trail:   [], // 軌跡座標
    };
  }

  // ランダム間隔でスポーン
  function scheduleShootingStar() {
    const delay = 1500 + Math.random() * 4000;
    setTimeout(() => {
      if (shootingStars.length < MAX_SHOOTING) {
        shootingStars.push(spawnShootingStar());
      }
      scheduleShootingStar();
    }, delay);
  }
  scheduleShootingStar();

  // ===== 描画ループ =====
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- 星 ---
    for (const s of stars) {
      // 瞬き
      s.opacity += s.delta;
      if (s.opacity >= 1)   { s.opacity = 1;  s.delta *= -1; }
      if (s.opacity <= 0.1) {                  s.delta *= -1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 95%, ${s.opacity})`;
      ctx.fill();
    }

    // --- 流れ星 ---
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];

      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 24) s.trail.shift();

      s.x += s.vx;
      s.y += s.vy;
      s.opacity -= s.fade;

      if (s.opacity <= 0 || s.x > canvas.width + 200 || s.y > canvas.height + 200) {
        shootingStars.splice(i, 1);
        continue;
      }

      // グラデーション軌跡
      if (s.trail.length >= 2) {
        const tail = s.trail[0];
        const head = s.trail[s.trail.length - 1];
        const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        grad.addColorStop(0,   `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.6, `rgba(200, 220, 255, ${s.opacity * 0.5})`);
        grad.addColorStop(1,   `rgba(255, 255, 255, ${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (const p of s.trail) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'round';
        ctx.stroke();
      }

      // 先端の光点
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
      glow.addColorStop(0,   `rgba(255, 255, 255, ${s.opacity})`);
      glow.addColorStop(1,   `rgba(255, 255, 255, 0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
