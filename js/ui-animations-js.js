/**
 * INLOGICO - UI ANIMATIONS MODULE
 * Scroll animations, transitions, and visual effects
 * Version: 2.0 - Modular Architecture
 */

class InlogicoAnimations {
  constructor(app) {
    this.app = app;
    this.observers = new Map();
    this.animationQueue = [];
    this.isReducedMotion = false;
    
    this.init();
  }

  init() {
    this.checkReducedMotionPreference();
    this.setupScrollAnimations();
    this.setupHeaderEffects();
    this.setupPageTransitions();
    this.setupParallaxEffects();
    this.setupCounterAnimations();
    
    // Listen for page changes to re-setup animations
    this.app.on('pageChanged', () => {
      this.setupScrollAnimations();
      this.setupCounterAnimations();
    });

    console.log('✨ Animations module initialized');
  }

  // REDUCED MOTION DETECTION
  
  checkReducedMotionPreference() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (this.isReducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
      console.log('♿ Reduced motion detected - animations simplified');
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      document.documentElement.setAttribute('data-reduced-motion', e.matches ? 'true' : 'false');
    });
  }

  // SCROLL ANIMATIONS
  
  setupScrollAnimations() {
    // Clean up existing observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    if (this.isReducedMotion) return;

    // Setup fade-in animations
    this.setupFadeInAnimations();
    
    // Setup slide-in animations
    this.setupSlideInAnimations();
    
    // Setup stagger animations
    this.setupStaggerAnimations();
    
    // Setup scale animations
    this.setupScaleAnimations();
  }

  setupFadeInAnimations() {
    const fadeElements = InlogicoUtils.$$('.card, .stat-item, .feature-card, .service-card');
    
    if (fadeElements.length === 0) return;

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target, 'fadeIn');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
      if (!el.classList.contains('animate-in')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        fadeObserver.observe(el);
      }
    });

    this.observers.set('fadeIn', fadeObserver);
  }

  setupSlideInAnimations() {
    const slideElements = InlogicoUtils.$$('.slide-in-left, .slide-in-right');
    
    if (slideElements.length === 0) return;

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const direction = entry.target.classList.contains('slide-in-left') ? 'Left' : 'Right';
          this.animateElement(entry.target, `slideIn${direction}`);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });

    slideElements.forEach(el => {
      const direction = el.classList.contains('slide-in-left') ? -100 : 100;
      el.style.opacity = '0';
      el.style.transform = `translateX(${direction}px)`;
      slideObserver.observe(el);
    });

    this.observers.set('slideIn', slideObserver);
  }

  setupStaggerAnimations() {
    const staggerContainers = InlogicoUtils.$$('.stagger-children');
    
    staggerContainers.forEach(container => {
      const children = InlogicoUtils.$$('.card, .stat-item', container);
      
      if (children.length === 0) return;

      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.staggerAnimation(children);
          }
        });
      }, { threshold: 0.1 });

      staggerObserver.observe(container);
      this.observers.set(`stagger-${container.id || Math.random()}`, staggerObserver);
    });
  }

  setupScaleAnimations() {
    const scaleElements = InlogicoUtils.$$('.scale-in');
    
    if (scaleElements.length === 0) return;

    const scaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target, 'scaleIn');
        }
      });
    }, { threshold: 0.2 });

    scaleElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
      scaleObserver.observe(el);
    });

    this.observers.set('scaleIn', scaleObserver);
  }

  // HEADER EFFECTS
  
  setupHeaderEffects() {
    const header = InlogicoUtils.$('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let isScrollingUp = false;

    const scrollHandler = InlogicoUtils.throttle(() => {
      const currentScrollY = window.scrollY;
      isScrollingUp = currentScrollY < lastScrollY;
      
      // Header visibility based on scroll direction
      if (currentScrollY > 100) {
        if (isScrollingUp) {
          header.classList.add('header-visible');
          header.classList.remove('header-hidden');
        } else {
          header.classList.add('header-hidden');
          header.classList.remove('header-visible');
        }
      } else {
        header.classList.remove('header-hidden', 'header-visible');
      }

      // Header background opacity
      const opacity = Math.min(currentScrollY / 100, 1);
      header.style.setProperty('--header-opacity', opacity);

      lastScrollY = currentScrollY;
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // PAGE TRANSITIONS
  
  setupPageTransitions() {
    if (this.isReducedMotion) return;

    // Listen for route changes
    this.app.on('pageChanged', () => {
      this.playPageTransition();
    });
  }

  playPageTransition() {
    const mainContent = InlogicoUtils.$('#main-content');
    if (!mainContent) return;

    // Add transition class
    mainContent.classList.add('page-transition');
    
    // Remove after animation
    setTimeout(() => {
      mainContent.classList.remove('page-transition');
    }, 600);
  }

  // PARALLAX EFFECTS
  
  setupParallaxEffects() {
    if (this.isReducedMotion) return;

    const parallaxElements = InlogicoUtils.$$('.parallax');
    
    if (parallaxElements.length === 0) return;

    const parallaxHandler = InlogicoUtils.throttle(() => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.5;
        const offset = scrollTop * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, 16);

    window.addEventListener('scroll', parallaxHandler, { passive: true });
  }

  // COUNTER ANIMATIONS
  
  setupCounterAnimations() {
    const counters = InlogicoUtils.$$('.stat-number[data-count]');
    
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          this.animateCounter(entry.target);
          entry.target.dataset.animated = 'true';
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });

    this.observers.set('counters', counterObserver);
  }

  animateCounter(element) {
    if (this.isReducedMotion) {
      element.textContent = element.dataset.count;
      return;
    }

    const target = parseInt(element.dataset.count.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        element.textContent = this.formatCounterNumber(Math.floor(current), element.dataset.count);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = element.dataset.count;
      }
    };

    updateCounter();
  }

  formatCounterNumber(num, original) {
    // Preserve original formatting (K, +, %, etc.)
    const suffix = original.replace(/[\d,]/g, '');
    
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K' + suffix;
    }
    
    return num.toLocaleString() + suffix;
  }

  // ANIMATION UTILITIES
  
  animateElement(element, animationType, options = {}) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.classList.add('animate-in');
      return;
    }

    const animations = {
      fadeIn: {
        opacity: '1',
        transform: 'translateY(0)'
      },
      slideInLeft: {
        opacity: '1',
        transform: 'translateX(0)'
      },
      slideInRight: {
        opacity: '1',
        transform: 'translateX(0)'
      },
      scaleIn: {
        opacity: '1',
        transform: 'scale(1)'
      }
    };

    const animation = animations[animationType];
    if (!animation) return;

    // Apply animation
    Object.assign(element.style, {
      transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'} ${options.delay || '0s'}`,
      ...animation
    });

    element.classList.add('animate-in');

    // Cleanup
    setTimeout(() => {
      element.style.transition = '';
    }, (parseFloat(options.duration) || 600) + (parseFloat(options.delay) || 0));
  }

  staggerAnimation(elements, baseDelay = 0.1) {
    elements.forEach((el, index) => {
      const delay = index * baseDelay;
      this.animateElement(el, 'fadeIn', { delay: `${delay}s` });
    });
  }

  // ENTRANCE ANIMATIONS FOR DYNAMIC CONTENT
  
  animateIn(selector, animationType = 'fadeIn', options = {}) {
    const elements = InlogicoUtils.$$(selector);
    
    if (options.stagger) {
      this.staggerAnimation(elements, options.stagger);
    } else {
      elements.forEach(el => {
        this.animateElement(el, animationType, options);
      });
    }
  }

  // LOADING ANIMATIONS
  
  showLoadingAnimation(target) {
    if (typeof target === 'string') {
      target = InlogicoUtils.$(target);
    }
    
    if (!target) return;

    const spinner = InlogicoUtils.createElement('div', {
      className: 'loading-spinner',
      html: '<div class="spinner"></div>'
    });

    target.appendChild(spinner);
    return spinner;
  }

  hideLoadingAnimation(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.remove();
    }
  }

  // MICRO-INTERACTIONS
  
  setupMicroInteractions() {
    // Button hover effects
    InlogicoUtils.$$('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          btn.style.transform = 'translateY(-2px)';
        }
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });

    // Card hover effects
    InlogicoUtils.$$('.card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          card.style.transform = 'translateY(-4px)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // PUBLIC API
  
  refresh() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
  }

  disable() {
    this.observers.forEach(observer => observer.disconnect());
    document.documentElement.setAttribute('data-animations-disabled', 'true');
  }

  enable() {
    document.documentElement.removeAttribute('data-animations-disabled');
    this.setupScrollAnimations();
  }

  // CLEANUP
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Add CSS animations
InlogicoUtils.addCSS(`
  .header {
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .header-hidden {
    transform: translateY(-100%);
  }
  
  .header-visible {
    transform: translateY(0);
  }
  
  .page-transition {
    animation: pageSlideIn 0.6s ease-out;
  }
  
  @keyframes pageSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
  
  .animate-in {
    animation: fadeInUp 0.6s ease-out;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Reduced motion overrides */
  [data-reduced-motion="true"] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  [data-reduced-motion="true"] .parallax {
    transform: none !important;
  }
  
  [data-animations-disabled="true"] * {
    animation: none !important;
    transition: none !important;
  }
`);

// Make available globally
window.InlogicoAnimations = InlogicoAnimations;