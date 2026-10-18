import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  Phone, 
  MapPin, 
  Award, 
  Pill,
  Heart
} from 'lucide-react';

interface TrustFooterProps {
  siteName: string;
  hotline: string;
}

export const TrustFooter: React.FC<TrustFooterProps> = ({
  siteName,
  hotline
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      
      {/* 4 Pillars */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">100% Genuine Medicine</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Sourced directly from Square, Beximco, Incepta, Renata, and certified manufacturers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Whole Bangladesh Delivery</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Nationwide express medicine courier covering all 64 districts and remote upazilas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Pharmacist Verification</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Every prescription order is audited by registered 'A' grade pharmacists before packing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">24/7 Hotline Support</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Dial <strong className="text-emerald-400 font-mono">{hotline}</strong> anytime for urgent orders and dosage guidance.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            Medicine Categories
          </h5>
          <ul className="space-y-2">
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Acid Peptic & Gastric</a></li>
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Pain & Fever Relievers</a></li>
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Antibiotics & Antivirals</a></li>
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Allergy & Respiratory</a></li>
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Diabetes & Chronic Care</a></li>
            <li><a href="#medicines-catalog" className="hover:text-emerald-400 transition-colors">Vitamins & Supplements</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            Popular Manufacturers
          </h5>
          <ul className="space-y-2">
            <li><span className="hover:text-emerald-400 cursor-pointer">Square Pharmaceuticals PLC</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Beximco Pharmaceuticals Ltd</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Incepta Pharmaceuticals Ltd</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Renata Limited</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Healthcare Pharmaceuticals</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">The ACME Laboratories Ltd</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            {siteName} Services
          </h5>
          <ul className="space-y-2">
            <li><span className="hover:text-emerald-400 cursor-pointer">Upload Prescription</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Track Medicine Order</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Generic Drug Substitutes</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Whole Bangladesh Dispatch</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Cold-Chain Storage Logistics</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            Regulatory & Contact
          </h5>
          <p className="text-slate-400 leading-relaxed mb-3">
            Licensed by Directorate General of Drug Administration (DGDA), Ministry of Health & Family Welfare, People's Republic of Bangladesh.
          </p>
          <div className="space-y-1 text-slate-300">
            <div>Hotline: <strong className="text-white font-mono">{hotline}</strong></div>
            <div>Email: <strong className="text-white">bharin10mim@gmail.com</strong></div>
            <div>Coverage: Whole Bangladesh (All 64 Districts)</div>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-slate-800 py-6 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-slate-500 text-xs">
          © {new Date().getFullYear()} {siteName} Bangladesh. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="text-slate-500">Supported Payments:</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-slate-200">Cash on Delivery</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-pink-400">bKash</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-amber-400">Nagad</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-blue-400">Visa / Mastercard</span>
        </div>
      </div>

    </footer>
  );
};
