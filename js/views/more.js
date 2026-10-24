/* ==========================================================================
   VIEW: MORE (OPERATIONS HUB) — LUMORA DESIGN & INDIAN MARKET
   Pastel Glassmorphic Navigation Grid to All Kitchen Operations & Settings
   Includes EOD 11:50 PM Backup Email Config, Dark Mode & Account Logout
   ========================================================================== */

const MoreView = {
  openCategories: new Set(['cat-studio']),

  toggleCategory(catId) {
    const card = document.getElementById(catId);
    if (!card) return;
    const isExpanded = card.classList.contains('expanded');
    if (isExpanded) {
      card.classList.remove('expanded');
      this.openCategories.delete(catId);
    } else {
      card.classList.add('expanded');
      this.openCategories.add(catId);
    }
  },

  render() {
    const store = window.bakeryStore;
    const profile = store.getProfile();
    const eodSettings = store.getEodReportSettings();
    const isDark = document.body.classList.contains('dark-mode') || document.documentElement.getAttribute('data-theme') === 'dark';
    const userSession = store.currentUser || { email: profile.email || 'baker@gmail.com', businessName: profile.name };
    const logoSrc = profile.logo || 'assets/bakepilot-logo.png';
    const isInstalled = typeof window.isAppInstalled === 'function' ? window.isAppInstalled() : (
      (window.matchMedia && (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches
      )) ||
      window.navigator.standalone === true ||
      (window.location.search && (window.location.search.includes('source=pwa') || window.location.search.includes('mode=standalone'))) ||
      (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:' ||
      (window.navigator.userAgent && /Capacitor|wv/i.test(window.navigator.userAgent)) ||
      (function(){ try { return localStorage.getItem('bakepilot_installed_mode') === 'true'; } catch(e){ return false; } })()
    );

    // Categorized Accordion Groups for Compact, Organized Mobile Navigation
    const categories = [
      {
        id: 'cat-studio',
        title: 'Studio Setup & Brand Identity',
        desc: 'Operating hours, logo, UPI QR & invoice customizer',
        icon: 'store',
        items: [
          {
            id: 'workspace',
            title: 'Kitchen Studio Setup',
            desc: 'Operating hours, order cutoffs, pickup address & prep times',
            icon: 'clock',
            badge: 'Studio',
            badgeClass: 'badge-mint'
          },
          {
            id: 'branding',
            title: 'Logo & Brand Identity',
            desc: 'Logo upload, UPI QR code, FSSAI registration & bill notes',
            icon: 'award',
            badge: 'Identity',
            badgeClass: 'badge-rose'
          },
          {
            id: 'invoice-config',
            title: 'Invoice Layout & Custom Fields',
            desc: 'Customize fields on bills: FSSAI, UPI, notes, address & social',
            icon: 'file-text',
            badge: 'Customizer',
            badgeClass: 'badge-mint',
            onClick: 'MoreView.openInvoiceSettingsModal()'
          }
        ]
      },
      {
        id: 'cat-kitchen',
        title: 'Kitchen, Pantry & Recipes',
        desc: 'Menu items, recipe costing, ingredients & expenses',
        icon: 'cake',
        items: [
          {
            id: 'catalogue',
            title: 'Menu Catalogue & Variants',
            desc: 'Brownies, celebration cakes & flavour variants',
            icon: 'book-open',
            badgeClass: 'badge-lavender'
          },
          {
            id: 'recipes',
            title: 'Recipe Cost Estimator',
            desc: 'Compound, butter, packaging boxes & labor costing',
            icon: 'calculator',
            badgeClass: 'badge-yellow'
          },
          {
            id: 'inventory',
            title: 'Pantry Stock & Prices',
            desc: 'Compounds, maida, essence rates & packaging boxes',
            icon: 'package',
            badgeClass: 'badge-peach'
          },
          {
            id: 'expenses',
            title: 'Kitchen Expenses & Gas Rates',
            desc: 'Wholesale ingredients, 19kg cylinder, power bills & receipts',
            icon: 'wallet',
            badgeClass: 'badge-rose'
          }
        ]
      },
      {
        id: 'cat-finance',
        title: 'Finances & Daily Reports',
        desc: 'Cash drawer, sales trends & automated EOD delivery',
        icon: 'bar-chart-2',
        items: [
          {
            id: 'cashbook',
            title: 'Cashbook Drawer',
            desc: 'Counter cash float, POS cash-in & cash-out ledger',
            icon: 'banknote',
            badgeClass: 'badge-yellow'
          },
          {
            id: 'reports',
            title: 'Sales & Analytics',
            desc: 'Weekly revenue trends, item margins & CSV exports',
            icon: 'pie-chart',
            badgeClass: 'badge-lavender'
          },
          {
            id: 'eod-config',
            title: 'Automated 11:50 PM Backup Report',
            desc: 'Configure nightly sales report frequency & recipient email',
            icon: 'mail-check',
            badge: 'Automated',
            badgeClass: 'badge-mint',
            onClick: 'MoreView.openEodSettingsModal()'
          }
        ]
      },
      {
        id: 'cat-network',
        title: 'Clients & Bakery Vendors',
        desc: 'Customer VIP profiles, WhatsApp chat & wholesale suppliers',
        icon: 'users',
        items: [
          {
            id: 'customers',
            title: 'Bakery Clients',
            desc: 'VIP club, phone numbers, WhatsApp & order histories',
            icon: 'heart-handshake',
            badgeClass: 'badge-mint'
          },
          {
            id: 'suppliers',
            title: 'Bakery Vendors',
            desc: 'Dairy distributors, packaging corrugators & wholesale suppliers',
            icon: 'truck',
            badgeClass: 'badge-peach'
          }
        ]
      },
      {
        id: 'cat-platform',
        title: 'Platform, Support & Privacy',
        desc: 'Cloud sync, feature wishlist & 100% confidential policy',
        icon: 'shield-check',
        items: [
          {
            id: 'settings',
            title: 'Settings & Cloud Storage',
            desc: 'Currency, delivery defaults, backup downloads & cloud sync',
            icon: 'settings',
            badge: 'Cloud Sync',
            badgeClass: 'badge-mint'
          },
          {
            id: 'feature-wishlist',
            title: 'Request a Feature for Future Updates',
            desc: 'Need a specific tool or option? Submit your ideas to the team',
            icon: 'sparkles',
            badge: 'Wishlist',
            badgeClass: 'badge-yellow',
            onClick: 'MoreView.openFeatureWishlistModal()'
          },
          {
            id: 'terms-confidentiality',
            title: 'Data Confidentiality & Privacy Terms',
            desc: 'Isolated cloud databases, 100% recipe ownership & cryptographic security',
            icon: 'lock',
            badge: '100% Private',
            badgeClass: 'badge-mint',
            onClick: 'LoginView.openTermsModal()'
          }
        ]
      }
    ];

    const totalModules = categories.reduce((acc, cat) => acc + cat.items.length, 0);

    return `
      <div class="more-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Business & Baker Profile Header -->
        <div class="bento-card" style="padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--bg-card); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1.5px solid var(--border-light); padding: 2px;">
              <img src="${logoSrc}" alt="BakePilot" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;" onerror="this.src='assets/bakepilot-logo.png'" />
            </div>
            <div style="min-width: 0;">
              <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0; word-break: break-word;">
                ${profile.name || userSession.businessName || 'BakePilot Patisserie'}
              </h3>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">
                ${profile.tagline || 'Artisan Patisserie & Cloud Kitchen'}
              </div>
              <div style="font-size: 11px; color: var(--text-faint); margin-top: 2px;">
                Account: <strong>${userSession.email || 'baker@gmail.com'}</strong>
              </div>
            </div>
          </div>

          <button onclick="BakeryUI.toggleDarkMode()" class="btn-3d btn-3d-secondary" style="padding: 8px 12px; font-size: 11.5px; flex-shrink: 0;" title="Toggle Dark / Light Theme">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" style="width: 14px; height: 14px;"></i>
            <span>${isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <!-- Studio Fresh Bakes Visual Banner (Delightful, appetizing atmosphere) -->
        <div class="bento-card" style="padding: 12px 14px; background: linear-gradient(135deg, rgba(232, 210, 196, 0.28) 0%, rgba(247, 239, 231, 0.65) 100%); display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1.5px solid var(--border-light);">
          <div style="min-width: 0;">
            <div style="font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-deep);">
              Bakery Command Suite
            </div>
            <div style="font-size: 14px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin-top: 2px;">
              Baked with Passion. Built for Growth.
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
              WhatsApp bills • 11:50 PM automated reports • Cloud sync
            </div>
          </div>
          <div style="width: 60px; height: 60px; border-radius: 16px; overflow: hidden; flex-shrink: 0; border: 2px solid #FFFFFF; box-shadow: var(--shadow-bento);">
            <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80" alt="Bakery Studio" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>

        <!-- Automated EOD 11:50 PM Backup Report Tile -->
        <div class="bento-card" style="padding: 14px 16px; background: var(--bg-card); border-left: 4px solid var(--c-primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div style="width: 100%;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="mail-check" style="width: 16px; height: 16px; color: var(--c-primary);"></i>
                  <h4 style="font-size: 14px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0;">
                    Automated EOD 11:50 PM Report & Backup
                  </h4>
                </div>
                <span class="status-badge badge-mint" style="font-size: 10px; padding: 2px 7px;">Active</span>
              </div>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px; line-height: 1.35;">
                Every night at <strong>11:50 PM</strong>, full day's sales, bills & encrypted JSON backup are sent to your designated email.
              </p>
              
              <!-- Recipient & Schedule with 1-Tap Edit Email Button -->
              <div style="display: flex; gap: 8px; margin-top: 8px; font-size: 11.5px; color: var(--text-muted); align-items: center; flex-wrap: wrap; background: var(--c-sand); padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border-light);">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
                  <span>Schedule: <strong style="color: var(--text-main); text-transform: capitalize;">${eodSettings.frequency || 'Daily'}</strong></span>
                </span>
                <span>•</span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="mail" style="width: 12px; height: 12px;"></i>
                  <span>To: <strong style="color: var(--text-main); word-break: break-all;">${eodSettings.email || userSession.email}</strong></span>
                </span>
                <button onclick="MoreView.openEditEmailModal()" class="btn-3d btn-3d-secondary btn-3d-xs" style="padding: 3px 8px; font-size: 10px; margin-left: auto;">
                  <i data-lucide="edit-3" style="width: 11px; height: 11px;"></i>
                  <span>Edit Email</span>
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button onclick="MoreView.openEodSettingsModal()" class="btn-3d btn-3d-secondary" style="flex: 1; padding: 7px 10px; font-size: 11.5px;">
              <i data-lucide="sliders" style="width: 13px; height: 13px;"></i>
              <span>Frequency & Options</span>
            </button>
            <button onclick="MoreView.triggerTestReport()" class="btn-3d btn-3d-primary" style="flex: 1; padding: 7px 10px; font-size: 11.5px;">
              <i data-lucide="send" style="width: 13px; height: 13px;"></i>
              <span>Send Test Backup</span>
            </button>
          </div>
        </div>

        <!-- Sample Demo vs Clean Slate Workspace Tile -->
        <div class="bento-card" style="padding: 14px 16px; border-left: 4px solid var(--c-deep);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 7px;">
              <i data-lucide="database" style="width: 16px; height: 16px; color: var(--c-deep);"></i>
              <h4 style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0;">
                Business Workspace Data
              </h4>
            </div>
            <span class="status-badge badge-lavender" style="font-size: 9.5px;">Demo / Live</span>
          </div>
          <p style="font-size: 11.5px; color: var(--text-muted); margin: 2px 0 10px; line-height: 1.35;">
            New accounts start completely blank for live business. You can load sample demo numbers anytime or clear everything back to clean.
          </p>
          <div style="display: flex; gap: 8px;">
            <button onclick="MoreView.handleLoadDemo()" class="btn-3d btn-3d-secondary" style="flex: 1; padding: 7px 10px; font-size: 11.5px;">
              <i data-lucide="sparkles" style="width: 13px; height: 13px;"></i>
              <span>Load Demo Stats</span>
            </button>
            <button onclick="MoreView.handleClearSlate()" class="btn-3d btn-3d-secondary" style="flex: 1; padding: 7px 10px; font-size: 11.5px; color: var(--error);">
              <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              <span>Clear to Clean Slate</span>
            </button>
          </div>
        </div>

        <!-- Categorized Operations Accordion System -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 4px 0;">
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;">
            Kitchen Operations & Settings
          </div>
          <span style="font-size: 11px; color: var(--text-faint); font-weight: 700;">${categories.length} Categories • ${totalModules} Tools</span>
        </div>

        <!-- Accordion Categories Container -->
        <div class="accordion-container" style="display: flex; flex-direction: column; gap: 4px;">
          ${categories.map(cat => {
            const isOpen = MoreView.openCategories.has(cat.id);
            return `
              <div class="accordion-category-card ${isOpen ? 'expanded' : ''}" id="${cat.id}">
                <div class="accordion-category-header" onclick="MoreView.toggleCategory('${cat.id}')" role="button" tabindex="0">
                  <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <div style="width: 38px; height: 38px; border-radius: 12px; background: rgba(212, 175, 55, 0.12); border: 1.5px solid rgba(212, 175, 55, 0.28); color: var(--brand-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <i data-lucide="${cat.icon}" style="width: 18px; height: 18px;"></i>
                    </div>
                    <div style="min-width: 0;">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <h4 style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0;">${cat.title}</h4>
                        <span style="font-size: 9.5px; font-weight: 700; background: var(--bg-card-subtle); color: var(--text-muted); padding: 1px 6px; border-radius: 8px; border: 1px solid var(--border-light);">${cat.items.length}</span>
                      </div>
                      <p style="font-size: 11px; color: var(--text-muted); margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cat.desc}</p>
                    </div>
                  </div>
                  <i data-lucide="chevron-down" class="accordion-chevron" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
                </div>

                <div class="accordion-category-body">
                  ${cat.items.map(item => `
                    <div 
                      onclick="${item.onClick ? item.onClick : (item.id === 'invoice-config' ? 'MoreView.openInvoiceSettingsModal()' : `window.bakeryApp.navigate('${item.id}')`)}" 
                      class="accordion-sub-item"
                      role="button"
                      tabindex="0"
                    >
                      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                        <div style="width: 32px; height: 32px; border-radius: 10px; background: var(--bg-card); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-light); color: var(--brand-accent);">
                          <i data-lucide="${item.icon}" style="width: 15px; height: 15px;"></i>
                        </div>
                        <div style="min-width: 0;">
                          <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">${item.title}</span>
                            ${item.badge ? `<span class="status-badge ${item.badgeClass || 'badge-mint'}" style="font-size: 9px; padding: 1px 5px;">${item.badge}</span>` : ''}
                          </div>
                          <p style="font-size: 11px; color: var(--text-muted); margin: 1px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.desc}</p>
                        </div>
                      </div>
                      <i data-lucide="chevron-right" style="width: 14px; height: 14px; color: var(--text-faint); flex-shrink: 0;"></i>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Mobile App Status / Installation Card (v1.1.43) -->
        ${isInstalled ? `
        <!-- Installed App Status Badge (v1.1.43 Official Mobile Release) -->
        <div class="bento-card" style="padding: 13px 16px; margin-top: 4px; background: linear-gradient(135deg, rgba(39, 174, 96, 0.08) 0%, rgba(212, 175, 55, 0.06) 100%); border: 1.5px solid rgba(39, 174, 96, 0.3); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 42px; height: 42px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1.5px solid #27AE60; box-shadow: 0 4px 10px rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; background: #1C171A;">
              <img src="assets/bakepilot-logo.png" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/icon-192.png'" />
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 13px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">BakePilot App Installed</span>
                <span class="status-badge badge-mint" style="font-size: 9.5px; padding: 2px 7px; display: inline-flex; align-items: center; gap: 3px;">
                  <i data-lucide="check" style="width: 11px; height: 11px;"></i>
                  <span>Active</span>
                </span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Version 1.1.43 • Mobile Studio Suite</div>
            </div>
          </div>
          <div style="flex-shrink: 0;">
            <span style="font-size: 10.5px; font-weight: 800; color: #27AE60; background: rgba(39, 174, 96, 0.12); padding: 4px 9px; border-radius: 9999px; border: 1px solid rgba(39, 174, 96, 0.25); display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="shield-check" style="width: 12px; height: 12px;"></i>
              <span>v1.1.43</span>
            </span>
          </div>
        </div>
        ` : `
        <!-- Mobile App Installation Card (Browser Mode) -->
        <div class="bento-card" style="padding: 14px 16px; margin-top: 4px; background: linear-gradient(135deg, rgba(28, 23, 26, 0.04) 0%, rgba(212, 175, 55, 0.08) 100%); border: 1.5px solid rgba(212, 175, 55, 0.35); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 44px; height: 44px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1.5px solid #D4AF37; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <img src="assets/bakepilot-logo.png" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/icon-192.png'" />
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">Install Mobile App</span>
                <span class="status-badge" style="background: rgba(212, 175, 55, 0.2); color: #8A6414; border: 1px solid rgba(212, 175, 55, 0.4); font-size: 9.5px; padding: 1px 6px;">v1.1.43</span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Home screen app with full-screen native experience</div>
            </div>
          </div>
          <button onclick="window.triggerPwaInstall ? window.triggerPwaInstall() : alert('Tap Share -> Add to Home Screen')" class="btn-3d btn-3d-primary" style="background: linear-gradient(135deg, #D4AF37 0%, #B37D22 100%); color: #0E0B05; font-size: 11.5px; font-weight: 800; padding: 7px 13px; border: none; white-space: nowrap; flex-shrink: 0;">
            <i data-lucide="download-cloud" style="width: 13px; height: 13px;"></i>
            <span>Install App</span>
          </button>
        </div>
        `}

        <!-- Logout Action Card -->
        <div class="bento-card" style="padding: 14px 16px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center; border: 1.5px dashed var(--border-light);">
          <div>
            <div style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">Sign Out of Kitchen</div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">Switch account or lock session on this device</div>
          </div>
          <button onclick="MoreView.handleLogout()" class="btn-3d btn-3d-secondary" style="color: var(--error); padding: 8px 16px; font-size: 12px; font-weight: 800;">
            <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
            <span>Log Out</span>
          </button>
        </div>

        <!-- App Release & Creator Badge -->
        <div style="text-align: center; margin-top: 16px; margin-bottom: 24px;">
          <div style="font-size: 11.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.03em;">
            BakePilot Studio Suite • Version 1.1.43 (Release Build)
          </div>
          <div style="margin-top: 8px;">
            <a href="https://moovarkreativ.in" target="_blank" class="cooked-by-pill" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; padding: 5px 14px; border-radius: 9999px; background: rgba(0,0,0,0.06); border: 1px solid var(--border-light); font-size: 11px; color: var(--text-secondary);">
              <span>Cooked with ❤️ by</span>
              <strong style="color: var(--text-main); font-weight: 800;">MOOVAR Kreativ</strong>
              <span style="color: var(--brand-accent);">• moovarkreativ.in</span>
            </a>
          </div>
        </div>

      </div>
    `;
  },

  openEodSettingsModal() {
    const store = window.bakeryStore;
    const s = store.getEodReportSettings();
    const userSession = store.currentUser || {};

    const html = `
      <form onsubmit="MoreView.handleSaveEodSettings(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
          Your automated End of Day report compiles all bills, revenue, payment modes, and an encrypted data snapshot at <strong>11:50 PM</strong>.
        </p>

        <div>
          <label class="form-label">Report Frequency</label>
          <select name="frequency" class="form-select">
            <option value="daily" ${s.frequency === 'daily' ? 'selected' : ''}>Daily at 11:50 PM (Recommended)</option>
            <option value="weekly" ${s.frequency === 'weekly' ? 'selected' : ''}>Weekly on Sunday at 11:50 PM</option>
            <option value="monthly" ${s.frequency === 'monthly' ? 'selected' : ''}>Monthly (End of Month at 11:50 PM)</option>
            <option value="none" ${s.frequency === 'none' ? 'selected' : ''}>Disabled (No automated emails)</option>
          </select>
        </div>

        <div>
          <label class="form-label">Recipient Email Address</label>
          <input type="email" name="email" value="${s.email || userSession.email || ''}" required placeholder="owner@gmail.com" class="form-input" />
          <span style="font-size: 10.5px; color: var(--text-muted);">Where the daily summary and backup JSON will be delivered.</span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
          <input type="checkbox" id="include-json" name="includeJsonBackup" ${s.includeJsonBackup !== false ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--c-primary);" />
          <label for="include-json" style="font-size: 12px; color: var(--text-main); font-weight: 600;">
            Attach full database backup (.json) to report email
          </label>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Preferences</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Automated 11:50 PM Backup Report Settings');
  },

  handleSaveEodSettings(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.saveEodReportSettings({
      frequency: formData.get('frequency'),
      email: formData.get('email'),
      includeJsonBackup: formData.get('includeJsonBackup') === 'on'
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Updated automated 11:50 PM report preferences!');
    window.bakeryApp.refreshCurrentView();
  },

  async triggerTestReport() {
    BakeryUI.toast('Compiling EOD report snapshot...', 'warning');
    await window.bakeryStore.sendTestEodReport();
  },

  openEditEmailModal() {
    const store = window.bakeryStore;
    const s = store.getEodReportSettings();
    const currentEmail = s.email || (store.currentUser ? store.currentUser.email : '') || '';

    const html = `
      <form onsubmit="MoreView.handleQuickSaveEmail(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
          Specify the destination email address for your nightly 11:50 PM sales summaries and encrypted cloud database backups.
        </p>

        <div>
          <label class="form-label">Report Recipient Email</label>
          <input type="email" id="quick-eod-email" name="eodEmail" value="${currentEmail}" required placeholder="yourbakery@gmail.com" class="form-input" autofocus />
          <span style="font-size: 10.5px; color: var(--text-faint); margin-top: 3px; display: block;">You will receive daily automated reports and database archives here.</span>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Update Email</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Edit Automated 11:50 PM Report Email');
  },

  handleQuickSaveEmail(e) {
    e.preventDefault();
    const input = document.getElementById('quick-eod-email');
    if (!input) return;
    const email = input.value.trim();
    if (!email) return;

    const store = window.bakeryStore;
    const s = store.getEodReportSettings();
    store.saveEodReportSettings({
      ...s,
      email: email
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Updated automated report email to: ' + email);
    window.bakeryApp.refreshCurrentView();
  },

  handleLoadDemo() {
    BakeryUI.confirmModal({
      title: 'Load Demo Sample Stats?',
      message: 'This will populate your catalogue with artisan brownies & cakes, sample orders, customers, and inventory stats so you can explore all features.',
      confirmText: 'Load Demo Data',
      onConfirm: () => {
        window.bakeryStore.loadDemoSampleData();
        window.bakeryApp.refreshCurrentView();
      }
    });
  },

  handleClearSlate() {
    BakeryUI.confirmModal({
      title: 'Reset to Clean Business Slate?',
      message: 'This will clear all sample orders, products, customers, vendors, recipes and inventory so you can start completely fresh for your real bakery business.',
      confirmText: 'Clear to Clean Slate',
      onConfirm: () => {
        window.bakeryStore.clearToCleanSlate();
        window.bakeryApp.refreshCurrentView();
      }
    });
  },

  openInvoiceSettingsModal() {
    const store = window.bakeryStore;
    const inv = store.getInvoiceSettings();
    const profile = store.getProfile();

    const html = `
      <form onsubmit="MoreView.handleSaveInvoiceSettings(event)" style="display: flex; flex-direction: column; gap: 14px; max-height: 80vh; overflow-y: auto; padding-right: 2px;">
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4; margin: 0;">
          Select exactly which fields and terms appear on your generated bills, printed receipts, and WhatsApp images.
        </p>

        <!-- Group 1: Business Branding & Legal -->
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Bakery Details on Bill
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="map-pin" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Bakery Address</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">${profile.address || 'Kitchen address'}</div>
                </div>
              </div>
              <input type="checkbox" name="showBakeryAddress" ${inv.showBakeryAddress !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="phone" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Bakery Contact Phone</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">${profile.phone || 'Phone number'}</div>
                </div>
              </div>
              <input type="checkbox" name="showBakeryPhone" ${inv.showBakeryPhone !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="award" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">FSSAI / Food License</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">${profile.fssaiOrLicense || 'FSSAI License registration'}</div>
                </div>
              </div>
              <input type="checkbox" name="showFssai" ${inv.showFssai !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="credit-card" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Payment UPI ID (GPay / PhonePe)</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">${profile.paymentUpi || 'UPI payment instructions'}</div>
                </div>
              </div>
              <input type="checkbox" name="showPaymentUpi" ${inv.showPaymentUpi !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>
          </div>
        </div>

        <!-- Group 2: Customer & Order Specifics -->
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Order & Client Info
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="user-check" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Customer Phone Number</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">Displays client mobile on the bill</div>
                </div>
              </div>
              <input type="checkbox" name="showCustomerPhone" ${inv.showCustomerPhone !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="truck" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Delivery Destination Address</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">Show delivery address on delivery orders</div>
                </div>
              </div>
              <input type="checkbox" name="showDeliveryAddress" ${inv.showDeliveryAddress !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="message-square" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Piped Cake Message Box</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">Prints inscribed birthday/celebration piping note</div>
                </div>
              </div>
              <input type="checkbox" name="showCakeMessage" ${inv.showCakeMessage !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>
          </div>
        </div>

        <!-- Group 3: Footer, Social & Custom Terms -->
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Footer & Freshness Terms
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="instagram" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Instagram / Social Handle</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">${profile.instagram || '@bakery'}</div>
                </div>
              </div>
              <input type="checkbox" name="showInstagram" ${inv.showInstagram !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>

            <label class="customizer-item">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="file-text" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">Footer Storage / Freshness Note</div>
                  <div style="font-size: 10.5px; color: var(--text-muted);">Displays below order summary</div>
                </div>
              </div>
              <input type="checkbox" name="showFooterNotes" ${inv.showFooterNotes !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--c-primary);" />
            </label>
          </div>

          <div style="margin-top: 10px;">
            <label class="form-label">Custom Bill Terms & Storage Disclaimer</label>
            <textarea name="invoiceNotes" rows="2" class="form-textarea" placeholder="Baked fresh with pure butter. Please refrigerate cream items immediately.">${inv.invoiceNotes || profile.invoiceNotes || ''}</textarea>
          </div>
        </div>

        <!-- Group 4: WhatsApp Greeting Message -->
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            WhatsApp Share Greeting
          </div>
          <div>
            <label class="form-label">Default WhatsApp Greeting Message</label>
            <input 
              type="text" 
              name="whatsappGreeting" 
              class="form-input" 
              value="${inv.whatsappGreeting || 'Namaste {customer}! 🙏'}" 
              placeholder="e.g. Namaste {customer}! 🙏 or Hello {customer}! 🎂" 
            />
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 3px;">
              Tags: <code>{customer}</code> = Client's Name • <code>{bakery}</code> = Your Bakery Name
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1.3;">Save Invoice Fields</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Customize Invoice Layout & Fields');
  },

  handleSaveInvoiceSettings(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.saveInvoiceSettings({
      showBakeryAddress: formData.get('showBakeryAddress') === 'on',
      showBakeryPhone: formData.get('showBakeryPhone') === 'on',
      showFssai: formData.get('showFssai') === 'on',
      showPaymentUpi: formData.get('showPaymentUpi') === 'on',
      showCustomerPhone: formData.get('showCustomerPhone') === 'on',
      showDeliveryAddress: formData.get('showDeliveryAddress') === 'on',
      showCakeMessage: formData.get('showCakeMessage') === 'on',
      showFooterNotes: formData.get('showFooterNotes') === 'on',
      showInstagram: formData.get('showInstagram') === 'on',
      whatsappGreeting: (formData.get('whatsappGreeting') || 'Namaste {customer}! 🙏').trim(),
      invoiceNotes: formData.get('invoiceNotes') || ''
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Saved invoice layout preferences! ✓');
    window.bakeryApp.refreshCurrentView();
  },

  openFeatureWishlistModal() {
    const store = window.bakeryStore;
    const profile = store.getProfile();
    const userSession = store.currentUser || { email: profile.email || '', businessName: profile.name || '' };

    const html = `
      <form onsubmit="MoreView.handleFeatureWishlistSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <div style="background: rgba(92, 224, 158, 0.1); border: 1.5px solid rgba(92, 224, 158, 0.25); border-radius: 12px; padding: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; color: #5CE09E; font-weight: 800; font-size: 13px;">
            <i data-lucide="sparkles" style="width: 15px; height: 15px;"></i>
            <span>Suggest a Feature for Future Updates</span>
          </div>
          <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.35;">
            What tool, option, or improvement would make running your home bakery easier? Our product team reviews every single request!
          </p>
        </div>

        <div>
          <label class="form-label">Feature / Tool Title *</label>
          <input type="text" name="featureTitle" required placeholder="e.g. WhatsApp automated payment receipt" class="form-input" />
        </div>

        <div>
          <label class="form-label">Category</label>
          <select name="category" class="form-select">
            <option value="Billing & Invoicing">📄 Counter Billing & WhatsApp Invoices</option>
            <option value="Recipe Costing">🧮 Recipe Cost Estimator & Ingredients</option>
            <option value="Pantry & Stock">📦 Pantry Inventory & Packaging</option>
            <option value="Custom Orders">🎂 Custom Cake Orders & Piping</option>
            <option value="Client Marketing">👥 Customer CRM & Loyalty</option>
            <option value="Other">💡 Other General Improvement</option>
          </select>
        </div>

        <div>
          <label class="form-label">What would this feature do for your bakery? *</label>
          <textarea name="description" required rows="3" placeholder="Please describe how you want this feature to work and how it will save you time..." class="form-input"></textarea>
        </div>

        <input type="hidden" name="email" value="${userSession.email || profile.email || ''}" />
        <input type="hidden" name="businessName" value="${profile.name || userSession.businessName || 'Artisan Baker'}" />

        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1.5; padding: 12px;">
            <i data-lucide="send" style="width: 14px; height: 14px;"></i>
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Request a Feature for Future Updates');
  },

  async handleFeatureWishlistSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const featureTitle = form.featureTitle.value.trim();
    const category = form.category.value;
    const description = form.description.value.trim();
    const email = form.email.value;
    const businessName = form.businessName.value;

    try {
      BakeryUI.toast('Submitting your idea...', 'warning');
      const submitUrl = typeof window.getServerUrl === 'function' ? window.getServerUrl('/api/feedback/submit') : '/api/feedback/submit';
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureTitle, category, description, email, businessName })
      });
      const data = await res.json();
      if (res.ok) {
        BakeryUI.closeSheet();
        BakeryUI.toast('✓ Thank you! Your request was sent directly to our team! 🚀');
      } else {
        BakeryUI.toast(data.error || 'Submission failed', 'error');
      }
    } catch (err) {
      BakeryUI.toast('Error submitting request: ' + err.message, 'error');
    }
  },

  handleLogout() {
    BakeryUI.confirmModal({
      title: 'Sign Out',
      message: 'Are you sure you want to log out of your bakery account? You can log back in with your email at any time.',
      confirmText: 'Sign Out',
      onConfirm: () => {
        window.bakeryStore.logout();
        window.bakeryApp.navigate('login');
      }
    });
  }
};

window.MoreView = MoreView;
