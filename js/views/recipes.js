/* ==========================================================================
   VIEW: RECIPE COST ESTIMATOR & PRICING CALCULATOR — LUMORA LUXURY DESIGN
   Dynamic Material Costing, Labor, Electricity Overhead & Smooth Profit Slider
   Direct In-Place DOM Updates (Zero Stuttering Mid-Drag)
   ========================================================================== */

const RecipesView = {
  selectedRecipeId: 'rec-1',
  marginSliders: {},

  render() {
    const store = window.bakeryStore;
    const recipes = store.getRecipes();

    if (!this.selectedRecipeId && recipes.length > 0) {
      this.selectedRecipeId = recipes[0].id;
    }

    const currentRecipe = recipes.find(r => r.id === this.selectedRecipeId) || recipes[0];
    const costBreakdown = currentRecipe ? store.calculateRecipeCost(currentRecipe) : null;
    const margin = currentRecipe ? (this.marginSliders[currentRecipe.id] || 55) : 55;

    // Suggested Selling Price formula: Selling Price = Total Cost / (1 - Margin/100)
    let suggestedPrice = 0;
    let profitPerUnit = 0;
    const costPerUnit = (costBreakdown && costBreakdown.costPerUnit > 0) ? costBreakdown.costPerUnit : 0;
    if (costPerUnit > 0) {
      suggestedPrice = Math.round((costPerUnit / (1 - (margin / 100))) / 10) * 10;
      profitPerUnit = Math.round(suggestedPrice - costPerUnit);
    }

    return `
      <div class="recipes-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Recipe Cost Estimator</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Live cost calculation linked to pantry compound, butter & box rates</p>
          </div>
          <button onclick="RecipesView.openAddRecipeModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>New Recipe</span>
          </button>
        </div>

        <!-- Recipe Selector Dropdown -->
        <div class="bento-card" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <label style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; flex-shrink: 0;">
            Select Recipe:
          </label>
          <select 
            onchange="RecipesView.selectRecipe(this.value)" 
            class="form-select" 
            style="flex: 1; font-size: 12.5px; font-weight: 800; padding: 8px 12px; background: var(--bg-card); color: var(--text-main); border-radius: var(--radius-sm);"
          >
            ${recipes.map(r => `
              <option value="${r.id}" ${this.selectedRecipeId === r.id ? 'selected' : ''}>
                ${r.name}
              </option>
            `).join('')}
          </select>
        </div>

        ${!currentRecipe ? BakeryUI.getEmptyIllustration('recipes') : `
          <!-- Main Calculation Bento Card -->
          <div class="bento-card" style="padding: 16px 16px;">
            
            <!-- Recipe Title & Batch Yield -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); gap: 10px;">
              <div style="display: flex; gap: 10px; align-items: center; min-width: 0;">
                <div style="width: 46px; height: 46px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; border: 1px solid var(--border-light); background: var(--c-sand);">
                  <img src="${currentRecipe.image || BAKERY_ASSETS.cakeChocolate}" alt="${currentRecipe.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="min-width: 0;">
                  <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0; word-break: break-word;">
                    ${currentRecipe.name}
                  </h3>
                  <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                    Yield: <strong style="color: var(--text-main);">${currentRecipe.yieldCount} ${currentRecipe.yieldUnit}</strong> • Bake: ${currentRecipe.bakeTimeMinutes} mins @ ${currentRecipe.ovenTemp}
                  </div>
                </div>
              </div>

              <div style="text-align: right; flex-shrink: 0;">
                <div style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Total Unit Cost</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--c-primary); font-variant-numeric: tabular-nums;">
                  ${BakeryUI.formatCurrency(costBreakdown.costPerUnit)}
                </div>
              </div>
            </div>

            <!-- Ingredients & Packaging Live Pricing Table -->
            <div style="margin: 14px 0 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                  Ingredients & Packaging Breakdown
                </span>
                <button onclick="RecipesView.openAddIngredientToRecipeModal('${currentRecipe.id}')" class="btn-3d btn-3d-secondary" style="font-size: 10.5px; padding: 4px 10px;">
                  + Add Item
                </button>
              </div>

              <div style="border: 1px solid var(--border-light); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-card);">
                <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
                  <thead>
                    <tr style="background: var(--c-sand); border-bottom: 1px solid var(--border-light);">
                      <th style="padding: 7px 8px; text-align: left; font-weight: 800; color: var(--text-muted);">Pantry Item</th>
                      <th style="padding: 7px 6px; text-align: center; font-weight: 800; color: var(--text-muted); width: 65px;">Used</th>
                      <th style="padding: 7px 6px; text-align: right; font-weight: 800; color: var(--text-muted); width: 75px;">Rate</th>
                      <th style="padding: 7px 8px; text-align: right; font-weight: 800; color: var(--text-muted); width: 70px;">Cost</th>
                      <th style="padding: 7px 4px; width: 26px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${currentRecipe.items.map((it, idx) => {
                      const ing = store.getIngredient(it.ingredientId);
                      const unitRate = ing ? ing.unitCost : 0;
                      const lineCost = Math.round(((Number(it.qty) || 0) * unitRate) * 100) / 100;
                      const displayQty = (it.unit === 'kg' && it.qty < 1) ? `${Math.round(it.qty * 1000)}g` : `${it.qty} ${it.unit}`;

                      return `
                        <tr style="border-bottom: 1px solid var(--border-light);">
                          <td style="padding: 7px 8px; font-weight: 700; color: var(--text-main); word-break: break-word;">
                            ${it.name}
                          </td>
                          <td style="padding: 7px 6px; text-align: center; color: var(--text-muted); font-weight: 600;">
                            ${displayQty}
                          </td>
                          <td style="padding: 7px 6px; text-align: right; color: var(--text-faint); font-variant-numeric: tabular-nums;">
                            ₹${unitRate}/${it.unit}
                          </td>
                          <td style="padding: 7px 8px; text-align: right; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">
                            ₹${lineCost.toFixed(2)}
                          </td>
                          <td style="padding: 7px 4px; text-align: center;">
                            <button onclick="RecipesView.removeItemFromRecipe('${currentRecipe.id}', ${idx})" style="background: none; border: none; color: var(--error); cursor: pointer; font-size: 13px;" title="Remove">✕</button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Raw Materials Sum -->
              <div style="display: flex; justify-content: flex-end; padding: 6px 4px; font-size: 11.5px; color: var(--text-muted);">
                <span>Materials & Boxes: <strong style="color: var(--text-main); font-variant-numeric: tabular-nums;">₹${costBreakdown.materialCost.toFixed(2)}</strong></span>
              </div>
            </div>

            <!-- Labor & Electricity / Gas Overhead Split -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              <div class="bento-card" style="padding: 10px 12px;">
                <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                  Baker Labor Cost
                </div>
                <div style="font-size: 15px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums; margin-top: 2px;">
                  ₹${costBreakdown.laborCost.toFixed(2)}
                </div>
                <div style="font-size: 10px; color: var(--text-faint); margin-top: 1px;">
                  ${currentRecipe.laborMinutes} mins @ ₹${currentRecipe.hourlyLaborRate}/hr
                </div>
              </div>

              <div class="bento-card" style="padding: 10px 12px;">
                <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                  Gas & Power Overhead
                </div>
                <div style="font-size: 15px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums; margin-top: 2px;">
                  ₹${costBreakdown.overheadCost.toFixed(2)}
                </div>
                <div style="font-size: 10px; color: var(--text-faint); margin-top: 1px;">
                  ${currentRecipe.overheadPercent}% oven gas & power
                </div>
              </div>
            </div>

            <!-- Butter-Smooth Profit Margin Slider (Instant in-place update) -->
            <div class="bento-card" style="padding: 14px 14px; margin-bottom: 12px; border: 1.5px solid var(--border-light);" id="recipe-slider-container" data-cost="${costPerUnit}" data-yield="${currentRecipe.yieldUnit || 'unit'}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                  Desired Profit Margin
                </label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button type="button" onclick="RecipesView.stepMargin('${currentRecipe.id}', -5)" class="btn-3d btn-3d-secondary" style="padding: 3px 8px; font-size: 11px;">- 5%</button>
                  <span id="margin-display-badge" style="font-size: 14px; font-weight: 800; color: var(--c-primary); background: var(--c-sand); padding: 3px 10px; border-radius: 8px; border: 1px solid var(--border-light); font-variant-numeric: tabular-nums;">
                    ${margin}%
                  </span>
                  <button type="button" onclick="RecipesView.stepMargin('${currentRecipe.id}', 5)" class="btn-3d btn-3d-secondary" style="padding: 3px 8px; font-size: 11px;">+ 5%</button>
                </div>
              </div>

              <!-- Native range slider with pan-x touch action -->
              <input 
                id="recipe-margin-range"
                type="range" 
                min="30" 
                max="80" 
                step="1"
                value="${margin}" 
                oninput="RecipesView.updateMargin('${currentRecipe.id}', this.value)"
                class="touch-slider"
                style="width: 100%; cursor: pointer;"
              />

              <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-faint); margin-top: 2px;">
                <span>35% (Wholesale)</span>
                <span>50% (Standard Retail)</span>
                <span>65%+ (Artisan Gourmet)</span>
              </div>
            </div>

            <!-- Final Suggested Selling Price Callout -->
            <div class="bento-card" style="padding: 14px 16px; background: var(--bg-card); border-left: 4px solid var(--c-primary); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <div>
                <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                  Recommended Selling Price
                </div>
                <div id="suggested-price-display" style="font-size: 24px; font-weight: 800; color: var(--c-primary); font-family: var(--font-heading); font-variant-numeric: tabular-nums; margin-top: 1px;">
                  ${BakeryUI.formatCurrency(suggestedPrice)}
                </div>
                <div id="net-profit-display" style="font-size: 11px; color: #2E7D5B; font-weight: 800; margin-top: 2px;">
                  Net Profit: +${BakeryUI.formatCurrency(profitPerUnit)} per ${currentRecipe.yieldUnit}
                </div>
              </div>

              <button onclick="RecipesView.applyToProduct('${currentRecipe.name}')" class="btn-3d btn-3d-primary" style="font-size: 11.5px; padding: 8px 12px; flex-shrink: 0;">
                Update Menu Price
              </button>
            </div>

            ${currentRecipe.notes ? `
              <div style="margin-top: 10px; font-size: 11.5px; color: var(--text-muted); background: var(--c-sand); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                <strong>Baker Note:</strong> ${currentRecipe.notes}
              </div>
            ` : ''}

          </div>
        `}

      </div>
    `;
  },

  selectRecipe(id) {
    this.selectedRecipeId = id;
    window.bakeryApp.refreshCurrentView();
  },

  // Instant in-place DOM update so slider never stutters or drops touch focus
  updateMargin(recipeId, val) {
    const marginInt = parseInt(val);
    this.marginSliders[recipeId] = marginInt;

    // 1. Update margin badge text
    const badge = document.getElementById('margin-display-badge');
    if (badge) badge.innerText = `${marginInt}%`;

    // 2. Synchronize slider input value if called via step buttons
    const range = document.getElementById('recipe-margin-range');
    if (range && range.value !== String(marginInt)) range.value = marginInt;

    // 3. Compute price dynamically from data attribute
    const container = document.getElementById('recipe-slider-container');
    if (container) {
      const costPerUnit = parseFloat(container.getAttribute('data-cost')) || 0;
      const yieldUnit = container.getAttribute('data-yield') || 'unit';
      if (costPerUnit > 0) {
        const suggestedPrice = Math.round((costPerUnit / (1 - (marginInt / 100))) / 10) * 10;
        const profit = Math.round(suggestedPrice - costPerUnit);

        const priceEl = document.getElementById('suggested-price-display');
        const profitEl = document.getElementById('net-profit-display');
        if (priceEl) priceEl.innerText = BakeryUI.formatCurrency(suggestedPrice);
        if (profitEl) profitEl.innerText = `Net Profit: +${BakeryUI.formatCurrency(profit)} per ${yieldUnit}`;
      }
    }
  },

  stepMargin(recipeId, delta) {
    const current = this.marginSliders[recipeId] || 55;
    const next = Math.max(30, Math.min(80, current + delta));
    this.updateMargin(recipeId, next);
  },

  removeItemFromRecipe(recipeId, itemIndex) {
    const recipe = window.bakeryStore.getRecipe(recipeId);
    if (!recipe) return;

    recipe.items.splice(itemIndex, 1);
    window.bakeryStore.saveRecipe(recipe);
    BakeryUI.toast('Item removed from recipe');
    window.bakeryApp.refreshCurrentView();
  },

  openAddIngredientToRecipeModal(recipeId) {
    const inventory = window.bakeryStore.getInventory();
    const html = `
      <form onsubmit="RecipesView.handleAddIngredientToRecipeSubmit(event, '${recipeId}')" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Select Pantry Item / Box</label>
          <select name="ingredientId" class="form-select" onchange="RecipesView.onSelectPantryItem(this)">
            ${inventory.map(i => `<option value="${i.id}" data-unit="${i.unit}" data-cost="${i.unitCost}">${i.name} (₹${i.unitCost}/${i.unit})</option>`).join('')}
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Quantity</label>
            <input type="number" step="0.001" name="qty" required placeholder="e.g. 0.25 (for 250g) or 2" class="form-input" />
          </div>
          <div>
            <label class="form-label">Unit</label>
            <input type="text" name="unit" id="modal-item-unit" value="${inventory[0]?.unit || 'kg'}" readonly class="form-input" style="background: var(--c-sand);" />
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); background: var(--c-sand); padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          Tip: For grams, enter as fraction of kg (e.g. 200g = 0.2, 50g = 0.05). For pieces or packaging boxes, enter count.
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Add to Recipe</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Add Ingredient or Box to Recipe');
  },

  onSelectPantryItem(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const unit = selectedOption.getAttribute('data-unit') || 'kg';
    const unitInput = document.getElementById('modal-item-unit');
    if (unitInput) unitInput.value = unit;
  },

  handleAddIngredientToRecipeSubmit(e, recipeId) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const ingredientId = formData.get('ingredientId');
    const ing = window.bakeryStore.getIngredient(ingredientId);
    if (!ing) return;

    const recipe = window.bakeryStore.getRecipe(recipeId);
    if (!recipe) return;

    recipe.items.push({
      ingredientId,
      name: ing.name,
      qty: parseFloat(formData.get('qty')) || 0,
      unit: ing.unit
    });

    window.bakeryStore.saveRecipe(recipe);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Added ${ing.name} to ${recipe.name}!`);
    window.bakeryApp.refreshCurrentView();
  },

  applyToProduct(recipeName) {
    const products = window.bakeryStore.getProducts();
    const matched = products.find(p => recipeName.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(recipeName.toLowerCase()));
    
    // Read current suggested price text from display
    const priceText = document.getElementById('suggested-price-display')?.innerText || '₹500';
    const priceNumeric = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 500;

    if (matched) {
      window.bakeryStore.saveProduct({ id: matched.id, price: priceNumeric });
      BakeryUI.toast(`Updated price of ${matched.name} to ${BakeryUI.formatCurrency(priceNumeric)}!`);
    } else {
      BakeryUI.toast(`Estimated price: ${BakeryUI.formatCurrency(priceNumeric)}`);
    }
  },

  openAddRecipeModal() {
    const html = `
      <form onsubmit="RecipesView.handleAddRecipeSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Recipe / Item Name</label>
          <input type="text" name="name" required placeholder="e.g. 10 inch Walnut Brownie Box or Pista Cake" class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Yield Count</label>
            <input type="number" name="yieldCount" required value="1" min="1" class="form-input" />
          </div>
          <div>
            <label class="form-label">Yield Unit</label>
            <input type="text" name="yieldUnit" required placeholder="e.g. 8 inch Box or 1kg Cake" class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Baker Labor Time (Mins)</label>
            <input type="number" name="laborMinutes" required value="30" class="form-input" />
          </div>
          <div>
            <label class="form-label">Hourly Labor Rate (₹)</label>
            <input type="number" name="hourlyLaborRate" required value="150" class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Baking Temp & Instructions</label>
          <input type="text" name="ovenTemp" placeholder="e.g. 175°C for 30 mins" class="form-input" />
        </div>

        <div>
          <label class="form-label">Recipe Notes</label>
          <textarea name="notes" placeholder="Melt compounds gently, resting times..." class="form-input" rows="2"></textarea>
        </div>

        <!-- Recipe Photo -->
        ${BakeryUI.renderImageUpload({
          id: 'recipe-image',
          label: 'Recipe Finished Photo (Optional)',
          helpText: 'Display photo in recipe estimator.'
        })}

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Create Recipe</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Create New Recipe Estimate');
  },

  handleAddRecipeSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const imageVal = document.getElementById('recipe-image-value')?.value || BAKERY_ASSETS.cakeChocolate;

    const newRec = {
      name: formData.get('name'),
      yieldCount: parseInt(formData.get('yieldCount')) || 1,
      yieldUnit: formData.get('yieldUnit'),
      laborMinutes: parseInt(formData.get('laborMinutes')) || 30,
      hourlyLaborRate: parseFloat(formData.get('hourlyLaborRate')) || 150,
      bakeTimeMinutes: 30,
      ovenTemp: formData.get('ovenTemp') || '175°C',
      overheadPercent: 12,
      image: imageVal,
      items: [
        { ingredientId: 'ing-1', name: 'Dark compound', qty: 0.20, unit: 'kg' },
        { ingredientId: 'ing-4', name: 'Butter (Pasteurized)', qty: 0.10, unit: 'kg' },
        { ingredientId: 'ing-24', name: 'Brownie Packing box (8 inch)', qty: 1, unit: 'pcs' }
      ],
      notes: formData.get('notes')
    };

    window.bakeryStore.saveRecipe(newRec);
    this.selectedRecipeId = newRec.id;
    BakeryUI.closeSheet();
    BakeryUI.toast(`Recipe "${newRec.name}" created! Add more ingredients as needed.`);
    window.bakeryApp.refreshCurrentView();
  }
};

window.RecipesView = RecipesView;
