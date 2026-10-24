/* ==========================================================================
   VIEW: AUTH & PROFILE — INDIAN MARKET
   Baker Profile & Kitchen Setup Walkthrough
   ========================================================================== */

const AuthView = {
  openOnboardingModal() {
    const store = window.bakeryStore;
    const profile = store.getProfile();
    const initials = (profile.baker || 'Chef').split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase();

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px; text-align: center;">
        
        <div style="width: 58px; height: 58px; border-radius: 16px; background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep); margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; border: 1.5px solid var(--border-hairline); box-shadow: var(--clay-shadow-sm); overflow: hidden;">
          ${profile.logo ? `
            <img src="${profile.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
          ` : `
            <span>${initials}</span>
          `}
        </div>

        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Chef & Kitchen Profile</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px; max-width: 300px; margin-left: auto; margin-right: auto;">
            Professional cloud kitchen management & recipe costing for Indian home bakers.
          </p>
        </div>

        <form onsubmit="AuthView.handleOnboardingSubmit(event)" style="display: flex; flex-direction: column; gap: 10px; text-align: left; margin-top: 4px;">
          <div>
            <label class="form-label">Head Baker / Chef Name</label>
            <input type="text" name="baker" value="${profile.baker}" required class="form-input" />
          </div>

          <div>
            <label class="form-label">Bakery Brand Name</label>
            <input type="text" name="name" value="${profile.name}" required class="form-input" />
          </div>

          <div>
            <label class="form-label">FSSAI Registration</label>
            <input type="text" name="fssai" value="${profile.fssaiOrLicense}" class="form-input" />
          </div>

          <div>
            <label class="form-label">Primary Specialty</label>
            <select name="specialty" class="form-select">
              <option value="Fudgy Brownies & Custom Cakes">Fudgy Brownies & Custom Celebration Cakes</option>
              <option value="Rosemilk, Pista & Classic Indian Flavour Cakes">Classic Indian Flavours & Tres Leches</option>
              <option value="Artisan Breads, Sandwiches & Pastries">Cafe Savouries & Sandwiches</option>
            </select>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button type="button" onclick="BakeryUI.closeSheet()" class="btn btn-secondary" style="flex: 1;">Close</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Profile</button>
          </div>
        </form>

      </div>
    `;

    BakeryUI.openSheet(html, 'Baker Profile');
  },

  handleOnboardingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.updateProfile({
      baker: formData.get('baker'),
      name: formData.get('name'),
      fssaiOrLicense: formData.get('fssai'),
      tagline: formData.get('specialty')
    });

    BakeryUI.closeSheet();
    BakeryUI.toast(`Saved profile for Chef ${formData.get('baker')}!`);
    window.bakeryApp.refreshCurrentView();
  }
};

window.AuthView = AuthView;
