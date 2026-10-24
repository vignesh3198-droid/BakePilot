/* ==========================================================================
   VIEW: AUTHENTICATION & LOGIN / REGISTER — BAKEPILOT LUXURY DESIGN
   Round Logo Layout • Deep Emerald Clay Card • Cream Clay Pills
   Crafted & Cooked with ❤️ by MOOVAR Kreativ (moovarkreativ.in)
   ========================================================================== */

const LoginView = {
  activeTab: 'login', // 'login' or 'register'

  render() {
    return `
      <div class="login-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100%; padding: 12px 14px 14px; position: relative;">
        
        <!-- Ambient Background Glow Particles -->
        <div class="login-orb login-orb-1"></div>
        <div class="login-orb login-orb-2"></div>

        <!-- 1. Pure Round Logo Emblem Pod with Floating Breath & Golden Aura -->
        <div style="text-align: center; margin-bottom: 10px; position: relative; z-index: 2;">
          <div class="login-logo-wrapper">
            <div class="login-logo-aura"></div>
            <div class="login-logo-circle">
              <img 
                src="assets/bakepilot-logo.png" 
                alt="BakePilot - Made for Home Bakers, Built for business." 
              />
            </div>
          </div>

          <!-- Feature Tagline Pill -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 6px;">
            <div class="pill-features-primary">
              <span>Billing</span>
              <span style="opacity: 0.6;">·</span>
              <span>Orders</span>
              <span style="opacity: 0.6;">·</span>
              <span>Inventory</span>
            </div>
          </div>
        </div>

        <!-- 2. Deep Obsidian Luxury Auth Card -->
        <div class="login-card-luxury" style="margin-top: 4px;">
          
          <!-- Segmented Tab Switcher (Cream Active Pill vs Dark Charcoal) -->
          <div style="display: flex; gap: 4px; background: #100C0E; padding: 4px; border-radius: var(--radius-full); margin-bottom: 18px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <button 
              type="button" 
              onclick="LoginView.switchTab('login')" 
              style="flex: 1; padding: 9px 0; font-size: 13px; border-radius: var(--radius-full); border: none; cursor: pointer; transition: all 0.2s ease; ${this.activeTab === 'login' ? 'background: #FAF1E4; color: #1C171A; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.3);' : 'background: transparent; color: #A3969C; font-weight: 700;'}"
            >
              Sign In
            </button>
            <button 
              type="button" 
              onclick="LoginView.switchTab('register')" 
              style="flex: 1; padding: 9px 0; font-size: 13px; border-radius: var(--radius-full); border: none; cursor: pointer; transition: all 0.2s ease; ${this.activeTab === 'register' ? 'background: #FAF1E4; color: #1C171A; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.3);' : 'background: transparent; color: #A3969C; font-weight: 700;'}"
            >
              Register Business
            </button>
          </div>

          <!-- Login Form -->
          ${this.activeTab === 'login' ? `
            <form onsubmit="LoginView.handleLoginSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="display: block; font-size: 12.5px; font-weight: 700; color: #FAF1E4; margin-bottom: 6px;">Email Address</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="mail" style="width: 16px; height: 16px; color: #D4AF37;"></i>
                  <input type="email" id="login-email-input" name="email" required placeholder="baker@gmail.com" />
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 12.5px; font-weight: 700; color: #FAF1E4; margin-bottom: 6px;">Password</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="lock" style="width: 16px; height: 16px; color: #D4AF37;"></i>
                  <input type="password" name="password" required placeholder="••••••••" />
                </div>
              </div>

              <!-- Forgot Password Link -->
              <div style="display: flex; justify-content: flex-end; margin-top: -4px;">
                <button type="button" onclick="LoginView.openForgotPasswordModal()" style="background: none; border: none; font-size: 12px; color: #D4AF37; font-weight: 700; cursor: pointer; text-decoration: underline;">
                  Forgot Password?
                </button>
              </div>

              <!-- Tactile Cream Access Button -->
              <button type="submit" class="btn-clay-cream" style="margin-top: 4px;">
                <i data-lucide="log-in" style="width: 16px; height: 16px; color: #1C171A;"></i>
                <span>Access My Bakery</span>
              </button>

              <div style="text-align: center; margin-top: 4px;">
                <button type="button" onclick="LoginView.continueDemo()" style="background: none; border: none; font-size: 12px; color: #FAF1E4; opacity: 0.8; cursor: pointer; text-decoration: underline;">
                  Explore Demo Studio (The Crust & Crumb) →
                </button>
              </div>
            </form>
          ` : `
            <!-- Register Form (Clean, Empty Business Workspace for New User) -->
            <form onsubmit="LoginView.handleRegisterSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #FAF1E4; margin-bottom: 4px;">Bakery / Studio Name *</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="store" style="width: 15px; height: 15px; color: #D4AF37;"></i>
                  <input type="text" name="businessName" required placeholder="e.g. Vanilla Blossom Bakes" />
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #FAF1E4; margin-bottom: 4px;">Specialty Tagline</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="award" style="width: 15px; height: 15px; color: #D4AF37;"></i>
                  <input type="text" name="tagline" placeholder="e.g. Fudgy Brownies & Custom Cakes" />
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #FAF1E4; margin-bottom: 4px;">Owner Email Address *</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="mail" style="width: 15px; height: 15px; color: #D4AF37;"></i>
                  <input type="email" name="email" required placeholder="owner@gmail.com" />
                </div>
                <span style="font-size: 10px; color: #C5A059; margin-top: 2px; display: block;">Daily 11:50 PM EOD reports will be sent here.</span>
              </div>

              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #FAF1E4; margin-bottom: 4px;">Password *</label>
                <div class="luxury-input-wrapper">
                  <i data-lucide="lock" style="width: 15px; height: 15px; color: #D4AF37;"></i>
                  <input type="password" name="password" required minlength="4" placeholder="••••••••" />
                </div>
              </div>

              <!-- Mandatory Sign-up Terms Checkbox -->
              <div style="display: flex; align-items: flex-start; gap: 8px; margin: 4px 0 2px;">
                <input type="checkbox" id="register-terms-agree" name="termsAgreed" required style="width: 16px; height: 16px; margin-top: 2px; accent-color: #D4AF37; cursor: pointer;" />
                <label for="register-terms-agree" style="font-size: 11.5px; color: #FAF1E4; line-height: 1.4; cursor: pointer;">
                  I agree to the <span onclick="LoginView.openTermsModal()" style="color: #D4AF37; text-decoration: underline; font-weight: 700; cursor: pointer;">Terms & Conditions & 100% Confidential Data Policy</span>
                </label>
              </div>

              <div style="font-size: 11px; color: #FAF1E4; background: rgba(0, 0, 0, 0.35); padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 175, 55, 0.2);">
                ✨ Your workspace starts <strong>100% clean & private</strong>. You can add your own fresh clients, vendors, pantry items & products.
              </div>

              <button type="submit" class="btn-clay-cream" style="margin-top: 4px;">
                <i data-lucide="sparkles" style="width: 16px; height: 16px; color: #1C171A;"></i>
                <span>Register & Launch My Studio</span>
              </button>
            </form>
          `}

        </div>

        <!-- 3. Bottom Text & Data Confidentiality Assurance -->
        <div style="text-align: center; margin-top: 14px; font-size: 11.5px; color: #7C6E76; font-weight: 600; max-width: 340px; line-height: 1.35; z-index: 2;">
          Each baker has their own private, cloud-isolated database & daily backups.
        </div>

        <!-- Terms and Data Security Guarantee Link -->
        <div style="text-align: center; margin-top: 6px; z-index: 2;">
          <button 
            type="button" 
            onclick="LoginView.openTermsModal()" 
            style="background: none; border: none; font-size: 11.5px; color: #1C171A; font-weight: 700; cursor: pointer; text-decoration: underline; display: inline-flex; align-items: center; gap: 5px;"
          >
            <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #B37D22;"></i>
            <span>Terms & Conditions · Data Confidentiality & Security</span>
          </button>
        </div>

        <!-- 4. Cooked by MOOVAR Kreativ Pill -->
        <div style="margin-top: 12px; margin-bottom: 6px; text-align: center; z-index: 2;">
          <a 
            href="https://moovarkreativ.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="cooked-by-pill"
            title="Visit MOOVAR Kreativ (moovarkreativ.in)"
          >
            <span>Cooked with</span>
            <span style="color: #E25555; animation: heartbeat 1.5s infinite; display: inline-block;">❤️</span>
            <span>by</span>
            <strong style="color: #1C171A; font-weight: 800; letter-spacing: 0.02em;">MOOVAR Kreativ</strong>
            <i data-lucide="external-link" style="width: 13px; height: 13px; opacity: 0.7;"></i>
          </a>
        </div>

      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    window.bakeryApp.refreshCurrentView();
  },

  async handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    BakeryUI.toast('Verifying credentials...', 'warning');
    const success = await window.bakeryStore.login(email, password);
    if (success) {
      BakeryUI.toast('Welcome to BakePilot! 🎂✓');
      window.bakeryApp.navigate('dashboard');
    }
  },

  async handleRegisterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.termsAgreed || !form.termsAgreed.checked) {
      BakeryUI.toast('Please check and accept the Terms & Conditions to register', 'warning');
      return;
    }
    const businessName = form.businessName.value;
    const tagline = form.tagline.value;
    const email = form.email.value;
    const password = form.password.value;

    BakeryUI.toast('Creating your clean bakery workspace...', 'warning');
    const success = await window.bakeryStore.register(email, password, businessName, tagline);
    if (success) {
      BakeryUI.toast(`Welcome to BakePilot, ${businessName}! 🎉`);
      window.bakeryApp.navigate('dashboard');
    }
  },

  continueDemo() {
    window.bakeryStore.setDemoSession();
    window.bakeryStore.loadDemoSampleData();
    BakeryUI.toast('Loaded Demo Kitchen Workspace (The Crust & Crumb)');
    window.bakeryApp.navigate('dashboard');
  },

  // Forgot Password Modal Sheet
  openForgotPasswordModal() {
    const currentTypedEmail = document.getElementById('login-email-input')?.value || '';
    const html = `
      <form onsubmit="LoginView.handleForgotPasswordSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
          Enter your registered email address and choose a new password to instantly regain access to your bakery database.
        </p>

        <div>
          <label class="form-label">Registered Email</label>
          <input type="email" name="email" value="${currentTypedEmail}" required placeholder="baker@gmail.com" class="form-input" />
        </div>

        <div>
          <label class="form-label">New Password</label>
          <input type="password" name="newPassword" required minlength="4" placeholder="••••••••" class="form-input" />
        </div>

        <div>
          <label class="form-label">Confirm New Password</label>
          <input type="password" name="confirmPassword" required minlength="4" placeholder="••••••••" class="form-input" />
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1.4;">Reset Password</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Reset Password');
  },

  async handleForgotPasswordSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      BakeryUI.toast('Passwords do not match', 'error');
      return;
    }

    BakeryUI.toast('Updating password...', 'warning');
    const success = await window.bakeryStore.resetPassword(email, newPassword);
    if (success) {
      BakeryUI.closeSheet();
      this.activeTab = 'login';
      window.bakeryApp.refreshCurrentView();
      setTimeout(() => {
        const emailInput = document.getElementById('login-email-input');
        if (emailInput) emailInput.value = email;
      }, 100);
    }
  },

  // Terms & Conditions & Data Confidentiality Modal Sheet
  openTermsModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px; max-height: 72vh; overflow-y: auto; padding: 4px; color: #FFFFFF;">
        
        <!-- Dark Obsidian High-Contrast Card Wrapper -->
        <div style="background: #140F12; border: 1.5px solid rgba(212, 175, 55, 0.45); border-radius: 18px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Top Guarantee Badge -->
          <div style="background: rgba(92, 224, 158, 0.14); border: 1.5px solid #5CE09E; border-radius: 14px; padding: 13px 15px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #5CE09E; font-size: 13.5px;">
              <i data-lucide="shield-check" style="width: 18px; height: 18px; color: #5CE09E;"></i>
              <span>100% Confidential Baker Cloud Isolation</span>
            </div>
            <p style="font-size: 12.5px; color: #FFFFFF; margin-top: 6px; line-height: 1.55; font-weight: 500;">
              Every home baker operates within their own strictly sandboxed, private cloud database. Your recipes, formulas, ingredient prices, client phone numbers, and revenue records are <strong>completely confidential</strong> and never shared with or visible to any other baker.
            </p>
          </div>

          <!-- Section 1 -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.22); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(212, 175, 55, 0.25); color: #D4AF37; border: 1px solid #D4AF37; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">1</span>
              <h4 style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; margin: 0;">Proprietary Trade Secrets & Cake Formulas</h4>
            </div>
            <p style="font-size: 12.5px; color: #F0EAE1; line-height: 1.55; margin-top: 6px; margin-left: 30px;">
              All your brownie and cake recipes, custom flavor formulations, cost estimator margins, and client order directories belong <strong>100% exclusively to you</strong>. BakePilot never sells, advertises, or discloses your trade secrets.
            </p>
          </div>

          <!-- Section 2 -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.22); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(212, 175, 55, 0.25); color: #D4AF37; border: 1px solid #D4AF37; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">2</span>
              <h4 style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; margin: 0;">Bank-Grade Password & Token Security</h4>
            </div>
            <p style="font-size: 12.5px; color: #F0EAE1; line-height: 1.55; margin-top: 6px; margin-left: 30px;">
              Your login password is encrypted using one-way cryptographic SHA-256 hashing. Communications between your phone and the cloud server are guarded by rotating authenticated cryptographic bearer tokens.
            </p>
          </div>

          <!-- Section 3 -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.22); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(212, 175, 55, 0.25); color: #D4AF37; border: 1px solid #D4AF37; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">3</span>
              <h4 style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; margin: 0;">Automated Daily 11:50 PM Cloud Backups</h4>
            </div>
            <p style="font-size: 12.5px; color: #F0EAE1; line-height: 1.55; margin-top: 6px; margin-left: 30px;">
              Every night at 11:50 PM, an automated End-of-Day (EOD) business financial report and full JSON database snapshot are securely archived and emailed straight to your registered address to ensure zero data loss.
            </p>
          </div>

          <!-- Section 4 -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.22); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(212, 175, 55, 0.25); color: #D4AF37; border: 1px solid #D4AF37; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">4</span>
              <h4 style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; margin: 0;">Zero-GST Compliance & Delivery Freedom</h4>
            </div>
            <p style="font-size: 12.5px; color: #F0EAE1; line-height: 1.55; margin-top: 6px; margin-left: 30px;">
              BakePilot generates clean, zero-GST compliant bills suitable for Indian home bakers operating below mandatory GST thresholds. You have total freedom to configure custom delivery charges per order.
            </p>
          </div>

          <!-- Section 5 -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.22); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(212, 175, 55, 0.25); color: #D4AF37; border: 1px solid #D4AF37; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">5</span>
              <h4 style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; margin: 0;">Multi-Device Synchronization & Data Retention</h4>
            </div>
            <p style="font-size: 12.5px; color: #F0EAE1; line-height: 1.55; margin-top: 6px; margin-left: 30px;">
              Access your bakery workspace securely from any phone, tablet, or laptop. Even when subscriptions expire, your past business records and client rosters are safely preserved indefinitely in your private database.
            </p>
          </div>

          <!-- Acceptance Button -->
          <button 
            type="button" 
            onclick="BakeryUI.closeSheet()" 
            class="btn-3d btn-3d-primary" 
            style="background: linear-gradient(135deg, #D4AF37 0%, #B37D22 100%); color: #0E0B05; font-size: 13.5px; font-weight: 800; border: none; padding: 13px; border-radius: 9999px; width: 100%; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.35); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;"
          >
            <i data-lucide="check-circle" style="width: 17px; height: 17px; color: #0E0B05;"></i>
            <span>I Understand & Agree to Terms</span>
          </button>

        </div>
      </div>
    `;
    BakeryUI.openSheet(html, 'Terms & Data Confidentiality');
  },

  renderPaymentPending() {
    const store = window.bakeryStore;
    const info = store.paymentPendingUser || {
      email: (store.currentUser ? store.currentUser.email : '') || 'baker@gmail.com',
      businessName: (store.currentUser ? store.currentUser.businessName : '') || 'Artisan Bakery',
      message: 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
    };

    const adminWhatsApp = '919840155230';
    const waText = encodeURIComponent(`Namaste BakePilot Admin, I would like to complete my monthly subscription payment to reactivate my bakery studio:\nBakery: ${info.businessName}\nEmail: ${info.email}`);
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${waText}`;

    return `
      <div class="login-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; padding: 28px 16px 80px; position: relative;">
        
        <!-- Subscription Payment Due Luxury Card -->
        <div class="login-card-luxury" style="max-width: 440px; text-align: center; border-color: rgba(245, 166, 35, 0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
          
          <!-- Illustrated Error Badge / Lock Graphic -->
          <div style="width: 86px; height: 86px; border-radius: 50%; background: linear-gradient(135deg, rgba(245, 166, 35, 0.2) 0%, rgba(255, 107, 122, 0.2) 100%); border: 2.5px solid #F5A623; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 26px rgba(245, 166, 35, 0.3);">
            <div style="position: relative;">
              <i data-lucide="credit-card" style="width: 38px; height: 38px; color: #F5A623;"></i>
              <div style="position: absolute; top: -6px; right: -6px; background: #FF6B7A; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #1C171A;">
                <i data-lucide="lock" style="width: 10px; height: 10px; color: #FFFFFF;"></i>
              </div>
            </div>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 5px; background: rgba(245, 166, 35, 0.16); color: #F5A623; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 9999px; padding: 3px 12px; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px;">
            <i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i>
            <span>Monthly Subscription Required</span>
          </div>

          <h2 style="font-size: 19px; font-weight: 800; font-family: var(--font-heading); color: #FAF1E4; margin-bottom: 12px; line-height: 1.3;">
            Account Temporarily On Hold
          </h2>

          <!-- Exact requested notification message -->
          <div style="background: rgba(0, 0, 0, 0.45); border: 1.5px solid rgba(245, 166, 35, 0.35); border-radius: 14px; padding: 14px 16px; font-size: 13px; color: #FAF1E4; line-height: 1.5; margin-bottom: 14px; text-align: left;">
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <i data-lucide="info" style="width: 18px; height: 18px; color: #F5A623; flex-shrink: 0; margin-top: 1px;"></i>
              <div>
                <strong>Notice:</strong> Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.
              </div>
            </div>
          </div>

          <!-- Baker Profile Chip -->
          <div style="background: rgba(255, 255, 255, 0.04); border-radius: 10px; padding: 8px 12px; font-size: 11.5px; color: var(--text-muted); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #FAF1E4; font-weight: 700;">${info.businessName}</span>
            <span style="color: var(--accent-gold);">${info.email}</span>
          </div>

          <!-- Safe Storage Assurance -->
          <div style="background: rgba(92, 224, 158, 0.08); border: 1px solid rgba(92, 224, 158, 0.22); border-radius: 12px; padding: 11px 13px; font-size: 11px; color: #FAF1E4; text-align: left; line-height: 1.45; margin-bottom: 18px;">
            🛡️ <strong>100% Data Preserved:</strong> All your recipes, client lists, invoices, and cloud backups remain safely encrypted in your private database. Once payment is confirmed, your studio will be unlocked immediately.
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a 
              href="${waUrl}" 
              target="_blank" 
              class="btn-clay-cream" 
              style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #FFFFFF; font-size: 13px; padding: 13px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);"
            >
              <i data-lucide="message-circle" style="width: 17px; height: 17px;"></i>
              <span>Contact Admin on WhatsApp to Reactivate</span>
            </a>

            <button 
              type="button" 
              onclick="LoginView.checkSubscriptionUnlock('${info.email}')" 
              class="btn-clay-cream" 
              style="padding: 12px; font-size: 12px; background: #FAF1E4; color: #1C171A;"
            >
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px; color: #1C171A;"></i>
              <span>I've Paid — Check & Unlock Account</span>
            </button>

            <button 
              type="button" 
              onclick="window.bakeryStore.logout(); window.bakeryApp.navigate('login');" 
              style="background: none; border: none; font-size: 11.5px; color: #FAF1E4; opacity: 0.75; cursor: pointer; text-decoration: underline; margin-top: 8px; padding: 6px;"
            >
              Sign In with Another Bakery Account
            </button>
          </div>

        </div>

        <!-- Cooked by MOOVAR Kreativ -->
        <div style="margin-top: 20px; text-align: center; z-index: 2;">
          <a href="https://moovarkreativ.in" target="_blank" class="cooked-by-pill">
            <span>Cooked with ❤️ by</span>
            <strong style="color: #1C171A; font-weight: 800;">MOOVAR Kreativ</strong>
          </a>
        </div>

      </div>
    `;
  },

  async checkSubscriptionUnlock(email) {
    BakeryUI.toast('Checking subscription payment status...', 'warning');
    try {
      const checkUrl = typeof window.getServerUrl === 'function' ? window.getServerUrl('/api/auth/check-subscription') : '/api/auth/check-subscription';
      const res = await fetch(checkUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.active) {
        BakeryUI.toast('✓ Subscription active! Welcome back! 🎉');
        window.bakeryApp.navigate('dashboard');
      } else {
        BakeryUI.toast(data.message || 'Payment still pending. Please contact admin on WhatsApp.', 'warning');
      }
    } catch (e) {
      BakeryUI.toast('Connection error checking status: ' + e.message, 'error');
    }
  }
};

window.LoginView = LoginView;
