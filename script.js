/**
 * script.js — Sumit Behera Portfolio
 *
 * Sections:
 *  01. Footer Year
 *  02. Star Field Engine (reusable canvas animation)
 *  03. Entry / Splash Screen
 *  04. Hamburger / Mobile Menu
 *  05. Custom Cursor
 *  06. Nav Scroll Behaviour & Progress Bar
 *  07. Scroll Reveal
 *  08. Skill Bar Animations
 *  09. Project Card Spotlight Effect
 *  10. Magnetic Contact Links
 *  11. Desk Canvas (hero illustration)
 *  12. Solar System Background (skills section)
 */


/* ──────────────────────────────────────────────
   01. FOOTER YEAR
────────────────────────────────────────────── */
document.getElementById('footerYear').textContent = new Date().getFullYear();


/* ──────────────────────────────────────────────
   02. STAR FIELD ENGINE
   Reusable starfield + shooting-star canvas.
   Returns { stop, pause, resume } controls.
────────────────────────────────────────────── */
function buildStarField(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const config = Object.assign(
    { count: 280, shootInterval: 2400, shootMax: 4 },
    opts
  );

  const stars  = [];
  const shoots = [];
  let active   = true;
  let tt       = 0;
  let raf;

  // ── Resize canvas to fill its container
  function resize() {
    canvas.width  = canvas.offsetWidth  || innerWidth;
    canvas.height = canvas.offsetHeight || innerHeight;
    initStars();
  }

  // ── Populate the star array
  function initStars() {
    stars.length = 0;
    for (let i = 0; i < config.count; i++) {
      stars.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.3 + 0.18,
        a:  Math.random() * 0.75 + 0.2,
        sp: 0.003 + Math.random() * 0.005,
        ph: Math.random() * Math.PI * 2,
      });
    }
  }

  // ── Spawn a shooting star
  function spawnShootingStar() {
    if (shoots.length >= config.shootMax) return;
    shoots.push({
      x:    Math.random() * canvas.width  * 0.8 + canvas.width  * 0.1,
      y:    Math.random() * canvas.height * 0.45,
      vx:   4 + Math.random() * 6,
      vy:   2 + Math.random() * 3,
      life: 1,
    });
  }

  const shootTimer = setInterval(
    spawnShootingStar,
    config.shootInterval + Math.random() * 1600
  );

  // ── Main draw loop
  function draw() {
    if (!active) return;
    raf = requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0,    '#030209');
    sky.addColorStop(0.55, '#07060e');
    sky.addColorStop(1,    '#0d0c1a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nebula clouds
    const nebulae = [
      [canvas.width * 0.30, canvas.height * 0.22, 320, 'rgba(100,55,185,.028)'],
      [canvas.width * 0.72, canvas.height * 0.14, 260, 'rgba(232,87,42,.022)'],
      [canvas.width * 0.12, canvas.height * 0.55, 210, 'rgba(55,95,205,.018)'],
    ];
    nebulae.forEach(([x, y, r, color]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Twinkling stars
    tt += 0.016;
    stars.forEach(star => {
      const tw = 0.5 + 0.5 * Math.sin(tt * star.sp * 60 + star.ph);

      ctx.save();

      // Glow halo
      ctx.globalAlpha = star.a * tw * 0.5;
      const halo = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 4);
      halo.addColorStop(0, 'rgba(255,240,215,.8)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.globalAlpha = star.a * tw;
      ctx.fillStyle = '#fffaee';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Shooting stars
    for (let i = shoots.length - 1; i >= 0; i--) {
      const s = shoots[i];
      s.x    += s.vx;
      s.y    += s.vy;
      s.life -= 0.02;

      if (s.life <= 0) {
        shoots.splice(i, 1);
        continue;
      }

      const trail = ctx.createLinearGradient(
        s.x - s.vx * 12, s.y - s.vy * 12,
        s.x,             s.y
      );
      trail.addColorStop(0, 'rgba(255,240,200,0)');
      trail.addColorStop(1, 'rgba(255,248,220,.95)');

      ctx.save();
      ctx.globalAlpha  = s.life;
      ctx.strokeStyle  = trail;
      ctx.lineWidth    = 1.8;
      ctx.lineCap      = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * 11, s.y - s.vy * 11);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Start everything
  resize();
  window.addEventListener('resize', () => resize());
  draw();

  return {
    stop:   () => { active = false; cancelAnimationFrame(raf); clearInterval(shootTimer); },
    pause:  () => { active = false; cancelAnimationFrame(raf); },
    resume: () => { if (!active) { active = true; draw(); } },
  };
}

// Instantiate star fields
const entryStar = buildStarField(
  document.getElementById('starCanvas'),
  { count: 320, shootMax: 5 }
);

const bgCanvas = document.getElementById('bgCanvas');
const bgStar   = buildStarField(bgCanvas, {
  count: 200, shootMax: 3, shootInterval: 3200,
});


/* ──────────────────────────────────────────────
   03. ENTRY / SPLASH SCREEN
────────────────────────────────────────────── */
function doEnter() {
  const entry = document.getElementById('entry');
  const site  = document.getElementById('site');

  entry.classList.add('gone');
  entryStar.stop(); // Free the entry canvas RAF loop

  setTimeout(() => {
    entry.style.display      = 'none';
    document.body.style.overflowY = 'auto';
    site.classList.add('visible');
    bgCanvas.classList.add('active');
  }, 950);
}

// Click to enter
document.getElementById('enterBtn').addEventListener('click', e => {
  e.preventDefault();
  doEnter();
});

// Keyboard: Enter or Space to enter
document.addEventListener('keydown', e => {
  const entry = document.getElementById('entry');
  const isVisible = !entry.classList.contains('gone');

  if (isVisible && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    doEnter();
  }
});

// Lock scroll on entry screen
document.body.style.overflow = 'hidden';


/* ──────────────────────────────────────────────
   04. HAMBURGER / MOBILE MENU
────────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  function setMenuOpen(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    // Prevent background scroll while menu is open (after entry screen is dismissed)
    if (document.getElementById('site').classList.contains('visible')) {
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }

  // Toggle on button click
  btn.addEventListener('click', () => {
    setMenuOpen(!menu.classList.contains('open'));
  });

  // Close when a nav link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenuOpen(false);
  });
})();


/* ──────────────────────────────────────────────
   05. CUSTOM CURSOR
   Only enabled on true pointer (non-touch) devices.
────────────────────────────────────────────── */
(function initCursor() {
  const isPointerDevice = window.matchMedia('(pointer: fine)').matches;

  if (!isPointerDevice) {
    document.getElementById('cDot').style.display  = 'none';
    document.getElementById('cRing').style.display = 'none';
    return;
  }

  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  let rx = 0, ry = 0;  // ring current position (lerped)
  let tx = 0, ty = 0;  // target position

  // Dot follows cursor instantly
  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
  });

  // Ring lerps toward cursor
  (function lerpRing() {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  // Expand ring on interactive elements
  document.addEventListener('mouseover', e => {
    const isInteractive = e.target.closest(
      'a, button, .pc, .cl, .sk, .astat, .ah, .edu-card'
    );
    document.body.classList.toggle('hov', !!isInteractive);
  });
})();


/* ──────────────────────────────────────────────
   06. NAV SCROLL BEHAVIOUR & PROGRESS BAR
────────────────────────────────────────────── */
(function initNavScroll() {
  const nav     = document.getElementById('nav');
  const pbar    = document.getElementById('pbar');
  const links   = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY    = window.scrollY;
    const maxScroll  = document.body.scrollHeight - innerHeight;

    // Solid navbar background after 60px
    nav.classList.toggle('solid', scrollY > 60);

    // Progress bar width
    pbar.style.width = ((scrollY / maxScroll) * 100) + '%';

    // Highlight active nav link
    let currentSection = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 130) {
        currentSection = sec.id;
      }
    });

    links.forEach(a => {
      a.classList.toggle('act', a.getAttribute('href') === '#' + currentSection);
    });
  });
})();


