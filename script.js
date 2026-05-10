/* ============================================
   JOYEUX 20 ANS — Script Principal
   GSAP + Lenis + SplitType + Canvas
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  document.body.style.overflow = 'hidden';

  // ==========================================
  // LENIS — SMOOTH SCROLL
  // ==========================================
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ==========================================
  // LOADER
  // ==========================================
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');

  if (loader) {
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);

        gsap.to(loaderProgress, {
          width: '100%',
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(loader, {
              opacity: 0,
              duration: 0.8,
              ease: 'power3.inOut',
              delay: 0.3,
              onComplete: () => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initHeroAnimations();
              }
            });
          }
        });
      }
      gsap.to(loaderProgress, {
        width: progress + '%',
        duration: 0.3,
        ease: 'power2.out'
      });
    }, 180);
  }

  // ==========================================
  // STARS GENERATOR
  // ==========================================
  function createStars() {
    const container = document.getElementById('heroStars');
    if (!container) return;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'hero__star';
      const size = Math.random() * 2.5 + 1;
      const animDuration = Math.random() * 3 + 2;
      const animDelay = Math.random() * 3;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.3});
        animation: starTwinkle ${animDuration}s ease-in-out infinite ${animDelay}s;
      `;
      container.appendChild(star);
    }
  }
  createStars();

  // ==========================================
  // HERO ANIMATIONS
  // ==========================================
  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero__pre-title', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    })
    .to('.hero__title-line', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
    }, '-=0.6')
    .to('.hero__divider', {
      opacity: 1,
      duration: 0.8,
    }, '-=0.4')
    .to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
    }, '-=0.4')
    .to('.hero__scroll', {
      opacity: 1,
      duration: 0.8,
    }, '-=0.4')
    .to('.hero__photo-frame', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
    }, '-=0.6');

    // Parallax on hero
    gsap.to('.hero__bg', {
      y: '15%',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // Hero scale out
    gsap.to('.hero__content', {
      scale: 0.95,
      opacity: 0.6,
      scrollTrigger: {
        trigger: '#hero',
        start: 'center top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }

  // ==========================================
  // NAVIGATION
  // ==========================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll behavior
  if (nav) {
    ScrollTrigger.create({
      start: 'top +=80',
      onUpdate: (self) => {
        nav.classList.toggle('scrolled', self.progress > 0);
      }
    });
  }

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Scroll to section
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -70, duration: 1.8 });
      }
    });
  });

  // ==========================================
  // SCROLL REVEAL — Sections
  // ==========================================
  function setupReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');

    reveals.forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        onStart: () => el.classList.add('revealed'),
      });
    });
  }

  // Timeline nodes staggered
  function setupTimeline() {
    const nodes = document.querySelectorAll('.timeline__node');

    nodes.forEach((node, i) => {
      gsap.to(node, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: node,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        onStart: () => node.classList.add('revealed'),
      });
    });

    // Timeline line growth
    gsap.to('.timeline__line', {
      scaleY: 1,
      scrollTrigger: {
        trigger: '.timeline__track',
        start: 'top 85%',
        end: 'bottom center',
        scrub: 1.2,
      },
      ease: 'none',
    });
  }

  // ==========================================
  // QUESTIONS — Staggered reveal
  // ==========================================
  function setupQuestions() {
    const questions = document.querySelectorAll('.question');

    questions.forEach((q, i) => {
      ScrollTrigger.create({
        trigger: q,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => {
            q.classList.add('revealed');
            q.style.opacity = '1';
            q.style.transform = 'translateY(0)';
          }, i * 150);
        },
        once: true,
      });
    });
  }

  // ==========================================
  // GALLERY — Lightbox (images + videos)
  // ==========================================
  function setupGallery() {
    const items = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxContent = lightbox?.querySelector('.lightbox__content');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightbox) return;

    function openImage(src, caption) {
      lightboxContent?.classList.remove('show-video');
      lightboxContent?.classList.add('show-image');
      if (lightboxVideo) lightboxVideo.pause();
      if (lightboxImage) lightboxImage.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function openVideo(src, caption) {
      lightboxContent?.classList.remove('show-image');
      lightboxContent?.classList.add('show-video');
      if (lightboxImage) lightboxImage.src = '';
      if (lightboxVideo) {
        lightboxVideo.src = src;
        lightboxVideo.load();
        lightboxVideo.play().catch(() => {});
      }
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery__img');
        const caption = item.querySelector('.gallery__caption span')?.textContent || 'Souvenir précieux';
        if (img) openImage(img.src, caption);
      });
    });

    // Videos — click on info opens lightbox
    const videoInfos = document.querySelectorAll('.videos__info');
    videoInfos.forEach(info => {
      info.addEventListener('click', () => {
        const item = info.closest('.videos__item');
        const video = item?.querySelector('.videos__video');
        const label = item?.querySelector('.videos__label')?.textContent || 'Vidéo';
        if (video) {
          const src = video.querySelector('source')?.src || video.src;
          if (src) openVideo(src, label);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      if (lightboxImage) lightboxImage.src = '';
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // INTERACTIVE HEART CANVAS
  // ==========================================
  function setupHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    let width = rect.width;
    let height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    let particles = [];
    let heartBeats = 0;
    let isBeating = false;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetScale = 1;
    let currentScale = 1;
    let animationId = null;

    const countDisplay = document.getElementById('heartCount');

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 120 + 20;
        this.baseX = width / 2 + Math.cos(angle) * radius * 0.8;
        this.baseY = height / 2 + Math.sin(angle) * radius * 0.7;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = 35 + Math.random() * 15;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(scale) {
        this.phase += 0.02;
        this.x = this.baseX + Math.sin(this.phase) * 3 * scale;
        this.y = this.baseY + Math.cos(this.phase) * 3 * scale;
        this.opacity = 0.2 + Math.sin(this.phase * 0.5) * 0.2 + 0.1 * scale;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    }

    function drawHeart(scale) {
      ctx.clearRect(0, 0, width, height);

      // Draw heart shape
      ctx.save();
      ctx.translate(width / 2, height / 2 + 10);
      ctx.scale(scale, scale);

      // Heart glow
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 80);
      gradient.addColorStop(0, 'rgba(201, 168, 76, 0.12)');
      gradient.addColorStop(0.5, 'rgba(201, 168, 76, 0.05)');
      gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fill();

      // Heart outline
      ctx.beginPath();
      ctx.moveTo(0, 15);

      for (let t = 0; t <= Math.PI * 2; t += 0.01) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        ctx.lineTo(x, y);
      }

      ctx.closePath();

      const heartGradient = ctx.createLinearGradient(-20, -20, 20, 20);
      heartGradient.addColorStop(0, 'rgba(201, 168, 76, 0.3)');
      heartGradient.addColorStop(0.5, 'rgba(232, 213, 163, 0.5)');
      heartGradient.addColorStop(1, 'rgba(201, 168, 76, 0.3)');

      ctx.fillStyle = heartGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Draw particles
      particles.forEach(p => {
        p.update(scale);
        p.draw(ctx);
      });

      // Center glow
      const centerGrad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, 40 * scale
      );
      centerGrad.addColorStop(0, `rgba(201, 168, 76, ${0.08 * scale})`);
      centerGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 40 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      currentScale += (targetScale - currentScale) * 0.05;
      drawHeart(currentScale);
      animationId = requestAnimationFrame(animate);
    }

    function heartbeat() {
      if (isBeating) return;
      isBeating = true;

      heartBeats++;
      if (countDisplay) countDisplay.textContent = heartBeats;

      targetScale = 1.3;
      gsap.to({}, {
        duration: 0.15,
        onComplete: () => {
          targetScale = 0.95;
          gsap.to({}, {
            duration: 0.1,
            onComplete: () => {
              targetScale = 1.1;
              gsap.to({}, {
                duration: 0.1,
                onComplete: () => {
                  targetScale = 1;
                  isBeating = false;
                }
              });
            }
          });
        }
      });
    }

    // Resize
    const resizeObserver = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
      initParticles();
    });
    resizeObserver.observe(canvas);

    // Click
    canvas.addEventListener('click', heartbeat);
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      heartbeat();
    });

    // Mouse move subtle parallax on particles
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / width;
      mouseY = (e.clientY - r.top) / height;

      particles.forEach((p, i) => {
        p.baseX += (p.baseX - (width / 2 + (mouseX - 0.5) * 30)) * 0.001;
        p.baseY += (p.baseY - (height / 2 + (mouseY - 0.5) * 20)) * 0.001;
      });
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = width / 2;
      mouseY = height / 2;
    });

    initParticles();
    animate();
  }

  // ==========================================
  // SPLITTYPE — Text animations
  // ==========================================
  function setupSplitText() {
    document.querySelectorAll('[data-split]').forEach(el => {
      try {
        const split = new SplitType(el, {
          types: 'lines, words',
          lineClass: 'split-line',
          wordClass: 'split-word',
        });

        gsap.from(split.lines, {
          y: '100%',
          opacity: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      } catch (e) {
        // Fallback if SplitType fails
        gsap.set(el, { opacity: 1 });
      }
    });
  }

  // ==========================================
  // STORY PARALLAX — Mouse effect
  // ==========================================
  function setupStoryParallax() {
    const blocks = document.querySelectorAll('.story__block');
    blocks.forEach(block => {
      block.addEventListener('mousemove', (e) => {
        const rect = block.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const num = block.querySelector('.story__number');
        if (num) {
          gsap.to(num, {
            x: x * 20,
            y: y * 10,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });

      block.addEventListener('mouseleave', () => {
        const num = block.querySelector('.story__number');
        if (num) {
          gsap.to(num, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });
    });
  }

  // ==========================================
  // INIT ALL
  // ==========================================
  ScrollTrigger.normalizeScroll(true);

  // Wait for Lenis to be ready
  setTimeout(() => {
    setupReveal();
    setupTimeline();
    setupQuestions();
    setupGallery();
    setupSplitText();
    setupStoryParallax();
    setupHeartCanvas();

    // Refresh ScrollTrigger after everything is set
    ScrollTrigger.refresh();
  }, 100);

  // Refresh on resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  // ==========================================
  // FALLBACK — If loader hidden already
  // ==========================================
  if (loader && loader.classList.contains('hidden')) {
    initHeroAnimations();
  }

}); // End DOMContentLoaded
