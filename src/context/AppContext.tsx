'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/mock-products';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ag_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    // Load wishlist from local API (which uses db.json)
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWishlist(data);
      })
      .catch(err => {
        // Fallback to localStorage if API fails
        const savedWishlist = localStorage.getItem('ag_wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      });
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ag_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart drawer on add
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = async (productId: string) => {
    // Update local state immediately (Optimistic update)
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('ag_wishlist', JSON.stringify(next));
      return next;
    });

    // Call API to persist in db.json
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWishlist(data);
        localStorage.setItem('ag_wishlist', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to sync wishlist with database:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