/* ──────────────────────────────────────────────
   07. SCROLL REVEAL
   Adds .in class when element enters viewport.
────────────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in');
          }, index * 55);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.sr').forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   08. SKILL BAR ANIMATIONS
   Animates width when skill bar scrolls into view.
────────────────────────────────────────────── */
(function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.w + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.sk-fill').forEach(fill => observer.observe(fill));
})();


/* ──────────────────────────────────────────────
   09. PROJECT CARD SPOTLIGHT EFFECT
   Moves a radial glow to follow the cursor
   within each project card.
────────────────────────────────────────────── */
document.querySelectorAll('.pc').forEach(card => {
  const spot = card.querySelector('.pc-spot');
  card.addEventListener('mousemove', e => {
    if (!spot) return;
    const rect      = card.getBoundingClientRect();
    spot.style.left = (e.clientX - rect.left)  + 'px';
    spot.style.top  = (e.clientY - rect.top)   + 'px';
  });
});


/* ──────────────────────────────────────────────
   10. MAGNETIC CONTACT LINKS
   Subtly pulls each link toward the cursor.
────────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  let bounds;
  let animId;
  let curX = 0, curY = 0;
  let tgX  = 0, tgY  = 0;

  el.addEventListener('mouseenter', () => {
    bounds = el.getBoundingClientRect();
  });

  el.addEventListener('mousemove', e => {
    tgX = (e.clientX - bounds.left - bounds.width  / 2) * 0.25;
    tgY = (e.clientY - bounds.top  - bounds.height / 2) * 0.25;

    cancelAnimationFrame(animId);
    (function lerp() {
      curX += (tgX - curX) * 0.15;
      curY += (tgY - curY) * 0.15;
      el.style.transform = `translate(${curX}px, ${curY}px)`;
      animId = requestAnimationFrame(lerp);
    })();
  });

  el.addEventListener('mouseleave', () => {
    tgX = 0;
    tgY = 0;
    cancelAnimationFrame(animId);

    (function snapBack() {
      curX += (0 - curX) * 0.18;
      curY += (0 - curY) * 0.18;
      el.style.transform = `translate(${curX}px, ${curY}px)`;
      if (Math.abs(curX) > 0.05 || Math.abs(curY) > 0.05) {
        animId = requestAnimationFrame(snapBack);
      } else {
        el.style.transform = '';
      }
    })();
  });
});


/* ──────────────────────────────────────────────
   11. DESK CANVAS
   Three-monitor workspace illustration.
   Only animates when the hero section is visible.
────────────────────────────────────────────── */
(function initDeskCanvas() {
  const canvas = document.getElementById('deskCanvas');
  if (!canvas) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const CW  = 580;
  const CH  = 400;

  canvas.width        = CW * DPR;
  canvas.height       = CH * DPR;
  canvas.style.width  = CW + 'px';
  canvas.style.height = CH + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  let t          = 0;
  let deskActive = false;
  let deskRaf;

  // ── Helper: rounded rectangle path
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // ── Desk surface
  function drawDesk() {
    // Table top (perspective trapezoid)
    ctx.beginPath();
    ctx.moveTo(8,   352);
    ctx.lineTo(572, 352);
    ctx.lineTo(498, 205);
    ctx.lineTo(82,  205);
    ctx.closePath();

    const dg = ctx.createLinearGradient(0, 205, 0, 352);
    dg.addColorStop(0,   '#1a1230');
    dg.addColorStop(0.5, '#130e25');
    dg.addColorStop(1,   '#0d0a1c');
    ctx.fillStyle = dg;
    ctx.fill();

    // Subtle grain lines
    ctx.save();
    ctx.globalAlpha  = 0.032;
    ctx.strokeStyle  = '#fff';
    ctx.lineWidth    = 0.8;
    for (let i = 0; i < 10; i++) {
      const fy = 212 + i * 14;
      const lx = 82  + (fy - 205) / 147 * 416;
      const rx = 498 - (fy - 205) / 147 * 416;
      ctx.beginPath();
      ctx.moveTo(lx, fy);
      ctx.lineTo(rx, fy);
      ctx.stroke();
    }
    ctx.restore();

    // Front edge
    ctx.beginPath();
    ctx.moveTo(8,   352);
    ctx.lineTo(572, 352);
    ctx.lineTo(572, 368);
    ctx.lineTo(8,   368);
    ctx.closePath();
    ctx.fillStyle = '#09071a';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8,   352);
    ctx.lineTo(572, 352);
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    // Desk mat (under keyboard)
    roundRect(118, 286, 256, 58, 6);
    ctx.fillStyle   = '#0f0c20';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    ctx.lineWidth   = 1;
    roundRect(118, 286, 256, 58, 6);
    ctx.stroke();
  }

  // ── Center monitor: VS Code editor screen
  function screenCode(ctx, sw, sh, t) {
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, sw, sh);

    // Activity bar (left strip)
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, 0, 14, sh);
    ['⊞','⊟','⊕','⚙'].forEach((icon, i) => {
      ctx.font      = '7px sans-serif';
      ctx.fillStyle = i === 0 ? '#e8572a' : 'rgba(255,255,255,.25)';
      ctx.textAlign = 'center';
      ctx.fillText(icon, 7, 18 + i * 16);
    });

    // Sidebar file tree
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(14, 0, 42, sh);
    ctx.fillStyle = 'rgba(255,255,255,.04)';
    ctx.fillRect(55, 0, 1, sh);

    const files = [
      { name: 'App.jsx',   color: '#79c0ff', indent: 0 },
      { name: 'index.js',  color: '#c9d1d9', indent: 0 },
      { name: 'style.css', color: '#7ee787', indent: 0 },
      { name: 'utils.js',  color: '#c9d1d9', indent: 4 },
      { name: 'api.js',    color: '#c9d1d9', indent: 4 },
    ];
    files.forEach((f, i) => {
      ctx.font      = '4px "DM Mono",monospace';
      ctx.fillStyle = i === 0 ? 'rgba(255,255,255,.12)' : 'transparent';
      if (i === 0) ctx.fillRect(15, i * 11 + 1, 40, 10);
      ctx.fillStyle = f.color;
      ctx.fillText(f.name, 18 + f.indent, i * 11 + 8);
    });

    // Tab bar
    ctx.fillStyle = '#161b22';
    ctx.fillRect(56, 0, sw - 56, 12);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(56, 0, 52, 12);
    ctx.fillStyle = '#e8572a';
    ctx.fillRect(56, 10, 52, 2);

    ctx.font      = '4.5px "DM Mono",monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c9d1d9';
    ctx.fillText('App.jsx',  60,  8.5);
    ctx.fillStyle = '#484f58';
    ctx.fillText('index.js', 114, 8.5);

    // Line numbers gutter
    ctx.fillStyle = 'rgba(255,255,255,.022)';
    ctx.fillRect(56, 12, 18, sh - 12);

    // Syntax-highlighted code lines
    const lines = [
      [{ c:'#ff7b72',t:'import'},{c:'#c9d1d9',t:' React, { '},{c:'#79c0ff',t:'useState'},{c:'#c9d1d9',t:' }'}],
      [{ c:'#ff7b72',t:'import'},{c:'#c9d1d9',t:' { '},{c:'#ffa657',t:'Portfolio'},{c:'#c9d1d9',t:' } '},{c:'#ff7b72',t:'from'},{c:'#a5d6ff',t:" './Portfolio'"}],
      [{ c:'#484f58',t:''}],
      [{ c:'#ff7b72',t:'const'},{c:'#ffa657',t:' App'},{c:'#79c0ff',t:' = '},{c:'#c9d1d9',t:'() => {'}],
      [{ c:'#c9d1d9',t:'  '},{c:'#ff7b72',t:'const'},{c:'#c9d1d9',t:' ['},{c:'#79c0ff',t:'theme'},{c:'#c9d1d9',t:','},{c:'#ffa657',t:'setTheme'},{c:'#c9d1d9',t:'] = '},{c:'#ffa657',t:'useState'},{c:'#c9d1d9',t:'('}],
      [{ c:'#a5d6ff',t:"    'dark'"},{c:'#c9d1d9',t:')'}],
      [{ c:'#484f58',t:''}],
      [{ c:'#c9d1d9',t:'  '},{c:'#ff7b72',t:'return'},{c:'#c9d1d9',t:' ('}],
      [{ c:'#79c0ff',t:'    <Portfolio'},{c:'#ffa657',t:' theme'},{c:'#c9d1d9',t:'={'},{c:'#79c0ff',t:'theme'},{c:'#c9d1d9',t:'} />'}],
    ];

    ctx.font = '4.5px "DM Mono",monospace';
    lines.forEach((parts, i) => {
      ctx.fillStyle = '#30363d';
      ctx.textAlign = 'right';
      ctx.fillText(i + 1, 72, 26 + i * 8);

      ctx.textAlign = 'left';
      let x = 76;
      parts.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.fillText(p.t, x, 26 + i * 8);
        x += ctx.measureText(p.t).width;
      });
    });

    // Blinking cursor (line 5)
    if (Math.floor(t / 28) % 2 === 0) {
      const cursorLine = 4;
      let cx = 76;
      ctx.font = '4.5px "DM Mono",monospace';
      lines[cursorLine].forEach(p => { cx += ctx.measureText(p.t).width; });
      ctx.fillStyle = '#e8572a';
      ctx.fillRect(cx, 22 + cursorLine * 8, 1.2, 6);
    }

    // Status bar
    ctx.fillStyle = '#e8572a';
    ctx.fillRect(0, sh - 8, sw, 8);
    ctx.font      = '4px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.textAlign = 'left';
    ctx.fillText('⎇ main  ✓ 0 errors  JSX  UTF-8', 4, sh - 2.5);

    // Minimap
    ctx.fillStyle = 'rgba(255,255,255,.03)';
    ctx.fillRect(sw - 18, 12, 18, sh - 20);
    for (let i = 0; i < 12; i++) {
      const r = [255,150,100,200,120,255,180,100,255,120,200,150][i];
      const g = [119, 94,140, 94,219, 94,100, 94, 94,150, 94, 94][i];
      const b = [114,255,255, 94, 94, 94,255,255, 94,255,200, 94][i];
      ctx.fillStyle = `rgba(${r},${g},${b},.4)`;
      ctx.fillRect(sw - 16, 14 + i * 6, Math.random() * 12 + 3, 2);
    }
  }

  // ── Left monitor: Terminal
  function screenTerminal(ctx, sw, sh, t) {
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, sw, sh);

    // Title bar
    ctx.fillStyle = '#0e1020';
    ctx.fillRect(0, 0, sw, 11);

    // Traffic light buttons
    [['#ff5f57', 6], ['#febc2e', 14], ['#28c840', 22]].forEach(([color, x]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, 5.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font      = '4px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.textAlign = 'center';
    ctx.fillText('bash', sw / 2, 8);
    ctx.textAlign = 'left';

    const lines = [
      { color: '#f07340', text: 'sumit@dev:~$'   },
      { color: '#86efac', text: ' npm run dev'   },
      { color: '#484f58', text: '─────────────'  },
      { color: '#7dd3fc', text: '✓ compiled 312ms' },
      { color: '#86efac', text: 'ready → :3000'  },
      { color: '#484f58', text: ''               },
      { color: '#f07340', text: 'sumit@dev:~$'   },
      { color: '#86efac', text: ' git push'      },
      { color: '#fde68a', text: '→ main updated' },
    ];

    ctx.font = '4px "DM Mono",monospace';
    lines.forEach((l, i) => {
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, 4, 20 + i * 7.5);
    });

    // Blinking cursor
    if (Math.floor(t / 30) % 2 === 0) {
      ctx.fillStyle = '#f07340';
      ctx.fillRect(4, 20 + lines.length * 7.5, 3, 5);
    }
  }

  // ── Right monitor: System monitor + music player
  function screenSystem(ctx, sw, sh, t) {
    ctx.fillStyle = '#07060f';
    ctx.fillRect(0, 0, sw, sh);

    ctx.fillStyle = 'rgba(255,255,255,.03)';
    ctx.fillRect(0, 0, sw, 11);

    ctx.font      = '4px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.textAlign = 'center';
    ctx.fillText('MONITOR', sw / 2, 8);
    ctx.textAlign = 'left';

    // CPU / RAM / Disk bars
    ['CPU','RAM','DSK'].forEach((label, i) => {
      const base = [72, 58, 44][i];
      const val  = base + Math.sin(t * 0.025 + i * 1.4) * 9;
      const col  = ['#86efac','#7dd3fc','#fde68a'][i];

      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.font      = '3.8px "DM Mono",monospace';
      ctx.fillText(label, 4, 22 + i * 18);

      roundRect(4, 24 + i * 18, sw - 8, 4, 2);
      ctx.fillStyle = 'rgba(255,255,255,.06)';
      ctx.fill();

      roundRect(4, 24 + i * 18, (sw - 8) * Math.min(1, val / 100), 4, 2);
      ctx.fillStyle = col;
      ctx.fill();

      ctx.fillStyle = col;
      ctx.font      = '3.8px "DM Mono",monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(val) + '%', sw - 3, 22 + i * 18);
      ctx.textAlign = 'left';
    });

    // Music player card
    const cardY = 76;
    roundRect(4, cardY, sw - 8, 52, 4);
    ctx.fillStyle   = 'rgba(255,255,255,.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(232,87,42,.18)';
    ctx.lineWidth   = 0.7;
    roundRect(4, cardY, sw - 8, 52, 4);
    ctx.stroke();

    // Album art
    const albumGrad = ctx.createLinearGradient(7, cardY + 4, 37, cardY + 34);
    albumGrad.addColorStop(0, '#e8572a');
    albumGrad.addColorStop(1, '#7c3aed');
    roundRect(7, cardY + 4, 30, 30, 3);
    ctx.fillStyle = albumGrad;
    ctx.fill();
    ctx.font      = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.textAlign = 'center';
    ctx.fillText('♪', 22, cardY + 23);
    ctx.textAlign = 'left';

    // Track info
    ctx.font      = 'bold 4.5px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.fillText('lo-fi beats', 42, cardY + 14);
    ctx.font      = '4px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.fillText('coding session', 42, cardY + 22);

    // Playback controls
    ['⏮','⏸','⏭'].forEach((icon, i) => {
      ctx.font      = '7px sans-serif';
      ctx.fillStyle = i === 1 ? '#e8572a' : 'rgba(255,255,255,.4)';
      ctx.textAlign = 'center';
      ctx.fillText(icon, 43 + i * 12, cardY + 34);
    });
    ctx.textAlign = 'left';

    // Progress bar
    const progress = (t % 420) / 420;
    roundRect(7, cardY + 40, sw - 14, 3, 1.5);
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.fill();
    roundRect(7, cardY + 40, (sw - 14) * progress, 3, 1.5);
    ctx.fillStyle = '#e8572a';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(7 + (sw - 14) * progress, cardY + 41.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Time
    const mins = Math.floor((t % 420) / 70);
    const secs = Math.floor(t % 70);
    ctx.font      = '3.5px "DM Mono",monospace';
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.fillText(`${mins}:${String(secs).padStart(2,'0')}`, 7, cardY + 50);
    ctx.textAlign = 'right';
    ctx.fillText('2:47', sw - 7, cardY + 50);
    ctx.textAlign = 'left';
  }

  // ── Draw a side (vertical) monitor
  function drawVerticalMonitor(cx, cy, side, content) {
    const sw = 64, sh = 112, bz = 6;
    const mw = sw + bz * 2;
    const mh = sh + bz * 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.transform(1, 0, side * 0.09, 1, 0, 0);

    // Screen glow on desk surface
    ctx.save();
    ctx.translate(0, mh / 2 + 20);
    ctx.scale(1, 0.18);
    const glowColor = side === -1 ? 'rgba(0,210,190,.45)' : 'rgba(170,90,255,.45)';
    const deskGlow  = ctx.createRadialGradient(0, 0, 0, 0, 0, sw * 0.7);
    deskGlow.addColorStop(0, glowColor);
    deskGlow.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.75;
    ctx.fillStyle   = deskGlow;
    ctx.beginPath();
    ctx.arc(0, 0, sw * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Drop shadow
    ctx.save();
    ctx.filter     = 'blur(8px)';
    ctx.globalAlpha = 0.4;
    ctx.fillStyle  = '#000';
    roundRect(-mw / 2 + 2, mh / 2 - 2, mw, 14, 4);
    ctx.fill();
    ctx.restore();

    // Bezel
    ctx.shadowColor = side === -1 ? 'rgba(0,210,190,.28)' : 'rgba(170,90,255,.28)';
    ctx.shadowBlur  = 16;
    roundRect(-mw / 2, -mh / 2, mw, mh, 6);
    const bezelGrad = ctx.createLinearGradient(0, -mh / 2, 0, mh / 2);
    bezelGrad.addColorStop(0, '#201c36');
    bezelGrad.addColorStop(1, '#110f1f');
    ctx.fillStyle = bezelGrad;
    ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = side === -1 ? 'rgba(0,210,190,.2)' : 'rgba(170,90,255,.2)';
    ctx.lineWidth   = 1;
    roundRect(-mw / 2, -mh / 2, mw, mh, 6);
    ctx.stroke();

    // Screen content (clipped)
    ctx.save();
    ctx.beginPath();
    roundRect(-sw / 2, -sh / 2, sw, sh, 2);
    ctx.clip();
    ctx.translate(-sw / 2, -sh / 2);
    if (content === 'terminal') {
      screenTerminal(ctx, sw, sh, t);
    } else {
      screenSystem(ctx, sw, sh, t);
    }
    ctx.restore();

    // Screen glare overlay
    ctx.save();
    ctx.beginPath();
    roundRect(-sw / 2, -sh / 2, sw, sh, 2);
    ctx.clip();
    const glare = ctx.createLinearGradient(-sw / 2, -sh / 2, 0, 0);
    glare.addColorStop(0, 'rgba(255,255,255,.055)');
    glare.addColorStop(1, 'transparent');
    ctx.fillStyle = glare;
    ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
    ctx.restore();

    // VESA pole + base
    ctx.fillStyle = '#15112a';
    ctx.fillRect(-4, mh / 2, 8, 22);
    roundRect(-16, mh / 2 + 20, 32, 9, 4);
    ctx.fillStyle = '#1c1632';
    ctx.fill();

    ctx.restore();
  }

  // ── Draw the center ultrawide monitor
  function drawUltrawide(cx, cy) {
    const sw = 238, sh = 106, bz = 9;
    const mw = sw + bz * 2;
    const mh = sh + bz * 2;

    ctx.save();
    ctx.translate(cx, cy);

    // Desk glow
    ctx.save();
    ctx.translate(0, mh / 2 + 24);
    ctx.scale(1, 0.14);
    const dg = ctx.createRadialGradient(0, 0, 0, 0, 0, sw);
    dg.addColorStop(0, 'rgba(80,120,255,.5)');
    dg.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.85;
    ctx.fillStyle   = dg;
    ctx.beginPath();
    ctx.arc(0, 0, sw, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bezel with curved top corners
    ctx.save();
    ctx.shadowColor = 'rgba(80,120,255,.35)';
    ctx.shadowBlur  = 22;
    ctx.beginPath();
    ctx.moveTo(-mw/2+10, -mh/2);
    ctx.lineTo( mw/2-10, -mh/2);
    ctx.quadraticCurveTo( mw/2, -mh/2,  mw/2, -mh/2+10);
    ctx.lineTo( mw/2,  mh/2-6);
    ctx.quadraticCurveTo( mw/2,  mh/2,  mw/2-10, mh/2);
    ctx.lineTo(-mw/2+10, mh/2);
    ctx.quadraticCurveTo(-mw/2,  mh/2, -mw/2,  mh/2-6);
    ctx.lineTo(-mw/2, -mh/2+10);
    ctx.quadraticCurveTo(-mw/2, -mh/2, -mw/2+10, -mh/2);
    ctx.closePath();
    const bg = ctx.createLinearGradient(0, -mh/2, 0, mh/2);
    bg.addColorStop(0, '#242040');
    bg.addColorStop(1, '#14112a');
    ctx.fillStyle   = bg;
    ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = 'rgba(100,130,255,.22)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();

    // Screen content (clipped to slightly rounded rect)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-sw/2+4, -sh/2);
    ctx.lineTo( sw/2-4, -sh/2);
    ctx.quadraticCurveTo( sw/2, -sh/2,  sw/2, -sh/2+4);
    ctx.lineTo( sw/2,  sh/2-4);
    ctx.quadraticCurveTo( sw/2,  sh/2,  sw/2-4, sh/2);
    ctx.lineTo(-sw/2+4, sh/2);
    ctx.quadraticCurveTo(-sw/2,  sh/2, -sw/2,  sh/2-4);
    ctx.lineTo(-sw/2, -sh/2+4);
    ctx.quadraticCurveTo(-sw/2, -sh/2, -sw/2+4, -sh/2);
    ctx.closePath();
    ctx.clip();
    ctx.translate(-sw/2, -sh/2);
    screenCode(ctx, sw, sh, t);
    ctx.restore();

    // Glare
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-sw/2+4, -sh/2);
    ctx.lineTo( sw/2-4, -sh/2);
    ctx.quadraticCurveTo( sw/2, -sh/2,  sw/2, -sh/2+4);
    ctx.lineTo( sw/2,  sh/2-4);
    ctx.quadraticCurveTo( sw/2,  sh/2,  sw/2-4, sh/2);
    ctx.lineTo(-sw/2+4, sh/2);
    ctx.quadraticCurveTo(-sw/2,  sh/2, -sw/2,  sh/2-4);
    ctx.lineTo(-sw/2, -sh/2+4);
    ctx.quadraticCurveTo(-sw/2, -sh/2, -sw/2+4, -sh/2);
    ctx.closePath();
    ctx.clip();
    const glare = ctx.createLinearGradient(-sw/2, -sh/2, sw*0.08, sh*0.1);
    glare.addColorStop(0, 'rgba(255,255,255,.065)');
    glare.addColorStop(1, 'transparent');
    ctx.fillStyle = glare;
    ctx.fillRect(-sw/2, -sh/2, sw, sh);
    ctx.restore();

    // Monitor stand
    ctx.fillStyle = '#18142e';
    ctx.fillRect(-6, mh/2, 12, 26);
    roundRect(-26, mh/2+24, 52, 10, 5);
    const standGrad = ctx.createLinearGradient(0, mh/2+24, 0, mh/2+34);
    standGrad.addColorStop(0, '#201c38');
    standGrad.addColorStop(1, '#130f24');
    ctx.fillStyle   = standGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.06)';
    ctx.lineWidth   = 0.8;
    roundRect(-26, mh/2+24, 52, 10, 5);
    ctx.stroke();

    ctx.restore();
  }

  // ── RGB Mechanical keyboard
  function drawKeyboard() {
    const kx = 118, ky = 290, kw = 256, kh = 52;

    ctx.save();

    // Shadow
    ctx.save();
    ctx.filter     = 'blur(10px)';
    ctx.globalAlpha = 0.45;
    ctx.fillStyle  = '#000';
    roundRect(kx+4, ky+8, kw, kh, 5);
    ctx.fill();
    ctx.restore();

    // Body
    roundRect(kx, ky, kw, kh, 5);
    const bodyGrad = ctx.createLinearGradient(kx, ky, kx, ky+kh);
    bodyGrad.addColorStop(0, '#20193a');
    bodyGrad.addColorStop(1, '#110e22');
    ctx.fillStyle   = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.09)';
    ctx.lineWidth   = 0.8;
    roundRect(kx, ky, kw, kh, 5);
    ctx.stroke();

    const hue = (t * 1.0) % 360;

    // RGB underglow
    const underglow = ctx.createLinearGradient(kx, ky+kh, kx+kw, ky+kh);
    for (let i = 0; i <= 10; i++) {
      underglow.addColorStop(i/10, `hsla(${(hue+i*36)%360},100%,55%,0.6)`);
    }
    ctx.save();
    ctx.filter    = 'blur(5px)';
    ctx.fillStyle = underglow;
    ctx.fillRect(kx+8, ky+kh-2, kw-16, 10);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.filter      = 'blur(12px)';
    ctx.fillStyle   = underglow;
    ctx.fillRect(kx+10, ky+kh+2, kw-20, 10);
    ctx.restore();

    // Top edge RGB strip
    const topStrip = ctx.createLinearGradient(kx, ky, kx+kw, ky);
    for (let i = 0; i <= 10; i++) {
      topStrip.addColorStop(i/10, `hsla(${(hue+180+i*36)%360},100%,60%,0.4)`);
    }
    ctx.fillStyle = topStrip;
    ctx.fillRect(kx+4, ky+1, kw-8, 2);

    // Keys — 4 rows
    const rows = [
      { y: 5,  keys: 14, kw: 16, kh: 10, gap: 1 },
      { y: 18, keys: 14, kw: 16, kh: 10, gap: 1 },
      { y: 31, keys: 13, kw: 17, kh: 10, gap: 1 },
      { y: 43, keys: 11, kw: 13, kh: 8,  gap: 1, spaceIdx: 5, spaceScale: 4.5 },
    ];

    rows.forEach((row, ri) => {
      let bx       = kx + 6;
      const rowHue = (hue + ri * 38) % 360;

      for (let ki = 0; ki < row.keys; ki++) {
        const isSpace = row.spaceIdx !== undefined && ki === row.spaceIdx;
        const kW      = isSpace ? row.kw * row.spaceScale : row.kw;

        // Key shadow face
        roundRect(bx+1, ky+row.y+1, kW-2, row.kh-1, 1.5);
        ctx.fillStyle = `hsla(${(rowHue+ki*12)%360},60%,18%,0.9)`;
        ctx.fill();

        // Key top face
        roundRect(bx+1, ky+row.y, kW-2, row.kh-2, 1.5);
        const keyGrad = ctx.createLinearGradient(0, ky+row.y, 0, ky+row.y+row.kh);
        keyGrad.addColorStop(0, `hsla(${(rowHue+ki*12)%360},50%,26%,0.95)`);
        keyGrad.addColorStop(1, `hsla(${(rowHue+ki*12)%360},50%,18%,0.95)`);
        ctx.fillStyle = keyGrad;
        ctx.fill();

        // Per-key RGB highlight strip
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle   = `hsla(${(rowHue+ki*12)%360},100%,65%,0.25)`;
        ctx.fillRect(bx+2, ky+row.y+0.5, kW-4, 1);
        ctx.restore();

        bx += isSpace ? kW + row.gap + 1 : row.kw + row.gap;
      }
    });

    ctx.restore();
  }

  // ── Analog desk clock
  function drawClock() {
    const cx = 90, cy = 296, r = 20;

    ctx.save();

    // Shadow
    ctx.save();
    ctx.filter     = 'blur(7px)';
    ctx.globalAlpha = 0.4;
    ctx.fillStyle  = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy+3, r+3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Outer case
    const caseGrad = ctx.createRadialGradient(cx-5, cy-5, 0, cx, cy, r+5);
    caseGrad.addColorStop(0, '#2c2650');
    caseGrad.addColorStop(1, '#1a1632');
    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r+5, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.1)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r+5, 0, Math.PI*2);
    ctx.stroke();

    // Clock face
    const faceGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    faceGrad.addColorStop(0, '#0d0a1c');
    faceGrad.addColorStop(1, '#060410');
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fill();

    // Tick marks
    for (let i = 0; i < 60; i++) {
      const angle  = i * Math.PI / 30 - Math.PI / 2;
      const isHour = i % 5 === 0;
      const inner  = r * (isHour ? 0.6  : 0.76);
      const outer  = r * (isHour ? 0.84 : 0.9);
      ctx.strokeStyle = isHour ? 'rgba(232,87,42,.75)' : 'rgba(255,255,255,.2)';
      ctx.lineWidth   = isHour ? 1.4 : 0.7;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle)*inner, cy + Math.sin(angle)*inner);
      ctx.lineTo(cx + Math.cos(angle)*outer, cy + Math.sin(angle)*outer);
      ctx.stroke();
    }

    // Animated hands
    const secAngle  = (t / 60) % (Math.PI*2);
    const minAngle  = secAngle / 12;
    const hourAngle = minAngle / 12;

    // Hour hand
    ctx.strokeStyle = 'rgba(237,224,208,.75)';
    ctx.lineWidth   = 2.2;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(hourAngle-Math.PI/2)*r*0.12, cy - Math.sin(hourAngle-Math.PI/2)*r*0.12);
    ctx.lineTo(cx + Math.cos(hourAngle-Math.PI/2)*r*0.5,  cy + Math.sin(hourAngle-Math.PI/2)*r*0.5);
    ctx.stroke();

    // Minute hand
    ctx.strokeStyle = 'rgba(237,224,208,.9)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(minAngle-Math.PI/2)*r*0.14, cy - Math.sin(minAngle-Math.PI/2)*r*0.14);
    ctx.lineTo(cx + Math.cos(minAngle-Math.PI/2)*r*0.72, cy + Math.sin(minAngle-Math.PI/2)*r*0.72);
    ctx.stroke();

    // Second hand
    ctx.strokeStyle = '#e8572a';
    ctx.lineWidth   = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(secAngle-Math.PI/2)*r*0.2,  cy - Math.sin(secAngle-Math.PI/2)*r*0.2);
    ctx.lineTo(cx + Math.cos(secAngle-Math.PI/2)*r*0.85, cy + Math.sin(secAngle-Math.PI/2)*r*0.85);
    ctx.stroke();

    // Center jewel
    ctx.fillStyle = '#e8572a';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.beginPath();
    ctx.arc(cx-0.8, cy-0.8, 1, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  // ── Coffee mug with steam
  function drawCoffee() {
    const mx = 488, my = 286;

    ctx.save();

    // Drop shadow (ellipse under mug)
    ctx.save();
    ctx.filter     = 'blur(9px)';
    ctx.globalAlpha = 0.32;
    ctx.fillStyle  = '#000';
    ctx.beginPath();
    ctx.ellipse(mx, my+40, 17, 4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Mug body
    const mugGrad = ctx.createLinearGradient(mx-16, my, mx+16, my);
    mugGrad.addColorStop(0,    '#1c1538');
    mugGrad.addColorStop(0.45, '#241e42');
    mugGrad.addColorStop(1,    '#141030');
    roundRect(mx-16, my, 32, 40, 4);
    ctx.fillStyle   = mugGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.09)';
    ctx.lineWidth   = 0.8;
    roundRect(mx-16, my, 32, 40, 4);
    ctx.stroke();

    // Handle
    ctx.beginPath();
    ctx.moveTo(mx+16, my+11);
    ctx.bezierCurveTo(mx+29, my+11, mx+29, my+30, mx+16, my+30);
    ctx.strokeStyle = 'rgba(255,255,255,.13)';
    ctx.lineWidth   = 3.5;
    ctx.lineCap     = 'round';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(20,16,48,.8)';
    ctx.lineWidth   = 1.8;
    ctx.stroke();

    // Coffee surface
    ctx.beginPath();
    ctx.ellipse(mx, my+5, 13, 3.5, 0, 0, Math.PI*2);
    const coffeeGrad = ctx.createRadialGradient(mx-2, my+4, 0, mx, my+5, 13);
    coffeeGrad.addColorStop(0,   '#3a1f10');
    coffeeGrad.addColorStop(0.6, '#261208');
    coffeeGrad.addColorStop(1,   '#160a04');
    ctx.fillStyle = coffeeGrad;
    ctx.fill();

    // Latte art swirl
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#c8956c';
    ctx.lineWidth   = 0.8;
    ctx.beginPath();
    ctx.ellipse(mx, my+5, 5, 2, 0.3, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx-4, my+5);
    ctx.bezierCurveTo(mx, my+3, mx+2, my+7, mx+5, my+5);
    ctx.stroke();
    ctx.restore();

    // Steam wisps
    for (let si = 0; si < 3; si++) {
      const sx    = mx - 4 + si * 4;
      const phase = t * 0.038 + si * 1.1;
      const alpha = 0.25 + 0.1 * Math.sin(phase);
      const sway  = Math.sin(phase) * 3.5;
      const h     = 14 + si * 3;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgba(210,195,240,${alpha})`;
      ctx.lineWidth   = 1.1;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, my - 1);
      ctx.bezierCurveTo(
        sx + sway,       my - h * 0.3,
        sx - sway,       my - h * 0.65,
        sx + sway * 0.4, my - h
      );
      ctx.stroke();
      ctx.restore();
    }

    // SB monogram
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.font        = 'bold 9px "Cormorant Garamond",serif';
    ctx.fillStyle   = '#e8572a';
    ctx.textAlign   = 'center';
    ctx.fillText('SB', mx, my+25);
    ctx.restore();

    ctx.restore();
  }

  // ── RGB gaming mouse
  function drawMouse() {
    const mx = 402, my = 302;

    ctx.save();

    // RGB underglow shadow
    ctx.save();
    ctx.filter     = 'blur(7px)';
    ctx.globalAlpha = 0.3;
    ctx.fillStyle  = `hsl(${(t*1.3+200)%360},90%,55%)`;
    ctx.beginPath();
    ctx.ellipse(mx, my+2, 12, 9, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Mouse body
    ctx.beginPath();
    ctx.ellipse(mx, my, 11, 18, 0, 0, Math.PI*2);
    const mouseGrad = ctx.createLinearGradient(mx-11, my-18, mx+11, my+18);
    mouseGrad.addColorStop(0,   '#231d38');
    mouseGrad.addColorStop(0.5, '#1a152e');
    mouseGrad.addColorStop(1,   '#11101e');
    ctx.fillStyle   = mouseGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.1)';
    ctx.lineWidth   = 0.7;
    ctx.stroke();

    // Scroll wheel
    roundRect(mx-1.5, my-9, 3, 8, 1.5);
    ctx.fillStyle = '#2c2748';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fillRect(mx-0.7, my-7, 1.5, 4.5);

    // Left/right button split
    ctx.beginPath();
    ctx.moveTo(mx, my-18);
    ctx.lineTo(mx, my-4);
    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.lineWidth   = 0.7;
    ctx.stroke();

    // RGB logo strip
    const h3    = (t * 1.3 + 200) % 360;
    const rgbG  = ctx.createLinearGradient(mx-11, my+12, mx+11, my+12);
    rgbG.addColorStop(0,   `hsla(${h3},100%,60%,.75)`);
    rgbG.addColorStop(0.5, `hsla(${(h3+120)%360},100%,60%,.75)`);
    rgbG.addColorStop(1,   `hsla(${(h3+240)%360},100%,60%,.75)`);
    ctx.strokeStyle = rgbG;
    ctx.lineWidth   = 2.2;
    ctx.beginPath();
    ctx.ellipse(mx, my+13, 8, 3.5, 0, Math.PI*0.1, Math.PI*0.9);
    ctx.stroke();

    ctx.restore();
  }

  // ── Ambient light pools on the desk surface
  function drawAmbient() {
    const pools = [
      [113, 328, 52, 'rgba(0,210,190,.055)'],
      [290, 316, 88, 'rgba(80,120,255,.075)'],
      [458, 328, 52, 'rgba(160,80,255,.055)'],
    ];

    pools.forEach(([x, y, r, color]) => {
      ctx.save();
      ctx.scale(1, 0.22);
      const g = ctx.createRadialGradient(x, y/0.22, 0, x, y/0.22, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(x-r, y/0.22-r, r*2, r*2);
      ctx.restore();
    });

    // Keyboard RGB spill on mat
    ctx.save();
    ctx.globalAlpha = 0.055;
    ctx.filter      = 'blur(14px)';
    const krgb = ctx.createLinearGradient(118, 342, 374, 342);
    const h    = (t * 1.0) % 360;
    for (let i = 0; i <= 8; i++) {
      krgb.addColorStop(i/8, `hsl(${(h+i*45)%360},100%,55%)`);
    }
    ctx.fillStyle = krgb;
    ctx.fillRect(118, 336, 256, 14);
    ctx.restore();
  }

  // ── Main animation loop
  function drawLoop() {
    if (!deskActive) return;
    deskRaf = requestAnimationFrame(drawLoop);

    ctx.clearRect(0, 0, CW, CH);
    drawAmbient();
    drawDesk();
    drawVerticalMonitor(109, 178, -1, 'terminal');
    drawUltrawide(290, 178);
    drawVerticalMonitor(471, 178,  1, 'system');
    drawClock();
    drawKeyboard();
    drawMouse();
    drawCoffee();
    t++;
  }

  // Only run when the hero canvas is on screen
  const visibilityObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        deskActive = true;
        drawLoop();
      } else {
        deskActive = false;
        cancelAnimationFrame(deskRaf);
      }
    },
    { threshold: 0.05 }
  );
  visibilityObserver.observe(canvas);
})();


/* ──────────────────────────────────────────────
   12. SOLAR SYSTEM BACKGROUND (Skills section)
   Tool "planets" orbit an "SB" sun.
   Starts only when the section scrolls into view.
────────────────────────────────────────────── */
(function initSolarSystem() {
  const canvas = document.getElementById('solarBg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let CW, CH, CX, CY;

  function resize() {
    const W = canvas.parentElement.offsetWidth;
    const H = canvas.parentElement.offsetHeight;
    canvas.width        = W * DPR;
    canvas.height       = H * DPR;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(DPR, DPR);
    CW = W; CH = H; CX = W / 2; CY = H / 2;
  }
  window.addEventListener('resize', resize);
  resize();

  // Orbital tilt (isometric feel)
  const TILT     = Math.PI * 0.28;
  const cosTilt  = Math.cos(TILT);
  const sinTilt  = Math.sin(TILT);

  // Tool "planets"
  const TOOLS = [
    { name: 'Git',     color: '#f05033', r: 10, orbit: 70,  speed: 0.020, phase: 0.0 },
    { name: 'GitHub',  color: '#c0c0c0', r: 12, orbit: 115, speed: 0.014, phase: 1.3 },
    { name: 'VS Code', color: '#007acc', r: 14, orbit: 162, speed: 0.010, phase: 2.6, ring: true },
    { name: 'Figma',   color: '#a259ff', r: 11, orbit: 210, speed: 0.007, phase: 0.9 },
    { name: 'Canva',   color: '#00c4cc', r: 10, orbit: 255, speed: 0.006, phase: 3.9 },
    { name: 'Office',  color: '#d83b01', r: 9,  orbit: 295, speed: 0.005, phase: 5.2 },
  ];

  // Color helpers
  function hexToRgb(hex) {
    const n = parseInt(hex.replace('#',''), 16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  }

  function lighten([r,g,b], a) {
    return `rgb(${Math.min(255,r+(255*a)|0)},${Math.min(255,g+(255*a)|0)},${Math.min(255,b+(255*a)|0)})`;
  }

  function darken([r,g,b], a) {
    return `rgb(${Math.max(0,r-(255*a)|0)},${Math.max(0,g-(255*a)|0)},${Math.max(0,b-(255*a)|0)})`;
  }

  // Project 3-D orbit position to 2-D canvas position
  function project(orbit, phase) {
    const x3 = Math.cos(phase) * orbit;
    const y3 = Math.sin(phase) * orbit;
    return {
      sx:    CX + x3,
      sy:    CY + y3 * cosTilt,
      depth: y3 * sinTilt,
    };
  }

  function drawOrbit(orbit) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.scale(1, cosTilt);
    ctx.strokeStyle = 'rgba(232,87,42,.09)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, orbit, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawPlanet(p, t) {
    const phase  = p.phase + t * p.speed;
    const pos    = project(p.orbit, phase);
    const depthN = pos.depth / p.orbit;
    const sc     = Math.max(0.4, 0.72 + depthN * 0.28);
    const alpha  = 0.5 + depthN * 0.5;
    const rad    = p.r * sc;
    const rgb    = hexToRgb(p.color);

    // Glow aura
    ctx.save();
    ctx.globalAlpha = alpha * 0.22;
    const aura = ctx.createRadialGradient(pos.sx, pos.sy, 0, pos.sx, pos.sy, rad*4);
    aura.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.5)`);
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(pos.sx, pos.sy, rad*4, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Saturn-like ring (VS Code)
    if (p.ring) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      ctx.translate(pos.sx, pos.sy);
      ctx.scale(1, cosTilt * 0.45);
      ctx.strokeStyle = 'rgba(0,122,204,.5)';
      ctx.lineWidth   = 3.5 * sc;
      ctx.beginPath();
      ctx.arc(0, 0, rad * 2.4, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }

    // Planet sphere
    ctx.save();
    ctx.globalAlpha  = alpha;
    ctx.shadowColor  = p.color;
    ctx.shadowBlur   = rad * 2;
    const sphere = ctx.createRadialGradient(
      pos.sx - rad*0.35, pos.sy - rad*0.35, rad*0.05,
      pos.sx, pos.sy, rad
    );
    sphere.addColorStop(0,    lighten(rgb, 0.55));
    sphere.addColorStop(0.45, p.color);
    sphere.addColorStop(1,    darken(rgb, 0.5));
    ctx.fillStyle = sphere;
    ctx.beginPath();
    ctx.arc(pos.sx, pos.sy, rad, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Specular highlight
    ctx.globalAlpha = alpha * 0.5;
    const spec = ctx.createRadialGradient(
      pos.sx - rad*0.38, pos.sy - rad*0.38, 0,
      pos.sx - rad*0.25, pos.sy - rad*0.25, rad*0.55
    );
    spec.addColorStop(0, 'rgba(255,255,255,.8)');
    spec.addColorStop(1, 'transparent');
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(pos.sx, pos.sy, rad, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Label (only when "in front")
    if (depthN > 0.1) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, 0.6 + depthN * 0.4);
      ctx.font        = `${Math.round(10 + depthN*3)}px "DM Mono",monospace`;
      ctx.fillStyle   = `rgba(237,224,208,${0.5 + depthN*0.5})`;
      ctx.textAlign   = 'center';
      ctx.shadowColor = 'rgba(0,0,0,.8)';
      ctx.shadowBlur  = 5;
      ctx.fillText(p.name, pos.sx, pos.sy + rad + 14);
      ctx.restore();
    }
  }

  function drawSun(t) {
    const pulse = 1 + 0.07 * Math.sin(t * 0.04);

    ctx.save();

    // Corona rings
    for (let i = 3; i >= 1; i--) {
      const cr     = 28 * pulse * (1 + i * 0.6);
      ctx.globalAlpha = 0.07 / i;
      const corona = ctx.createRadialGradient(CX, CY, 0, CX, CY, cr);
      corona.addColorStop(0,   'rgba(255,180,60,.9)');
      corona.addColorStop(0.4, 'rgba(232,87,42,.6)');
      corona.addColorStop(1,   'transparent');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(CX, CY, cr, 0, Math.PI*2);
      ctx.fill();
    }

    // Sun body
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'rgba(255,140,40,.9)';
    ctx.shadowBlur  = 32 * pulse;
    const sunGrad = ctx.createRadialGradient(CX-6, CY-6, 0, CX, CY, 24);
    sunGrad.addColorStop(0,    '#fff9e0');
    sunGrad.addColorStop(0.35, '#ffcc55');
    sunGrad.addColorStop(0.7,  '#f07340');
    sunGrad.addColorStop(1,    '#b83d18');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(CX, CY, 24, 0, Math.PI*2);
    ctx.fill();

    // "SB" label on sun
    ctx.shadowBlur      = 0;
    ctx.fillStyle       = '#fff';
    ctx.font            = 'bold 11px "Cormorant Garamond",serif';
    ctx.textAlign       = 'center';
    ctx.textBaseline    = 'middle';
    ctx.fillText('SB', CX, CY);

    ctx.restore();
  }

  let t = 0;

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, CW, CH);

    // Draw all orbits
    TOOLS.forEach(p => drawOrbit(p.orbit));

    // Sort by depth for correct Z-order
    const sorted = [...TOOLS].sort((a, b) => {
      const da = Math.sin(a.phase + t * a.speed) * a.orbit * sinTilt;
      const db = Math.sin(b.phase + t * b.speed) * b.orbit * sinTilt;
      return da - db;
    });

    // Behind-sun planets
    sorted.forEach(p => {
      if (Math.sin(p.phase + t * p.speed) * p.orbit * sinTilt <= 0) {
        drawPlanet(p, t);
      }
    });

    drawSun(t);

    // In-front planets
    sorted.forEach(p => {
      if (Math.sin(p.phase + t * p.speed) * p.orbit * sinTilt > 0) {
        drawPlanet(p, t);
      }
    });

    t++;
  }

  // Start only when section scrolls into view
  const startObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        draw();
        startObserver.disconnect();
      }
    },
    { threshold: 0.05 }
  );
  startObserver.observe(canvas.parentElement);
})();