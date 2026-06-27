export interface Product {
  id: string;
  name: string;
  category: 'Mice' | 'Keyboards' | 'Custom PCs' | 'Monitors' | 'Components';
  price: number;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  specs: {
    brand: string;
    [key: string]: any;
  };
  olxUrl?: string;
  isPopular?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscount?: number; // percentage
}

export const mockProducts: Product[] = [
  // Mice
  {
    id: 'm1',
    name: 'Aureum Claw X1 Wireless Mouse',
    category: 'Mice',
    price: 129,
    description: 'Ultra-lightweight gaming mouse featuring a gold-gilded scroll wheel, 26,000 DPI sensor, and optical switches.',
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Aureum',
      dpi: '26,000 DPI',
      connection: 'Wireless (2.4GHz) & Bluetooth',
      weight: '53g',
      sensor: 'Focus Pro 30K',
      battery: 'Up to 90 hours'
    },
    isPopular: true,
    olxUrl: 'https://olx.uz/d/oz/obyavlenie/aureum-claw-x1-gaming-mouse-gold-accents-ID12345.html'
  },
  {
    id: 'm2',
    name: 'Basalt Pro Precision Mouse',
    category: 'Mice',
    price: 79,
    description: 'Ergonomic matte black design built for comfort during long sessions. Features tactile metal grip borders.',
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Basalt',
      dpi: '16,000 DPI',
      connection: 'Wired (Braided Cable)',
      weight: '85g',
      sensor: 'PixArt PMW3389'
    },
    isFlashSale: true,
    flashSaleDiscount: 15
  },

  // Keyboards
  {
    id: 'k1',
    name: 'BronzeAlchemy TKL Mechanical Keyboard',
    category: 'Keyboards',
    price: 189,
    description: 'Custom gasket-mounted keyboard with a bronze anodized aluminum top frame, hot-swappable sockets, and lubed linear switches.',
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Alchemy',
      switchType: 'Linear (Bronze Cream)',
      layout: 'TKL (80%)',
      backlight: 'Amber Glow RGB',
      keycaps: 'Double-shot PBT Cherry Profile',
      hotSwap: 'Yes (5-pin)'
    },
    isPopular: true,
    olxUrl: 'https://olx.uz/d/oz/obyavlenie/bronze-alchemy-tkl-mechanical-keyboard-custom-ID54321.html'
  },
  {
    id: 'k2',
    name: 'Stealth Brown Tactile Keyboard',
    category: 'Keyboards',
    price: 149,
    description: 'Silent yet satisfying. Premium matte black case with dark brown theme keycaps and tactile quiet switches.',
    rating: 4.7,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Stealth',
      switchType: 'Tactile (Silent Brown)',
      layout: 'Compact (75%)',
      backlight: 'Static Warm White',
      keycaps: 'Dye-Sub PBT profile'
    },
    isFlashSale: true,
    flashSaleDiscount: 20
  },

  // Monitors
  {
    id: 'mon1',
    name: 'Vesuvio 34" Curved Ultrawide Monitor',
    category: 'Monitors',
    price: 499,
    description: 'Immersive 34-inch curved WQHD display with 165Hz refresh rate and custom bronze metallic bezel stands.',
    rating: 4.7,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Vesuvio',
      size: '34 Inches',
      resolution: '3440 x 1440 (WQHD)',
      refreshRate: '165Hz',
      panelType: 'VA (1500R Curve)',
      responseTime: '1ms MPRT'
    },
    isPopular: true
  },

  // Custom PCs (Prebuilt)
  {
    id: 'pc1',
    name: 'Aureum Elite Custom PC (Gold Edition)',
    category: 'Custom PCs',
    price: 2499,
    description: 'Fully assembled elite tier gaming PC. Features liquid-cooled Ryzen 9, RTX 4080 Super with vertical gold bracket, and sleeved bronze/black custom cables.',
    rating: 5.0,
    reviews: 43,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Antigravity Build',
      cpu: 'AMD Ryzen 9 7900X',
      gpu: 'NVIDIA RTX 4080 Super 16GB',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe PCIe 4.0 SSD',
      os: 'Windows 11 Pro'
    },
    isPopular: true
  },

  // Components for Builder & Individual Purchase
  // CPUs
  {
    id: 'c-cpu1',
    name: 'AMD Ryzen 7 7800X3D Processor',
    category: 'Components',
    price: 369,
    description: 'The ultimate gaming processor with 3D V-Cache technology. Socket AM5, 8 cores, 16 threads, 120W TDP.',
    rating: 4.9,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'AMD',
      type: 'CPU',
      socket: 'AM5',
      cores: '8 Cores / 16 Threads',
      powerUsage: '120W',
      clockSpeed: '4.2 GHz (5.0 GHz Turbo)'
    }
  },
  {
    id: 'c-cpu2',
    name: 'Intel Core i9-14900K Processor',
    category: 'Components',
    price: 529,
    description: 'High-performance desktop processor with hybrid architecture. Socket LGA1700, 24 cores, 32 threads, 125W base TDP.',
    rating: 4.8,
    reviews: 304,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Intel',
      type: 'CPU',
      socket: 'LGA1700',
      cores: '24 Cores / 32 Threads',
      powerUsage: '125W (253W Boost)',
      clockSpeed: '3.2 GHz (6.0 GHz Turbo)'
    }
  },

  // Motherboards
  {
    id: 'c-mb1',
    name: 'ASUS ROG Crosshair X670E Hero (AM5)',
    category: 'Components',
    price: 649,
    description: 'Premium AMD X670E ATX motherboard featuring 18+2 power stages, DDR5 support, PCIe 5.0, and gold accent styling.',
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'ASUS',
      type: 'Motherboard',
      socket: 'AM5',
      formFactor: 'ATX',
      ramSlots: '4x DDR5',
      chipset: 'AMD X670E'
    }
  },
  {
    id: 'c-mb2',
    name: 'MSI MPG Z790 Carbon WiFi (LGA1700)',
    category: 'Components',
    price: 399,
    description: 'Feature-rich Intel Z790 ATX motherboard with DDR5 support, PCIe 5.0, robust VRM, and customizable RGB.',
    rating: 4.6,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'MSI',
      type: 'Motherboard',
      socket: 'LGA1700',
      formFactor: 'ATX',
      ramSlots: '4x DDR5',
      chipset: 'Intel Z790'
    }
  },

  // GPUs
  {
    id: 'c-gpu1',
    name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
    category: 'Components',
    price: 799,
    description: 'Excellent performance for 1440p and 4K gaming, featuring ray tracing and DLSS 3. Power requirement: 285W.',
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'NVIDIA',
      type: 'GPU',
      vram: '16GB GDDR6X',
      powerUsage: '285W',
      length: '310mm'
    },
    isFlashSale: true,
    flashSaleDiscount: 8
  },
  {
    id: 'c-gpu2',
    name: 'AMD Radeon RX 7800 XT 16GB',
    category: 'Components',
    price: 499,
    description: 'High-speed performance graphics card with RDNA 3 architecture. Ideal for 1440p gaming. Power usage: 263W.',
    rating: 4.7,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'AMD',
      type: 'GPU',
      vram: '16GB GDDR6',
      powerUsage: '263W',
      length: '267mm'
    }
  },

  // RAM
  {
    id: 'c-ram1',
    name: 'G.Skill Trident Z5 Neo RGB 32GB DDR5-6000',
    category: 'Components',
    price: 119,
    description: 'Premium dual-channel memory kit tailored for AMD EXPO. 32GB (2x16GB) capacity, CL30 latency, gold-trimmed heatspreaders.',
    rating: 4.9,
    reviews: 382,
    image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'G.Skill',
      type: 'RAM',
      capacity: '32GB (2x16GB)',
      speed: '6000 MHz',
      typeDdr: 'DDR5',
      latency: 'CL30'
    }
  },

  // Power Supplies
  {
    id: 'c-psu1',
    name: 'Corsair RM850x 850W 80+ Gold Fully Modular',
    category: 'Components',
    price: 129,
    description: 'Ultra-low noise, high-efficiency power supply. EPS12V compatible, fully modular cables.',
    rating: 4.8,
    reviews: 580,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Corsair',
      type: 'PSU',
      wattage: 850,
      efficiency: '80+ Gold',
      modular: 'Fully Modular'
    }
  },
  {
    id: 'c-psu2',
    name: 'SeaSonic Vertex GX-1200W ATX 3.0',
    category: 'Components',
    price: 239,
    description: 'Ultra-high-wattage PCIe 5.0 and ATX 3.0 ready power supply. Fully modular, premium gold-plated terminals.',
    rating: 4.9,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'SeaSonic',
      type: 'PSU',
      wattage: 1200,
      efficiency: '80+ Gold',
      modular: 'Fully Modular'
    }
  },

  // Cases
  {
    id: 'c-case1',
    name: 'Lian Li O11 Dynamic EVO (Black/Bronze Custom)',
    category: 'Components',
    price: 169,
    description: 'Iconic dual-chamber glass panel case customized with bronze anodized steel borders and dual layout flexibility.',
    rating: 4.9,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    specs: {
      brand: 'Lian Li',
      type: 'Case',
      supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      dimensions: '465 x 285 x 459 mm',
      materials: 'Tempered Glass, Aluminum'
    }
  }
];
