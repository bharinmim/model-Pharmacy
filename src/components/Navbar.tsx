import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  FileText, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  UserCheck
} from 'lucide-react';
import { POPULAR_LOCATIONS, MEDICINES_DATABASE } from '../data/medicinesData';
import { Medicine, CartItem } from '../types/pharmacy';

interface NavbarProps {
  siteName: string;
  hotline: string;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenUploadPrescription: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onSelectMedicine: (medicine: Medicine) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateHome: () => void;
  availableMedicines?: Medicine[];
}

export const Navbar: React.FC<NavbarProps> = ({
  siteName,
  hotline,
  selectedLocation,
  onSelectLocation,
  cartItems,
  onOpenCart,
  onOpenUploadPrescription,
  onOpenOrderTracking,
  onOpenAdmin,
  isAdminLoggedIn,
  onSelectMedicine,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  availableMedicines = MEDICINES_DATABASE
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Total cart item count
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => {
    let unitMultiplier = 1;
    if (item.unit === 'strip') unitMultiplier = item.medicine.stripSize;
    if (item.unit === 'box') unitMultiplier = item.medicine.boxSize;
    const discountedPrice = item.medicine.pricePerPiece * (1 - item.medicine.discountPercent / 100);
    return acc + discountedPrice * unitMultiplier * item.quantity;
  }, 0);

  // Filtered autocomplete search results from current active catalog
  const searchSuggestions = searchQuery.trim().length >= 1
    ? availableMedicines.filter(m => 
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: <strong className="text-white font-mono tabular-nums">{hotline}</strong> (24/7)</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Delivery: <strong className="text-emerald-300">Whole Bangladesh (64 Districts)</strong></span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DGDA Certified · 100% Genuine Medicines</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 relative">
            <button 
              onClick={() => onOpenOrderTracking()}
              className="hover:text-emerald-300 transition-colors cursor-pointer text-xs"
            >
              Track Order
            </button>
            <span className="text-slate-700" aria-hidden="true">|</span>

            {/* Admin Portal Entry */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold ${
                isAdminLoggedIn ? 'text-amber-300 hover:text-amber-200' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isAdminLoggedIn ? <UserCheck className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Login'}</span>
            </button>
            <span className="text-slate-700" aria-hidden="true">|</span>

            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[130px] sm:max-w-[190px]">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Delivery Zone
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          onSelectLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                          selectedLocation === loc ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate pr-2">{loc}</span>
                        {selectedLocation === loc && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar - Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Zone 1: Single Brand Element */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm font-extrabold text-lg tracking-tight group-hover:bg-emerald-800 transition-colors">
              <span className="font-mono">MP</span>
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {siteName}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold tracking-wide">
                NATIONWIDE BANGLADESH PHARMACY
              </div>
            </div>
          </button>
        </div>

        {/* Live Search Bar with Instant Autocomplete */}
        <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search by Brand (e.g. Napa, Sergel), Generic, or Manufacturer..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-900 rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
                <span>Matching Medicines</span>
                <span className="text-[11px] text-emerald-700">{searchSuggestions.length} items</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchSuggestions.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => {
                      onSelectMedicine(med);
                      setIsSearchFocused(false);
                      onSearchChange('');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-emerald-50/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700">
                          {med.brandName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {med.strength}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {med.dosageForm}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{med.generic}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{med.manufacturer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono tabular-nums text-sm font-semibold text-emerald-700">
                        ৳{(med.pricePerPiece * (1 - med.discountPercent / 100)).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        per piece
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Actions (Upload Prescription & Cart Drawer) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenUploadPrescription}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Upload Prescription</span>
            <span className="sm:hidden">Upload Rx</span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline">Cart</span>
              <span className="font-mono tabular-nums font-bold">
                ৳{cartSubtotal.toFixed(0)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below header */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Napa, Sergel, Generic..."
            className="w-full pl-9 pr-9 py-2 bg-slate-100 text-sm text-slate-900 rounded-lg border border-slate-200 focus:border-emerald-600 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
