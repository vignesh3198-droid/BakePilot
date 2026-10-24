# The Crust & Crumb — Professional Home Bakery & Cloud Kitchen Manager (Indian Market)

A clean, classic, editorial luxury management and recipe costing software designed specifically for Indian home bakers, cloud kitchens, and custom cake studios.

---

## 💎 Design System & Visual Philosophy

- **Aesthetic**: Classic, clean, neat, and mature SaaS interface.
- **Palette**:
  - **Ivory Linen / Warm Alabaster Canvas**: `#FAF8F5`
  - **Porcelain White Surfaces**: `#FFFFFF` with ultra-fine razor hairline borders (`#E8E2D9`)
  - **Deep Rosewood Noir**: `#853744` (Primary action fill & highlights)
  - **Deep Espresso Charcoal**: `#1D1917` (High-contrast typography)
  - **Warm Tuscan Gold**: `#C29338` (Accents, float balances & highlights)
  - **Muted Sage Green**: `#2E6B4F` (Net profits, paid status & in-stock items)
  - **Soft Terracotta**: `#B55029` (Low-stock threshold alerts)
- **Ergonomics & Navigation**:
  - **Swipe-Back Gesture**: Swipe right from the left edge on any mobile touchscreen to navigate back smoothly!
  - **Browser History Integration**: Full `popstate` support for Android native back buttons and desktop browser navigation.
  - **Contextual Top Back Button**: Direct `← Back` button on every sub-screen.
  - **Thumb-Friendly Bottom Navigation**: Floating frosted glass dock with Home, Orders, Billing, Pantry, and More.

---

## 🇮🇳 Indian Market Pantry & Item Pricing Preloaded

Every ingredient and packaging item includes an **editable unit purchase price (₹)** that is directly linked to the Recipe Cost Estimator:

### 1. Compounds & Chocolates
- **Dark compound** (Morde / 2M) — `₹195.00 / kg`
- **White compound** — `₹220.00 / kg`
- **Milk compound** — `₹210.00 / kg`
- **Cocoa powder** — `₹480.00 / kg`

### 2. Dairy & Fats
- **Butter (Pasteurized)** (Amul) — `₹540.00 / kg`
- **Whipping cream** (Rich's / Tropolite) — `₹195.00 / kg`
- **Egg** — `₹7.00 / piece`

### 3. Flours, Sugars & Essentials
- **Maida** — `₹42.00 / kg`
- **Sugar** — `₹46.00 / kg`
- **Brown sugar** — `₹110.00 / kg`
- **Baking powder** — `₹380.00 / kg`
- **Baking soda** — `₹240.00 / kg`
- **Nuts** (Almonds, Cashews, Walnuts) — `₹850.00 / kg`

### 4. Essences & Flavours (Indian Favorites)
- **Vanilla essence** — `₹0.65 / ml`
- **Rosemilk essence** — `₹0.75 / ml`
- **Pista essence** — `₹0.75 / ml`
- **Blackcurrant essence** — `₹0.80 / ml`
- **Mango essence** — `₹0.75 / ml`
- **Butterscotch essence** — `₹0.80 / ml`

### 5. Boxes, Covers & Packaging
- **Brownie Packing box (8 inch)** — `₹18.00 / pc`
- **Brownie Packing box (10 inch)** — `₹25.00 / pc`
- **Cake Packing box (8 inch)** — `₹24.00 / pc`
- **Cake Packing box (10 inch)** — `₹32.00 / pc`
- **10Inch Packing cover (Carry sleeve)** — `₹6.00 / pc`
- **Sandwich Box** — `₹8.00 / pc`
- **Brownie PVC 3*3 Box** — `₹12.00 / pc`

### 6. Cafe, Savoury & Party Decor
- **Bread** — `₹45.00 / loaf`
- **Mayonise** — `₹180.00 / kg`
- **Sauce tomato** — `₹140.00 / kg`
- **Sauce sachet** — `₹1.50 / pc`
- **Cake birthday toppers** — `₹35.00 / pc`
- **Birthday candles** — `₹20.00 / pkt`

*Additional custom items can be added with custom measurement units (`kg`, `g`, `L`, `ml`, `pcs`, `pkt`, `loaf`) at any time.*

---

## 🧮 Dynamic Recipe Cost Estimator

When calculating or estimating prices for brownies, celebration cakes, or sandwiches:
1. Select any ingredient or packaging box from the pantry dropdown.
2. Specify the quantity needed (e.g. `0.22` kg of Dark compound, `1` 8-inch Brownie box, `1` 10-inch carry cover).
3. The estimator automatically calculates:
   $$\text{Material Cost} = \sum (\text{Qty} \times \text{Pantry Rate})$$
4. Adds baker labor (`minutes` $\times$ `hourly rate`) and oven gas/electricity overhead percentage (`12%`).
5. Adjust the interactive **Profit Margin % Slider** (30% to 80%) to see the recommended selling price and net profit per unit.
6. Click **"Update Menu Price"** to instantly sync with your product catalogue!

---

## 🚀 How to Run

The local server is already running! Open in your browser:
**`http://localhost:3000`**

Or launch `index.html` directly in any web browser.
