'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowRight, MousePointerClick, Zap, Flame, ShieldAlert, Award, Volume2, Compass } from 'lucide-react';
import { mockProducts } from '@/data/mock-products';
import ProductCard from '@/components/ProductCard';
import { GlassCard } from '@/components/ui/glass-card';

export default function Home() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Mock slides for Hero bento grid box
  const heroSlides = [
    {
      title: 'Aureum Elite Custom PCs',
      subtitle: 'Build your dream station with custom gold-gilded wiring and Ryzen 9 + RTX 4080 Super liquid cooling.',
      badge: 'PRESTIGE BUILD',
      cta: 'Explore Builds',
      link: '/catalog?category=Custom%20PCs',
      bgGradient: 'from-[#1c1412] via-[#2c1f1c] to-[#0a0908]'
    },
    {
      title: 'BronzeAlchemy Custom Keyboards',
      subtitle: 'Premium gasket-mounted tactile switches with bronze frames. Enjoy deep thock sounds and elite feedback.',
      badge: 'NEW DROP',
      cta: 'View Keyboards',
      link: '/catalog?category=Keyboards',
      bgGradient: 'from-[#2c1f1c] via-[#160f0d] to-[#080707]'
    },
    {
      title: 'Aureum Claw X1 Precision Mouse',
      subtitle: 'Gilded tactile scroll, ultra-lightweight 53g carbon shell, and unmatched 26K DPI response.',
      badge: 'FLAWLESS CONTROL',
      cta: 'View Peripherals',
      link: '/catalog?category=Mice',
      bgGradient: 'from-[#160f0d] via-[#251a17] to-[#0a0908]'
    }
  ];

  // Auto-scroll slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash sales countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter flash sales and popular products
  const flashProducts = mockProducts.filter(p => p.isFlashSale).slice(0, 2);
  const popularProducts = mockProducts.filter(p => p.isPopular).slice(0, 4);

  const formatTime = (t: number) => t.toString().padStart(2, '0');

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-brand-cream">
            FORGE YOUR <span className="text-gold-gradient">ULTIMATE</span> SETUP
          </h1>
          <p className="text-sm text-brand-taupe mt-1 max-w-xl">
            Premium custom PCs, high-end keyboards, monitors, and components with real-time market pricing integrations.
          </p>
        </div>
        <Link
          href="/catalog"
          className="self-start md:self-center flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-brown/40 border border-brand-glass-border hover:border-brand-bronze/35 text-brand-cream text-sm font-semibold transition-all hover:bg-brand-brown/60"
        >
          Browse Full Catalog
          <ArrowRight className="w-4 h-4 text-brand-bronze" />
        </Link>
      </div>

      {/* Main Bento Grid */}
      <div className="bento-grid">
        {/* Box 1: Hero Slider (Col span 3, Row span 2) */}
        <div className="md:col-span-3 md:row-span-2 relative rounded-2xl overflow-hidden glass-panel border border-brand-glass-border flex flex-col justify-end p-8 min-h-[360px] md:min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={sliderIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${heroSlides[sliderIndex].bgGradient} transition-all`}
            >
              {/* Artistic Background glow patterns */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,155,39,0.08),transparent_40%)]" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-bronze/5 rounded-full blur-[80px] pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Slider details */}
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-brand-bronze/10 border border-brand-bronze/30 text-brand-bronze uppercase">
              {heroSlides[sliderIndex].badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-brand-cream tracking-tight leading-none">
              {heroSlides[sliderIndex].title}
            </h2>
            <p className="text-sm md:text-base text-brand-taupe leading-relaxed">
              {heroSlides[sliderIndex].subtitle}
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href={heroSlides[sliderIndex].link}
                className="px-6 py-3 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-extrabold text-sm transition-all shadow-lg shadow-brand-bronze/10 flex items-center gap-2"
              >
                {heroSlides[sliderIndex].cta}
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Slider dots indicator */}
              <div className="flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSliderIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      sliderIndex === i ? 'bg-brand-bronze w-6' : 'bg-brand-taupe/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Interactive PC Builder Entry Card (Col span 1, Row span 2) */}
        <GlassCard className="md:col-span-1 md:row-span-2 border-brand-bronze/20 bg-gradient-to-b from-brand-brown/20 to-brand-black flex flex-col justify-between p-6 hover:border-brand-bronze/45">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-bronze/10 border border-brand-bronze/20 flex items-center justify-center text-brand-bronze">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-brand-cream tracking-wide">
                Interactive PC Builder
              </h3>
              <p className="text-xs text-brand-taupe mt-1.5 leading-relaxed">
                Choose components (CPU, GPU, RAM, Motherboard) and check socket & power compatibility live in our bento planner!
              </p>
            </div>
            {/* Live mockup layout representation */}
            <div className="p-3.5 rounded-xl bg-brand-black/50 border border-brand-glass-border space-y-2.5 text-[10px]">
              <div className="flex justify-between items-center text-brand-taupe">
                <span>CPU Sockets</span>
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> AM5 Match
                </span>
              </div>
              <div className="w-full bg-brand-brown/30 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-bronze h-full w-[85%]" />
              </div>
              <div className="flex justify-between items-center text-brand-taupe">
                <span>Estimated TDP Power</span>
                <span className="text-brand-bronze font-bold">485W / 850W</span>
              </div>
            </div>
          </div>

          <Link
            href="/builder"
            className="w-full py-3 rounded-xl bg-brand-brown/50 hover:bg-brand-bronze hover:text-brand-black border border-brand-glass-border hover:border-brand-bronze text-brand-cream text-center font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4"
          >
            Launch Builder
            <MousePointerClick className="w-4 h-4" />
          </Link>
        </GlassCard>

        {/* Box 3: Categories Breakdown (Col span 4) */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Mice', count: '12 Items', link: '/catalog?category=Mice', icon: MousePointerClick },
            { name: 'Keyboards', count: '24 Items', link: '/catalog?category=Keyboards', icon: Award },
            { name: 'Monitors', count: '8 Items', link: '/catalog?category=Monitors', icon: Compass },
            { name: 'Custom PCs', count: '6 prebuilts', link: '/catalog?category=Custom%20PCs', icon: Cpu },
            { name: 'Components', count: '54 parts', link: '/catalog?category=Components', icon: Zap }
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.link}>
                <GlassCard className="p-4 flex items-center gap-3 border border-brand-glass-border hover:border-brand-bronze/35 hover:bg-brand-brown/15 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-brand-brown/30 border border-brand-glass-border flex items-center justify-center text-brand-bronze">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-cream">{cat.name}</h4>
                    <span className="text-[10px] text-brand-taupe">{cat.count}</span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>

        {/* Box 4: Flash Sales (Col span 2, Row span 2) */}
        <GlassCard className="md:col-span-2 md:row-span-2 border-brand-glass-border flex flex-col justify-between gap-4 bg-brand-dark-brown/10">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-brand-glass-border">
              <div className="flex items-center gap-1.5 text-red-500 font-extrabold text-lg">
                <Flame className="w-5 h-5 fill-red-500 animate-bounce" />
                <span>FLASH SALE</span>
              </div>

              {/* Countdown timers */}
              <div className="flex items-center gap-1">
                {[
                  { label: 'H', val: formatTime(timeLeft.hours) },
                  { label: 'M', val: formatTime(timeLeft.minutes) },
                  { label: 'S', val: formatTime(timeLeft.seconds) }
                ].map((item, i) => (
                  <React.Fragment key={item.label}>
                    <div className="px-2 py-1 rounded bg-brand-black border border-brand-glass-border text-xs font-black text-brand-bronze">
                      {item.val}
                    </div>
                    {i < 2 && <span className="text-xs text-brand-bronze font-bold">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p className="text-xs text-brand-taupe mt-2">
              Grab high-end PC parts and peripherals at limited discount rates. Refreshes daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 mt-4">
            {flashProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </GlassCard>

        {/* Box 5: Popular Products (Col span 2, Row span 2) */}
        <div className="md:col-span-2 md:row-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <h3 className="font-extrabold text-lg text-brand-cream tracking-wide flex items-center gap-1.5">
              <Award className="w-5 h-5 text-brand-bronze" /> Popular Products
            </h3>
            <Link href="/catalog" className="text-xs text-brand-bronze hover:underline font-semibold">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {popularProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
