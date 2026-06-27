'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockProducts, Product } from '@/data/mock-products';
import ProductCard from '@/components/ProductCard';
import { GlassCard } from '@/components/ui/glass-card';
import { Heart, Package, Truck, Calendar, ShoppingCart, RefreshCw, ClipboardList, MapPin } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingCode: string;
  total: number;
}

export default function Dashboard() {
  const { wishlist } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter mockProducts to display liked ones
  const likedProducts = mockProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-brand-cream tracking-tight">
          USER HUB & DASHBOARD
        </h1>
        <p className="text-xs text-brand-taupe mt-1">
          Review active orders, track logistics status, and manage saved high-performance items in your wishlist.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-glass-border">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 font-extrabold text-sm border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-brand-taupe hover:text-brand-cream'
          }`}
        >
          <Package className="w-4.5 h-4.5" />
          Order History & Tracking ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-6 py-3 font-extrabold text-sm border-b-2 transition-all ${
            activeTab === 'wishlist'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-brand-taupe hover:text-brand-cream'
          }`}
        >
          <Heart className="w-4.5 h-4.5" />
          Wishlist & Liked ({likedProducts.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="py-20 flex flex-col justify-center items-center gap-3">
              <RefreshCw className="w-8 h-8 text-brand-bronze animate-spin" />
              <span className="text-xs text-brand-taupe">Loading order logs...</span>
            </div>
          ) : orders.length === 0 ? (
            <GlassCard className="py-20 text-center space-y-4 border border-brand-glass-border">
              <ClipboardList className="w-12 h-12 text-brand-bronze/40 mx-auto" />
              <h3 className="text-lg font-bold text-brand-cream">No order logs found</h3>
              <p className="text-sm text-brand-taupe max-w-sm mx-auto">
                Configure custom builds or select peripherals and proceed through checkout to test the system.
              </p>
              <Link
                href="/catalog"
                className="inline-block px-5 py-2.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all"
              >
                Go to Catalog
              </Link>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <GlassCard
                  key={order.id}
                  hoverGlow={false}
                  className="border border-brand-glass-border grid grid-cols-1 md:grid-cols-3 gap-6 !p-6"
                >
                  {/* Summary / Meta */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-brand-cream">Order {order.id}</span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-bronze/10 border border-brand-bronze/20 text-brand-bronze">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-brand-taupe">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-brand-bronze/70" />
                        <span>Placed: {order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-brand-bronze/70" />
                        <span>Tracking: <strong className="text-brand-cream">{order.trackingCode}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-bronze/70" />
                        <span>Dest: {order.shippingInfo.city}, UZ</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-brand-glass-border/30">
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-taupe">Paid Total</span>
                        <span className="font-black text-brand-bronze text-sm">${order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="md:col-span-2 space-y-3.5 border-t md:border-t-0 md:border-l border-brand-glass-border/30 pt-4 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wider mb-2">
                      Ordered Hardware
                    </h4>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                      {order.items.map(item => (
                        <div
                          key={item.productId}
                          className="flex justify-between items-center text-xs p-2 rounded-lg bg-brand-brown/10 border border-brand-glass-border/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-brand-black border border-brand-glass-border">
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-brand-cream block truncate max-w-[200px]">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-brand-taupe">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-brand-bronze">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {likedProducts.length === 0 ? (
            <GlassCard className="py-20 text-center space-y-4 border border-brand-glass-border">
              <Heart className="w-12 h-12 text-brand-bronze/40 mx-auto" />
              <h3 className="text-lg font-bold text-brand-cream">Wishlist is empty</h3>
              <p className="text-sm text-brand-taupe max-w-sm mx-auto">
                Explore products inside the Catalog and hit the heart icon to save them to your customized list.
              </p>
              <Link
                href="/catalog"
                className="inline-block px-5 py-2.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black font-semibold text-sm transition-all"
              >
                Find Products
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {likedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
