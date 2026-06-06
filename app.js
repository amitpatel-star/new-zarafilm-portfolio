/* ==========================================================================
   Zaara Films - Application Logic
   ========================================================================== */

function init() {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initBeforeAfterSlider();
  initPortfolioModal();
  initContactForm();
  initVideoPlaybackControl();
  initParticleBackground();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Dynamic Instagram logo fetching has been replaced with static local logo (zaarafilms.png)

/**
 * 2. Header Scroll Effects
 * Adds visual weight to navigation bar when user scrolls down.
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Toggle header compression
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active navigation indicator styling
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 3. Mobile Navigation Menu Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');
  const menuLinks = document.querySelectorAll('.mobile-nav-item');

  if (!toggleBtn || !overlay) return;

  function toggleMenu() {
    const isOpen = toggleBtn.classList.contains('open');
    if (isOpen) {
      toggleBtn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      toggleBtn.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent page scroll
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when a mobile nav link is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 4. Intersection Observer for Scroll Reveal Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve once animation has been triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 5. Before/After Color Grading Comparison Slider
 * Allows interactive dragging to display LUT adjustments inside DaVinci Resolve Mockup.
 */
function initBeforeAfterSlider() {
  const sliderContainer = document.querySelector('.video-preview-wrapper');
  const beforeImg = document.querySelector('.before-img');
  const sliderHandle = document.querySelector('.slider-handle');

  if (!sliderContainer || !beforeImg || !sliderHandle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = sliderContainer.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    
    // Clamp values between 0 and 100
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    // Apply values to image overlay clip-path and handle offset
    beforeImg.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    sliderHandle.style.left = `${position}%`;
  }

  // Move slider on mouse hover (no click required)
  sliderContainer.addEventListener('mousemove', (e) => {
    setSliderPosition(e.clientX);
  });

  // Touch device handlers
  sliderContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  });

  sliderContainer.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  });
}

/**
 * 6. Immersive 9:16 Video Portfolio Modal Player
 */
function initPortfolioModal() {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const closeBtn = document.querySelector('.modal-close');
  const backdrop = document.querySelector('.modal-backdrop');
  
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const heroWatchReel = document.getElementById('hero-watch-reel');

  if (!modal || !modalVideo) return;

  // Open modal functionality
  function openModal(videoUrl, title, category, desc) {
    modalVideo.src = videoUrl;
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDesc.textContent = desc;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock scrolling

    // Auto play the selected video file
    modalVideo.load();
    const playPromise = modalVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Playback started successfully
      }).catch(error => {
        console.log("Autoplay blocked, showing video controls.", error);
      });
    }
  }

  // Close modal functionality
  function closeModal() {
    modalVideo.pause();
    modalVideo.src = '';
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // unlock scroll
  }

  // Bind clicks to portfolio items
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const url = item.getAttribute('data-video-url');
      const title = item.getAttribute('data-title');
      const category = item.getAttribute('data-category');
      const desc = item.getAttribute('data-desc');
      openModal(url, title, category, desc);
    });
  });

  // Hero Watch Reel CTA
  if (heroWatchReel) {
    heroWatchReel.addEventListener('click', () => {
      // Open modal with primary showreel asset
      openModal(
        'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-41712-large.mp4',
        'Zaara Films - Agency Showreel 2026',
        'Agency Reel',
        'Our official compilation showcase demonstrating dynamic tracking, Volumetric color grading, speed ramps, and high-retention timeline cuts.'
      );
    });
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 7. Lead Generation Form Simulation & Toast Feedback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-success');

  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const btnInner = submitBtn.querySelector('.btn-inner');
    const originalContent = btnInner.innerHTML;

    // Transition submit button into simulated processing state
    submitBtn.disabled = true;
    btnInner.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Rendering Proposal...';

    // Simulate API submission latency
    setTimeout(() => {
      // Reset form controls
      form.reset();
      
      // Restore button text states
      submitBtn.disabled = false;
      btnInner.innerHTML = originalContent;

      // Trigger Toast Notification popup
      toast.classList.add('show');

      // Dismiss Toast after delay
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);

    }, 1500);
  });
}

/**
 * 8. Synchronize YouTube Video Playback
 * Pauses all other videos when one begins playing using the official YouTube Player API and message events fallback.
 */
let ytPlayers = [];

