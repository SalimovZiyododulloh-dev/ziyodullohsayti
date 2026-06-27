'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, CheckCircle2, Truck, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import confetti from 'canvas-confetti';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'success';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, clearCart } = useApp();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Shipping Form
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: 'Tashkent',
    phone: ''
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 300 ? 0 : 15;
  const total = subtotal + shippingFee;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c59b27', '#e5b32f', '#f7f4eb', '#8e6d17']
    });
  };

  const handleNextStep = () => {
    if (step === 'cart') setStep('shipping');
    else if (step === 'shipping') {
      if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
        alert('Please fill in all shipping details.');
        return;
      }
      setStep('payment');
    }
  };

  const handleCheckoutSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          shippingInfo,
          paymentMethod,
          total
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrderId(data.order.id);
        setStep('success');
        clearCart();
        triggerConfetti();
      } else {
        alert(data.error || 'Checkout failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset checkout step on close unless success
    if (step !== 'success') {
      setTimeout(() => setStep('cart'), 300);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-brand-black/75 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-black/90 border-l border-brand-glass-border shadow-2xl z-50 flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-brand-glass-border flex justify-between items-center bg-brand-dark-brown/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-bronze" />
                <h2 className="font-bold text-lg text-brand-cream tracking-wide">
                  {step === 'cart' && 'Your Cart'}
                  {step === 'shipping' && 'Shipping Details'}
                  {step === 'payment' && 'Payment Method'}
                  {step === 'success' && 'Order Placed!'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-brand-brown/40 text-brand-taupe hover:text-brand-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            {step !== 'success' && (
              <div className="flex justify-between items-center px-6 py-3 bg-brand-brown/10 border-b border-brand-glass-border text-xs font-semibold text-brand-taupe">
                <span className={step === 'cart' ? 'text-brand-bronze' : 'text-brand-cream/60'}>1. Review</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-45" />
                <span className={step === 'shipping' ? 'text-brand-bronze' : 'text-brand-cream/60'}>2. Shipping</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-45" />
                <span className={step === 'payment' ? 'text-brand-bronze' : 'text-brand-cream/60'}>3. Payment</span>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Empty Cart State */}
              {step === 'cart' && cart.length === 0 && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-brand-brown/20 border border-brand-bronze/20 flex items-center justify-center text-brand-bronze/60 animate-pulse">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-cream">Your cart is empty</h3>
                  <p className="text-sm text-brand-taupe max-w-xs">
                    Explore our categories and add high-performance hardware to your setup.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all shadow-lg shadow-brand-bronze/10"
                  >
                    Start Shopping
                  </button>
                </div>
              )}

              {/* Step 1: Cart Items */}
              {step === 'cart' && cart.length > 0 && (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 rounded-xl bg-brand-brown/20 border border-brand-glass-border hover:border-brand-bronze/20 transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-glass-border flex-shrink-0 bg-brand-black">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-brand-cream truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-brand-taupe truncate mt-0.5">
                          {item.product.category}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-brand-bronze font-bold text-sm">
                            ${item.product.price}
                          </span>
                          <div className="flex items-center gap-2 border border-brand-glass-border rounded-lg bg-brand-black/40 px-2 py-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="text-brand-taupe hover:text-brand-cream text-xs px-1"
                            >
                              -
                            </button>
                            <span className="text-xs text-brand-cream w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="text-brand-taupe hover:text-brand-cream text-xs px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-brand-taupe hover:text-red-400 self-start p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Shipping Form */}
              {step === 'shipping' && (
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-taupe block">Full Name</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={e => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      placeholder="e.g. Alisher Usmanov"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-black/50 border border-brand-glass-border text-brand-cream focus:outline-none focus:border-brand-bronze text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-taupe block">Delivery Address</label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="e.g. Navoi Avenue, House 24, Apt 15"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-black/50 border border-brand-glass-border text-brand-cream focus:outline-none focus:border-brand-bronze text-sm transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-taupe block">City / Region</label>
                    <select
                      value={shippingInfo.city}
                      onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-black/50 border border-brand-glass-border text-brand-cream focus:outline-none focus:border-brand-bronze text-sm transition-all"
                    >
                      <option value="Tashkent">Tashkent</option>
                      <option value="Samarkand">Samarkand</option>
                      <option value="Bukhara">Bukhara</option>
                      <option value="Andijan">Andijan</option>
                      <option value="Namangan">Namangan</option>
                      <option value="Khiva">Khiva</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-taupe block">Phone Number</label>
                    <input
                      type="text"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      placeholder="+998 (90) 123-45-67"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-black/50 border border-brand-glass-border text-brand-cream focus:outline-none focus:border-brand-bronze text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment Option */}
              {step === 'payment' && (
                <div className="space-y-4 p-1">
                  <p className="text-xs text-brand-taupe">Select your secure payment method. All transactions are fully encrypted.</p>
                  
                  {[
                    { id: 'Cash on Delivery', title: 'Cash on Delivery', desc: 'Pay with cash or card upon product delivery' },
                    { id: 'Click / Payme (Simulated)', title: 'Click / Payme (Simulated)', desc: 'Instant local electronic payments' },
                    { id: 'Bronze Trust Escrow', title: 'Bronze Trust P2P Escrow', desc: 'Secure escrow holding for custom PC parts' }
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex gap-3 p-4 rounded-xl border transition-all cursor-pointer block ${
                        paymentMethod === method.id
                          ? 'border-brand-bronze bg-brand-bronze/10'
                          : 'border-brand-glass-border bg-brand-brown/10 hover:border-brand-bronze/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-brand-bronze mt-1"
                      />
                      <div>
                        <h5 className="font-semibold text-sm text-brand-cream">{method.title}</h5>
                        <p className="text-xs text-brand-taupe mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Step 4: Success confirmation */}
              {step === 'success' && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-5 py-10">
                  <div className="w-20 h-20 rounded-full bg-brand-bronze/20 border border-brand-bronze/30 flex items-center justify-center text-brand-bronze">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-cream tracking-wide">
                    Buyurtmangiz qabul qilindi!
                  </h3>
                  <div className="p-4 rounded-xl bg-brand-brown/10 border border-brand-glass-border w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-taupe">Order ID:</span>
                      <span className="font-bold text-brand-bronze">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-taupe">Status:</span>
                      <span className="flex items-center gap-1.5 text-green-400 font-semibold">
                        <Truck className="w-4 h-4" /> Processing
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-taupe">Method:</span>
                      <span className="text-brand-cream">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between border-t border-brand-glass-border pt-2 mt-2 font-bold text-brand-cream">
                      <span>Paid Total:</span>
                      <span className="text-brand-bronze">${total}</span>
                    </div>
                  </div>
                  <p className="text-xs text-brand-taupe max-w-sm">
                    You can track your order using the order ID in your Dashboard. Tashkent deliveries arrive within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setStep('cart');
                      handleClose();
                    }}
                    className="w-full py-3 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all shadow-lg"
                  >
                    Back to Store
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary & Action Buttons */}
            {step !== 'success' && cart.length > 0 && (
              <div className="p-5 border-t border-brand-glass-border bg-brand-dark-brown/40 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-brand-taupe">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-brand-taupe">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-brand-cream font-bold text-base border-t border-brand-glass-border pt-2 mt-1">
                    <span>Total Amount</span>
                    <span className="text-brand-bronze">${total}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {step !== 'cart' && (
                    <button
                      onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                      className="px-4 py-3 rounded-xl border border-brand-glass-border hover:bg-brand-brown/25 text-brand-taupe hover:text-brand-cream text-sm font-semibold transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  {step === 'payment' ? (
                    <button
                      onClick={handleCheckoutSubmit}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover disabled:bg-brand-bronze/45 text-brand-black font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-bronze/10"
                    >
                      {loading ? 'Processing...' : `Pay & Confirm $${total}`}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-3 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-bronze/10"
                    >
                      Proceed to {step === 'cart' ? 'Shipping' : 'Payment'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
