/**
 * INLOGICO - ROUTER MODULE
 * SPA routing system with SEO support
 * Version: 2.0 - Modular Architecture
 */

class InlogicoRouter {
  constructor(app) {
    this.app = app;
    this.routes = new Map();
    this.beforeRouteChange = [];
    this.afterRouteChange = [];
    
    this.init();
  }

  init() {
    // Only setup SPA router for web server mode
    if (!this.app.isLocal) {
      console.log('🌐 Enabling SPA router for web server mode');
      this.setupSPARouting();
      
      // Load initial content if needed
      if (this.app.currentPage !== '/') {
        this.loadPage(this.app.currentPage);
      }
    } else {
      console.log('📄 Local file mode detected - using fallback navigation');
      this.setupLocalFileNavigation();
    }
  }

  setupSPARouting() {
    // Handle internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.hasAttribute('target') && !link.hasAttribute('data-external')) {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigateTo(path);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.loadPage(window.location.pathname, false);
    });
  }

  setupLocalFileNavigation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        const href = link.getAttribute('href');
        
        // Allow home and anchor links
        if (href !== '/' && !href.startsWith('/#')) {
          e.preventDefault();
          this.app.showNotification(
            '⚡ Per navigare tra tutte le pagine, apri il sito da un server web locale', 
            'info'
          );
        }
      }
    });
  }

  async navigateTo(path, addToHistory = true) {
    if (path === this.app.currentPage) return;
    
    try {
      // Execute before route change hooks
      for (const hook of this.beforeRouteChange) {
        const result = await hook(path, this.app.currentPage);
        if (result === false) return; // Cancel navigation
      }

      if (addToHistory) {
        history.pushState({ path }, '', path);
      }
      
      await this.loadPage(path, addToHistory);
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.app.showNotification('Errore di navigazione', 'error');
    }
  }

  async loadPage(path, updateHistory = true) {
    try {
      this.app.showLoading();
      
      // Get page content
      const content = await this.getPageContent(path);
      
      // Update main content
      const mainContent = InlogicoUtils.$('#main-content');
      if (mainContent) {
        mainContent.innerHTML = content;
      }
      
      // Update app state
      this.app.setCurrentPage(path);
      
      // Update SEO
      this.updateSEO(path);
      
      // Re-setup animations for new content
      if (this.app.animations) {
        this.app.animations.setupScrollAnimations();
      }
      
      // Execute after route change hooks
      for (const hook of this.afterRouteChange) {
        await hook(path);
      }
      
      this.app.hideLoading();
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error loading page:', error);
      this.app.showNotification('Errore nel caricamento della pagina', 'error');
      this.app.hideLoading();
    }
  }

  async getPageContent(path) {
    // Check if content pages module is available
    if (this.app.contentPages) {
      return this.app.contentPages.getPageContent(path);
    }
    
    // Fallback content
    return this.getBasicPageContent(path);
  }

  getBasicPageContent(path) {
    const pages = {
      '/servizi/': `
        <section class="hero">
          <div class="container">
            <h1>I Nostri Servizi</h1>
            <p>Soluzioni digitali complete per la tua crescita online.</p>
          </div>
        </section>
      `,
      '/contatti/': `
        <section class="hero">
          <div class="container">
            <h1>Contatti</h1>
            <p>Parliamo del tuo progetto digitale.</p>
          </div>
        </section>
      `,
      '/chi-siamo/': `
        <section class="hero">
          <div class="container">
            <h1>Chi Siamo</h1>
            <p>La storia di Inlogico dal 2006.</p>
          </div>
        </section>
      `
    };

    return pages[path] || this.get404Content();
  }

  get404Content() {
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
    const seoData = this.getSEOData();
    const data = seoData[path] || seoData['/'];
    
    // Update title
    document.title = data.title;
    
    // Update meta description
    const metaDescription = InlogicoUtils.$('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description);
    }

    // Update canonical URL
    let canonical = InlogicoUtils.$('link[rel="canonical"]');
    if (!canonical) {
      canonical = InlogicoUtils.createElement('link', {
        attributes: { rel: 'canonical' }
      });
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + path;

    // Update Open Graph
    this.updateOpenGraph(data, path);
  }

  updateOpenGraph(data, path) {
    const ogTags = {
      'og:title': data.title,
      'og:description': data.description,
      'og:url': window.location.origin + path,
      'og:type': 'website'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = InlogicoUtils.$(`meta[property="${property}"]`);
      if (!meta) {
        meta = InlogicoUtils.createElement('meta', {
          attributes: { property, content }
        });
        document.head.appendChild(meta);
      } else {
        meta.setAttribute('content', content);
      }
    });
  }

  getSEOData() {
    return {
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
      '/contatti/': {
        title: 'Contatti | Web Agency Roma | Inlogico',
        description: 'Contatta Inlogico Web Agency a Roma. Via Monte della Vecchia Quercia 28/B, Tel: 328.8144105. Preventivo gratuito per siti web, SEO e digital marketing.'
      },
      '/chi-siamo/': {
        title: 'Chi Siamo | Storia Inlogico Web Agency Roma',
        description: 'La storia di Inlogico dal 2006. Web agency Roma con esperienza internazionale. Dove l\'ingegneria incontra la visione.'
      }
    };
  }

  // Route hooks for advanced functionality
  beforeRoute(callback) {
    this.beforeRouteChange.push(callback);
  }

  afterRoute(callback) {
    this.afterRouteChange.push(callback);
  }

  // Route registration for dynamic routes
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  removeRoute(path) {
    this.routes.delete(path);
  }

  // URL utilities
  getCurrentPath() {
    return window.location.pathname;
  }

  getQueryParams() {
    return new URLSearchParams(window.location.search);
  }

  getHashParams() {
    return window.location.hash.slice(1);
  }

  // Navigation utilities
  goBack() {
    window.history.back();
  }

  goForward() {
    window.history.forward();
  }

  reload() {
    window.location.reload();
  }

  redirect(url, external = false) {
    if (external) {
      window.location.href = url;
    } else {
      this.navigateTo(url);
    }
  }
}

// Make available globally
window.InlogicoRouter = InlogicoRouter;