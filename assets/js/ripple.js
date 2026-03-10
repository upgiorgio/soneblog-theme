(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'ripple-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0.35';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var w, h;
  var ripples = [];
  var raf = null;
  var running = false;
  var lastX = 0, lastY = 0;
  var moveTimer = null;
  var spawnInterval = null;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  // Get theme-aware color
  function getRippleColor() {
    var style = getComputedStyle(document.documentElement);
    var bgL = parseFloat(style.getPropertyValue('--bg-l')) || 99;
    // Dark mode: light ripples, Light mode: dark ripples
    return bgL < 50
      ? 'rgba(255,255,255,'
      : 'rgba(0,0,0,';
  }

  function spawnRipple(x, y) {
    ripples.push({
      x: x,
      y: y,
      r: 0,
      maxR: 80 + Math.random() * 60,
      alpha: 0.4 + Math.random() * 0.15,
      speed: 1.2 + Math.random() * 0.8,
      lineWidth: 1 + Math.random() * 0.5
    });
    if (ripples.length > 40) ripples.splice(0, ripples.length - 40);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    var colorBase = getRippleColor();

    for (var i = ripples.length - 1; i >= 0; i--) {
      var rp = ripples[i];
      rp.r += rp.speed;

      // Fade: peak at 30% expansion, then fade out
      var progress = rp.r / rp.maxR;
      var alpha;
      if (progress < 0.3) {
        alpha = rp.alpha * (progress / 0.3);
      } else {
        alpha = rp.alpha * (1 - (progress - 0.3) / 0.7);
      }

      if (alpha <= 0.005 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = colorBase + alpha.toFixed(3) + ')';
      ctx.lineWidth = rp.lineWidth * (1 - progress * 0.5);
      ctx.stroke();
    }

    if (ripples.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      running = false;
      raf = null;
    }
  }

  function ensureRunning() {
    if (!running) {
      running = true;
      raf = requestAnimationFrame(draw);
    }
  }

  function startSpawning() {
    if (spawnInterval) return;
    spawnInterval = setInterval(function() {
      // Spawn at current mouse position with slight jitter
      var jx = lastX + (Math.random() - 0.5) * 12;
      var jy = lastY + (Math.random() - 0.5) * 12;
      spawnRipple(jx, jy);
      ensureRunning();
    }, 60);
  }

  function stopSpawning() {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  document.addEventListener('mousemove', function(e) {
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    lastX = e.clientX;
    lastY = e.clientY;

    // Only spawn if mouse moved enough
    if (dist > 6) {
      spawnRipple(e.clientX, e.clientY);
      ensureRunning();
    }

    // Start continuous spawning while moving
    startSpawning();

    // Stop spawning after mouse stops
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function() {
      stopSpawning();
    }, 150);
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopSpawning();
      if (raf) { cancelAnimationFrame(raf); raf = null; running = false; }
      ripples.length = 0;
    }
  });
})();
