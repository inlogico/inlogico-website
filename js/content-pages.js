/**
 * INLOGICO - CONTENT PAGES MODULE
 * All page content generators and dynamic content
 * Version: 2.0 - Modular Architecture
 */

class InlogicoContentPages {
  constructor(app) {
    this.app = app;
    this.contentCache = new Map();
    this.init();
  }

  init() {
    console.log('📄 Content Pages module initialized');
  }

  // MAIN CONTENT ROUTER
  
  getPageContent(path) {
    // Check cache first
    if (this.contentCache.has(path)) {
      return this.contentCache.get(path);
    }

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

    const content = pages[path] || this.get404PageContent();
    
    // Cache the content
    this.contentCache.set(path, content);
    
    return content;
  }

  // SERVICES OVERVIEW PAGE
  
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
          ${this.getServicesGrid()}
        </div>
      </section>
    `;
  }

  getServicesGrid() {
    const services = [
      { name: 'SEO & Posizionamento', url: '/servizi/seo/', desc: 'Primi su Google con strategie SEO avanzate', volume: '9.900' },
      { name: 'Sviluppo Siti Web', url: '/servizi/sviluppo-siti-web/', desc: 'Siti web professionali e performanti', volume: '8.100' },
      { name: 'Google Ads', url: '/servizi/google-ads/', desc: 'Campagne pubblicitarie ROI garantito', volume: '6.600' },
      { name: 'Social Media Marketing', url: '/servizi/social-media-marketing/', desc: 'Presenza social strategica e coinvolgente', volume: '4.400' },
      { name: 'E-commerce', url: '/servizi/e-commerce/', desc: 'Shop online completi e ottimizzati', volume: '4.400' },
      { name: 'Intelligenza Artificiale', url: '/servizi/intelligenza-artificiale/', desc: 'AI integration per business competitivi', volume: '4.100' },
      { name: 'Web Design', url: '/servizi/web-design/', desc: 'Design moderno e user experience', volume: '3.600' },
      { name: 'Chatbot', url: '/servizi/chatbot/', desc: 'Assistenti virtuali intelligenti', volume: '3.600' },
      { name: 'Facebook Ads', url: '/servizi/facebook-ads/', desc: 'Advertising Meta professionale', volume: '3.600' },
      { name: 'Email Marketing', url: '/servizi/email-marketing/', desc: 'Newsletter e automazione email', volume: '2.900' },
      { name: 'WhatsApp Business', url: '/servizi/whatsapp-business/', desc: 'Automazione customer service', volume: '2.700' },
      { name: 'Consulenza Digitale', url: '/servizi/consulenza-digitale/', desc: 'Digital transformation strategy', volume: '2.400' },
      { name: 'Google Analytics', url: '/servizi/google-analytics/', desc: 'Tracking e analisi performance', volume: '2.200' },
      { name: 'Creazione App', url: '/servizi/creazione-app/', desc: 'App mobile native e PWA', volume: '1.900' },
      { name: 'Social Commerce', url: '/servizi/social-commerce/', desc: 'Vendita diretta sui social', volume: '1.300' },
      { name: 'Privacy Marketing', url: '/servizi/privacy-data-marketing/', desc: 'Marketing cookieless e GDPR', volume: '900' },
      { name: 'Green Marketing', url: '/servizi/green-marketing/', desc: 'Marketing sostenibile', volume: '480' }
    ];

    return `
      <div class="section-title">
        <h2>Tutti i nostri servizi specializzati</h2>
        <p class="text-muted">17 servizi per coprire ogni aspetto del digital marketing</p>
      </div>
      
      <div class="grid grid-3 stagger-children">
        ${services.map(service => `
          <div class="card">
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <div class="service-meta">
              <span class="volume">${service.volume} ricerche/mese</span>
            </div>
            <a href="${service.url}" class="btn">Scopri di più</a>
          </div>
        `).join('')}
      </div>
      
