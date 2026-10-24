/* ==========================================================================
   VIEW: BUSINESS PROFILE & BRANDING — LUMORA DESIGN & MOBILE FIRST
   Logo Edit & Upload, Brand Colors, FSSAI, UPI, Social Links & Invoice Header
   ========================================================================== */

const BrandingView = {
  render() {
    const store = window.bakeryStore;
    const profile = store.getProfile();

    return `
      <div class="branding-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Logo & Brand Identity</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Manage your official logo, UPI QR code, FSSAI & bill care notes</p>
          </div>
        </div>

        <!-- Logo & Brand Preview Bento Card -->
        <div class="bento-card" style="padding: 20px 16px; text-align: center; border-top: 3.5px solid var(--c-primary);">
          <div style="position: relative; display: inline-block; margin-bottom: 12px;">
            <div style="width: 76px; height: 76px; border-radius: 22px; overflow: hidden; background: var(--c-sand); border: 2px solid var(--border-light); margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-bento);">
              <img 
                id="branding-logo-preview" 
                src="${profile.logo || BAKERY_ASSETS.defaultLogo}" 
                alt="${profile.name}" 
                style="width: 100%; height: 100%; object-fit: cover;" 
              />
            </div>
            <button 
              type="button" 
              onclick="document.getElementById('branding-logo-file-input').click()" 
              class="btn-3d btn-3d-primary" 
              style="position: absolute; bottom: -4px; right: -6px; width: 30px; height: 30px; padding: 0; border-radius: 50%;"
              title="Upload new logo"
            >
              <i data-lucide="camera" style="width: 14px; height: 14px;"></i>
            </button>
            <input 
              type="file" 
              id="branding-logo-file-input" 
              accept="image/*" 
              style="display: none;" 
              onchange="BrandingView.handleLogoUpload(event)" 
            />
          </div>

          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0;">${profile.name}</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${profile.tagline}</p>
          
          <div style="font-size: 11px; color: var(--text-faint); margin-top: 4px; display: flex; justify-content: center; gap: 6px; flex-wrap: wrap;">
            <span>📍 ${profile.address}</span>
            <span>•</span>
            <span>📞 ${profile.phone}</span>
          </div>

          <div style="margin-top: 10px; display: inline-flex; gap: 6px; font-size: 11px; font-weight: 700; color: var(--text-main); background: var(--c-sand); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border-light); flex-wrap: wrap; justify-content: center;">
            <span>${profile.instagram || '@crustandcrumb'}</span>
            <span>•</span>
            <span>${profile.fssaiOrLicense || 'FSSAI Registered'}</span>
          </div>

          <div style="display: flex; justify-content: center; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
            <button 
              type="button" 
              onclick="document.getElementById('branding-logo-file-input').click()" 
              class="btn-3d btn-3d-secondary"
              style="padding: 6px 14px; font-size: 11.5px;"
            >
              <i data-lucide="image" style="width: 13px; height: 13px;"></i>
              <span>Replace Logo Photo</span>
            </button>
            ${profile.logo && profile.logo !== BAKERY_ASSETS.defaultLogo ? `
              <button 
                type="button" 
                onclick="BrandingView.removeLogo()" 
                class="btn-3d btn-3d-secondary" 
                style="color: var(--error); padding: 6px 12px; font-size: 11.5px;"
              >
                Reset Default
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Edit Form -->
        <form onsubmit="BrandingView.handleSubmit(event)" class="bento-card" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <h4 style="font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
            Bakery Profile Details
          </h4>

          <div>
            <label class="form-label">Bakery Brand Name *</label>
            <input type="text" name="name" value="${profile.name}" required class="form-input" />
          </div>

          <div>
            <label class="form-label">Tagline / Specialty</label>
            <input type="text" name="tagline" value="${profile.tagline}" class="form-input" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Head Chef / Baker Name</label>
              <input type="text" name="baker" value="${profile.baker}" class="form-input" />
            </div>
            <div>
              <label class="form-label">Instagram Handle</label>
              <input type="text" name="instagram" value="${profile.instagram}" class="form-input" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Contact Phone</label>
              <input type="tel" name="phone" value="${profile.phone}" class="form-input" />
            </div>
            <div>
              <label class="form-label">FSSAI Registration No.</label>
              <input type="text" name="fssaiOrLicense" value="${profile.fssaiOrLicense}" class="form-input" />
            </div>
          </div>

          <div>
            <label class="form-label">Public Kitchen / Store Address</label>
            <input type="text" name="address" value="${profile.address}" class="form-input" />
          </div>

          <div>
            <label class="form-label">Customer Payment UPI ID (VPA)</label>
            <input type="text" name="paymentUpi" value="${profile.paymentUpi || 'crustandcrumb@okhdfcbank'}" class="form-input" placeholder="e.g. yourbakery@okhdfcbank" />
          </div>

          <div>
            <label class="form-label">Invoice Care Instructions Note</label>
            <textarea name="invoiceNotes" class="form-input" rows="2">${profile.invoiceNotes}</textarea>
          </div>

          <button type="submit" class="btn-3d btn-3d-primary" style="margin-top: 6px; padding: 12px; font-size: 13.5px;">
            <i data-lucide="check" style="width: 15px; height: 15px;"></i>
            <span>Save Branding Changes</span>
          </button>
        </form>

      </div>
    `;
  },

  handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        window.bakeryStore.updateLogo(dataUrl);
        BakeryUI.toast('New bakery logo saved! ✓');
        window.bakeryApp.refreshCurrentView();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },

  removeLogo() {
    window.bakeryStore.updateLogo(BAKERY_ASSETS.defaultLogo);
    BakeryUI.toast('Logo reset to default');
    window.bakeryApp.refreshCurrentView();
  },

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.updateProfile({
      name: formData.get('name'),
      tagline: formData.get('tagline'),
      baker: formData.get('baker'),
      instagram: formData.get('instagram'),
      phone: formData.get('phone'),
      fssaiOrLicense: formData.get('fssaiOrLicense'),
      address: formData.get('address'),
      paymentUpi: formData.get('paymentUpi'),
      invoiceNotes: formData.get('invoiceNotes')
    });

    BakeryUI.toast('Bakery branding updated successfully! ✓');
    window.bakeryApp.refreshCurrentView();
  }
};

window.BrandingView = BrandingView;