function initVideoPlaybackControl() {
  const startPlayerInit = () => {
    const iframeIds = ['yt-player-1', 'yt-player-2', 'yt-player-3', 'yt-player-4'];
    ytPlayers = []; // Reset players to prevent duplicates on multiple runs
    
    iframeIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const player = new YT.Player(id, {
          events: {
            'onStateChange': (event) => {
              // event.data is the player's new state (1 is playing)
              if (event.data === 1) {
                // Pause all other initialized players
                ytPlayers.forEach(otherPlayer => {
                  if (otherPlayer !== player && typeof otherPlayer.pauseVideo === 'function') {
                    try {
                      otherPlayer.pauseVideo();
                    } catch (e) {
                      console.error("Error pausing YT player:", e);
                    }
                  }
                });
              }
            }
          }
        });
        ytPlayers.push(player);
      }
    });
  };

  // 1. Initialize via YouTube API (handles race conditions where API script is already cached/loaded)
  if (window.YT && window.YT.Player) {
    startPlayerInit();
  } else {
    window.onYouTubeIframeAPIReady = startPlayerInit;
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  // 2. Fallback window message listener (captures raw postMessages from frames directly)
  window.addEventListener('message', (event) => {
    if (event.origin && (event.origin.includes('youtube.com') || event.origin.includes('youtube-nocookie.com'))) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // Check if message represents a playing state change
        const isPlaying = 
          (data.event === 'infoDelivery' && data.info && data.info.playerState === 1) ||
          (data.event === 'onStateChange' && data.info === 1);

        if (isPlaying) {
          const iframes = document.querySelectorAll('.video-card-media iframe');
          iframes.forEach(iframe => {
            // Compare source windows to prevent pausing the active video itself
            if (iframe.contentWindow !== event.source) {
              iframe.contentWindow.postMessage(
                JSON.stringify({
                  event: 'command',
                  func: 'pauseVideo',
                  args: ''
                }),
                '*'
              );
            }
          });
        }
      } catch (e) {
        // Safe catch for non-JSON payloads
      }
    }
  });
}

/**
 * 9. Interactive Radial Starburst Background
 * Renders particles radiating outwards from the center of the screen,
 * featuring 3D perspective stretching, depth-based mouse parallax, and
 * springy cursor repulsion (antigravity).
 */
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let cx = width / 2;
  let cy = height / 2;
  let maxRadius = Math.hypot(cx, cy);

  const particles = [];
  const particleCount = 450; // Generate around 400-500 particles
  const mouseRadius = 100; // Repulsion radius (100px)
  const mouse = { x: null, y: null, active: false };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  });

  // Handle viewport resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
    maxRadius = Math.hypot(cx, cy);
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.angle = Math.random() * Math.PI * 2;
      // If initial page load, distribute them randomly across radius. Otherwise reset near center.
      this.r = init ? Math.random() * maxRadius : Math.random() * 50;
      this.depth = Math.random() * 1.5 + 0.5; // Depth factor [0.5, 2.0] (for 3D parallax)
      this.speed = Math.random() * 0.4 + 0.2; // Base speed of expansion
      
      // Theme colors: cyan, subtle magenta, white, electric blue
      const colors = [
        'rgba(0, 240, 255, ',   // Neon Cyan
        'rgba(255, 0, 128, ',   // Faint Magenta
        'rgba(255, 255, 255, ', // White
        'rgba(0, 102, 255, '    // Electric Blue
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.3 + 0.15; // Max opacity [0.15, 0.45]

      // Actual coordinates
      this.x = cx + Math.cos(this.angle) * this.r;
      this.y = cy + Math.sin(this.angle) * this.r;
    }

    update() {
      // 1. Expand outward
      this.r += this.speed * this.depth;

      // Reset if it exceeds screen bounds
      if (this.r > maxRadius) {
        this.reset(false);
        return;
      }

      // 2. Parallax displacement relative to cursor distance from center
      const dxMouse = mouse.active && mouse.x !== null ? mouse.x - cx : 0;
      const dyMouse = mouse.active && mouse.y !== null ? mouse.y - cy : 0;
      // Background layers (smaller depth) shift less, foreground (larger depth) shifts more
      const px = -dxMouse * 0.03 * (this.depth - 0.2);
      const py = -dyMouse * 0.03 * (this.depth - 0.2);

      // Target position along its radial path including parallax
      const targetX = cx + Math.cos(this.angle) * this.r + px;
      const targetY = cy + Math.sin(this.angle) * this.r + py;

      // 3. Mouse repulsion (Antigravity springs)
      let repelledX = targetX;
      let repelledY = targetY;

      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          // Push particles outwards from mouse pointer
          repelledX = targetX + Math.cos(angle) * force * 30;
          repelledY = targetY + Math.sin(angle) * force * 30;
        }
      }

      // 4. Smoothly ease to coordinates
      this.x += (repelledX - this.x) * 0.1;
      this.y += (repelledY - this.y) * 0.1;
    }

    draw() {
      const scale = this.r / maxRadius;
      // Sinusoidal opacity profile (fades in near center, peaks in middle, fades out at bounds)
      const alpha = Math.sin(scale * Math.PI) * this.baseAlpha;
      
      // Calculate length of perspective dash (stretches as it goes outward)
      const length = 2 + scale * 12;

      ctx.strokeStyle = `${this.colorBase}${alpha})`;
      ctx.lineWidth = 0.8 + (this.depth - 0.5) * 0.8; // Thicker lines for closer items
      ctx.beginPath();
      
      // Elongated dash pointing away from the center
      const cos = Math.cos(this.angle);
      const sin = Math.sin(this.angle);
      ctx.moveTo(this.x - cos * length, this.y - sin * length);
      ctx.lineTo(this.x + cos * length, this.y + sin * length);
      ctx.stroke();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