      <div class="services-cta">
        <h3>Pronto per iniziare?</h3>
        <p>Ogni servizio è progettato per integrarsi perfettamente con gli altri, creando un ecosistema digitale completo.</p>
        <div class="cta-buttons">
          <a href="/contatti/" class="btn btn-large">Consulenza gratuita</a>
          <a href="tel:+39328814105" class="btn btn-outline btn-large">Chiamaci ora</a>
        </div>
      </div>
    `;
  }

  // SEO SERVICE PAGE
  
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
          <div class="grid grid-2 stagger-children">
            <div class="card">
              <h4>🔍 Audit SEO Tecnico</h4>
              <p>Analisi completa del tuo sito per identificare problemi tecnici e opportunità di miglioramento.</p>
            </div>
            <div class="card">
              <h4>🎯 Keyword Research</h4>
              <p>Ricerca approfondita delle parole chiave più performanti per il tuo settore.</p>
            </div>
            <div class="card">
              <h4>📝 Ottimizzazione On-Page</h4>
              <p>Ottimizzazione contenuti, meta tag, struttura URL e fattori on-page.</p>
            </div>
            <div class="card">
              <h4>🔗 Link Building</h4>
              <p>Strategia di acquisizione backlink di qualità per aumentare l'autorità del dominio.</p>
            </div>
          </div>
          
          <div class="services-cta">
            <h3>Quanto costa la SEO?</h3>
            <p>I nostri pacchetti SEO partono da <strong>€800/mese</strong> e includono audit tecnico completo, ottimizzazione pagine, articoli SEO e report mensili.</p>
            <a href="/contatti/" class="btn btn-large">Richiedi preventivo</a>
          </div>
        </div>
      </section>
    `;
  }

  // GOOGLE ADS SERVICE PAGE
  
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
          
          <div class="grid grid-2 stagger-children">
            <div class="card">
              <h4>🔍 Campagne Search</h4>
              <p>Annunci testuali che appaiono quando gli utenti cercano i tuoi prodotti/servizi.</p>
            </div>
            <div class="card">
              <h4>🛒 Google Shopping</h4>
              <p>Vetrina prodotti con immagini, prezzi e recensioni per e-commerce.</p>
            </div>
            <div class="card">
              <h4>📺 YouTube Ads</h4>
              <p>Video advertising sulla piattaforma video più grande al mondo.</p>
            </div>
            <div class="card">
              <h4>🌐 Display Network</h4>
              <p>Banner visivi su oltre 2 milioni di siti web e app partner Google.</p>
            </div>
          </div>
          
          <div class="services-cta">
            <h3>ROI Garantito</h3>
            <p>La gestione Google Ads parte da <strong>€500/mese</strong> + budget pubblicità. Setup account incluso e primo mese gestione gratis.</p>
            <a href="/contatti/" class="btn btn-large">Inizia subito</a>
          </div>
        </div>
      </section>
    `;
  }

  // SVILUPPO SITI WEB PAGE
  
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
          
          <div class="grid grid-3 stagger-children">
            <div class="card">
              <h4>🏢 Siti Web Aziendali</h4>
              <p>Presenza digitale professionale per aziende che vogliono crescere online. Design responsive e SEO ottimizzato.</p>
            </div>
            <div class="card">
              <h4>🛒 E-commerce</h4>
              <p>Negozi online completi per vendere prodotti e servizi. WooCommerce, Shopify, pagamenti sicuri.</p>
            </div>
            <div class="card">
              <h4>⚡ Web Application</h4>
              <p>Applicazioni web custom per esigenze specifiche. Sviluppo su misura con tecnologie moderne.</p>
            </div>
          </div>
          
          <div class="services-cta">
            <h3>Prezzi Trasparenti</h3>
            <p>Siti web aziendali da <strong>€1.500</strong>, e-commerce da <strong>€3.500</strong>. Include hosting, dominio e supporto.</p>
            <a href="/contatti/" class="btn btn-large">Richiedi preventivo</a>
          </div>
        </div>
      </section>
    `;
  }

  // AI SERVICE PAGE
  
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
          
          <div class="grid grid-2 stagger-children">
            <div class="card">
              <h4>🤖 Chatbot AI Personalizzati</h4>
              <p>Assistenti virtuali intelligenti per customer service automatizzato 24/7 e lead generation.</p>
            </div>
            <div class="card">
              <h4>⚡ Marketing Automation</h4>
              <p>Automazione campagne marketing con AI per personalizzazione e targeting avanzato.</p>
            </div>
            <div class="card">
              <h4>📊 Predictive Analytics</h4>
              <p>Analisi predittiva per anticipare trend di mercato e comportamenti clienti.</p>
            </div>
            <div class="card">
              <h4>🔧 Process Automation</h4>
              <p>Automazione processi aziendali con AI per efficienza e riduzione costi operativi.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // CONTACT PAGE
  
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
            <div class="slide-in-left">
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
            
            <div class="card slide-in-right">
              <h3>Richiedi informazioni</h3>
              ${this.getContactForm()}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getContactForm() {
    return `
      <form id="contact-form">
        <div style="margin-bottom: 1rem;">
          <label for="name">Nome *</label>
          <input type="text" id="name" name="name" required style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: 6px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" required style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: 6px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label for="service">Servizio di interesse</label>
          <select id="service" name="service" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: 6px;">
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
          <textarea id="message" name="message" required rows="4" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid var(--border); border-radius: 6px; resize: vertical;"></textarea>
        </div>
        
        <button type="submit" class="btn btn-large" style="width: 100%;">
          Invia Richiesta
        </button>
      </form>
    `;
  }

  // ABOUT PAGE
  
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
          
          <div class="grid md:grid-2 stagger-children">
            <div class="card">
              <h4>🎯 La nostra missione</h4>
              <p>Trasformare la complessità digitale in semplicità, i dati in storie, le idee in imperi digitali misurabili.</p>
            </div>
            <div class="card">
              <h4>💎 I nostri valori</h4>
              <p>Innovazione costante, approccio ingegneristico, risultati misurabili e partnership durature con i clienti.</p>
            </div>
          </div>
          
          <div class="services-cta">
            <h3>Esperienza Internazionale</h3>
            <p>17 anni di progetti attraverso 15+ paesi, dall'Italia all'Europa, dalle startup alle multinazionali.</p>
            <a href="/contatti/" class="btn btn-large">Inizia il tuo progetto</a>
          </div>
        </div>
      </section>
    `;
  }

  // 404 PAGE
  
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

  // ABBREVIATED SERVICE PAGES (for space - full versions would be much longer)
  
  getSocialMediaPageContent() {
    return this.getServicePageTemplate(
      'Social Media Marketing | Gestione Social Completa',
      'Presenza social strategica e coinvolgente. Content creation, influencer marketing e social advertising per engagement massimo.',
      [
        { title: '📱 Gestione Social Media', desc: 'Gestione completa Facebook, Instagram, LinkedIn, TikTok e YouTube con content strategy personalizzata.' },
        { title: '🤝 Influencer Marketing', desc: 'Campagne influencer marketing strategiche con micro e macro influencer del tuo settore.' },
        { title: '🎨 Content Creation', desc: 'Creazione contenuti visual e video professionali ottimizzati per ogni piattaforma social.' }
      ]
    );
  }

  getFacebookAdsPageContent() {
    return this.getServicePageTemplate(
      'Facebook Ads | Instagram Advertising | Meta',
      'Campagne Facebook e Instagram Ads strategiche per reach massimo e conversioni garantite.',
      [
        { title: '📘 Facebook Ads', desc: 'Campagne pubblicitarie su Facebook per lead generation, vendite e brand awareness.' },
        { title: '📷 Instagram Ads', desc: 'Visual advertising su Instagram per coinvolgere audience giovani e trend-conscious.' },
        { title: '🛒 Meta Shop', desc: 'Integrazione Facebook Shop e Instagram Shopping per vendita diretta sui social.' }
      ]
    );
  }

  getWhatsAppPageContent() {
    return this.getServicePageTemplate(
      'WhatsApp Business | Automazione Customer Service',
      'WhatsApp Business API, automazione customer service e marketing conversazionale.',
      [
        { title: '📱 WhatsApp Business API', desc: 'Integrazione API ufficiale per automazione avanzata e gestione multi-operatore.' },
        { title: '🤖 Customer Service Automation', desc: 'Chatbot intelligenti per rispondere automaticamente alle domande frequenti 24/7.' },
        { title: '💬 Marketing Conversazionale', desc: 'Campagne marketing via WhatsApp con messaggi personalizzati e interattivi.' }
      ]
    );
  }

  // Service page template generator
  getServicePageTemplate(title, description, features) {
    return `
      <section class="hero">
        <div class="container">
          <h1>${title}</h1>
          <p>${description}</p>
          <div class="hero-cta">
            <a href="/contatti/" class="btn btn-large">Richiedi informazioni</a>
          </div>
        </div>
      </section>
      
      <section class="services">
        <div class="container">
          <div class="grid grid-3 stagger-children">
            ${features.map(feature => `
              <div class="card">
                <h4>${feature.title}</h4>
                <p>${feature.desc}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="services-cta">
            <h3>Inizia subito</h3>
            <p>Contattaci per una consulenza gratuita e scopri come questo servizio può far crescere il tuo business.</p>
            <a href="/contatti/" class="btn btn-large">Contattaci ora</a>
          </div>
        </div>
      </section>
    `;
  }

  // Simplified generators for other services
  getEcommercePageContent() {
    return this.getServicePageTemplate(
      'E-commerce | Negozi Online Professionali',
      'Shop online completi e ottimizzati per vendere di più. WooCommerce, Shopify, Magento e custom.',
      [
        { title: '🛒 WooCommerce', desc: 'E-commerce WordPress personalizzabile, SEO-friendly e con migliaia di plugin disponibili.' },
        { title: '🏪 Shopify', desc: 'Piattaforma cloud affidabile e veloce, ideale per startup e scale-up dell\'e-commerce.' },
        { title: '⚙️ E-commerce Custom', desc: 'Sviluppo su misura per esigenze specifiche e integrazioni complesse con gestionali.' }
      ]
    );
  }

  getAppPageContent() {
    return this.getServicePageTemplate(
      'Creazione App Mobile | iOS, Android, PWA',
      'App mobile native e Progressive Web App per iOS e Android.',
      [
        { title: '📱 App Native', desc: 'Sviluppo app native per performance massime e accesso completo alle funzioni del device.' },
        { title: '⚡ React Native & Flutter', desc: 'App cross-platform con codice condiviso per ridurre tempi e costi di sviluppo.' },
        { title: '🌐 Progressive Web App', desc: 'PWA che funzionano come app native ma si installano dal browser senza store.' }
      ]
    );
  }

  getWebDesignPageContent() {
    return this.getServicePageTemplate(
      'Web Design | UI/UX Design Professionale',
      'Design moderno e user experience ottimizzata. UI/UX design, brand identity e wireframing.',
      [
        { title: '🎨 UI/UX Design', desc: 'User interface e user experience design centrati sull\'utente per massimizzare conversioni.' },
        { title: '🏷️ Brand Identity', desc: 'Logo design, visual identity e brand guidelines per comunicazione coerente e memorabile.' },
        { title: '📱 Responsive Design', desc: 'Design ottimizzato per tutti i device: desktop, tablet, mobile con approccio mobile-first.' }
      ]
    );
  }

  getEmailMarketingPageContent() {
    return this.getServicePageTemplate(
      'Email Marketing | Newsletter & Automation',
      'Email marketing strategico con automazione avanzata. Newsletter, DEM, lead nurturing.',
      [
        { title: '📧 Newsletter Automatizzate', desc: 'Newsletter automatiche segmentate per mantenere il contatto con i tuoi clienti.' },
        { title: '⚡ Marketing Automation', desc: 'Workflow automatici per lead nurturing, onboarding clienti e recupero carrelli abbandonati.' },
        { title: '📬 DEM Campaigns', desc: 'Direct Email Marketing campaigns per promozioni, eventi e lancio prodotti.' }
      ]
    );
  }

  getAnalyticsPageContent() {
    return this.getServicePageTemplate(
      'Google Analytics 4 | Tracking & Analisi',
      'Setup Google Analytics 4, conversion tracking e dashboard personalizzate per ROI misurabili.',
      [
        { title: '📊 Google Analytics 4 Setup', desc: 'Configurazione completa GA4 con eventi personalizzati e conversion tracking avanzato.' },
        { title: '🏷️ Google Tag Manager', desc: 'Implementazione GTM per gestione tag centralizzata e tracking eventi senza sviluppatori.' },
        { title: '📈 Dashboard Personalizzate', desc: 'Report automatici e dashboard su misura per monitorare le metriche che contano.' }
      ]
    );
  }

  getChatbotPageContent() {
    return this.getServicePageTemplate(
      'Chatbot Intelligenti | AI Customer Service',
      'Chatbot AI personalizzati per customer service automatizzato 24/7 e lead generation.',
      [
        { title: '🤖 Chatbot Personalizzati', desc: 'Chatbot AI addestrati sui tuoi dati per rispondere come un esperto del tuo settore.' },
        { title: '🌐 Chatbot Multicanale', desc: 'Integrazione su sito web, WhatsApp, Facebook Messenger, Telegram per presenza ovunque.' },
        { title: '🎯 Lead Generation Bot', desc: 'Chatbot specializzati nella qualificazione lead e prenotazione appuntamenti automatica.' }
      ]
    );
  }

  getConsulenzaPageContent() {
    return this.getServicePageTemplate(
      'Consulenza Digitale | Digital Transformation',
      'Consulenza strategica digitale per digital transformation, audit completo e strategia omnicanale.',
      [
        { title: '🚀 Digital Transformation', desc: 'Strategia di trasformazione digitale per modernizzare processi e competere nell\'era digitale.' },
        { title: '🔍 Audit Digitale Completo', desc: 'Analisi approfondita della presenza digitale attuale con piano d\'azione prioritario.' },
        { title: '🎯 Strategia Omnicanale', desc: 'Coordinamento di tutti i touchpoint digitali per customer experience coerente e integrata.' }
      ]
    );
  }

  getSocialCommercePageContent() {
    return this.getServicePageTemplate(
      'Social Commerce | Vendita sui Social',
      'Vendita diretta su Instagram, TikTok Shop e Facebook Shop per commerce innovativo.',
      [
        { title: '📷 Instagram Shopping', desc: 'Integrazione Instagram Shop per vendita diretta con tag prodotti e checkout nativo.' },
        { title: '🎵 TikTok Shop', desc: 'Setup TikTok Shop per raggiungere la Gen Z e vendere attraverso video virali.' },
        { title: '📺 Live Shopping', desc: 'Eventi live shopping interattivi per engagement massimo e conversioni immediate.' }
      ]
    );
  }

  getPrivacyDataPageContent() {
    return this.getServicePageTemplate(
      'Privacy Marketing | Marketing Cookieless',
      'Marketing senza cookie, GDPR compliance e first-party data strategy per il futuro.',
      [
        { title: '🔒 Marketing Cookieless', desc: 'Strategie marketing senza cookie di terze parti per compliance e performance sostenibili.' },
        { title: '📊 First-Party Data', desc: 'Raccolta e utilizzo strategico di first-party data per personalizzazione e targeting.' },
        { title: '⚖️ GDPR Compliance', desc: 'Compliance completa GDPR con consent management e privacy by design.' }
      ]
    );
  }

  getGreenMarketingPageContent() {
    return this.getServicePageTemplate(
      'Green Marketing | Marketing Sostenibile',
      'Marketing sostenibile, comunicazione ambientale e brand responsabili per il futuro.',
      [
        { title: '🌱 Marketing Sostenibile', desc: 'Strategie marketing che promuovono sostenibilità ambientale e responsabilità sociale.' },
        { title: '🌍 Comunicazione Ambientale', desc: 'Storytelling autentico per comunicare impegno ambientale senza greenwashing.' },
        { title: '🎯 Brand Purpose', desc: 'Definizione e comunicazione del purpose aziendale per brand con impatto positivo.' }
      ]
    );
  }

  // CACHE MANAGEMENT
  
  clearCache() {
    this.contentCache.clear();
  }

  getCacheSize() {
    return this.contentCache.size;
  }

  preloadContent(paths) {
    paths.forEach(path => {
      if (!this.contentCache.has(path)) {
        this.getPageContent(path);
      }
    });
  }
}

// Add CSS for service volume display
InlogicoUtils.addCSS(`
  .service-meta {
    margin: 1rem 0;
    padding: 0.5rem;
    background: var(--bg-light, #f8f9fa);
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--text-light, #666);
  }
  
  .volume {
    font-weight: 600;
    color: var(--accent, #3b82f6);
  }
`);

// Make available globally
window.InlogicoContentPages = InlogicoContentPages;