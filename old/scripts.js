// INLOGICO - SCRIPTS.JS - COMPLETE + HYBRID VERSION
// Versione finale che funziona sia locale che web con tutte le funzionalità

class InlogicoApp {
  constructor() {
    this.content = new Map();
    this.currentPage = window.location.pathname;
    this.isMenuOpen = false;
    // 🔍 HYBRID DETECTION - Rileva automaticamente l'ambiente
    this.isLocalFile = window.location.protocol === 'file:';
    this.init();
  }

  async init() {
    // Log environment per debug
    console.log(`🚀 Inlogico App starting in ${this.isLocalFile ? 'LOCAL FILE' : 'WEB SERVER'} mode`);
    
    // Setup components sempre attivi
    this.setupNavigation();
    this.setupAnimations();
    this.setupForms();
    
    // 🌐 CONDITIONAL ROUTER SETUP - Solo per web server
    if (!this.isLocalFile) {
      console.log('🌐 Enabling SPA router for web server mode');
      this.setupRouter();
      
      // Load initial content if needed per SPA
      if (this.currentPage !== '/') {
        await this.loadPage(this.currentPage);
      }
    } else {
      console.log('📄 Local file mode detected - router disabled, using direct navigation');
      this.setupLocalFileNavigation();
    }
    
    console.log(`✅ Inlogico Complete Website loaded in ${performance.now().toFixed(2)}ms`);
  }

  // 🔗 NAVIGAZIONE PER FILE LOCALI - Gestisce link senza errori
  setupLocalFileNavigation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        const href = link.getAttribute('href');
        
