import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldAlert, 
  Tag, 
  Truck, 
  Check,
  AlertCircle
} from 'lucide-react';
import { CartItem, UnitType } from '../types/pharmacy';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdateUnit: (index: number, unit: UnitType) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  deliveryMethod: 'standard' | 'express';
  onChangeDeliveryMethod: (method: 'standard' | 'express') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateUnit,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  deliveryMethod,
  onChangeDeliveryMethod
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isOpen) return null;

  // Compute pricing
  const subtotal = cartItems.reduce((acc, item) => {
    let multiplier = 1;
    if (item.unit === 'strip') multiplier = item.medicine.stripSize;
    if (item.unit === 'box') multiplier = item.medicine.boxSize;
    const discountedPrice = item.medicine.pricePerPiece * (1 - item.medicine.discountPercent / 100);
    return acc + discountedPrice * multiplier * item.quantity;
  }, 0);

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'HEALTH10') {
    discountAmount = subtotal * 0.10;
  } else if (appliedCoupon === 'EPHARMA50') {
    discountAmount = Math.min(50, subtotal);
  }

  // Delivery fee
  // Standard is free if order > 999 BDT, else 50 BDT. Express is 99 BDT.
  const deliveryFee = deliveryMethod === 'express' ? 99 : (subtotal >= 999 ? 0 : 50);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const hasRxMedicines = cartItems.some(i => i.medicine.isPrescriptionRequired);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const valid = onApplyCoupon(couponInput.trim().toUpperCase());
    if (valid) {
      setCouponSuccess(true);
      setTimeout(() => setCouponSuccess(false), 2000);
    } else {
      setCouponError('Invalid coupon. Try HEALTH10 or EPHARMA50');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Your Medicine Bag
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prescription Warning if applicable */}
        {hasRxMedicines && (
          <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Prescription required for some items. You can upload it during checkout.</span>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Your medicine bag is empty
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our directory of 100% genuine medicines from top Bangladeshi pharmaceutical companies.
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              let multiplier = 1;
              if (item.unit === 'strip') multiplier = item.medicine.stripSize;
              if (item.unit === 'box') multiplier = item.medicine.boxSize;
              const unitPrice = item.medicine.pricePerPiece * (1 - item.medicine.discountPercent / 100) * multiplier;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={`${item.medicine.id}-${item.unit}`} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          {item.medicine.brandName}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {item.medicine.strength}
                        </span>
                        {item.medicine.isPrescriptionRequired && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 rounded">
                            Rx
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.medicine.manufacturer}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold font-mono text-sm text-slate-900 tabular-nums">
                        ৳{itemTotal.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ৳{unitPrice.toFixed(2)} / {item.unit}
                      </div>
                    </div>
                  </div>

                  {/* Unit switcher & Quantity controls */}
                  <div className="mt-3 flex items-center justify-between">
                    
                    {/* Unit Switcher */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px] font-medium">
                      <button
                        onClick={() => onUpdateUnit(index, 'piece')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          item.unit === 'piece' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        1 Pc
                      </button>
                      <button
                        onClick={() => onUpdateUnit(index, 'strip')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          item.unit === 'strip' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Strip ({item.medicine.stripSize})
                      </button>
                      <button
                        onClick={() => onUpdateUnit(index, 'box')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          item.unit === 'box' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Box ({item.medicine.boxSize})
                      </button>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Drawer Footer with Price Breakdown */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-3 text-xs">
            
            {/* Delivery Method Choice */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => onChangeDeliveryMethod('standard')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-emerald-600 bg-white ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-100/60'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard 24h</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {subtotal >= 999 ? 'FREE (Orders ৳999+)' : '৳50 inside city'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChangeDeliveryMethod('express')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-emerald-600 bg-white ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-100/60'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dhaka 2-Hour</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ৳99 cold-chain express
                </div>
              </button>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo Code (e.g. HEALTH10)"
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs uppercase font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="text-emerald-700 text-[11px] flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" />
                Coupon code {appliedCoupon} applied successfully!
              </div>
            )}
            {couponError && (
              <div className="text-rose-600 text-[11px]">
                {couponError}
              </div>
            )}

            {/* Subtotal, Discount & Total */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
              <div className="flex justify-between text-slate-600">
                <span>Medicines Subtotal:</span>
                <span className="font-mono tabular-nums">৳{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount:</span>
                  <span className="font-mono tabular-nums">-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-emerald-800">
                  ৳{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
