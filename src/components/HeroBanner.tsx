import React from 'react';
import { 
  FileUp, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  Sparkles, 
  PhoneCall, 
  ChevronRight,
  Pill,
  MapPin
} from 'lucide-react';
import heroImg from '../assets/images/pharmacy_hero_medicines_1792297164466.jpg';
import rxImg from '../assets/images/prescription_desk_stethoscope_1792297165282.jpg';
import deliveryImg from '../assets/images/express_pharmacy_delivery_1792297164949.jpg';

interface HeroBannerProps {
  siteName: string;
  hotline: string;
  onOpenUploadPrescription: () => void;
  onFilterCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  siteName,
  hotline,
  onOpenUploadPrescription,
  onFilterCategory
}) => {
  return (
    <section className="bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white pt-6 pb-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid: Hero Showcase + Quick Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Licensed Digital Pharmacy of Bangladesh</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
                Genuine Medicines Delivered Across Whole Bangladesh
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed [text-wrap:balance]">
                Direct supply from certified manufacturers like Square, Beximco, Incepta, and Renata. 
                Fast nationwide courier to all 64 districts with registered pharmacist audit.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenUploadPrescription}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Upload Prescription</span>
                </button>
                <a
                  href="#medicines-catalog"
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Browse Medicines</span>
                </a>
              </div>
            </div>

            {/* Background Medical Illustration / Photography */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:w-72 lg:h-full lg:opacity-90 pointer-events-none flex justify-end items-end">
              <img
                src={heroImg}
                alt="Genuine pharmaceutical medicines and laboratory testing"
                className="rounded-xl lg:rounded-none object-cover h-48 lg:h-full w-full lg:w-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick feature indicators */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                100% Genuine Direct Supply
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Whole Bangladesh Delivery
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Hotline: <strong className="font-mono text-slate-900">{hotline}</strong>
              </span>
            </div>
          </div>

          {/* Right Column (4 cols): Upload Prescription Card + Express Delivery Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Quick Rx Upload Card */}
            <div 
              onClick={onOpenUploadPrescription}
              className="bg-emerald-800 text-white p-5 rounded-2xl shadow-sm hover:bg-emerald-900 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200">
                    <FileUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                    Nationwide Service
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Order with Prescription
                </h3>
                <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">
                  Snap a photo of your prescription. Our licensed pharmacist will review, call your phone, and dispatch across Bangladesh.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs font-semibold text-emerald-200 group-hover:text-white">
                <span>Upload Now & Confirm</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Express Delivery Highlight Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                <img 
                  src={deliveryImg} 
                  alt="Express temperature-controlled pharmaceutical delivery" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nationwide Express Dispatch</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Deliveries to Dhaka, Chittagong, Sylhet, Rajshahi, Khulna and all 64 districts. Call <strong className="font-mono text-emerald-700">{hotline}</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Popular Category Quick Filter Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0 pr-1">
            Quick Browse:
          </span>
          {[
            { label: 'Acid Peptic & Gastric', id: 'Acid Peptic & Gastric' },
            { label: 'Pain & Fever', id: 'Pain, Fever & Migraine' },
            { label: 'Allergy & Cough', id: 'Allergy, Cough & Asthma' },
            { label: 'Antibiotics', id: 'Antibiotics & Anti-Infectives' },
            { label: 'Diabetes Care', id: 'Diabetes Care' },
            { label: 'Blood Pressure', id: 'Cardiovascular & Blood Pressure' },
            { label: 'Vitamins & Minerals', id: 'Vitamins & Minerals' },
            { label: 'Skin Care', id: 'Dermatology & Skin' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterCategory(cat.id)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
