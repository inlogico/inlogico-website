/**
 * INLOGICO - UI NAVIGATION MODULE
 * Mobile menu, dropdown, dark mode, and UI interactions
 * Version: 2.0 - Modular Architecture
 */

class InlogicoNavigation {
  constructor(app) {
    this.app = app;
    this.isMenuOpen = false;
    this.activeDropdown = null;
    this.currentTheme = 'light';
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupDropdownMenus();
    this.setupDarkMode();
    this.setupActiveNavLinks();
    this.setupAccessibility();
    
    // Listen for page changes to update active links
    this.app.on('pageChanged', (e) => {
      this.updateActiveNavLink(e.detail.path);
    });

    console.log('🧭 Navigation module initialized');
  }

  // MOBILE MENU SYSTEM
  
  setupMobileMenu() {
    const mobileMenuBtn = InlogicoUtils.$('#mobile-menu-btn');
    const mobileMenu = InlogicoUtils.$('#mobile-menu');
    const closeMenuBtn = InlogicoUtils.$('#close-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;

    // Main toggle button
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Close button
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeMobileMenu();
      });
    }

    // Link clicks - smart closing
    InlogicoUtils.$$('a:not(.close-btn)', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => this.closeMobileMenu(), 150);
      });
    });

    // Backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        this.closeMobileMenu();
      }
    });

    // Keyboard controls
    this.setupMobileMenuKeyboard(mobileMenu);
    
    // Responsive behavior
    this.setupMobileMenuResponsive();
  }

  setupMobileMenuKeyboard(mobileMenu) {
    document.addEventListener('keydown', (e) => {
      // Escape key closes menu
      if (e.key === 'Escape' && this.isMenuOpen) {
        e.preventDefault();
        this.closeMobileMenu();
      }

      // Tab key focus trap
      if (e.key === 'Tab' && this.isMenuOpen) {
        this.handleFocusTrap(e, mobileMenu);
      }
    });
  }

  handleFocusTrap(e, mobileMenu) {
    const focusableElements = InlogicoUtils.$$('a, button, [tabindex]:not([tabindex="-1"])', mobileMenu);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  setupMobileMenuResponsive() {
    // Auto-close on desktop resize
    window.addEventListener('resize', InlogicoUtils.throttle(() => {
      if (window.innerWidth > 1024 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 250));

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      if (this.isMenuOpen) {
        setTimeout(() => this.closeMobileMenu(), 300);
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileMenuBtn = InlogicoUtils.$('#mobile-menu-btn');
    const mobileMenu = InlogicoUtils.$('#mobile-menu');
    
    if (!mobileMenu || !mobileMenuBtn) return;

    this.isMenuOpen = true;
    
    // Prevent body scroll
    document.body.classList.add('menu-open');
    
    // Activate menu with smooth transition
    requestAnimationFrame(() => {
      mobileMenu.classList.add('active');
      mobileMenuBtn.classList.add('active');
    });
    
    // Accessibility
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    
    // Focus management
    setTimeout(() => {
      const firstLink = InlogicoUtils.$('a:not(.close-btn)', mobileMenu);
      if (firstLink) firstLink.focus();
    }, 200);

    // Emit event
    this.app.emit('mobileMenuOpened');
  }

  closeMobileMenu() {
    const mobileMenuBtn = InlogicoUtils.$('#mobile-menu-btn');
    const mobileMenu = InlogicoUtils.$('#mobile-menu');
    
    if (!mobileMenu || !mobileMenuBtn) return;

    this.isMenuOpen = false;
    
    // Deactivate menu
    mobileMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    
    // Accessibility
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll after animation
    setTimeout(() => {
      document.body.classList.remove('menu-open');
    }, 400);
    
    // Return focus
    setTimeout(() => {
      mobileMenuBtn.focus();
    }, 100);

    // Emit event
    this.app.emit('mobileMenuClosed');
  }

  // DROPDOWN MENUS
  
  setupDropdownMenus() {
    const dropdowns = InlogicoUtils.$$('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
      const dropdownContent = InlogicoUtils.$('.dropdown-content', dropdown);
      
      if (!dropdownContent) return;

      let hoverTimeout;
      
      // Show dropdown on hover
      dropdown.addEventListener('mouseenter', () => {
        this.showDropdown(dropdownContent, hoverTimeout);
      });
      
      // Hide dropdown on leave with delay
      dropdown.addEventListener('mouseleave', () => {
        hoverTimeout = this.hideDropdown(dropdownContent, 150);
      });
      
      // Prevent closing when hovering over content
      dropdownContent.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });
      
      dropdownContent.addEventListener('mouseleave', () => {
        hoverTimeout = this.hideDropdown(dropdownContent, 150);
      });

      // Keyboard support
      this.setupDropdownKeyboard(dropdown, dropdownContent);
    });
  }

  showDropdown(dropdownContent, currentTimeout) {
    clearTimeout(currentTimeout);
    
    // Close other dropdowns
    if (this.activeDropdown && this.activeDropdown !== dropdownContent) {
      this.hideDropdownImmediate(this.activeDropdown);
    }
    
    this.activeDropdown = dropdownContent;
    
    dropdownContent.style.display = 'grid';
    dropdownContent.style.opacity = '0';
    dropdownContent.style.transform = 'translateY(-10px)';
    
    requestAnimationFrame(() => {
      dropdownContent.style.transition = 'all 0.3s ease';
      dropdownContent.style.opacity = '1';
      dropdownContent.style.transform = 'translateY(0)';
    });
  }

  hideDropdown(dropdownContent, delay = 0) {
    return setTimeout(() => {
      dropdownContent.style.opacity = '0';
      dropdownContent.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        dropdownContent.style.display = 'none';
        if (this.activeDropdown === dropdownContent) {
          this.activeDropdown = null;
        }
      }, 300);
    }, delay);
  }

  hideDropdownImmediate(dropdownContent) {
    dropdownContent.style.display = 'none';
    dropdownContent.style.opacity = '0';
    if (this.activeDropdown === dropdownContent) {
      this.activeDropdown = null;
    }
  }

  setupDropdownKeyboard(dropdown, dropdownContent) {
    const trigger = InlogicoUtils.$('.nav-link', dropdown);
    
    if (!trigger) return;

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (dropdownContent.style.display === 'grid') {
          this.hideDropdownImmediate(dropdownContent);
        } else {
          this.showDropdown(dropdownContent);
        }
      }
    });
  }

  // DARK MODE SYSTEM
  
  setupDarkMode() {
    const themeToggle = InlogicoUtils.$('#theme-toggle');
    
    // Load saved theme
    this.currentTheme = InlogicoUtils.getStorage('theme', 'light');
    this.applyTheme(this.currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Update icon
      this.updateThemeIcon(themeToggle, this.currentTheme);
    }

    // Listen for system theme changes
    this.setupSystemThemeDetection();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    InlogicoUtils.setStorage('theme', theme);
    
    const themeToggle = InlogicoUtils.$('#theme-toggle');
    if (themeToggle) {
      this.updateThemeIcon(themeToggle, theme);
    }

    // Emit theme change event
    this.app.emit('themeChanged', { theme });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    let metaThemeColor = InlogicoUtils.$('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = InlogicoUtils.createElement('meta', {
        attributes: { name: 'theme-color' }
      });
      document.head.appendChild(metaThemeColor);
    }
    
    const themeColors = {
      light: '#ffffff',
      dark: '#141414'
    };
    
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }

  updateThemeIcon(themeToggle, theme) {
    const sunIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;

    const moonIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  }

  setupSystemThemeDetection() {
    // Detect system theme preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Only apply system theme if user hasn't set a preference
      if (!InlogicoUtils.getStorage('theme')) {
        this.setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
      
      // Listen for system theme changes
      mediaQuery.addEventListener('change', (e) => {
        if (!InlogicoUtils.getStorage('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // ACTIVE NAVIGATION LINKS
  
  setupActiveNavLinks() {
    this.updateActiveNavLink(this.app.currentPath);
  }

  updateActiveNavLink(currentPath) {
    const navLinks = InlogicoUtils.$$('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('active');
      }
    });
  }

  // ACCESSIBILITY ENHANCEMENTS
  
  setupAccessibility() {
    // Skip to main content link
    this.addSkipLink();
    
    // Enhanced focus management
    this.setupFocusManagement();
    
    // Reduced motion support
    this.setupReducedMotion();
  }

  addSkipLink() {
    const skipLink = InlogicoUtils.createElement('a', {
      className: 'skip-link sr-only',
      text: 'Vai al contenuto principale',
      attributes: { href: '#main-content' }
    });
    
    skipLink.addEventListener('focus', () => {
      skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  setupFocusManagement() {
    // Enhance focus visibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }
  }

  // PUBLIC API
  
  getCurrentTheme() {
    return this.currentTheme;
  }

  isMobileMenuOpen() {
    return this.isMenuOpen;
  }

  closeAllDropdowns() {
    const dropdowns = InlogicoUtils.$$('.dropdown-content');
    dropdowns.forEach(dropdown => {
      this.hideDropdownImmediate(dropdown);
    });
  }

  // Programmatic theme switching
  switchToLight() {
    this.setTheme('light');
  }

  switchToDark() {
    this.setTheme('dark');
  }

  switchToAuto() {
    InlogicoUtils.removeStorage('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }
}

// Add enhanced focus styles
InlogicoUtils.addCSS(`
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.3s;
  }
  
  .skip-link:focus {
    top: 6px;
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--accent, #3b82f6) !important;
    outline-offset: 2px !important;
  }
  
  [data-reduced-motion="true"] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
`);

// Make available globally
window.InlogicoNavigation = InlogicoNavigation;