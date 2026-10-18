import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Upload, 
  AlertCircle
} from 'lucide-react';
import { CartItem, PlacedOrder } from '../types/pharmacy';
import { POPULAR_LOCATIONS } from '../data/medicinesData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'standard' | 'express';
  onOrderPlaced: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discount,
  deliveryFee,
  total,
  deliveryMethod,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('01712-345678');
  const [area, setArea] = useState(POPULAR_LOCATIONS[0]);
  const [address, setAddress] = useState('House 18, Road 4, Dhanmondi R/A, Dhaka-1205');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [rxFileAttached, setRxFileAttached] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasRxMedicines = cartItems.some(i => i.medicine.isPrescriptionRequired);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please provide a contact phone number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `EPH-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: PlacedOrder = {
        id: orderId,
        items: [...cartItems],
        patientName: name,
        patientPhone: phone,
        deliveryAddress: address,
        area: area,
        deliveryMethod: deliveryMethod,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        discount: discount,
        deliveryFee: deliveryFee,
        total: total,
        status: hasRxMedicines ? 'Pharmacist Reviewing' : 'Confirmed',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasPrescriptionItems: hasRxMedicines
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                Secure Medicine Checkout
              </h3>
              <p className="text-xs text-emerald-200/90">
                100% Genuine Direct Supply · Pharmacist Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmOrder} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          
          {/* Prescription Alert if Rx required */}
          {hasRxMedicines && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">
                  Prescription Verification Required (DGDA Rule)
                </span>
                <span className="text-amber-800/90 text-[11px] block mt-0.5">
                  Your cart contains prescription drugs. Our pharmacist will review your order. 
                  You can upload a photo now or show the original prescription to the rider upon delivery.
                </span>
                <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-300 rounded text-amber-900 font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>{rxFileAttached ? 'Prescription Attached ✓' : 'Upload Prescription (Optional now)'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={() => setRxFileAttached(true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Recipient / Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shakib Al Hasan"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Phone Number (For Rider & Pharmacist Call) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Area & Full Street Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Delivery Area / City *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Street Address / House / Flat *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Sector/Area"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-slate-800 font-bold mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-slate-900">Cash on Delivery</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay cash or bKash when rider arrives at your doorstep
                </p>
              </div>

              {/* bKash */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-pink-600" />
                  <span className="font-bold text-slate-900">bKash Online</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant mobile payment via bKash gateway
                </p>
              </div>

              {/* Nagad / Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900">Card / Nagad</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Visa, Mastercard or Nagad payment
                </p>
              </div>

            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 mb-1">
              Order Summary ({cartItems.length} items)
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-mono tabular-nums">৳{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono tabular-nums">-৳{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Method ({deliveryMethod === 'express' ? '2-Hour Dhaka Express' : 'Standard 24h'}):</span>
              <span className="font-mono tabular-nums">
                {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="font-mono tabular-nums text-emerald-800">
                ৳{total.toFixed(2)}
              </span>
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Submit Order CTA */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (৳{total.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
