/**
 * INLOGICO - APP CORE
 * Main application class + core utilities
 * Version: 2.0 - Modular Architecture
 */

class InlogicoApp {
  constructor() {
    this.content = new Map();
    this.currentPage = window.location.pathname;
    this.isMenuOpen = false;
    
    // Environment detection
    this.isLocalFile = window.location.protocol === 'file:';
    
    // Module instances
    this.router = null;
    this.navigation = null;
    this.animations = null;
    this.contentPages = null;
    
    this.init();
  }

  async init() {
    console.log(`🚀 Inlogico App starting in ${this.isLocalFile ? 'LOCAL FILE' : 'WEB SERVER'} mode`);
    
    try {
      // Initialize modules in correct order
      await this.initializeModules();
      
      // Setup core functionality
      this.setupForms();
      this.setupPerformanceMonitoring();
      
      console.log(`✅ Inlogico Complete Website loaded in ${performance.now().toFixed(2)}ms`);
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.showNotification('Errore di inizializzazione app', 'error');
    }
  }

  async initializeModules() {
    // Initialize Router (handles SPA navigation)
    if (window.InlogicoRouter) {
      this.router = new InlogicoRouter(this);
    }
    
    // Initialize Navigation (mobile menu, dropdowns, dark mode)
    if (window.InlogicoNavigation) {
      this.navigation = new InlogicoNavigation(this);
    }
    
    // Initialize Animations (scroll effects, transitions)
    if (window.InlogicoAnimations) {
      this.animations = new InlogicoAnimations(this);
    }
    
    // Initialize Content Pages (page generators)
    if (window.InlogicoContentPages) {
      this.contentPages = new InlogicoContentPages(this);
    }
  }

  // CORE UTILITIES
  
  setupForms() {
    document.addEventListener('submit', async (e) => {
      if (e.target.matches('form')) {
        e.preventDefault();
        await this.handleFormSubmit(e.target);
      }
    });
  }

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      this.setButtonLoading(submitButton, true);

      // Simulate form submission (replace with real endpoint)
      await InlogicoUtils.delay(2000);
      
      this.showNotification('Messaggio inviato con successo! Ti ricontatteremo presto.', 'success');
      form.reset();
      
      // Restore button
      this.setButtonLoading(submitButton, false, originalText);
      
    } catch (error) {
      this.showNotification('Errore nell\'invio del messaggio. Riprova più tardi.', 'error');
      console.error('Form submission error:', error);
      
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        this.setButtonLoading(submitButton, false, 'Invia Richiesta');
      }
    }
  }

  setButtonLoading(button, isLoading, restoreText = '') {
    if (isLoading) {
      button.innerHTML = '<span class="spinner"></span> Invio in corso...';
      button.disabled = true;
    } else {
      button.textContent = restoreText || button.textContent;
      button.disabled = false;
    }
  }

  setupPerformanceMonitoring() {
    // Core Web Vitals monitoring
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`⚡ Website loaded in ${loadTime.toFixed(2)}ms`);
      
      // Optional: Web Vitals library
      if (window.webVitals) {
        webVitals.getCLS(console.log);
        webVitals.getFID(console.log);
        webVitals.getFCP(console.log);
        webVitals.getLCP(console.log);
        webVitals.getTTFB(console.log);
      }
    });
  }

  // NOTIFICATION SYSTEM
  
  showNotification(message, type = 'success', duration = 5000) {
    const notification = document.createElement('div');
    
    const colors = {
      'success': 'var(--primary)',
      'error': '#ef4444',
      'info': '#3b82f6',
      'warning': '#f59e0b'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${colors[type]};
      color: white;
      border-radius: var(--border-radius, 6px);
      box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      font-weight: 500;
      max-width: 350px;
      font-size: 14px;
      font-family: inherit;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);

    // Click to dismiss
    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    });
  }

  showLoading() {
    document.body.classList.add('loading');
  }

  hideLoading() {
    document.body.classList.remove('loading');
  }

  // EVENT SYSTEM FOR MODULE COMMUNICATION
  
  emit(eventName, data = {}) {
    const event = new CustomEvent(`inlogico:${eventName}`, { 
      detail: data,
      bubbles: true 
    });
    document.dispatchEvent(event);
  }

  on(eventName, callback) {
    document.addEventListener(`inlogico:${eventName}`, callback);
  }

  off(eventName, callback) {
    document.removeEventListener(`inlogico:${eventName}`, callback);
  }

  // GETTERS FOR MODULE ACCESS
  
  get isLocal() {
    return this.isLocalFile;
  }

  get currentPath() {
    return this.currentPage;
  }

  setCurrentPage(path) {
    this.currentPage = path;
    this.emit('pageChanged', { path });
  }
}

/**
 * INLOGICO UTILITIES
 * Shared utility functions
 */
class InlogicoUtils {
  
  // Async utilities
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // DOM utilities
  static $(selector, context = document) {
    return context.querySelector(selector);
  }

  static $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  static createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.text) element.textContent = options.text;
    if (options.html) element.innerHTML = options.html;
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    if (options.style) {
      Object.assign(element.style, options.style);
    }
    
    return element;
  }

  // String utilities
  static slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static truncate(text, length, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }

  // Validation utilities
  static isEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isPhoneNumber(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  }

  static isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Performance utilities
  static measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }

  static async measureAsyncPerformance(name, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }

  // Local storage utilities (with error handling)
  static setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  }

  static getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return defaultValue;
    }
  }

  static removeStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  }
}

// CSS Animation utilities
InlogicoUtils.addCSS = function(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Add notification animations if not present
InlogicoUtils.addCSS(`
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 2px solid white;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`);

// Make available globally
window.InlogicoApp = InlogicoApp;
window.InlogicoUtils = InlogicoUtils;