        // Se il link punta a pagine diverse dalla home, mostra info
        if (href !== '/' && !href.startsWith('/#')) {
          e.preventDefault();
          // Mostra messaggio informativo user-friendly
          this.showNotification('⚡ Per navigare tra tutte le pagine, apri il sito da un server web locale (vedi README)', 'info');
        }
        // I link alla home (/) e anchor (#) funzionano normalmente
      }
    });
  }

  setupNavigation() {
    // 🍔 MOBILE MENU SETUP - BULLETPROOF IMPLEMENTATION
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    const closeMenuBtn = document.querySelector('#close-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      // 🎯 MAIN TOGGLE - Ultra responsive
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      });

      // 🎯 CLOSE BUTTON - Premium interaction
      if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeMenu();
        });
      }

      // 🎯 LINK CLICKS - Smart closing with environment awareness
      mobileMenu.querySelectorAll('a:not(.close-btn)').forEach(link => {
        link.addEventListener('click', (e) => {
          if (this.isLocalFile) {
            // In modalità file, chiudi il menu e lascia che il link funzioni normalmente
            setTimeout(() => {
              this.closeMenu();
            }, 150);
          } else {
            // In modalità web, comportamento SPA normale
            setTimeout(() => {
              this.closeMenu();
            }, 150);
          }
        });
      });

      // 🎯 BACKDROP CLICK - Close when clicking outside
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
          this.closeMenu();
        }
      });

      // 🎯 ESCAPE KEY - Universal close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          e.preventDefault();
          this.closeMenu();
        }
      });

      // 🎯 FOCUS TRAP - Keep focus within menu when open
      document.addEventListener('keydown', (e) => {
        if (!this.isMenuOpen || e.key !== 'Tab') return;
        
        const focusableElements = mobileMenu.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      });

      // 🎯 RESIZE HANDLER - Auto-close on desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.isMenuOpen) {
          this.closeMenu();
        }
      });

      // 🎯 ORIENTATION CHANGE - Handle mobile rotation
      window.addEventListener('orientationchange', () => {
        if (this.isMenuOpen) {
          setTimeout(() => {
            this.closeMenu();
          }, 300);
        }
      });
    }

    // Setup other navigation features
    this.setupDarkMode();
    this.updateActiveNavLink();
    this.setupDropdownMenus();
  }

  // 🎯 DROPDOWN MENUS - Desktop Navigation
  setupDropdownMenus() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      
      if (dropdownContent) {
        let hoverTimeout;
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          dropdownContent.style.display = 'grid';
          dropdownContent.style.opacity = '0';
          dropdownContent.style.transform = 'translateY(-10px)';
          
          // Smooth animation
          requestAnimationFrame(() => {
            dropdownContent.style.transition = 'all 0.3s ease';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
          });
        });
        
        // Hide dropdown on leave with delay
        dropdown.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
              dropdownContent.style.display = 'none';
            }, 300);
          }, 150);
        });
        
        // Prevent closing when hovering over dropdown content
        dropdownContent.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
        });
        
        dropdownContent.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
              dropdownContent.style.display = 'none';
            }, 300);
          }, 150);
        });
      }
    });
  }

  // 🍔 MOBILE MENU TOGGLE - AWARD-WINNING IMPLEMENTATION
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    
    if (mobileMenu && mobileMenuBtn) {
      // 🚀 SMOOTH STATE CHANGES
      this.isMenuOpen = true;
      
      // 🎯 BODY LOCK FIRST (prevents scroll issues)
      document.body.classList.add('menu-open');
      
      // 🌟 ACTIVATE WITH SLIGHT DELAY for smooth transition
      requestAnimationFrame(() => {
        mobileMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
      });
      
      // 🎯 ACCESSIBILITY PERFECT
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      
      // 🔒 FOCUS MANAGEMENT - Delayed for animation
      setTimeout(() => {
        const firstLink = mobileMenu.querySelector('a:not(.close-btn)');
        if (firstLink) firstLink.focus();
      }, 200);
    }
  }

  closeMenu() {
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    
    if (mobileMenu && mobileMenuBtn) {
      // 🚀 INSTANT FEEDBACK
      this.isMenuOpen = false;
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      
      // 🎯 ACCESSIBILITY IMMEDIATE
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      
      // 🔒 BODY UNLOCK AFTER ANIMATION
      setTimeout(() => {
        document.body.classList.remove('menu-open');
      }, 400); // Match CSS transition duration
      
      // 🔒 RETURN FOCUS SMOOTHLY
      setTimeout(() => {
        mobileMenuBtn.focus();
      }, 100);
    }
  }

  setupDarkMode() {
    const themeToggle = document.querySelector('#theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        this.updateThemeIcon(newTheme);
      });
    }

    // Set initial icon
    this.updateThemeIcon(savedTheme);
  }

  updateThemeIcon(theme) {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;

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

  updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === this.currentPage) {
        link.classList.add('active');
      }
    });
  }

  // 🌐 ROUTER - SOLO PER MODALITÀ WEB SERVER
  setupRouter() {
    // Handle internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.hasAttribute('target')) {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigateTo(path);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.loadPage(window.location.pathname);
    });
  }

  async navigateTo(path) {
    if (path === this.currentPage) return;
    
    try {
      history.pushState({}, '', path);
      await this.loadPage(path);
    } catch (error) {
      console.error('Navigation error:', error);
      this.showNotification('Errore di navigazione', 'error');
    }
  }

  async loadPage(path) {
    try {
      this.showLoading();
      
      // Get page content based on path
      const content = await this.getPageContent(path);
      
      const mainContent = document.querySelector('#main-content');
      mainContent.innerHTML = content;
      
      this.currentPage = path;
      this.updateActiveNavLink();
      this.updateSEO(path);
      
      // Re-setup interactions for new content
      this.setupAnimations();
      
      this.hideLoading();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error loading page:', error);
      this.showNotification('Errore nel caricamento della pagina', 'error');
    }
  }

  async getPageContent(path) {
    // Enhanced page content for all services - COMPLETE VERSION
    const pages = {
      '/servizi/': this.getServicesPageContent(),
      '/servizi/seo/': this.getSEOPageContent(),
      '/servizi/google-ads/': this.getGoogleAdsPageContent(),
      '/servizi/sviluppo-siti-web/': this.getSviluppoSitiPageContent(),
      '/servizi/intelligenza-artificiale/': this.getAIPageContent(),
      '/servizi/social-media-marketing/': this.getSocialMediaPageContent(),
      '/servizi/facebook-ads/': this.getFacebookAdsPageContent(),
      '/servizi/whatsapp-business/': this.getWhatsAppPageContent(),
      '/servizi/e-commerce/': this.getEcommercePageContent(),
      '/servizi/creazione-app/': this.getAppPageContent(),
      '/servizi/web-design/': this.getWebDesignPageContent(),
      '/servizi/email-marketing/': this.getEmailMarketingPageContent(),
      '/servizi/google-analytics/': this.getAnalyticsPageContent(),
      '/servizi/chatbot/': this.getChatbotPageContent(),
      '/servizi/consulenza-digitale/': this.getConsulenzaPageContent(),
      '/servizi/social-commerce/': this.getSocialCommercePageContent(),
      '/servizi/privacy-data-marketing/': this.getPrivacyDataPageContent(),
      '/servizi/green-marketing/': this.getGreenMarketingPageContent(),
      '/contatti/': this.getContactPageContent(),
      '/chi-siamo/': this.getAboutPageContent()
    };

    return pages[path] || this.get404PageContent();
  }

  // PAGE CONTENT GENERATORS - COMPLETE VERSION
  getServicesPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>I Nostri Servizi Completi</h1>
          <p>Soluzioni digitali end-to-end per dominare il mercato online. 17 servizi specializzati per la tua crescita digitale.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Consulenza gratuita</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <div class="grid grid-3">
            ${this.getServiceCards()}
          </div>
        </div>
      </section>
    `;
  }

  getServiceCards() {
    const services = [
      { name: 'SEO & Posizionamento', url: '/servizi/seo/', desc: 'Primi su Google con strategie SEO avanzate' },
      { name: 'Google Ads', url: '/servizi/google-ads/', desc: 'Campagne pubblicitarie ROI garantito' },
      { name: 'Sviluppo Siti Web', url: '/servizi/sviluppo-siti-web/', desc: 'Siti web professionali e performanti' },
      { name: 'Intelligenza Artificiale', url: '/servizi/intelligenza-artificiale/', desc: 'AI integration per business competitivi' },
      { name: 'Social Media Marketing', url: '/servizi/social-media-marketing/', desc: 'Presenza social strategica e coinvolgente' },
      { name: 'E-commerce', url: '/servizi/e-commerce/', desc: 'Shop online completi e ottimizzati' },
      { name: 'Chatbot', url: '/servizi/chatbot/', desc: 'Assistenti virtuali intelligenti' },
      { name: 'WhatsApp Business', url: '/servizi/whatsapp-business/', desc: 'Automazione customer service' },
      { name: 'Facebook Ads', url: '/servizi/facebook-ads/', desc: 'Advertising Meta professionale' },
      { name: 'Email Marketing', url: '/servizi/email-marketing/', desc: 'Newsletter e automazione email' },
      { name: 'Google Analytics', url: '/servizi/google-analytics/', desc: 'Tracking e analisi performance' },
      { name: 'Web Design', url: '/servizi/web-design/', desc: 'Design moderno e user experience' },
      { name: 'Creazione App', url: '/servizi/creazione-app/', desc: 'App mobile native e PWA' },
      { name: 'Consulenza Digitale', url: '/servizi/consulenza-digitale/', desc: 'Digital transformation strategy' },
      { name: 'Social Commerce', url: '/servizi/social-commerce/', desc: 'Vendita diretta sui social' },
      { name: 'Privacy Marketing', url: '/servizi/privacy-data-marketing/', desc: 'Marketing cookieless e GDPR' },
      { name: 'Green Marketing', url: '/servizi/green-marketing/', desc: 'Marketing sostenibile' }
    ];

    return services.map(service => `
      <div class="card">
        <h3>${service.name}</h3>
        <p>${service.desc}</p>
        <a href="${service.url}" class="btn">Scopri di più</a>
      </div>
    `).join('');
  }

  getSEOPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>SEO Roma | Posizionamento Google Professionale</h1>
          <p>Posizionamento Google garantito con strategie SEO avanzate. <strong>+340% traffico organico</strong> in 6 mesi per i nostri clienti.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Richiedi Audit SEO Gratuito</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Come funziona la SEO?</h2>
          <p>La SEO (Search Engine Optimization) è l'insieme di tecniche volte a ottimizzare il posizionamento di un sito web sui motori di ricerca come Google.</p>
          
          <h3>I nostri servizi SEO includono:</h3>
          <div class="grid grid-2">
            <div class="card">
              <h4>Audit SEO Tecnico</h4>
              <p>Analisi completa del tuo sito per identificare problemi tecnici e opportunità di miglioramento.</p>
            </div>
            <div class="card">
              <h4>Keyword Research</h4>
              <p>Ricerca approfondita delle parole chiave più performanti per il tuo settore.</p>
            </div>
            <div class="card">
              <h4>Ottimizzazione On-Page</h4>
              <p>Ottimizzazione contenuti, meta tag, struttura URL e fattori on-page.</p>
            </div>
            <div class="card">
              <h4>Link Building</h4>
              <p>Strategia di acquisizione backlink di qualità per aumentare l'autorità del dominio.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Quanto costa la SEO?</h3>
            <p>I nostri pacchetti SEO partono da <strong>€800/mese</strong> e includono audit tecnico completo, ottimizzazione pagine, articoli SEO e report mensili.</p>
            <a href="/contatti/" class="btn btn-large">Richiedi preventivo</a>
          </div>
        </div>
      </section>
    `;
  }

  getGoogleAdsPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Google Ads Roma | Gestione Campagne Pubblicitarie</h1>
          <p>Campagne Google Ads con <strong>ROI garantito</strong> e lead qualificati dal primo giorno. Google Partner Certified.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Analisi Account Gratuita</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Cosa sono Google Ads?</h2>
          <p>Google Ads è la piattaforma pubblicitaria di Google che permette di mostrare annunci nei risultati di ricerca, su YouTube, Gmail e milioni di siti partner.</p>
          
          <div class="grid grid-2">
            <div class="card">
              <h4>Campagne Search</h4>
              <p>Annunci testuali che appaiono quando gli utenti cercano i tuoi prodotti/servizi.</p>
            </div>
            <div class="card">
              <h4>Google Shopping</h4>
              <p>Vetrina prodotti con immagini, prezzi e recensioni per e-commerce.</p>
            </div>
            <div class="card">
              <h4>YouTube Ads</h4>
              <p>Video advertising sulla piattaforma video più grande al mondo.</p>
            </div>
            <div class="card">
              <h4>Display Network</h4>
              <p>Banner visivi su oltre 2 milioni di siti web e app partner Google.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>ROI Garantito</h3>
            <p>La gestione Google Ads parte da <strong>€500/mese</strong> + budget pubblicità. Setup account incluso e primo mese gestione gratis.</p>
            <a href="/contatti/" class="btn btn-large">Inizia subito</a>
          </div>
        </div>
      </section>
    `;
  }

  getSviluppoSitiPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Sviluppo Siti Web Roma | WordPress & Custom</h1>
          <p>Siti web che convertono visitatori in clienti. <strong>Performance 100/100</strong> su Lighthouse e tempi di caricamento <0.5s.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Consulenza Gratuita</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Che tipo di sito web ti serve?</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Siti Web Aziendali</h4>
              <p>Presenza digitale professionale per aziende che vogliono crescere online. Design responsive e SEO ottimizzato.</p>
            </div>
            <div class="card">
              <h4>E-commerce</h4>
              <p>Negozi online completi per vendere prodotti e servizi. WooCommerce, Shopify, pagamenti sicuri.</p>
            </div>
            <div class="card">
              <h4>Web Application</h4>
              <p>Applicazioni web custom per esigenze specifiche. Sviluppo su misura con tecnologie moderne.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Prezzi Trasparenti</h3>
            <p>Siti web aziendali da <strong>€1.500</strong>, e-commerce da <strong>€3.500</strong>. Include hosting, dominio e supporto.</p>
            <a href="/contatti/" class="btn btn-large">Richiedi preventivo</a>
          </div>
        </div>
      </section>
    `;
  }

  getAIPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Intelligenza Artificiale per Business</h1>
          <p>AI integration che <strong>riduce costi operativi del 40%</strong> e automatizza customer service 24/7.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Scopri l'AI per il tuo business</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Come l'AI può trasformare il tuo business</h2>
          
          <div class="grid grid-2">
            <div class="card">
              <h4>Chatbot AI Personalizzati</h4>
              <p>Assistenti virtuali intelligenti per customer service automatizzato 24/7 e lead generation.</p>
            </div>
            <div class="card">
              <h4>Marketing Automation</h4>
              <p>Automazione campagne marketing con AI per personalizzazione e targeting avanzato.</p>
            </div>
            <div class="card">
              <h4>Predictive Analytics</h4>
              <p>Analisi predittiva per anticipare trend di mercato e comportamenti clienti.</p>
            </div>
            <div class="card">
              <h4>Process Automation</h4>
              <p>Automazione processi aziendali con AI per efficienza e riduzione costi operativi.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getSocialMediaPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Social Media Marketing | Gestione Social Completa</h1>
          <p>Presenza social strategica e coinvolgente. Content creation, influencer marketing e social advertising per engagement massimo.</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Strategia Social Gratuita</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <div class="grid grid-3">
            <div class="card">
              <h4>Gestione Social Media</h4>
              <p>Gestione completa Facebook, Instagram, LinkedIn, TikTok e YouTube con content strategy personalizzata.</p>
            </div>
            <div class="card">
              <h4>Influencer Marketing</h4>
              <p>Campagne influencer marketing strategiche con micro e macro influencer del tuo settore.</p>
            </div>
            <div class="card">
              <h4>Content Creation</h4>
              <p>Creazione contenuti visual e video professionali ottimizzati per ogni piattaforma social.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getFacebookAdsPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Facebook Ads | Instagram Advertising | Meta</h1>
          <p>Campagne Facebook e Instagram Ads strategiche per reach massimo e conversioni garantite. <strong>3.600 ricerche/mese</strong> per "Facebook Ads".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Audit Account Gratuito</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Advertising su Meta (Facebook & Instagram)</h2>
          <p>Le piattaforme Meta offrono targeting avanzato e reach globale per raggiungere il tuo pubblico ideale.</p>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Facebook Ads</h4>
              <p>Campagne pubblicitarie su Facebook per lead generation, vendite e brand awareness.</p>
            </div>
            <div class="card">
              <h4>Instagram Ads</h4>
              <p>Visual advertising su Instagram per coinvolgere audience giovani e trend-conscious.</p>
            </div>
            <div class="card">
              <h4>Meta Shop</h4>
              <p>Integrazione Facebook Shop e Instagram Shopping per vendita diretta sui social.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Risultati Misurabili</h3>
            <p>Gestione Meta Ads da <strong>€400/mese</strong> + budget pubblicità. Setup pixel e catalogo incluso.</p>
            <a href="/contatti/" class="btn btn-large">Inizia le campagne</a>
          </div>
        </div>
      </section>
    `;
  }

  getWhatsAppPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>WhatsApp Business | Automazione Customer Service</h1>
          <p>WhatsApp Business API, automazione customer service e marketing conversazionale. <strong>2.700 ricerche/mese</strong> per "WhatsApp Business".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Attiva WhatsApp Business</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>WhatsApp per il tuo business</h2>
          <p>WhatsApp è il canale di comunicazione preferito dai clienti. Automatizza e professionalizza la tua presenza.</p>
          
          <div class="grid grid-2">
            <div class="card">
              <h4>WhatsApp Business API</h4>
              <p>Integrazione API ufficiale per automazione avanzata e gestione multi-operatore.</p>
            </div>
            <div class="card">
              <h4>Customer Service Automation</h4>
              <p>Chatbot intelligenti per rispondere automaticamente alle domande frequenti 24/7.</p>
            </div>
            <div class="card">
              <h4>Marketing Conversazionale</h4>
              <p>Campagne marketing via WhatsApp con messaggi personalizzati e interattivi.</p>
            </div>
            <div class="card">
              <h4>E-commerce Integration</h4>
              <p>Vendita diretta su WhatsApp con catalogo prodotti e pagamenti integrati.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getEcommercePageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>E-commerce | Negozi Online Professionali</h1>
          <p>Shop online completi e ottimizzati per vendere di più. WooCommerce, Shopify, Magento e custom. <strong>4.400 ricerche/mese</strong> per "e-commerce".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Preventivo E-commerce</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Soluzioni E-commerce Complete</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>WooCommerce</h4>
              <p>E-commerce WordPress personalizzabile, SEO-friendly e con migliaia di plugin disponibili.</p>
            </div>
            <div class="card">
              <h4>Shopify</h4>
              <p>Piattaforma cloud affidabile e veloce, ideale per startup e scale-up dell'e-commerce.</p>
            </div>
            <div class="card">
              <h4>E-commerce Custom</h4>
              <p>Sviluppo su misura per esigenze specifiche e integrazioni complesse con gestionali.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Tutto Incluso</h3>
            <p>E-commerce da <strong>€3.500</strong> chiavi in mano: design, sviluppo, pagamenti, spedizioni, SEO.</p>
            <a href="/contatti/" class="btn btn-large">Inizia a vendere online</a>
          </div>
        </div>
      </section>
    `;
  }

  getAppPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Creazione App Mobile | iOS, Android, PWA</h1>
          <p>App mobile native e Progressive Web App per iOS e Android. Development React Native, Flutter e native. <strong>1.900 ricerche/mese</strong> per "creazione app".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Sviluppa la tua App</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Sviluppo App su Misura</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>App Native iOS/Android</h4>
              <p>Sviluppo app native per performance massime e accesso completo alle funzioni del device.</p>
            </div>
            <div class="card">
              <h4>React Native & Flutter</h4>
              <p>App cross-platform con codice condiviso per ridurre tempi e costi di sviluppo.</p>
            </div>
            <div class="card">
              <h4>Progressive Web App</h4>
              <p>PWA che funzionano come app native ma si installano dal browser senza store.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Da Idea a App Store</h3>
            <p>Sviluppo app da <strong>€8.000</strong>. Include design UX/UI, sviluppo, test e pubblicazione store.</p>
            <a href="/contatti/" class="btn btn-large">Realizza la tua idea</a>
          </div>
        </div>
      </section>
    `;
  }

  getWebDesignPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Web Design | UI/UX Design Professionale</h1>
          <p>Design moderno e user experience ottimizzata. UI/UX design, brand identity e wireframing. <strong>3.600 ricerche/mese</strong> per "web design".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Progetto Design</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Design che Converte</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>UI/UX Design</h4>
              <p>User interface e user experience design centrati sull'utente per massimizzare conversioni.</p>
            </div>
            <div class="card">
              <h4>Brand Identity</h4>
              <p>Logo design, visual identity e brand guidelines per comunicazione coerente e memorabile.</p>
            </div>
            <div class="card">
              <h4>Responsive Design</h4>
              <p>Design ottimizzato per tutti i device: desktop, tablet, mobile con approccio mobile-first.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getEmailMarketingPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Email Marketing | Newsletter & Automation</h1>
          <p>Email marketing strategico con automazione avanzata. Newsletter, DEM, lead nurturing e marketing automation. <strong>2.900 ricerche/mese</strong> per "email marketing".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Strategia Email</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Email Marketing che Funziona</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Newsletter Automatizzate</h4>
              <p>Newsletter automatiche segmentate per mantenere il contatto con i tuoi clienti.</p>
            </div>
            <div class="card">
              <h4>Marketing Automation</h4>
              <p>Workflow automatici per lead nurturing, onboarding clienti e recupero carrelli abbandonati.</p>
            </div>
            <div class="card">
              <h4>DEM Campaigns</h4>
              <p>Direct Email Marketing campaigns per promozioni, eventi e lancio prodotti.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getAnalyticsPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Google Analytics 4 | Tracking & Analisi</h1>
          <p>Setup Google Analytics 4, conversion tracking e dashboard personalizzate per ROI misurabili. <strong>2.200 ricerche/mese</strong> per "Google Analytics".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Setup Analytics</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Misura tutto con Google Analytics 4</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Google Analytics 4 Setup</h4>
              <p>Configurazione completa GA4 con eventi personalizzati e conversion tracking avanzato.</p>
            </div>
            <div class="card">
              <h4>Google Tag Manager</h4>
              <p>Implementazione GTM per gestione tag centralizzata e tracking eventi senza sviluppatori.</p>
            </div>
            <div class="card">
              <h4>Dashboard Personalizzate</h4>
              <p>Report automatici e dashboard su misura per monitorare le metriche che contano.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getChatbotPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Chatbot Intelligenti | AI Customer Service</h1>
          <p>Chatbot AI personalizzati per customer service automatizzato 24/7 e lead generation. <strong>3.600 ricerche/mese</strong> per "chatbot".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Crea il tuo Chatbot</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Assistenti Virtuali Intelligenti</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Chatbot Personalizzati</h4>
              <p>Chatbot AI addestrati sui tuoi dati per rispondere come un esperto del tuo settore.</p>
            </div>
            <div class="card">
              <h4>Chatbot Multicanale</h4>
              <p>Integrazione su sito web, WhatsApp, Facebook Messenger, Telegram per presenza ovunque.</p>
            </div>
            <div class="card">
              <h4>Lead Generation Bot</h4>
              <p>Chatbot specializzati nella qualificazione lead e prenotazione appuntamenti automatica.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getConsulenzaPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Consulenza Digitale | Digital Transformation</h1>
          <p>Consulenza strategica digitale per digital transformation, audit completo e strategia omnicanale. <strong>2.400 ricerche/mese</strong> per "consulenza digitale".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Consulenza Strategica</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Strategia Digitale Completa</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Digital Transformation</h4>
              <p>Strategia di trasformazione digitale per modernizzare processi e competere nell'era digitale.</p>
            </div>
            <div class="card">
              <h4>Audit Digitale Completo</h4>
              <p>Analisi approfondita della presenza digitale attuale con piano d'azione prioritario.</p>
            </div>
            <div class="card">
              <h4>Strategia Omnicanale</h4>
              <p>Coordinamento di tutti i touchpoint digitali per customer experience coerente e integrata.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getSocialCommercePageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Social Commerce | Vendita sui Social</h1>
          <p>Vendita diretta su Instagram, TikTok Shop e Facebook Shop per commerce innovativo. <strong>1.300 ricerche/mese</strong> per "social commerce".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Vendi sui Social</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Il Futuro del Commerce</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Instagram Shopping</h4>
              <p>Integrazione Instagram Shop per vendita diretta con tag prodotti e checkout nativo.</p>
            </div>
            <div class="card">
              <h4>TikTok Shop</h4>
              <p>Setup TikTok Shop per raggiungere la Gen Z e vendere attraverso video virali.</p>
            </div>
            <div class="card">
              <h4>Live Shopping</h4>
              <p>Eventi live shopping interattivi per engagement massimo e conversioni immediate.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getPrivacyDataPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Privacy Marketing | Marketing Cookieless</h1>
          <p>Marketing senza cookie, GDPR compliance e first-party data strategy per il futuro. <strong>900 ricerche/mese</strong> per "marketing privacy".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Marketing del Futuro</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Marketing nel Mondo Post-Cookie</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Marketing Cookieless</h4>
              <p>Strategie marketing senza cookie di terze parti per compliance e performance sostenibili.</p>
            </div>
            <div class="card">
              <h4>First-Party Data</h4>
              <p>Raccolta e utilizzo strategico di first-party data per personalizzazione e targeting.</p>
            </div>
            <div class="card">
              <h4>GDPR Compliance</h4>
              <p>Compliance completa GDPR con consent management e privacy by design.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getGreenMarketingPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Green Marketing | Marketing Sostenibile</h1>
          <p>Marketing sostenibile, comunicazione ambientale e brand responsabili per il futuro. <strong>480 ricerche/mese</strong> per "green marketing".</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Marketing Sostenibile</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>Comunicazione Responsabile</h2>
          
          <div class="grid grid-3">
            <div class="card">
              <h4>Marketing Sostenibile</h4>
              <p>Strategie marketing che promuovono sostenibilità ambientale e responsabilità sociale.</p>
            </div>
            <div class="card">
              <h4>Comunicazione Ambientale</h4>
              <p>Storytelling autentico per comunicare impegno ambientale senza greenwashing.</p>
            </div>
            <div class="card">
              <h4>Brand Purpose</h4>
              <p>Definizione e comunicazione del purpose aziendale per brand con impatto positivo.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getContactPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Contatti</h1>
          <p>Parliamo del tuo progetto digitale. Consulenza gratuita di 30 minuti per analizzare la tua situazione e identificare le opportunità di crescita.</p>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <div class="grid md:grid-2">
            <div>
              <h3>Informazioni di contatto</h3>
              <div style="margin-bottom: 2rem;">
                <p><strong>📍 Indirizzo:</strong><br>Via Monte della Vecchia Quercia, 28/B<br>Formello (Roma), 00060</p>
                <p><strong>📞 Telefono:</strong><br><a href="tel:+39328814105">328.8144105</a></p>
                <p><strong>✉️ Email:</strong><br><a href="mailto:inlogico@gmail.com">inlogico@gmail.com</a></p>
              </div>
              
              <h4>Orari di Apertura</h4>
              <p>Lunedì - Venerdì: 9:00 - 18:00<br>Sabato: 9:00 - 13:00<br>Domenica: Chiuso</p>
              
              <h4>Certificazioni</h4>
              <p>🏆 Google Partner Certified<br>⚡ PageSpeed Expert<br>🔒 GDPR Compliance</p>
            </div>
            
            <div class="card">
              <h3>Richiedi informazioni</h3>
              <form id="contact-form">
                <div style="margin-bottom: 1rem;">
                  <label for="name">Nome *</label>
                  <input type="text" id="name" name="name" required style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: var(--border-radius);">
                </div>
                
                <div style="margin-bottom: 1rem;">
                  <label for="email">Email *</label>
                  <input type="email" id="email" name="email" required style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: var(--border-radius);">
                </div>
                
                <div style="margin-bottom: 1rem;">
                  <label for="service">Servizio di interesse</label>
                  <select id="service" name="service" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: var(--border-radius);">
                    <option value="">Seleziona un servizio</option>
                    <option value="seo">SEO & Posizionamento</option>
                    <option value="sviluppo">Sviluppo Siti Web</option>
                    <option value="google-ads">Google Ads</option>
                    <option value="ai">Intelligenza Artificiale</option>
                    <option value="social">Social Media Marketing</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="consulenza">Consulenza Digitale</option>
                  </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                  <label for="message">Messaggio *</label>
                  <textarea id="message" name="message" required rows="4" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: var(--border-radius); resize: vertical;"></textarea>
                </div>
                
                <button type="submit" class="btn btn-large" style="width: 100%;">
                  Invia Richiesta
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getAboutPageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Chi Siamo | La Storia di Inlogico</h1>
          <p>Dal 2006, dove l'ingegneria incontra la visione. La storia di una web agency che ha attraversato confini geografici e tecnologici.</p>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <h2>La nostra storia</h2>
          <p>Fondati nel 2006, siamo cresciuti attraversando confini geografici e tecnologici. Abbiamo visto l'evoluzione del web e abbiamo sempre anticipato i trend.</p>
          
          <div class="grid md:grid-2">
            <div class="card">
              <h4>La nostra missione</h4>
              <p>Trasformare la complessità digitale in semplicità, i dati in storie, le idee in imperi digitali misurabili.</p>
            </div>
            <div class="card">
              <h4>I nostri valori</h4>
              <p>Innovazione costante, approccio ingegneristico, risultati misurabili e partnership durature con i clienti.</p>
            </div>
          </div>
          
          <div class="services-cta" style="margin-top: var(--space-xl);">
            <h3>Esperienza Internazionale</h3>
            <p>17 anni di progetti attraverso 15+ paesi, dall'Italia all'Europa, dalle startup alle multinazionali.</p>
            <a href="/contatti/" class="btn btn-large">Inizia il tuo progetto</a>
          </div>
        </div>
      </section>
    `;
  }

  get404PageContent() {
    return `
      <section class="hero">
        <div class="container">
          <h1>Pagina non trovata</h1>
          <p>La pagina che stai cercando non esiste o è stata spostata.</p>
          <div class="hero-cta">
            <a href="/" class="btn btn-large">Torna alla homepage</a>
            <a href="/servizi/" class="btn btn-outline btn-large">Esplora i servizi</a>
          </div>
        </div>
      </section>
    `;
  }

  updateSEO(path) {
    const seoData = {
      '/': {
        title: 'Inlogico - Web Agency Roma | Siti Web & Digital Marketing',
        description: 'Web Agency a Roma specializzata in siti web, SEO, Google Ads e digital marketing. Esperienza dal 2006. Dove l\'ingegneria incontra la visione.'
      },
      '/servizi/': {
        title: 'Servizi Digital Marketing | Web Agency Roma | Inlogico',
        description: 'Servizi completi di digital marketing: SEO, sviluppo siti web, Google Ads, social media marketing. 17 servizi specializzati per la tua crescita.'
      },
      '/servizi/seo/': {
        title: 'SEO Roma | Posizionamento Google Professionale | Inlogico',
        description: 'Servizi SEO a Roma. Posizionamento Google garantito, audit tecnico, ottimizzazione siti web. Consulenza SEO professionale dal 2006.'
      },
      '/servizi/google-ads/': {
        title: 'Google Ads Roma | Gestione Campagne Pubblicitarie | Inlogico',
        description: 'Gestione Google Ads professionale a Roma. Campagne pubblicitarie ROI garantito, certificazioni Google Partner. Genera clienti subito.'
      },
      '/servizi/sviluppo-siti-web/': {
        title: 'Sviluppo Siti Web Roma | WordPress & Custom | Inlogico',
        description: 'Sviluppo siti web professionali a Roma. WordPress, siti custom, e-commerce, responsive design. Esperienza dal 2006, performance garantite.'
      },
      '/servizi/intelligenza-artificiale/': {
        title: 'Intelligenza Artificiale Business | AI Integration | Inlogico',
        description: 'Implementazione AI per business. Chatbot intelligenti, automazione processi, machine learning. Trasforma il tuo business con l\'AI.'
      },
      '/servizi/social-media-marketing/': {
        title: 'Social Media Marketing Roma | Gestione Social | Inlogico',
        description: 'Social media marketing strategico a Roma. Gestione Facebook, Instagram, TikTok, LinkedIn. Content creation e influencer marketing.'
      },
      '/servizi/facebook-ads/': {
        title: 'Facebook Ads | Instagram Advertising | Meta | Inlogico',
        description: 'Gestione Facebook Ads e Instagram Ads professionale. Campagne Meta advertising ROI garantito. Reach massimo e conversioni.'
      },
      '/servizi/whatsapp-business/': {
        title: 'WhatsApp Business | Automazione Customer Service | Inlogico',
        description: 'WhatsApp Business API e automazione customer service. Marketing conversazionale e chatbot WhatsApp personalizzati.'
      },
      '/servizi/e-commerce/': {
        title: 'E-commerce | Negozi Online WooCommerce Shopify | Inlogico',
        description: 'Sviluppo e-commerce professionali. WooCommerce, Shopify, Magento. Shop online ottimizzati per vendere di più.'
      },
      '/servizi/creazione-app/': {
        title: 'Creazione App Mobile | iOS Android PWA | Inlogico',
        description: 'Sviluppo app mobile native iOS e Android. React Native, Flutter, Progressive Web App. Da idea a App Store.'
      },
      '/servizi/web-design/': {
        title: 'Web Design | UI UX Design Professionale | Inlogico',
        description: 'Web design moderno e UI/UX design ottimizzato. Brand identity, responsive design, wireframing. Design che converte.'
      },
      '/servizi/email-marketing/': {
        title: 'Email Marketing | Newsletter Automation | Inlogico',
        description: 'Email marketing strategico e automazione. Newsletter, DEM campaigns, lead nurturing. Marketing automation avanzato.'
      },
      '/servizi/google-analytics/': {
        title: 'Google Analytics 4 | Tracking Conversioni | Inlogico',
        description: 'Setup Google Analytics 4 e conversion tracking. Google Tag Manager, dashboard personalizzate, analisi ROI.'
      },
      '/servizi/chatbot/': {
        title: 'Chatbot AI | Assistenti Virtuali Intelligenti | Inlogico',
        description: 'Chatbot AI personalizzati per customer service 24/7. Chatbot multicanale WhatsApp, sito web, lead generation.'
      },
      '/servizi/consulenza-digitale/': {
        title: 'Consulenza Digitale | Digital Transformation | Inlogico',
        description: 'Consulenza strategica digitale e digital transformation. Audit digitale, strategia omnicanale, innovazione aziendale.'
      },
      '/servizi/social-commerce/': {
        title: 'Social Commerce | Vendita Instagram TikTok | Inlogico',
        description: 'Social commerce su Instagram Shop, TikTok Shop, Facebook Shop. Live shopping e vendita diretta sui social.'
      },
      '/servizi/privacy-data-marketing/': {
        title: 'Privacy Marketing | Marketing Cookieless GDPR | Inlogico',
        description: 'Marketing cookieless e privacy compliance. First-party data strategy, GDPR compliance, marketing del futuro.'
      },
      '/servizi/green-marketing/': {
        title: 'Green Marketing | Marketing Sostenibile | Inlogico',
        description: 'Green marketing e comunicazione sostenibile. Brand purpose, comunicazione ambientale, marketing responsabile.'
      },
      '/contatti/': {
        title: 'Contatti | Web Agency Roma | Inlogico',
        description: 'Contatta Inlogico Web Agency a Roma. Via Monte della Vecchia Quercia 28/B, Tel: 328.8144105. Preventivo gratuito per siti web, SEO e digital marketing.'
      },
      '/chi-siamo/': {
        title: 'Chi Siamo | Storia Inlogico Web Agency Roma',
        description: 'La storia di Inlogico dal 2006. Web agency Roma con esperienza internazionale. Dove l\'ingegneria incontra la visione.'
      }
    };

    const data = seoData[path] || seoData['/'];
    
    document.title = data.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + path;
  }

  setupAnimations() {
    // Animate elements on scroll
    const observeElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.card, .stat-item, .feature-card').forEach(el => {
        observer.observe(el);
      });
    };

    // Run after a short delay to ensure elements are rendered
    setTimeout(observeElements, 100);
  }

  setupForms() {
    // Handle form submissions
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
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.innerHTML = '<span class="spinner"></span> Invio in corso...';
      submitButton.disabled = true;

      // Simulate form submission (replace with real endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showNotification('Messaggio inviato con successo! Ti ricontatteremo presto.', 'success');
      form.reset();
      
      // Restore button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
    } catch (error) {
      this.showNotification('Errore nell\'invio del messaggio. Riprova più tardi.', 'error');
      console.error('Form submission error:', error);
      
      // Restore button on error
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Invia Richiesta';
        submitButton.disabled = false;
      }
    }
  }

  showLoading() {
    document.body.classList.add('loading');
  }

  hideLoading() {
    document.body.classList.remove('loading');
  }

  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    
    const colors = {
      'success': 'var(--primary)',
      'error': '#ef4444',
      'info': '#3b82f6'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${colors[type]};
      color: white;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
      font-weight: 500;
      max-width: 350px;
      font-size: 14px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// 🚀 INIZIALIZZAZIONE - Environment Detection Automatico
document.addEventListener('DOMContentLoaded', () => {
  const isLocal = window.location.protocol === 'file:';
  console.log(`🌍 Environment: ${isLocal ? 'Local File Mode' : 'Web Server Mode'}`);
  window.app = new InlogicoApp();
});

// 📊 PERFORMANCE MONITORING
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`⚡ Inlogico website fully loaded in ${loadTime.toFixed(2)}ms`);
  
  // Report Core Web Vitals
  if ('web-vitals' in window) {
    import('https://unpkg.com/web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    }).catch(() => {
      // Silently fail if web-vitals cannot be loaded
    });
  }
});

// Service Worker disabled - uncomment when sw.js is ready
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => console.log('SW registered'))
//       .catch(error => console.log('SW registration failed'));
//   });
// }