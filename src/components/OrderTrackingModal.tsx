import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Phone, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PlacedOrder } from '../types/pharmacy';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: PlacedOrder[];
  hotline?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  hotline = '0179970910'
}) => {
  if (!isOpen) return null;

  const [searchOrderId, setSearchOrderId] = useState(recentOrders[0]?.id || 'EPH-842910');
  const [activeOrder, setActiveOrder] = useState<PlacedOrder | null>(recentOrders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = recentOrders.find(o => o.id.toLowerCase() === searchOrderId.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
    } else {
      // Mock an active realistic state for the searched order ID
      setActiveOrder({
        id: searchOrderId.trim().toUpperCase(),
        items: [],
        patientName: 'Verified Patient',
        patientPhone: '01712-XXXXXX',
        deliveryAddress: 'Dhanmondi, Dhaka',
        area: 'Dhaka - Dhanmondi',
        deliveryMethod: 'express',
        paymentMethod: 'cod',
        subtotal: 420,
        discount: 30,
        deliveryFee: 50,
        total: 440,
        status: 'On The Way',
        createdAt: '10:45 AM',
        hasPrescriptionItems: false
      });
    }
  };

  const steps = [
    { title: 'Order Received', desc: 'Placed and logged in ePharma queue', done: true },
    { title: 'Pharmacist Audit', desc: 'Prescription & dosage checked by Grade-A Pharmacist', done: true },
    { title: 'Cold-Chain Packing', desc: 'Medicine sealed in temperature-controlled bag', done: activeOrder?.status === 'On The Way' || activeOrder?.status === 'Delivered' },
    { title: 'Dispatched to Rider', desc: 'Express courier on the way to your doorstep', done: activeOrder?.status === 'On The Way' || activeOrder?.status === 'Delivered' },
    { title: 'Delivered', desc: 'Received and verified by customer', done: activeOrder?.status === 'Delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-base">
              Track Your Medicine Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Search Order Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. EPH-123456 or RX-123456)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Active Order Details */}
          {activeOrder && (
            <div className="space-y-5">
              
              {/* Order Meta Header */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[11px]">Order Reference</div>
                  <div className="text-base font-extrabold font-mono text-emerald-900">
                    {activeOrder.id}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {activeOrder.patientName} · {activeOrder.area}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-emerald-700 text-white font-bold rounded-full text-[11px]">
                    {activeOrder.status}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Placed at {activeOrder.createdAt}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="border-l-2 border-emerald-600 ml-4 pl-4 space-y-4 py-1">
                {steps.map((st, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[25px] top-0.5 w-4 h-4 rounded-full border-2 ${
                      st.done ? 'bg-emerald-600 border-white text-white' : 'bg-slate-200 border-white'
                    } flex items-center justify-center`}>
                      {st.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${st.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rider / Pharmacist Direct Hotline */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold text-slate-800 block">Need urgent updates?</span>
                    <span className="text-[11px] text-slate-500">Call Dispatch Hotline: {hotline}</span>
                  </div>
                </div>
                <a
                  href={`tel:${hotline}`}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
                >
                  Call Now
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
