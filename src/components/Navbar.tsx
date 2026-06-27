'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, Cpu, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, setIsCartOpen } = useApp();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-brand-black/45 backdrop-blur-md border-b border-brand-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-bronze to-brand-brown border border-brand-bronze/30 flex items-center justify-center shadow-lg group-hover:shadow-brand-bronze/25 transition-all">
              <Cpu className="w-5 h-5 text-brand-black" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-brand-cream group-hover:text-brand-bronze transition-colors flex items-center gap-1.5">
              AUREUM<span className="text-brand-bronze font-light text-sm tracking-widest">TECH</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-full glass-panel border border-brand-glass-border bg-brand-brown/10">
            {[
              { href: '/', label: 'Home' },
              { href: '/catalog', label: 'Catalog' },
              { href: '/builder', label: 'PC Builder' },
              { href: '/dashboard', label: 'Dashboard' }
            ].map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-brand-bronze text-brand-black shadow-md shadow-brand-bronze/10'
                      : 'text-brand-taupe hover:text-brand-cream hover:bg-brand-brown/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utilities (Cart, Wishlist, Theme) */}
          <div className="flex items-center gap-4">
            {/* Wishlist Button */}
            <Link
              href="/dashboard"
              className="p-2.5 rounded-full glass-panel hover:border-brand-bronze/30 text-brand-taupe hover:text-brand-cream transition-all relative"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-brand-bronze text-brand-bronze' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-bronze border border-brand-black text-[10px] font-bold text-brand-black flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full glass-panel hover:border-brand-bronze/30 text-brand-taupe hover:text-brand-cream transition-all relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-bronze border border-brand-black text-[10px] font-bold text-brand-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile navigation overlay bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-black/90 backdrop-blur-xl border-t border-brand-glass-border py-2 px-6 flex justify-around items-center z-45">
        {[
          { href: '/', label: 'Home', icon: Layers },
          { href: '/catalog', label: 'Catalog', icon: ShoppingCart },
          { href: '/builder', label: 'Builder', icon: Cpu },
          { href: '/dashboard', label: 'Dashboard', icon: Heart }
        ].map(item => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-1 text-xs font-semibold transition-colors ${
                active ? 'text-brand-bronze' : 'text-brand-taupe hover:text-brand-cream'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
