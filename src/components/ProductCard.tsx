'use client';

import React, { useState } from 'react';
import { Heart, ShoppingCart, ExternalLink, Star, ShieldCheck } from 'lucide-react';
import { Product } from '@/data/mock-products';
import { useApp } from '@/context/AppContext';
import { GlassCard } from './ui/glass-card';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [postingOlx, setPostingOlx] = useState(false);
  const [olxUrl, setOlxUrl] = useState(product.olxUrl);

  const isLiked = wishlist.includes(product.id);

  // Calculate discounted price
  const hasDiscount = !!product.isFlashSale && !!product.flashSaleDiscount;
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.flashSaleDiscount || 0) / 100))
    : product.price;

  const handlePostToOlx = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPostingOlx(true);

    try {
      const res = await fetch('/api/olx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: finalPrice,
          description: product.description
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOlxUrl(data.olxUrl);
        alert(`Successfully cross-listed to OLX!\nLink: ${data.olxUrl}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to OLX API.');
    } finally {
      setPostingOlx(false);
    }
  };

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden group select-none relative !p-0 border border-brand-glass-border hover:border-brand-bronze/30">
      {/* Badges and Wishlist Button */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isPopular && (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-bronze text-brand-black shadow-md shadow-brand-bronze/10">
            Popular
          </span>
        )}
        {product.isFlashSale && (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-md shadow-red-500/10">
            -{product.flashSaleDiscount}% Off
          </span>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-xl glass-panel bg-brand-black/50 hover:bg-brand-brown/40 border border-brand-glass-border hover:border-brand-bronze/30 text-brand-taupe hover:text-brand-cream transition-colors"
        aria-label="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 transition-transform group-active:scale-95 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Panel */}
      <div className="relative w-full aspect-square overflow-hidden bg-brand-black flex items-center justify-center border-b border-brand-glass-border">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Hover overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-40" />
      </div>

      {/* Product Details Panel */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-brand-dark-brown/20">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-brand-taupe mb-1">
            <div className="flex text-brand-bronze">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-brand-bronze' : 'opacity-40'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-brand-cream ml-0.5">{product.rating}</span>
            <span className="opacity-60">({product.reviews} reviews)</span>
          </div>

          <h3 className="font-bold text-base text-brand-cream line-clamp-1 group-hover:text-brand-bronze transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-brand-taupe line-clamp-2 mt-1">
            {product.description}
          </p>

          {/* Quick Specs summary */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <span
                key={key}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-brown/40 border border-brand-glass-border text-brand-taupe"
              >
                {key.toUpperCase()}: {val}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-brand-glass-border">
          <div className="flex justify-between items-baseline mb-3">
            <div>
              {hasDiscount && (
                <span className="text-xs line-through text-brand-taupe mr-1.5 opacity-60">
                  ${product.price}
                </span>
              )}
              <span className="text-lg font-black text-brand-cream">
                ${finalPrice}
              </span>
            </div>
            <span className="text-[10px] font-bold text-brand-bronze uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => addToCart(product)}
              className="w-full py-2.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-bronze/5 active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            {/* OLX Action Integration Button */}
            {olxUrl ? (
              <a
                href={olxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 rounded-xl border border-brand-glass-border hover:border-emerald-500/40 hover:bg-emerald-500/10 text-brand-taupe hover:text-emerald-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Buy on OLX (P2P Trust)
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <button
                onClick={handlePostToOlx}
                disabled={postingOlx}
                className="py-1.5 rounded-xl border border-brand-glass-border hover:border-brand-bronze/30 hover:bg-brand-brown/20 text-brand-taupe hover:text-brand-cream text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {postingOlx ? 'Posting to OLX...' : 'List on OLX (Sell Peer)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
