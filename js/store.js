/* ==========================================================================
   STATE STORE & CLOUD DATA ENGINE — PASTEL GLASS & CLAY BAKERY MANAGER
   Zero GST, Per-Order Delivery Fee, Image Support, Workspace & Multi-Step Orders
   ========================================================================== */

const STORAGE_KEY = 'bakery_manager_v4_lumora_store';
const AUTH_KEY = 'bakery_manager_v4_user_session';

// Helper: Curated high-resolution bakery photography & brand assets
const BAKERY_ASSETS = {
  bakePilotLogo: 'assets/bakepilot-logo.png',
  defaultLogo: 'assets/bakepilot-logo.png',
  
  // Real Bakery Item Photography (Delicious, High-Resolution, Fast CDN)
  brownieClassic: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
  brownieWalnut: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&auto=format&fit=crop&q=80',
  cakeRosemilk: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
  cakeBlackcurrant: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500&auto=format&fit=crop&q=80',
  cupcakeRedVelvet: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&auto=format&fit=crop&q=80',
  cakeChocolate: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&auto=format&fit=crop&q=80',
  sandwichCafe: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
  workspacePhoto: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  
  // Pantry Ingredients & Packaging Photography
  compoundDark: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
  compoundWhite: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=300&auto=format&fit=crop&q=80',
  butterAmul: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80',
  packagingBox: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80',
  packagingCake: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80',
  nutsAssorted: 'https://images.unsplash.com/photo-1536591375315-1b836835a2b7?w=300&auto=format&fit=crop&q=80',

  // Fallback SVG
  brownieSvg: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
  cakeSvg: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
  cupcakeSvg: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&auto=format&fit=crop&q=80',
  sandwichSvg: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
  workspaceSvg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
};

