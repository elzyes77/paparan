/* =========================================================
   MISSION 60 — app.js
   Boot sequence · HUD · Mission timer · Scroll reveals ·
   Typewriter · Chat demo · Checklist · Confetti ·
   AI Mascot widget · Fullscreen Presentation Mode
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Icons ---------------- */
  if (window.lucide) lucide.createIcons();

  /* ---------------- Boot sequence ---------------- */
  const bootLines = [
    'Initializing Mission...',
    'Connecting AI...',
    'Loading Presentation Engine...',
    'Calibrating design system...',
    'Ready.'
  ];
  const bootLog = document.getElementById('bootLog');
  const bootFill = document.getElementById('bootFill');
  const bootPct = document.getElementById('bootPct');
  const boot = document.getElementById('boot');
  const bootSkip = document.getElementById('bootSkip');

  let bootDone = false;
  function finishBoot(){
    if (bootDone) return;
    bootDone = true;
    boot.classList.add('is-hidden');
    document.body.style.overflow = '';
    startMissionTimer();
    setTimeout(() => boot.remove(), 600);
  }

  document.body.style.overflow = 'hidden';
  let pct = 0;
  bootLines.forEach((line, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = line;
      bootLog.appendChild(el);
    }, i * 320);
  });

  const bootInterval = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) { pct = 100; clearInterval(bootInterval); }
    bootFill.style.width = pct + '%';
    bootPct.textContent = Math.floor(pct) + '%';
    if (pct >= 100) setTimeout(finishBoot, 400);
  }, 260);

  bootSkip.addEventListener('click', () => { clearInterval(bootInterval); finishBoot(); });
  setTimeout(finishBoot, 4500);

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ---------------- HUD show/hide + progress ---------------- */
  const hud = document.getElementById('hud');
  const hudProgress = document.getElementById('hudProgress');
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('presenting')) return;
    const y = window.scrollY;
    hud.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, y / max) : 0;
    hudProgress.style.width = (ratio * 100) + '%';
  }, { passive: true });

  /* ---------------- Mission countdown timer (60:00) ---------------- */
  const timerEl = document.getElementById('missionTimer');
  let secondsLeft = 60 * 60;
  let timerInterval = null;
  function startMissionTimer(){
    timerInterval = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1);
      const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
      const s = String(secondsLeft % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
      if (secondsLeft === 0) clearInterval(timerInterval);
    }, 1000);
  }

  /* ---------------- Scroll reveal animations ---------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
    gsap.from('.hero__content > *', {
      opacity: 0, y: 20, duration: 0.7, stagger: 0.08, delay: 0.3, ease: 'power2.out'
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------------- Typewriter for AI bubble ---------------- */
  const typedEl = document.getElementById('aiTyped');
  if (typedEl) {
    const fullText = typedEl.dataset.full || '';
    let typed = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typed) {
          typed = true;
          let i = 0;
          typedEl.textContent = '';
          const iv = setInterval(() => {
            typedEl.textContent = fullText.slice(0, i);
            i++;
            if (i > fullText.length) {
              clearInterval(iv);
              typedEl.style.borderRight = 'none';
            }
          }, 18);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(typedEl);
  }

  /* ---------------- Chat demo typing (Level 2) ---------------- */
  const chatDemo = document.getElementById('chatDemo');
  if (chatDemo) {
    const linesContainer = document.getElementById('chatDemoLines');
    let lines = [];
    try { lines = JSON.parse(chatDemo.dataset.lines || '[]'); } catch (e) { lines = []; }
    let played = false;
    const chatObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !played) {
          played = true;
          lines.forEach((line, i) => {
            setTimeout(() => {
              const div = document.createElement('div');
              div.textContent = line;
              if (line.startsWith('You:')) div.classList.add('you');
              if (line.startsWith('AI:')) div.classList.add('ai');
              div.style.animationDelay = '0s';
              linesContainer.appendChild(div);
            }, i * 450);
          });
          chatObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    chatObserver.observe(chatDemo);
  }

  /* ---------------- Quest "Next Mission" buttons ---------------- */
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.goto);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------- Checklist progress ---------------- */
  const checklistBox = document.getElementById('checklistBox');
  const checklistFill = document.getElementById('checklistFill');
  const checklistCount = document.getElementById('checklistCount');
  if (checklistBox) {
    const inputs = checklistBox.querySelectorAll('input[type="checkbox"]');
    function updateChecklist(){
      const checked = Array.from(inputs).filter(i => i.checked).length;
      checklistFill.style.width = (checked / inputs.length * 100) + '%';
      checklistCount.textContent = `${checked} / ${inputs.length} selesai`;
      if (checked === inputs.length) fireConfetti();
    }
    inputs.forEach(i => i.addEventListener('change', updateChecklist));
  }

  /* ---------------- Confetti ---------------- */
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let confettiActive = false;
  function fireConfetti(){
    if (confettiActive) return;
    confettiActive = true;
    const colors = ['#4F8CFF', '#8B5CF6', '#FFC857'];
    const particles = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      r: 3 + Math.random() * 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12
    }));
    let frame = 0;
    const maxFrames = 220;
    function tick(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        ctx.restore();
      });
      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiActive = false;
      }
    }
    tick();
  }

  const achievement = document.getElementById('achievement');
  if (achievement) {
    const achObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fireConfetti();
          achObserver.disconnect();
        }
      });
    }, { threshold: 0.6 });
    achObserver.observe(achievement);
  }

  /* =========================================================
     AI MASCOT WIDGET
  ========================================================= */
  const mascotBtn = document.getElementById('mascotBtn');
  const mascotBubble = document.getElementById('mascotBubble');
  const mascotTips = [
    'Butuh bantuan? Klik "Quest berikutnya" untuk lanjut ke misi selanjutnya.',
    'Coba tekan tombol "Mode Presentasi" di pojok kanan atas untuk tampil layar penuh.',
    'Tips: tujuan yang jelas membuat AI menghasilkan outline yang jauh lebih baik.',
    'Jangan lupa centang Checklist Mission setelah menyelesaikan tiap tahap!',
    'Semangat! Timer terus berjalan — satu langkah lagi menuju presentasi selesai.'
  ];
  let mascotTipIndex = 0;
  if (mascotBtn) {
    mascotBtn.addEventListener('click', () => {
      const isVisible = mascotBubble.classList.contains('is-visible');
      if (isVisible) {
        mascotBubble.classList.remove('is-visible');
      } else {
        mascotBubble.textContent = mascotTips[mascotTipIndex % mascotTips.length];
        mascotTipIndex++;
        mascotBubble.classList.add('is-visible');
      }
    });
  }

  /* =========================================================
     FULLSCREEN PRESENTATION MODE
     Space / → / ↓  = next slide
     ←  / ↑          = previous slide
     Esc              = exit
  ========================================================= */
  const presentBtn = document.getElementById('presentBtn');
  const pmodeExit = document.getElementById('pmodeExit');
  const pmodeDots = document.getElementById('pmodeDots');
  const pmodeCounter = document.getElementById('pmodeCounter');

  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  let currentSlide = 0;
  let slideObserver = null;

  function buildDots(){
    pmodeDots.innerHTML = '';
    slides.forEach((slide, i) => {
      const dot = document.createElement('div');
      dot.className = 'pmode-dots__dot';
      dot.title = slide.dataset.slideName || `Slide ${i + 1}`;
      dot.addEventListener('click', () => goToSlide(i));
      pmodeDots.appendChild(dot);
    });
  }

  function updateActive(index){
    currentSlide = index;
    pmodeCounter.textContent = `${index + 1} / ${slides.length} — ${slides[index].dataset.slideName || ''}`;
    Array.from(pmodeDots.children).forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goToSlide(index){
    if (index < 0 || index >= slides.length) return;
    slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateActive(index);
  }

  function enterPresentationMode(){
    document.documentElement.classList.add('presenting');
    document.body.classList.add('presenting');
    if (lenis) lenis.stop();
    buildDots();
    updateActive(0);
    slides[0].scrollIntoView({ block: 'start' });

    // Fullscreen API (graceful fallback if blocked, e.g. inside an iframe)
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    // Track current slide as user scrolls/swipes manually
    slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1) updateActive(idx);
        }
      });
    }, { threshold: [0.6] });
    slides.forEach(s => slideObserver.observe(s));
  }

  function exitPresentationMode(){
    document.documentElement.classList.remove('presenting');
    document.body.classList.remove('presenting');
    if (lenis) lenis.start();
    if (slideObserver) { slideObserver.disconnect(); slideObserver = null; }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (presentBtn) presentBtn.addEventListener('click', enterPresentationMode);
  if (pmodeExit) pmodeExit.addEventListener('click', exitPresentationMode);

  document.addEventListener('keydown', (e) => {
    const presenting = document.body.classList.contains('presenting');
    if (!presenting) return;
    if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'ArrowDown') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.code === 'Escape') {
      exitPresentationMode();
    }
  });

  // If the user exits fullscreen via browser controls (not our button), sync state
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && document.body.classList.contains('presenting')) {
      exitPresentationMode();
    }
  });

});
