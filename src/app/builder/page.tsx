'use client';

import React, { useState } from 'react';
import { Cpu, Layers, HardDrive, Zap, Box, AlertTriangle, CheckCircle, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { mockProducts, Product } from '@/data/mock-products';
import { useApp } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/glass-card';

interface BuildSlot {
  id: string;
  name: string;
  category: 'Components';
  subCategory: 'CPU' | 'Motherboard' | 'GPU' | 'RAM' | 'PSU' | 'Case';
  icon: any;
  selectedItem: Product | null;
}

export default function PCBuilder() {
  const { addToCart } = useApp();
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Initialize PC builder slots
  const [slots, setSlots] = useState<BuildSlot[]>([
    { id: 'cpu', name: 'Processor (CPU)', category: 'Components', subCategory: 'CPU', icon: Cpu, selectedItem: null },
    { id: 'motherboard', name: 'Motherboard', category: 'Components', subCategory: 'Motherboard', icon: Layers, selectedItem: null },
    { id: 'gpu', name: 'Graphics Card (GPU)', category: 'Components', subCategory: 'GPU', icon: Zap, selectedItem: null },
    { id: 'ram', name: 'Memory (RAM)', category: 'Components', subCategory: 'RAM', icon: HardDrive, selectedItem: null },
    { id: 'psu', name: 'Power Supply (PSU)', category: 'Components', subCategory: 'PSU', icon: Zap, selectedItem: null },
    { id: 'case', name: 'PC Case', category: 'Components', subCategory: 'Case', icon: Box, selectedItem: null }
  ]);

  const selectItemForSlot = (slotId: string, item: Product) => {
    setSlots(prev =>
      prev.map(s => (s.id === slotId ? { ...s, selectedItem: item } : s))
    );
    setActiveSlot(null);
  };

  const removeSlotItem = (slotId: string) => {
    setSlots(prev =>
      prev.map(s => (s.id === slotId ? { ...s, selectedItem: null } : s))
    );
  };

  // Get matching products for a specific slot category
  const getProductsForSlot = (subCategory: string): Product[] => {
    return mockProducts.filter(
      p => p.category === 'Components' && p.specs.type === subCategory
    );
  };

  // Compatibility Checks
  const cpu = slots.find(s => s.id === 'cpu')?.selectedItem;
  const mobo = slots.find(s => s.id === 'motherboard')?.selectedItem;
  const gpu = slots.find(s => s.id === 'gpu')?.selectedItem;
  const ram = slots.find(s => s.id === 'ram')?.selectedItem;
  const psu = slots.find(s => s.id === 'psu')?.selectedItem;
  const pccase = slots.find(s => s.id === 'case')?.selectedItem;

  const warnings: string[] = [];

  // Check 1: Socket match (CPU and Motherboard)
  if (cpu && mobo) {
    const cpuSocket = cpu.specs.socket;
    const moboSocket = mobo.specs.socket;
    if (cpuSocket !== moboSocket) {
      warnings.push(`Socket mismatch: Selected CPU requires socket ${cpuSocket}, but Motherboard is ${moboSocket}.`);
    }
  }

  // Check 2: Total power usage vs PSU wattage
  let totalPowerUsage = 100; // Base motherboard/fans power
  if (cpu) {
    const cpuPowerStr = cpu.specs.powerUsage || '100W';
    const cpuPower = parseInt(cpuPowerStr) || 120;
    totalPowerUsage += cpuPower;
  }
  if (gpu) {
    const gpuPowerStr = gpu.specs.powerUsage || '200W';
    const gpuPower = parseInt(gpuPowerStr) || 250;
    totalPowerUsage += gpuPower;
  }

  if (psu) {
    const psuWattage = psu.specs.wattage || 750;
    if (totalPowerUsage > psuWattage) {
      warnings.push(`Insufficient power: Combined system power draw is estimated at ${totalPowerUsage}W, but Power Supply offers only ${psuWattage}W. Recommend a ${totalPowerUsage + 100}W+ PSU.`);
    }
  }

  const buildCost = slots.reduce((total, s) => total + (s.selectedItem?.price || 0), 0);
  const totalItemsSelected = slots.filter(s => s.selectedItem).length;

  const handleAddAllToCart = () => {
    let addedAny = false;
    slots.forEach(slot => {
      if (slot.selectedItem) {
        addToCart(slot.selectedItem);
        addedAny = true;
      }
    });
    if (addedAny) {
      alert('All selected compatible parts have been added to your cart!');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-brand-cream tracking-tight">
          PC COMPATIBILITY BUILDER
        </h1>
        <p className="text-xs text-brand-taupe mt-1">
          Pick parts for your rig. Our bento system automatically performs socket checking, power draw math, and modular configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Bento Grid builder slots (col-span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slots.map(slot => {
            const Icon = slot.icon;
            const item = slot.selectedItem;

            return (
              <GlassCard
                key={slot.id}
                hoverGlow={!item}
                className={`relative border overflow-hidden p-5 flex flex-col justify-between min-h-[140px] transition-all cursor-pointer ${
                  item ? 'border-brand-bronze/30 bg-brand-brown/10' : 'border-brand-glass-border bg-brand-black/20 hover:border-brand-bronze/25'
                }`}
                onClick={() => {
                  if (!item) setActiveSlot(slot.id);
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold text-brand-bronze uppercase tracking-widest">
                      {slot.name}
                    </span>
                    {item && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSlotItem(slot.id);
                        }}
                        className="text-brand-taupe hover:text-red-400 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {item ? (
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-black border border-brand-glass-border flex-shrink-0">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-brand-cream truncate">{item.name}</h4>
                        <span className="text-[10px] text-brand-bronze font-bold">${item.price}</span>
                        {/* Short spec */}
                        <div className="flex gap-1.5 mt-1 text-[9px] text-brand-taupe">
                          {item.specs.socket && <span>Socket: {item.specs.socket}</span>}
                          {item.specs.powerUsage && <span>TDP: {item.specs.powerUsage}</span>}
                          {item.specs.wattage && <span>Power: {item.specs.wattage}W</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-2 text-brand-taupe/60">
                      <div className="w-10 h-10 rounded-xl bg-brand-brown/10 border border-brand-glass-border flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-bronze/45" />
                      </div>
                      <span className="text-xs font-semibold">Empty Slot. Click to insert item.</span>
                    </div>
                  )}
                </div>

                {!item && (
                  <button
                    onClick={() => setActiveSlot(slot.id)}
                    className="self-end mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-bronze/10 border border-brand-bronze/25 text-brand-bronze hover:bg-brand-bronze hover:text-brand-black text-[10px] font-bold uppercase transition-all"
                  >
                    <Plus className="w-3 h-3" /> Select Item
                  </button>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Right: Build Summary panel */}
        <GlassCard className="lg:col-span-1 border-brand-glass-border space-y-5 bg-brand-dark-brown/15 !p-5">
          <h3 className="font-bold text-base text-brand-cream pb-3 border-b border-brand-glass-border tracking-wide">
            Build Summary
          </h3>

          <div className="space-y-4">
            {/* Compatibility status badge */}
            <div className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs bg-brand-black/40 border-brand-glass-border">
              {warnings.length > 0 ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-amber-500">Compatibility Issues ({warnings.length})</span>
                    <p className="text-[10px] text-brand-taupe leading-relaxed">
                      Please check the warnings details below and adjust selected parts.
                    </p>
                  </div>
                </>
              ) : totalItemsSelected > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-green-400">Everything Compatible!</span>
                    <p className="text-[10px] text-brand-taupe leading-relaxed">
                      CPU socket match verified. Power requirements are within limits.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-brand-taupe">
                  Start picking computer parts to activate system compatibility calculations.
                </div>
              )}
            </div>

            {/* Warnings list */}
            {warnings.length > 0 && (
              <div className="space-y-2 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[10px] text-amber-400 leading-relaxed">
                {warnings.map((warn, i) => (
                  <div key={i} className="flex gap-1.5">
                    <span>•</span>
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Specs summary stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-brand-taupe">
                <span>Total TDP Draw</span>
                <span className="font-bold text-brand-cream">{totalPowerUsage}W</span>
              </div>
              <div className="flex justify-between text-brand-taupe">
                <span>Selected Components</span>
                <span className="font-bold text-brand-cream">{totalItemsSelected} / 6</span>
              </div>
              <div className="flex justify-between text-brand-cream font-bold text-sm border-t border-brand-glass-border/30 pt-3">
                <span>Estimated Cost</span>
                <span className="text-brand-bronze text-base">${buildCost}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleAddAllToCart}
              disabled={totalItemsSelected === 0}
              className="w-full py-3.5 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover disabled:bg-brand-bronze/40 disabled:text-brand-black/60 text-brand-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-bronze/5"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All Parts to Cart
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Part Selection Overlay Drawer Modal */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-brand-black/75 backdrop-blur-sm" onClick={() => setActiveSlot(null)} />
          
          <GlassCard className="w-full max-w-2xl bg-brand-black/95 border-brand-glass-border shadow-2xl z-10 p-6 max-h-[500px] flex flex-col overflow-hidden backdrop-blur-xl">
            <div className="flex justify-between items-center pb-3 border-b border-brand-glass-border mb-4">
              <h3 className="font-extrabold text-base text-brand-cream">
                Select {slots.find(s => s.id === activeSlot)?.subCategory}
              </h3>
              <button
                onClick={() => setActiveSlot(null)}
                className="px-2 py-1 text-xs text-brand-taupe hover:text-brand-cream border border-brand-glass-border rounded-lg bg-brand-brown/10"
              >
                Cancel
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {getProductsForSlot(slots.find(s => s.id === activeSlot)?.subCategory || '').map(item => (
                <div
                  key={item.id}
                  onClick={() => selectItemForSlot(activeSlot, item)}
                  className="flex gap-4 p-3.5 rounded-xl bg-brand-brown/10 border border-brand-glass-border hover:border-brand-bronze/35 hover:bg-brand-brown/20 cursor-pointer transition-all"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-brand-black border border-brand-glass-border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-brand-cream truncate">{item.name}</h4>
                      <p className="text-[10px] text-brand-taupe line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                    {/* Specs badge details */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(item.specs).slice(1, 4).map(([key, val]) => (
                        <span key={key} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-black/40 border border-brand-glass-border text-brand-taupe">
                          {key.toUpperCase()}: {val}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <span className="font-black text-xs text-brand-bronze">${item.price}</span>
                    <span className="text-[9px] text-brand-taupe">{item.specs.brand}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