const initialBakeryData = {
  profile: {
    name: 'The Crust & Crumb Patisserie',
    tagline: 'Artisan Custom Cakes, Fudgy Brownies & Cloud Kitchen',
    baker: 'Ananya Sharma',
    email: 'hello@crustandcrumb.in',
    phone: '+91 98401 55230',
    whatsappNumber: '+91 98401 55230',
    address: '14, Greenways Road, R.A. Puram, Chennai, TN',
    currency: '₹',
    currencySymbol: '₹',
    defaultDeliveryCharge: 60.0,
    fssaiOrLicense: 'FSSAI: 22424001000842',
    invoiceNotes: 'Baked fresh with pure butter and premium chocolate. Please refrigerate cream items immediately upon arrival.',
    instagram: '@crustandcrumb.india',
    activeBusiness: 'The Crust & Crumb (Main Kitchen)',
    businesses: ['The Crust & Crumb (Main Kitchen)', 'Crust & Crumb Express (Kiosk)'],
    logo: BAKERY_ASSETS.defaultLogo,
    brandColor: '#F6C9D0',
    secondaryColor: '#DCD6F7',
    paymentUpi: 'crustandcrumb@okhdfcbank',
    cloudSyncUrl: '/api/sync'
  },

  // Dedicated Kitchen Utilities (Commercial Gas Cylinder, Electricity per unit)
  utilities: {
    gasCylinderRate: 1850.0,
    gasCylinderLifeDays: 20,
    electricityRatePerUnit: 8.50,
    monthlyEstimatedPower: 3200.0,
    waterAndMaintenance: 650.0,
    notes: 'Commercial 19kg cylinder costs ₹1,850 and lasts ~20 baking days. Power calculated on commercial unit rates.'
  },

  // Automated EOD Email Report Settings (11:50 PM)
  eodReport: {
    frequency: 'daily', // 'daily', 'weekly', 'monthly', 'none'
    scheduledTime: '23:50',
    email: 'hello@crustandcrumb.in',
    lastSentAt: null,
    includeJsonBackup: true
  },

  // Customizable Invoice Layout & Field Display Settings
  invoiceSettings: {
    showBakeryAddress: true,
    showBakeryPhone: true,
    showFssai: true,
    showPaymentUpi: true,
    showDeliveryAddress: true,
    showCustomerPhone: true,
    showCakeMessage: true,
    showFooterNotes: true,
    showInstagram: true,
    invoiceHeaderTitle: 'Official Bill',
    whatsappGreeting: 'Namaste {customer}! 🙏',
    invoiceNotes: 'Baked fresh with pure butter and premium chocolate. Please refrigerate cream items immediately upon arrival.'
  },

  // Dedicated Kitchen Workspace Settings
  workspace: {
    name: 'The Crust & Crumb — Main Patisserie Studio',
    coverPhoto: BAKERY_ASSETS.workspaceSvg,
    address: '14, Greenways Road, R.A. Puram, Chennai, TN',
    isHomeKitchenPrivate: false,
    pickupLocationInstructions: 'Gate 2, Ring the bakery buzzer on ground floor. Parking available in driveway.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:30 AM - 08:30 PM',
    orderAcceptanceHours: '09:00 AM - 07:00 PM',
    minAdvanceNoticeHours: 24,
    defaultPrepTimeHours: 4,
    holidayDates: [],
    equipment: ['Double Deck Convection Oven (60L)', 'Stand Mixer (7L)', 'Blast Chiller', 'Commercial Microwave'],
    notes: 'Brownies must be completely cooled for 45 minutes before slicing and packing in 8" or 10" presentation boxes.'
  },

  // Indian Market Ingredients & Packaging Items
  inventory: [
    { id: 'ing-1', name: 'Dark compound', category: 'Compounds & Chocolates', currentStock: 12.0, minThreshold: 3.0, unit: 'kg', unitCost: 195.0, supplier: 'BakePro Supplies', image: '' },
    { id: 'ing-2', name: 'White compound', category: 'Compounds & Chocolates', currentStock: 8.5, minThreshold: 2.0, unit: 'kg', unitCost: 220.0, supplier: 'BakePro Supplies', image: '' },
    { id: 'ing-3', name: 'Milk compound', category: 'Compounds & Chocolates', currentStock: 6.0, minThreshold: 2.0, unit: 'kg', unitCost: 210.0, supplier: 'BakePro Supplies', image: '' },
    { id: 'ing-4', name: 'Butter (Pasteurized)', category: 'Dairy & Fats', currentStock: 4.5, minThreshold: 5.0, unit: 'kg', unitCost: 540.0, supplier: 'Amul Dairy Distributor', image: '' },
    { id: 'ing-5', name: 'Whipping cream', category: 'Dairy & Fats', currentStock: 5.0, minThreshold: 4.0, unit: 'kg', unitCost: 195.0, supplier: 'Richs / Tropolite Depot', image: '' },
    { id: 'ing-6', name: 'Egg', category: 'Dairy & Fats', currentStock: 48, minThreshold: 30, unit: 'pcs', unitCost: 7.0, supplier: 'Local Poultry Wholesale', image: '' },
    { id: 'ing-7', name: 'Maida', category: 'Flours & Sugars', currentStock: 25.0, minThreshold: 8.0, unit: 'kg', unitCost: 42.0, supplier: 'Sri Murugan Wholesale Mart', image: '' },
    { id: 'ing-8', name: 'Sugar', category: 'Flours & Sugars', currentStock: 20.0, minThreshold: 6.0, unit: 'kg', unitCost: 46.0, supplier: 'Sri Murugan Wholesale Mart', image: '' },
    { id: 'ing-9', name: 'Brown sugar', category: 'Flours & Sugars', currentStock: 4.0, minThreshold: 2.0, unit: 'kg', unitCost: 110.0, supplier: 'BakeMart Wholesale', image: '' },
    { id: 'ing-10', name: 'Cocoa powder', category: 'Compounds & Chocolates', currentStock: 3.5, minThreshold: 1.5, unit: 'kg', unitCost: 480.0, supplier: 'BakePro Supplies', image: '' },
    { id: 'ing-11', name: 'Baking powder', category: 'Leavening & Essentials', currentStock: 1.2, minThreshold: 0.5, unit: 'kg', unitCost: 380.0, supplier: 'BakeMart Wholesale', image: '' },
    { id: 'ing-12', name: 'Baking soda', category: 'Leavening & Essentials', currentStock: 0.8, minThreshold: 0.4, unit: 'kg', unitCost: 240.0, supplier: 'BakeMart Wholesale', image: '' },
    { id: 'ing-13', name: 'Nuts (Almonds, Cashews, Walnuts)', category: 'Nuts & Inclusions', currentStock: 2.8, minThreshold: 1.0, unit: 'kg', unitCost: 850.0, supplier: 'Royal Dry Fruits', image: '' },
    
    // Essences & Flavours
    { id: 'ing-14', name: 'Vanilla essence', category: 'Essences & Flavours', currentStock: 400, minThreshold: 150, unit: 'ml', unitCost: 0.65, supplier: 'Ossoro Flavour House', image: '' },
    { id: 'ing-15', name: 'Rosemilk essence', category: 'Essences & Flavours', currentStock: 350, minThreshold: 150, unit: 'ml', unitCost: 0.75, supplier: 'Flying Man / Ossoro', image: '' },
    { id: 'ing-16', name: 'Pista essence', category: 'Essences & Flavours', currentStock: 250, minThreshold: 100, unit: 'ml', unitCost: 0.75, supplier: 'Ossoro Flavour House', image: '' },
    { id: 'ing-17', name: 'Blackcurrant essence', category: 'Essences & Flavours', currentStock: 200, minThreshold: 100, unit: 'ml', unitCost: 0.80, supplier: 'Ossoro Flavour House', image: '' },
    { id: 'ing-18', name: 'Mango essence', category: 'Essences & Flavours', currentStock: 200, minThreshold: 100, unit: 'ml', unitCost: 0.75, supplier: 'Ossoro Flavour House', image: '' },
    { id: 'ing-19', name: 'Butterscotch essence', category: 'Essences & Flavours', currentStock: 250, minThreshold: 100, unit: 'ml', unitCost: 0.80, supplier: 'Ossoro Flavour House', image: '' },

    // Cafe & Savoury
    { id: 'ing-20', name: 'Bread', category: 'Cafe & Savoury', currentStock: 6, minThreshold: 4, unit: 'loaf', unitCost: 45.0, supplier: 'Modern / Britannia Depot', image: '' },
    { id: 'ing-21', name: 'Mayonise', category: 'Cafe & Savoury', currentStock: 3.2, minThreshold: 1.5, unit: 'kg', unitCost: 180.0, supplier: 'Veeba Wholesale', image: '' },
    { id: 'ing-22', name: 'Sauce tomato', category: 'Cafe & Savoury', currentStock: 4.0, minThreshold: 2.0, unit: 'kg', unitCost: 140.0, supplier: 'Kissan Wholesale', image: '' },
    { id: 'ing-23', name: 'Sauce sachet', category: 'Cafe & Savoury', currentStock: 120, minThreshold: 50, unit: 'pcs', unitCost: 1.50, supplier: 'Kissan Wholesale', image: '' },

    // Boxes & Packaging
    { id: 'ing-24', name: 'Brownie Packing box (8 inch)', category: 'Boxes & Packaging', currentStock: 18, minThreshold: 25, unit: 'pcs', unitCost: 18.0, supplier: 'PackPrint Corrugators', image: '' },
    { id: 'ing-25', name: 'Brownie Packing box (10 inch)', category: 'Boxes & Packaging', currentStock: 22, minThreshold: 20, unit: 'pcs', unitCost: 25.0, supplier: 'PackPrint Corrugators', image: '' },
    { id: 'ing-26', name: 'Cake Packing box (8 inch)', category: 'Boxes & Packaging', currentStock: 14, minThreshold: 20, unit: 'pcs', unitCost: 24.0, supplier: 'PackPrint Corrugators', image: '' },
    { id: 'ing-27', name: 'Cake Packing box (10 inch)', category: 'Boxes & Packaging', currentStock: 16, minThreshold: 15, unit: 'pcs', unitCost: 32.0, supplier: 'PackPrint Corrugators', image: '' },
    { id: 'ing-28', name: '10Inch Packing cover', category: 'Boxes & Packaging', currentStock: 45, minThreshold: 30, unit: 'pcs', unitCost: 6.0, supplier: 'EcoCarry Bags', image: '' },
    { id: 'ing-29', name: 'Sandwich Box', category: 'Boxes & Packaging', currentStock: 35, minThreshold: 25, unit: 'pcs', unitCost: 8.0, supplier: 'EcoCarry Bags', image: '' },
    { id: 'ing-30', name: 'Brownie PVC 3*3 Box', category: 'Boxes & Packaging', currentStock: 28, minThreshold: 20, unit: 'pcs', unitCost: 12.0, supplier: 'ClearView Plastics', image: '' },
    { id: 'ing-31', name: 'Cake birthday toppers', category: 'Party & Decor', currentStock: 24, minThreshold: 15, unit: 'pcs', unitCost: 35.0, supplier: 'PartyWorld Wholesale', image: '' },
    { id: 'ing-32', name: 'Birthday candles', category: 'Party & Decor', currentStock: 30, minThreshold: 20, unit: 'pkt', unitCost: 20.0, supplier: 'PartyWorld Wholesale', image: '' }
  ],

  // Products with Variants, Customizations and Images
  products: [
    {
      id: 'prod-1',
      name: 'Classic Fudgy Dark Chocolate Brownie',
      category: 'Brownies',
      price: 550.0,
      costPrice: 215.0,
      unit: 'box',
      image: BAKERY_ASSETS.brownieClassic,
      description: 'Loaded with Morde 55% dark compound, Amul butter, rich cocoa and crackly crust.',
      allergens: ['Dairy', 'Eggs', 'Gluten'],
      inStock: true,
      variants: [
        { id: 'v1', name: '8" Box (6-8 slices)', price: 550.0, costPrice: 215.0 },
        { id: 'v2', name: '10" Box (12-16 slices)', price: 950.0, costPrice: 380.0 },
        { id: 'v3', name: 'Single Serve (PVC Box)', price: 85.0, costPrice: 32.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Custom gold ribbon message'
      }
    },
    {
      id: 'prod-2',
      name: 'Signature 10" Walnut Brownie Celebration Slab',
      category: 'Brownies',
      price: 950.0,
      costPrice: 380.0,
      unit: 'box',
      image: BAKERY_ASSETS.brownieWalnut,
      description: 'Extra-large 10-inch fudgy brownie slab topped with toasted Kashmiri walnuts.',
      allergens: ['Dairy', 'Eggs', 'Gluten', 'Tree Nuts'],
      inStock: true,
      variants: [
        { id: 'v1', name: '10" Slab (Full)', price: 950.0, costPrice: 380.0 },
        { id: 'v2', name: '10" Slab with Extra Nuts', price: 1050.0, costPrice: 420.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Custom tag on box'
      }
    },
    {
      id: 'prod-3',
      name: 'Rosemilk Tres Leches Celebration Cake',
      category: 'Cakes',
      price: 850.0,
      costPrice: 310.0,
      unit: 'cake',
      image: BAKERY_ASSETS.cakeRosemilk,
      description: 'Soft sponge soaked in cardamom rosemilk, whipped cream frosting, dried rose petals and pista.',
      allergens: ['Dairy', 'Gluten', 'Tree Nuts'],
      inStock: true,
      variants: [
        { id: 'v1', name: '500g Bento Cake', price: 480.0, costPrice: 175.0 },
        { id: 'v2', name: '1 kg Box (8")', price: 850.0, costPrice: 310.0 },
        { id: 'v3', name: '1.5 kg Celebration Cake', price: 1250.0, costPrice: 460.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Piped cake message (e.g. Happy Birthday)'
      }
    },
    {
      id: 'prod-4',
      name: 'Blackcurrant Dream Whipped Cake',
      category: 'Cakes',
      price: 780.0,
      costPrice: 280.0,
      unit: 'cake',
      image: BAKERY_ASSETS.cakeBlackcurrant,
      description: 'Airy vanilla sponge layered with rich blackcurrant compote, whipped cream and dark compound drip.',
      allergens: ['Dairy', 'Gluten'],
      inStock: true,
      variants: [
        { id: 'v1', name: '500g Bento', price: 440.0, costPrice: 160.0 },
        { id: 'v2', name: '1 kg Box (8")', price: 780.0, costPrice: 280.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Cake topper or piped text'
      }
    },
    {
      id: 'prod-5',
      name: 'Red Velvet Cream Cheese Cupcakes',
      category: 'Cupcakes',
      price: 450.0,
      costPrice: 160.0,
      unit: 'pack',
      image: BAKERY_ASSETS.cupcakeRedVelvet,
      description: 'Velvety cocoa sponge topped with smooth cream cheese frosting swirl and red velvet crumb.',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      inStock: true,
      variants: [
        { id: 'v1', name: 'Box of 6 pieces', price: 450.0, costPrice: 160.0 },
        { id: 'v2', name: 'Box of 12 pieces', price: 850.0, costPrice: 300.0 },
        { id: 'v3', name: 'Box of 4 pieces', price: 320.0, costPrice: 110.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Greeting card message'
      }
    },
    {
      id: 'prod-6',
      name: 'Artisan Chocolate Celebration Cake',
      category: 'Cakes',
      price: 800.0,
      costPrice: 290.0,
      unit: 'cake',
      image: BAKERY_ASSETS.cakeChocolate,
      description: 'Rich dark chocolate sponge layered with Belgian dark chocolate ganache and chocolate curls.',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      inStock: true,
      variants: [
        { id: 'v1', name: '500g Cake', price: 480.0, costPrice: 180.0 },
        { id: 'v2', name: '1 kg Cake', price: 800.0, costPrice: 290.0 },
        { id: 'v3', name: '2 kg Tiered Cake', price: 1550.0, costPrice: 560.0 }
      ],
      customizationOptions: {
        allowCakeMessage: true,
        messagePrompt: 'Custom cake message (max 30 chars)'
      }
    },
    {
      id: 'prod-7',
      name: 'Cafe Grilled Cheese Mayo Sandwich (Pack of 2)',
      category: 'Savouries',
      price: 180.0,
      costPrice: 58.0,
      unit: 'pack',
      image: BAKERY_ASSETS.sandwichCafe,
      description: 'Toasted bakery bread packed with creamy mayo, herbs, tomato sauce and butter in sandwich box.',
      allergens: ['Dairy', 'Gluten'],
      inStock: true,
      variants: [
        { id: 'v1', name: 'Pack of 2 Sandwiches', price: 180.0, costPrice: 58.0 },
        { id: 'v2', name: 'Pack of 4 Party Sandwiches', price: 340.0, costPrice: 110.0 }
      ],
      customizationOptions: {
        allowCakeMessage: false
      }
    }
  ],

  // Recipes linked to pantry rates
  recipes: [
    {
      id: 'rec-1',
      name: 'Classic Fudgy Brownie (8-inch Box)',
      image: BAKERY_ASSETS.brownieSvg,
      yieldCount: 1,
      yieldUnit: '8" Box (6-8 Slices)',
      prepTimeMinutes: 20,
      bakeTimeMinutes: 30,
      ovenTemp: '175°C / 350°F',
      laborMinutes: 30,
      hourlyLaborRate: 150.0,
      overheadPercent: 12,
      items: [
        { ingredientId: 'ing-1', name: 'Dark compound', qty: 0.22, unit: 'kg' },
        { ingredientId: 'ing-4', name: 'Butter (Pasteurized)', qty: 0.12, unit: 'kg' },
        { ingredientId: 'ing-8', name: 'Sugar', qty: 0.15, unit: 'kg' },
        { ingredientId: 'ing-6', name: 'Egg', qty: 3, unit: 'pcs' },
        { ingredientId: 'ing-7', name: 'Maida', qty: 0.065, unit: 'kg' },
        { ingredientId: 'ing-10', name: 'Cocoa powder', qty: 0.025, unit: 'kg' },
        { ingredientId: 'ing-14', name: 'Vanilla essence', qty: 5, unit: 'ml' },
        { ingredientId: 'ing-24', name: 'Brownie Packing box (8 inch)', qty: 1, unit: 'pcs' },
        { ingredientId: 'ing-28', name: '10Inch Packing cover', qty: 1, unit: 'pcs' }
      ],
      notes: 'Melt dark compound and butter over low heat. Whisk eggs and sugar until pale ribbon stage.'
    },
    {
      id: 'rec-2',
      name: 'Rosemilk Tres Leches Cake (8-inch 1kg)',
      image: BAKERY_ASSETS.cakeSvg,
      yieldCount: 1,
      yieldUnit: '8" Cake (1kg)',
      prepTimeMinutes: 45,
      bakeTimeMinutes: 35,
      ovenTemp: '165°C / 330°F',
      laborMinutes: 45,
      hourlyLaborRate: 150.0,
      overheadPercent: 15,
      items: [
        { ingredientId: 'ing-7', name: 'Maida', qty: 0.16, unit: 'kg' },
        { ingredientId: 'ing-8', name: 'Sugar', qty: 0.12, unit: 'kg' },
        { ingredientId: 'ing-6', name: 'Egg', qty: 3, unit: 'pcs' },
        { ingredientId: 'ing-11', name: 'Baking powder', qty: 0.005, unit: 'kg' },
        { ingredientId: 'ing-5', name: 'Whipping cream', qty: 0.28, unit: 'kg' },
        { ingredientId: 'ing-15', name: 'Rosemilk essence', qty: 8, unit: 'ml' },
        { ingredientId: 'ing-13', name: 'Nuts (Almonds, Cashews, Walnuts)', qty: 0.03, unit: 'kg' },
        { ingredientId: 'ing-26', name: 'Cake Packing box (8 inch)', qty: 1, unit: 'pcs' },
        { ingredientId: 'ing-31', name: 'Cake birthday toppers', qty: 1, unit: 'pcs' },
        { ingredientId: 'ing-32', name: 'Birthday candles', qty: 1, unit: 'pkt' }
      ],
      notes: 'Poke cooled sponge thoroughly before pouring rosemilk soak.'
    }
  ],

  // Orders with Fulfilment Method, Advance Paid & Balance Due
  orders: [
    {
      id: 'ORD-2101',
      customerName: 'Pooja Sundaram',
      customerPhone: '+91 98401 22910',
      customerWhatsapp: '+91 98401 22910',
      date: new Date().toISOString().split('T')[0],
      deliverySlot: '11:30 AM',
      fulfilmentMethod: 'self_pickup',
      deliveryType: 'Self Pickup',
      deliveryAddress: '',
      deliveryInstructions: 'Customer will collect from kitchen gate',
      status: 'ready',
      paymentStatus: 'paid',
      paymentMethod: 'UPI / GPay',
      items: [
        { productId: 'prod-1', name: 'Classic Fudgy Dark Chocolate Brownie (8" Box)', variant: '8" Box (6-8 slices)', qty: 2, price: 550.0 }
      ],
      subtotal: 1100.0,
      discount: 0,
      deliveryCharge: 0.0,
      total: 1100.0,
      advancePaid: 1100.0,
      balanceDue: 0.0,
      cakeMessage: 'Happy Anniversary Karthik & Pooja',
      notes: 'Attach gold ribbon on both boxes.'
    },
    {
      id: 'ORD-2102',
      customerName: 'Rohan Mehra',
      customerPhone: '+91 99620 44812',
      customerWhatsapp: '+91 99620 44812',
      date: new Date().toISOString().split('T')[0],
      deliverySlot: '03:00 PM - 04:00 PM',
      fulfilmentMethod: 'porter_delivery',
      deliveryType: 'Porter / Third-Party Delivery',
      deliveryAddress: 'Flat 4B, Emerald Heights, T. Nagar, Chennai',
      deliveryInstructions: 'Call recipient upon arrival at tower gate',
      recipientContact: 'Rohan Mehra (+91 99620 44812)',
      externalReference: 'POR-88219-CHN',
      status: 'in-oven',
      paymentStatus: 'partially-paid',
      paymentMethod: 'UPI / PhonePe',
      items: [
        { productId: 'prod-3', name: 'Rosemilk Tres Leches Celebration Cake (8" 1kg)', variant: '1 kg Box (8")', qty: 1, price: 850.0 }
      ],
      subtotal: 850.0,
      discount: 50.0,
      deliveryCharge: 60.0,
      total: 860.0,
      advancePaid: 500.0,
      balanceDue: 360.0,
      cakeMessage: 'Happy Birthday Aanya!',
      notes: 'Add Cake Birthday Topper & candles inside bag.'
    },
    {
      id: 'ORD-2103',
      customerName: 'Kavitha Sridhar',
      customerPhone: '+91 94440 88123',
      customerWhatsapp: '+91 94440 88123',
      date: new Date().toISOString().split('T')[0],
      deliverySlot: '05:30 PM - 06:30 PM',
      fulfilmentMethod: 'own_delivery',
      deliveryType: 'Own Bakery Delivery',
      deliveryAddress: '18, 4th Main Road, Besant Nagar, Chennai',
      deliveryInstructions: 'Leave with security if not reachable',
      recipientContact: 'Kavitha (+91 94440 88123)',
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'Cash on Delivery',
      items: [
        { productId: 'prod-2', name: 'Signature 10" Walnut Brownie Celebration Slab', variant: '10" Slab (Full)', qty: 1, price: 950.0 },
        { productId: 'prod-7', name: 'Cafe Grilled Cheese Mayo Sandwich (Pack of 2)', variant: 'Pack of 2 Sandwiches', qty: 2, price: 180.0 }
      ],
      subtotal: 1310.0,
      discount: 0,
      deliveryCharge: 80.0,
      total: 1390.0,
      advancePaid: 0.0,
      balanceDue: 1390.0,
      cakeMessage: '',
      notes: 'Cut 10" brownie slab into 16 clean squares.'
    }
  ],

  expenses: [
    {
      id: 'exp-101',
      date: new Date().toISOString().split('T')[0],
      category: 'Ingredients',
      vendor: 'BakePro Supplies',
      amount: 2450.0,
      paymentMethod: 'UPI / GPay',
      receiptImage: '',
      notes: '10kg Dark compound and 2kg White compound restock'
    },
    {
      id: 'exp-102',
      date: new Date().toISOString().split('T')[0],
      category: 'Packaging',
      vendor: 'PackPrint Corrugators',
      amount: 1120.0,
      paymentMethod: 'Cash',
      receiptImage: '',
      notes: '50pcs 8-inch Brownie boxes and 30pcs Cake boxes'
    }
  ],

  production: [
    {
      id: 'plan-1',
      date: new Date().toISOString().split('T')[0],
      product: 'Classic Fudgy Brownie (8" Box)',
      batchQty: 4,
      stage: 'Baking',
      targetTime: '11:00 AM',
      completed: false,
      assignedBaker: 'Ananya',
      notes: '2 for ORD-2101, 2 for counter display'
    },
    {
      id: 'plan-2',
      date: new Date().toISOString().split('T')[0],
      product: 'Rosemilk Tres Leches (8" 1kg)',
      batchQty: 1,
      stage: 'Cooling',
      targetTime: '1:30 PM',
      completed: false,
      assignedBaker: 'Ananya',
      notes: 'ORD-2102 birthday order'
    }
  ],

  suppliers: [
    { id: 'sup-1', name: 'BakePro Supplies', contact: 'Venkatesh', phone: '+91 98840 11920', email: 'orders@bakepro.in', category: 'Compounds, Cocoa & Essences', leadDays: 1, minOrder: '₹1,000' },
    { id: 'sup-2', name: 'Amul Dairy Distributor', contact: 'Suresh Babu', phone: '+91 94441 55021', email: 'suresh.amul@gmail.com', category: 'Butter, Cheese & Cream', leadDays: 1, minOrder: '₹1,500' },
    { id: 'sup-3', name: 'PackPrint Corrugators', contact: 'Kailash', phone: '+91 98410 77300', email: 'packprint.sales@gmail.com', category: '8" & 10" Boxes & Bags', leadDays: 2, minOrder: '₹2,000' }
  ],

  customers: [
    { id: 'cust-1', name: 'Pooja Sundaram', phone: '+91 98401 22910', whatsapp: '+91 98401 22910', address: '12/4 Harrington Road, Chetpet, Chennai', totalOrders: 7, totalSpend: 5420.0, tier: 'VIP Baker Club', notes: 'Loves extra dark chocolate' },
    { id: 'cust-2', name: 'Rohan Mehra', phone: '+91 99620 44812', whatsapp: '+91 99620 44812', address: 'Flat 4B, Emerald Heights, T. Nagar, Chennai', totalOrders: 4, totalSpend: 3100.0, tier: 'Regular', notes: 'Corporate Dunzo orders' },
    { id: 'cust-3', name: 'Kavitha Sridhar', phone: '+91 94440 88123', whatsapp: '+91 94440 88123', address: '18, 4th Main Road, Besant Nagar, Chennai', totalOrders: 5, totalSpend: 4680.0, tier: 'VIP Baker Club', notes: 'Prefers eggless options' }
  ],

  cashbook: {
    openingBalance: 3000.0,
    records: [
      { id: 'cb-1', time: '09:30 AM', description: 'Opening Cash Register Float', type: 'in', amount: 3000.0, category: 'Float' },
      { id: 'cb-2', time: '11:15 AM', description: 'Counter POS sale: 2 Brownie Cubes', type: 'in', amount: 170.0, category: 'Sales' },
      { id: 'cb-3', time: '01:00 PM', description: 'Paid packing box delivery auto fare', type: 'out', amount: 150.0, category: 'Expense' }
    ]
  }
};

class BakeryStore {
  constructor() {
    this.subscribers = [];
    this.cloudStatus = 'synced'; // 'synced' | 'syncing' | 'offline'
    this.lastSyncedAt = new Date();
    this.currentUser = this.loadUserSession();
    this.data = this.load();

    // Ensure strict currency and profile hygiene
    this.sanitizeData(this.data);

    // Fetch latest cloud database on startup
    this.fetchFromCloud();

    // Periodic background sync every 45 seconds
    setInterval(() => {
      this.syncToCloud(false);
    }, 45000);
  }

  loadUserSession() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return Boolean(this.currentUser && this.currentUser.token);
  }

  getServerUrl(endpoint) {
    if (typeof window.getServerUrl === 'function') {
      return window.getServerUrl(endpoint);
    }
    if (!endpoint) return '/';
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const customHost = localStorage.getItem('bakepilot_server_url') || (window.BAKEPILOT_API_HOST || '');
    if (customHost) {
      const base = customHost.endsWith('/') ? customHost.slice(0, -1) : customHost;
      return `${base}${cleanPath}`;
    }

    return cleanPath;
  }

  setCleanUserSession(email, businessName, tagline) {
    const cleanId = 'baker-' + Date.now();
    this.currentUser = {
      id: cleanId,
      email: email || 'baker@bakepilot.in',
      businessName: businessName || 'My Artisan Bakery',
      token: 'device-token-' + cleanId
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));

    const cleanData = JSON.parse(JSON.stringify(initialBakeryData));
    cleanData.profile.name = businessName || 'My Artisan Bakery';
    cleanData.profile.tagline = tagline || 'Artisan Patisserie & Custom Bakes';
    cleanData.profile.email = email || 'baker@bakepilot.in';
    cleanData.orders = [];
    cleanData.customers = [];
    cleanData.cashbook = { openingBalance: 0, records: [] };
    cleanData.expenses = [];

    this.data = this.sanitizeData(cleanData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    this.notify();
  }

  setDemoSession() {
    this.currentUser = {
      id: 'demo-user',
      email: 'demo@crustandcrumb.in',
      businessName: 'The Crust & Crumb Patisserie',
      token: 'demo-token'
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
    this.notify();
  }

  async login(email, password) {
    try {
      const res = await fetch(this.getServerUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          businessName: data.user.businessName,
          token: data.token
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
        if (data.database && data.database.inventory) {
          this.data = this.sanitizeData(data.database);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
        this.notify();
        return true;
      } else {
        if (res.status === 402 || data.paymentPending || data.status === 'payment_pending' || data.status === 'disabled' || data.status === 'suspended') {
          this.paymentPendingUser = {
            email: data.bakerEmail || email,
            businessName: data.businessName || 'Artisan Bakery',
            message: data.error || 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
          };
          window.bakeryApp.navigate('payment-pending');
          return false;
        }
        BakeryUI.toast(data.error || 'Login failed', 'error');
        return false;
      }
    } catch (err) {
      // Offline fallback: check if user session already exists on this device
      const savedUser = this.loadUserSession();
      if (savedUser && savedUser.email && savedUser.email.toLowerCase() === (email || '').trim().toLowerCase()) {
        BakeryUI.toast('Device offline. Resumed your saved bakery studio! ✓', 'info');
        this.currentUser = savedUser;
        this.notify();
        return true;
      }

      if ((email || '').toLowerCase().includes('demo')) {
        BakeryUI.toast('Logging into Demo Studio.', 'info');
        this.setDemoSession();
        return true;
      }

      this.setCleanUserSession(email, email.split('@')[0].toUpperCase() + ' Bakery', 'Artisan Bakes');
      BakeryUI.toast('Offline studio created on device! ✓', 'success');
      return true;
    }
  }

  async register(email, password, businessName, tagline) {
    try {
      const res = await fetch(this.getServerUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, businessName, tagline })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          businessName: data.user.businessName,
          token: data.token
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
        if (data.database) {
          this.data = this.sanitizeData(data.database);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
        this.notify();
        return true;
      } else {
        BakeryUI.toast(data.error || 'Registration failed', 'error');
        return false;
      }
    } catch (err) {
      this.setCleanUserSession(email, businessName, tagline);
      BakeryUI.toast('Clean studio initialized on device! ✓', 'success');
      return true;
    }
  }

  async resetPassword(email, newPassword) {
    try {
      const res = await fetch(this.getServerUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        BakeryUI.toast(data.message || 'Password reset successfully! Please log in.');
        return true;
      } else {
        BakeryUI.toast(data.error || 'Password reset failed', 'error');
        return false;
      }
    } catch (e) {
      BakeryUI.toast('Cannot reach server', 'error');
      return false;
    }
  }

  loadDemoSampleData() {
    const demo = JSON.parse(JSON.stringify(initialBakeryData));
    if (this.currentUser && this.currentUser.businessName) {
      demo.profile.name = this.currentUser.businessName;
    }
    this.data = this.sanitizeData(demo);
    this.save(true);
    BakeryUI.toast('Loaded sample bakery demo stats! 🎂');
    this.notify();
  }

  clearToCleanSlate() {
    this.data.orders = [];
    this.data.expenses = [];
    this.data.customers = [];
    this.data.suppliers = [];
    this.data.recipes = [];
    this.data.products = [];
    this.data.inventory = [];
    this.data.cashbook = { openingBalance: 0, records: [] };
    this.save(true);
    BakeryUI.toast('Reset to clean, empty business workspace! ✓');
    this.notify();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    BakeryUI.toast('Logged out successfully');
    this.notify();
  }

  sanitizeData(d) {
    if (!d || typeof d !== 'object') return d;
    if (!d.profile) d.profile = {};

    // Strictly enforce Indian Rupee symbol against encoding glitches
    let sym = d.profile.currencySymbol;
    if (!sym || sym.includes('\ufffd') || sym.includes(',') || sym.includes('?') || !['₹', '$', '€', '£'].includes(sym)) {
      d.profile.currencySymbol = '₹';
      d.profile.currency = '₹';
    }

    if (!d.workspace) {
      d.workspace = JSON.parse(JSON.stringify(initialBakeryData.workspace));
    }

    if (!d.profile.logo) {
      d.profile.logo = BAKERY_ASSETS.defaultLogo;
    }

    // Upgrade product images to realistic photography if using old SVG or empty
    if (d.products && Array.isArray(d.products)) {
      d.products.forEach(p => {
        if (!p.image || p.image.startsWith('data:image/svg')) {
          if (p.name.toLowerCase().includes('walnut')) p.image = BAKERY_ASSETS.brownieWalnut;
          else if (p.name.toLowerCase().includes('brownie')) p.image = BAKERY_ASSETS.brownieClassic;
          else if (p.name.toLowerCase().includes('rosemilk')) p.image = BAKERY_ASSETS.cakeRosemilk;
          else if (p.name.toLowerCase().includes('blackcurrant')) p.image = BAKERY_ASSETS.cakeBlackcurrant;
          else if (p.name.toLowerCase().includes('cupcake')) p.image = BAKERY_ASSETS.cupcakeRedVelvet;
          else if (p.name.toLowerCase().includes('chocolate')) p.image = BAKERY_ASSETS.cakeChocolate;
          else if (p.name.toLowerCase().includes('sandwich')) p.image = BAKERY_ASSETS.sandwichCafe;
          else p.image = BAKERY_ASSETS.cakeChocolate;
        }
      });
    }

    // Upgrade pantry item photos if empty
    if (d.inventory && Array.isArray(d.inventory)) {
      d.inventory.forEach(i => {
        if (!i.image) {
          const nm = i.name.toLowerCase();
          if (nm.includes('dark compound')) i.image = BAKERY_ASSETS.compoundDark;
          else if (nm.includes('white compound')) i.image = BAKERY_ASSETS.compoundWhite;
          else if (nm.includes('butter')) i.image = BAKERY_ASSETS.butterAmul;
          else if (nm.includes('nut')) i.image = BAKERY_ASSETS.nutsAssorted;
          else if (nm.includes('cake') && nm.includes('box')) i.image = BAKERY_ASSETS.packagingCake;
          else if (nm.includes('box')) i.image = BAKERY_ASSETS.packagingBox;
        }
      });
    }

    if (!d.utilities) {
      d.utilities = JSON.parse(JSON.stringify(initialBakeryData.utilities));
    }

    if (!d.eodReport) {
      d.eodReport = JSON.parse(JSON.stringify(initialBakeryData.eodReport));
    }

    return d;
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.inventory && parsed.orders) {
          return this.sanitizeData(parsed);
        }
      }
    } catch (e) {
      console.warn('LocalStorage parse failed, using initial dataset.', e);
    }
    return JSON.parse(JSON.stringify(initialBakeryData));
  }

  save(triggerCloudSync = true) {
    this.sanitizeData(this.data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
    this.notify();

    if (triggerCloudSync) {
      this.syncToCloud(true);
    }
  }

  // --- CLOUD SYNC ENGINE (Multi-tenant & Zero Data Loss) ---
  async syncToCloud(showToast = false) {
    const rawCloudUrl = this.data.profile?.cloudSyncUrl || '/api/sync';
    const cloudUrl = this.getServerUrl(rawCloudUrl);
    this.cloudStatus = 'syncing';
    this.notifyStatus();

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.currentUser && this.currentUser.token) {
        headers['Authorization'] = `Bearer ${this.currentUser.token}`;
      }

      const res = await fetch(cloudUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(this.data)
      });

      if (res.status === 402) {
        const errData = await res.json().catch(() => ({}));
        this.paymentPendingUser = {
          email: this.currentUser ? this.currentUser.email : '',
          businessName: this.currentUser ? this.currentUser.businessName : 'Artisan Bakery',
          message: errData.message || 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
        };
        window.bakeryApp.navigate('payment-pending');
        return;
      }

      if (res.ok) {
        this.cloudStatus = 'synced';
        this.lastSyncedAt = new Date();
        this.notifyStatus();
      } else {
        this.cloudStatus = 'offline';
        this.notifyStatus();
      }
    } catch (err) {
      this.cloudStatus = 'offline';
      this.notifyStatus();
    }
  }

  async fetchFromCloud() {
    const rawCloudUrl = this.data.profile?.cloudSyncUrl || '/api/sync';
    const cloudUrl = this.getServerUrl(rawCloudUrl);
    try {
      const headers = {};
      if (this.currentUser && this.currentUser.token) {
        headers['Authorization'] = `Bearer ${this.currentUser.token}`;
      }

      const res = await fetch(cloudUrl, { headers });
      if (res.status === 402) {
        const errData = await res.json().catch(() => ({}));
        this.paymentPendingUser = {
          email: this.currentUser ? this.currentUser.email : '',
          businessName: this.currentUser ? this.currentUser.businessName : 'Artisan Bakery',
          message: errData.message || 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
        };
        window.bakeryApp.navigate('payment-pending');
        return;
      }
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && !cloudData.empty && cloudData.orders && cloudData.inventory) {
          this.data = this.sanitizeData(cloudData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
          this.cloudStatus = 'synced';
          this.lastSyncedAt = new Date();
          this.notify();
          this.notifyStatus();
        } else {
          this.syncToCloud(false);
        }
      }
    } catch (e) {
      console.log('Running in local offline mode.');
    }
  }

  // --- Utilities Settings (Gas Cylinder, Electricity Tariff) ---
  getUtilities() {
    return this.data.utilities || initialBakeryData.utilities;
  }

  saveUtilities(updates) {
    this.data.utilities = { ...this.getUtilities(), ...updates };
    this.save(true);
    BakeryUI.toast('Kitchen utility rates updated successfully!');
    return this.data.utilities;
  }

  // --- EOD Report Settings ---
  getEodReportSettings() {
    return this.data.eodReport || initialBakeryData.eodReport;
  }

  saveEodReportSettings(updates) {
    this.data.eodReport = { ...this.getEodReportSettings(), ...updates };
    this.save(true);
    BakeryUI.toast('EOD automated report settings saved!');
    return this.data.eodReport;
  }

  // --- Invoice Layout & Custom Field Settings ---
  getInvoiceSettings() {
    if (!this.data.invoiceSettings) {
      this.data.invoiceSettings = JSON.parse(JSON.stringify(initialBakeryData.invoiceSettings));
    }
    return this.data.invoiceSettings;
  }

  saveInvoiceSettings(updates) {
    this.data.invoiceSettings = { ...this.getInvoiceSettings(), ...updates };
    if (updates.invoiceNotes) {
      this.data.profile.invoiceNotes = updates.invoiceNotes;
    }
    this.save(true);
    BakeryUI.toast('Invoice layout preferences saved!');
    return this.data.invoiceSettings;
  }

  async sendTestEodReport() {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.currentUser && this.currentUser.token) {
        headers['Authorization'] = `Bearer ${this.currentUser.token}`;
      }
      const res = await fetch(this.getServerUrl('/api/reports/test-send'), { method: 'POST', headers });
      const resData = await res.json();
      if (res.ok && resData.success) {
        BakeryUI.toast(resData.message || 'EOD Test Report compiled and archived successfully!');
        return resData.report;
      } else {
        BakeryUI.toast(resData.error || 'Failed to generate report', 'error');
      }
    } catch (e) {
      BakeryUI.toast('Server offline. Cannot send report.', 'error');
    }
    return null;
  }

  getCloudStatus() {
    const secondsAgo = Math.floor((Date.now() - this.lastSyncedAt.getTime()) / 1000);
    let timeStr = 'Just now';
    if (secondsAgo >= 60) timeStr = `${Math.floor(secondsAgo / 60)}m ago`;
    else if (secondsAgo > 5) timeStr = `${secondsAgo}s ago`;

    return {
      status: this.cloudStatus,
      lastSyncedAt: this.lastSyncedAt,
      timeAgo: timeStr
    };
  }

  notifyStatus() {
    const el = document.getElementById('cloud-sync-status-indicator');
    if (el) {
      const info = this.getCloudStatus();
      if (info.status === 'synced') {
        el.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #367B5B;"></span><span>Cloud Synced (${info.timeAgo})</span>`;
        el.style.color = '#367B5B';
      } else if (info.status === 'syncing') {
        el.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #F6C9D0; animation: pulse 1s infinite;"></span><span>Syncing...</span>`;
        el.style.color = '#77717D';
      } else {
        el.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #B84B58;"></span><span>Local Saved</span>`;
        el.style.color = '#77717D';
      }
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(initialBakeryData));
    this.save(true);
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(fn => {
      try { fn(this.data); } catch (err) { console.error('Store subscriber error:', err); }
    });
  }

  // --- Profile & Branding ---
  getProfile() {
    return this.data.profile;
  }

  updateProfile(updates) {
    this.data.profile = { ...this.data.profile, ...updates };
    this.save(true);
  }

  updateLogo(logoDataUrl) {
    this.data.profile.logo = logoDataUrl || BAKERY_ASSETS.defaultLogo;
    this.save(true);
  }

  // --- Workspace Settings ---
  getWorkspace() {
    if (!this.data.workspace) {
      this.data.workspace = JSON.parse(JSON.stringify(initialBakeryData.workspace));
    }
    return this.data.workspace;
  }

  updateWorkspace(updates) {
    this.data.workspace = { ...this.getWorkspace(), ...updates };
    this.save(true);
  }

  // --- Inventory & Prices ---
  getInventory() {
    return this.data.inventory;
  }

  getIngredient(id) {
    return this.data.inventory.find(i => i.id === id);
  }

  updateIngredientPrice(id, newPrice) {
    const item = this.data.inventory.find(i => i.id === id);
    if (item) {
      item.unitCost = Math.max(0, parseFloat(newPrice) || 0);
      this.save(true);
    }
    return item;
  }

  updateStock(id, delta) {
    const item = this.data.inventory.find(i => i.id === id);
    if (item) {
      item.currentStock = Math.max(0, Math.round((item.currentStock + delta) * 10) / 10);
      this.save(true);
    }
    return item;
  }

  saveIngredient(ingredientData) {
    if (ingredientData.id) {
      const idx = this.data.inventory.findIndex(i => i.id === ingredientData.id);
      if (idx !== -1) {
        this.data.inventory[idx] = { ...this.data.inventory[idx], ...ingredientData };
      }
    } else {
      const newIng = {
        id: 'ing-' + (this.data.inventory.length + 1) + '-' + Date.now().toString().slice(-4),
        ...ingredientData
      };
      this.data.inventory.push(newIng);
    }
    this.save(true);
  }

  deleteIngredient(id) {
    this.data.inventory = this.data.inventory.filter(i => i.id !== id);
    this.save(true);
  }

  // --- Recipes & Estimator ---
  getRecipes() {
    return this.data.recipes;
  }

  getRecipe(id) {
    return this.data.recipes.find(r => r.id === id);
  }

  calculateRecipeCost(recipe) {
    if (!recipe || !recipe.items) return { materialCost: 0, laborCost: 0, overheadCost: 0, totalCost: 0, costPerUnit: 0 };

    let materialCost = 0;
    recipe.items.forEach(it => {
      const ing = this.getIngredient(it.ingredientId);
      if (ing) {
        materialCost += (Number(it.qty) || 0) * (Number(ing.unitCost) || 0);
      }
    });

    const laborCost = Math.round(((recipe.laborMinutes || 30) / 60) * (recipe.hourlyLaborRate || 150) * 100) / 100;
    const subtotal = materialCost + laborCost;
    const overheadCost = Math.round(subtotal * ((recipe.overheadPercent || 12) / 100) * 100) / 100;
    const totalCost = Math.round((subtotal + overheadCost) * 100) / 100;
    const costPerUnit = Math.round((totalCost / (recipe.yieldCount || 1)) * 100) / 100;

    return {
      materialCost: Math.round(materialCost * 100) / 100,
      laborCost,
      overheadCost,
      totalCost,
      costPerUnit
    };
  }

  saveRecipe(recipeData) {
    if (recipeData.id) {
      const idx = this.data.recipes.findIndex(r => r.id === recipeData.id);
      if (idx !== -1) {
        this.data.recipes[idx] = { ...this.data.recipes[idx], ...recipeData };
      }
    } else {
      const newRec = {
        id: 'rec-' + Date.now().toString().slice(-5),
        ...recipeData
      };
      this.data.recipes.push(newRec);
    }
    this.save(true);
  }

  deleteRecipe(id) {
    this.data.recipes = this.data.recipes.filter(r => r.id !== id);
    this.save(true);
  }

  // --- Orders (NO GST, Support Fulfilment, Advance & Balance Due) ---
  getOrders() {
    return this.data.orders;
  }

  getOrder(id) {
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(orderData) {
    const id = 'ORD-' + Math.floor(2100 + Math.random() * 899);
    
    // Explicit clean bill calculation without GST:
    const subtotal = Number(orderData.subtotal) || 0;
    const discount = Number(orderData.discount) || 0;
    const deliveryCharge = Number(orderData.deliveryCharge) || 0;
    const total = Math.max(0, subtotal - discount) + deliveryCharge;
    const advancePaid = Math.min(total, Number(orderData.advancePaid) || 0);
    const balanceDue = Math.max(0, total - advancePaid);

    let paymentStatus = 'unpaid';
    if (advancePaid >= total && total > 0) paymentStatus = 'paid';
    else if (advancePaid > 0) paymentStatus = 'partially-paid';

    const newOrder = {
      id,
      date: orderData.date || new Date().toISOString().split('T')[0],
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || paymentStatus,
      paymentMethod: orderData.paymentMethod || 'UPI / GPay',
      fulfilmentMethod: orderData.fulfilmentMethod || 'self_pickup',
      deliveryType: orderData.deliveryType || 'Self Pickup',
      deliverySlot: orderData.deliverySlot || 'Standard Delivery',
      deliveryAddress: orderData.deliveryAddress || '',
      deliveryInstructions: orderData.deliveryInstructions || '',
      recipientContact: orderData.recipientContact || '',
      externalReference: orderData.externalReference || '',
      cakeMessage: orderData.cakeMessage || '',
      referenceImage: orderData.referenceImage || '',
      items: orderData.items || [],
      createdAt: new Date().toISOString(),
      ...orderData,
      subtotal,
      discount,
      deliveryCharge,
      total,
      advancePaid,
      balanceDue
    };

    this.data.orders.unshift(newOrder);
    this.recordCustomerActivity(newOrder);
    this.save(true);
    return newOrder;
  }

  updateOrder(id, updates) {
    const idx = this.data.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      const order = this.data.orders[idx];
      const merged = { ...order, ...updates };

      // Recalculate totals
      const subtotal = Number(merged.subtotal) || 0;
      const discount = Number(merged.discount) || 0;
      const deliveryCharge = Number(merged.deliveryCharge) || 0;
      merged.total = Math.max(0, subtotal - discount) + deliveryCharge;
      merged.advancePaid = Math.min(merged.total, Number(merged.advancePaid) || 0);
      merged.balanceDue = Math.max(0, merged.total - merged.advancePaid);

      if (merged.advancePaid >= merged.total && merged.total > 0) merged.paymentStatus = 'paid';
      else if (merged.advancePaid > 0) merged.paymentStatus = 'partially-paid';

      this.data.orders[idx] = merged;
      this.save(true);
      return merged;
    }
    return null;
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.save(true);
    }
    return order;
  }

  deleteOrder(orderId) {
    this.data.orders = this.data.orders.filter(o => o.id !== orderId);
    this.save(true);
  }

  // --- Products ---
  getProducts() {
    return this.data.products;
  }

  getProduct(id) {
    return this.data.products.find(p => p.id === id);
  }

  saveProduct(productData) {
    if (productData.id) {
      const idx = this.data.products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        this.data.products[idx] = { ...this.data.products[idx], ...productData };
      }
    } else {
      const newProduct = {
        id: 'prod-' + Date.now().toString().slice(-4),
        image: BAKERY_ASSETS.cakeSvg,
        inStock: true,
        allergens: ['Dairy', 'Gluten'],
        variants: [
          { id: 'v1', name: 'Regular Size', price: Number(productData.price) || 500, costPrice: Number(productData.costPrice) || 200 }
        ],
        ...productData
      };
      this.data.products.push(newProduct);
    }
    this.save(true);
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save(true);
  }

  // --- Production ---
  getProduction() {
    return this.data.production;
  }

  toggleProductionComplete(planId) {
    const item = this.data.production.find(p => p.id === planId);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) item.stage = 'Ready';
      this.save(true);
    }
    return item;
  }

  addProductionTask(task) {
    const newTask = {
      id: 'plan-' + Date.now().toString().slice(-5),
      date: new Date().toISOString().split('T')[0],
      stage: 'Prep',
      completed: false,
      ...task
    };
    this.data.production.push(newTask);
    this.save(true);
    return newTask;
  }

  // --- Expenses ---
  getExpenses() {
    return this.data.expenses;
  }

  addExpense(expenseData) {
    const newExp = {
      id: 'exp-' + Date.now().toString().slice(-5),
      date: new Date().toISOString().split('T')[0],
      receiptImage: '',
      ...expenseData
    };
    this.data.expenses.unshift(newExp);

    if (expenseData.paymentMethod === 'Cash') {
      this.addCashbookEntry({
        description: `Expense: ${expenseData.category} (${expenseData.vendor || 'Misc'})`,
        type: 'out',
        amount: Number(expenseData.amount),
        category: 'Expense'
      });
    }

    this.save(true);
    return newExp;
  }

  // --- Cashbook ---
  getCashbook() {
    const records = this.data.cashbook.records || [];
    const opening = this.data.cashbook.openingBalance || 0;
    
    let cashIn = 0;
    let cashOut = 0;
    records.forEach(r => {
      if (r.type === 'in' && r.category !== 'Float') cashIn += Number(r.amount);
      if (r.type === 'out') cashOut += Number(r.amount);
    });
    
    const closingBalance = opening + cashIn - cashOut;
    return {
      openingBalance: opening,
      cashIn,
      cashOut,
      closingBalance,
      records
    };
  }

  addCashbookEntry(entry) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord = {
      id: 'cb-' + Date.now().toString().slice(-5),
      time: timeStr,
      ...entry
    };
    this.data.cashbook.records.push(newRecord);
    this.save(true);
    return newRecord;
  }

  // --- Customers & Suppliers ---
  getCustomers() {
    return this.data.customers;
  }

  getSuppliers() {
    return this.data.suppliers;
  }

  saveCustomer(customerData) {
    if (customerData.id) {
      const idx = this.data.customers.findIndex(c => c.id === customerData.id);
      if (idx !== -1) {
        this.data.customers[idx] = { ...this.data.customers[idx], ...customerData };
      }
    } else {
      const newCust = {
        id: 'cust-' + Date.now().toString().slice(-4),
        totalOrders: 0,
        totalSpend: 0,
        tier: 'Regular',
        whatsapp: customerData.phone || '',
        address: '',
        ...customerData
      };
      this.data.customers.push(newCust);
    }
    this.save(true);
  }

  saveSupplier(supplierData) {
    if (supplierData.id) {
      const idx = this.data.suppliers.findIndex(s => s.id === supplierData.id);
      if (idx !== -1) {
        this.data.suppliers[idx] = { ...this.data.suppliers[idx], ...supplierData };
      }
    } else {
      const newSup = {
        id: 'sup-' + Date.now().toString().slice(-4),
        ...supplierData
      };
      this.data.suppliers.push(newSup);
    }
    this.save(true);
  }

  recordCustomerActivity(order) {
    let customer = this.data.customers.find(c => 
      c.name.toLowerCase() === order.customerName.toLowerCase() || 
      (order.customerPhone && c.phone === order.customerPhone)
    );
    if (!customer) {
      customer = {
        id: 'cust-' + Date.now().toString().slice(-4),
        name: order.customerName,
        phone: order.customerPhone || '',
        whatsapp: order.customerWhatsapp || order.customerPhone || '',
        address: order.deliveryAddress || '',
        totalOrders: 1,
        totalSpend: Number(order.total),
        tier: 'Regular',
        notes: ''
      };
      this.data.customers.push(customer);
    } else {
      customer.totalOrders = (customer.totalOrders || 0) + 1;
      customer.totalSpend = (customer.totalSpend || 0) + Number(order.total);
      if (order.deliveryAddress && !customer.address) customer.address = order.deliveryAddress;
      if (customer.totalOrders >= 4) {
        customer.tier = 'VIP Baker Club';
      }
    }
  }

  // --- Financial Summary (NO GST) ---
  getFinancialSummary() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = this.data.orders.filter(o => o.date === todayStr && o.status !== 'cancelled');
    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const todayExpensesList = this.data.expenses.filter(e => e.date === todayStr);
    const todayExpenses = todayExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);
    const todayProfit = todayRevenue - todayExpenses;
    const lowStockCount = this.data.inventory.filter(i => i.currentStock <= i.minThreshold).length;

    return {
      todayRevenue,
      todayExpenses,
      todayProfit,
      ordersCount: todayOrders.length,
      pendingOrdersCount: this.data.orders.filter(o => o.status === 'pending' || o.status === 'in-oven').length,
      lowStockCount
    };
  }
}

window.BakeryStore = BakeryStore;
window.bakeryStore = new BakeryStore();
