'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw, X, ShieldAlert, Cpu } from 'lucide-react';
import { Product } from '@/data/mock-products';
import ProductCard from '@/components/ProductCard';
import { GlassCard } from '@/components/ui/glass-card';

export function CatalogContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtime, setRealtime] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSwitches, setSelectedSwitches] = useState<string[]>([]);
  const [selectedDpis, setSelectedDpis] = useState<string[]>([]);

  // Initialize search parameter filters from URL query
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `/api/products?realtime=${realtime}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [realtime]);

  // Extract unique brands, switch types, and DPI lists from products for filters
  const brands = Array.from(new Set(products.map(p => p.specs.brand).filter(Boolean)));
  
  const keyboardSwitches = [
    'Linear (Bronze Cream)',
    'Tactile (Silent Brown)',
    'Clicky (Blue)'
  ];

  const mouseDpis = [
    '26,000 DPI',
    '16,000 DPI',
    '8,000 DPI'
  ];

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleSwitchChange = (sw: string) => {
    setSelectedSwitches(prev =>
      prev.includes(sw) ? prev.filter(s => s !== sw) : [...prev, sw]
    );
  };

  const handleDpiChange = (dpi: string) => {
    setSelectedDpis(prev =>
      prev.includes(dpi) ? prev.filter(d => d !== dpi) : [...prev, dpi]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setPriceRange(3000);
    setSelectedBrands([]);
    setSelectedSwitches([]);
    setSelectedDpis([]);
    setSearchQuery('');
  };

  // Client side filtering logic based on all chosen states
  const filteredProducts = products.filter(p => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.specs.brand && p.specs.brand.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchDesc) return false;
    }

    // 2. Category
    if (selectedCategory && p.category !== selectedCategory) {
      return false;
    }

    // 3. Max Price
    // Calculate final price checking flash discount
    const hasDiscount = !!p.isFlashSale && !!p.flashSaleDiscount;
    const finalPrice = hasDiscount
      ? Math.round(p.price * (1 - (p.flashSaleDiscount || 0) / 100))
      : p.price;

    if (finalPrice > priceRange) {
      return false;
    }

    // 4. Brands
    if (selectedBrands.length > 0 && (!p.specs.brand || !selectedBrands.includes(p.specs.brand))) {
      return false;
    }

    // 5. Switches (Keyboards only)
    if (selectedSwitches.length > 0) {
      if (p.category !== 'Keyboards' || !selectedSwitches.includes(p.specs.switchType)) {
        return false;
      }
    }

    // 6. DPI (Mice only)
    if (selectedDpis.length > 0) {
      if (p.category !== 'Mice' || !selectedDpis.includes(p.specs.dpi)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-cream tracking-tight">
            HARDWARE CATALOG
          </h1>
          <p className="text-xs text-brand-taupe mt-1">
            Browse premium hardware components. Toggle Real-Time Pricing to sync with external tech markets.
          </p>
        </div>

        {/* Real-time pricing toggle */}
        <button
          onClick={() => setRealtime(!realtime)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-xs transition-all active:scale-98 shadow-md ${
            realtime
              ? 'bg-brand-bronze text-brand-black border-brand-bronze shadow-brand-bronze/10'
              : 'glass-panel border-brand-glass-border hover:border-brand-bronze/30 text-brand-cream hover:bg-brand-brown/15'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${realtime ? 'animate-spin' : ''}`} />
          {realtime ? 'REAL-TIME PRICING: ACTIVE' : 'ACTIVATE REAL-TIME PRICING'}
        </button>
      </div>

      {/* Catalog Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <GlassCard className="lg:col-span-1 border-brand-glass-border space-y-6 !p-5">
          <div className="flex justify-between items-center pb-3 border-b border-brand-glass-border">
            <h3 className="font-bold text-sm text-brand-cream flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-bronze" /> Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-bold text-brand-bronze hover:underline uppercase"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-brand-taupe uppercase tracking-wider">
              Category
            </h4>
            <div className="flex flex-col gap-1.5 text-sm">
              {['', 'Mice', 'Keyboards', 'Monitors', 'Custom PCs', 'Components'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-1.5 rounded-lg transition-colors font-medium text-xs ${
                    selectedCategory === cat
                      ? 'bg-brand-bronze/10 text-brand-bronze border-l-2 border-brand-bronze pl-2.5 font-bold'
                      : 'text-brand-taupe hover:text-brand-cream hover:bg-brand-brown/10'
                  }`}
                >
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-semibold text-brand-taupe uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-xs font-bold text-brand-bronze">${priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-brand-brown/40 appearance-none cursor-pointer accent-brand-bronze"
            />
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-brand-taupe uppercase tracking-wider">
                Brand
              </h4>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 text-xs text-brand-cream cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="accent-brand-bronze rounded border-brand-glass-border bg-brand-black w-3.5 h-3.5"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Switch Type (only for keyboards) */}
          {(selectedCategory === 'Keyboards' || !selectedCategory) && (
            <div className="space-y-2 pt-2 border-t border-brand-glass-border/30">
              <h4 className="text-xs font-semibold text-brand-taupe uppercase tracking-wider">
                Keyboard Switches
              </h4>
              <div className="flex flex-col gap-2">
                {keyboardSwitches.map(sw => (
                  <label key={sw} className="flex items-center gap-2 text-xs text-brand-cream cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSwitches.includes(sw)}
                      onChange={() => handleSwitchChange(sw)}
                      className="accent-brand-bronze rounded border-brand-glass-border bg-brand-black w-3.5 h-3.5"
                    />
                    <span>{sw}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* DPI Switch (only for mice) */}
          {(selectedCategory === 'Mice' || !selectedCategory) && (
            <div className="space-y-2 pt-2 border-t border-brand-glass-border/30">
              <h4 className="text-xs font-semibold text-brand-taupe uppercase tracking-wider">
                Mouse DPI
              </h4>
              <div className="flex flex-col gap-2">
                {mouseDpis.map(dpi => (
                  <label key={dpi} className="flex items-center gap-2 text-xs text-brand-cream cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDpis.includes(dpi)}
                      onChange={() => handleDpiChange(dpi)}
                      className="accent-brand-bronze rounded border-brand-glass-border bg-brand-black w-3.5 h-3.5"
                    />
                    <span>{dpi}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Product Listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search keyboards, gaming mice, custom components..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-brand-brown/10 border border-brand-glass-border focus:border-brand-bronze focus:outline-none text-brand-cream text-sm transition-all shadow-md backdrop-blur-md"
            />
            <Search className="w-5 h-5 text-brand-taupe absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-taupe hover:text-brand-cream"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Real-time pricing disclaimer banner */}
          {realtime && (
            <div className="p-3.5 rounded-xl border border-brand-bronze/20 bg-brand-bronze/5 flex items-start gap-2.5 text-xs text-brand-cream leading-relaxed animate-pulse">
              <Cpu className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
              <p>
                <strong>Real-Time API Sync Active:</strong> Prices are dynamically synced to active tech power-retailer nodes. Fluctuations represent real-time logistics, duty adjustments, and component availability index.
              </p>
            </div>
          )}

          {/* Products List Loader / Display */}
          {loading ? (
            <div className="py-20 flex flex-col justify-center items-center gap-3">
              <RefreshCw className="w-8 h-8 text-brand-bronze animate-spin" />
              <span className="text-xs text-brand-taupe font-semibold">Retrieving hardware listings...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-2xl glass-panel border border-brand-glass-border">
              <ShieldAlert className="w-12 h-12 text-brand-bronze/40 mx-auto" />
              <h3 className="text-lg font-bold text-brand-cream">No products matched your filters</h3>
              <p className="text-sm text-brand-taupe max-w-sm mx-auto">
                Try widening your price range, choosing another category, or refining your search query.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col justify-center items-center gap-3">
        <RefreshCw className="w-8 h-8 text-brand-bronze animate-spin" />
        <span className="text-xs text-brand-taupe font-semibold">Loading Catalog...</span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
