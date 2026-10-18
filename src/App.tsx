import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MedicineCard } from './components/MedicineCard';
import { MedicineFilters } from './components/MedicineFilters';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanel } from './components/AdminPanel';
import { TrustFooter } from './components/TrustFooter';
import { MEDICINES_DATABASE, POPULAR_LOCATIONS, MEDICINE_CATEGORIES } from './data/medicinesData';
import { Medicine, CartItem, UnitType, PlacedOrder, PrescriptionOrder } from './types/pharmacy';
import { Pill, Sparkles, Filter, RotateCcw, AlertCircle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import rxSampleImg from './assets/images/prescription_desk_stethoscope_1792297165282.jpg';

export default function App() {
  // Site Configuration & Branding
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Mim Pharma',
    hotline: '0179970910',
    coverage: 'Whole Bangladesh (All 64 Districts)'
  });

  // Admin Authentication State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Dynamic Medicine Inventory state (editable via Admin Panel)
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES_DATABASE);

  // Navigation & Location state (default Whole Bangladesh)
  const [selectedLocation, setSelectedLocation] = useState<string>(POPULAR_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All Medicines');
  const [selectedForm, setSelectedForm] = useState<string>('All Forms');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All Manufacturers');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'rx' | 'otc'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount'>('relevance');

  // Modals & Drawers state
  const [selectedMedicineModal, setSelectedMedicineModal] = useState<Medicine | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isUploadRxOpen, setIsUploadRxOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);

  // Cart State (pre-populated with 2 popular items for immediate delightful UX)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      medicine: MEDICINES_DATABASE[1], // Napa Extra
      unit: 'strip',
      quantity: 2
    },
    {
      medicine: MEDICINES_DATABASE[4], // Sergel 20mg
      unit: 'strip',
      quantity: 1
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('HEALTH10');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('express');

  // Prescription Queue State (visible and manageable in Admin)
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>([
    {
      id: 'RX-948123',
      patientName: 'Ariful Islam',
      patientPhone: '0179970910',
      address: 'House 14, Road 3, Dhanmondi, Dhaka',
      area: 'Dhaka - Dhanmondi',
      notes: 'Need 1 month course of Sergel 20mg & Monas 10mg as written by Dr. Sarah.',
      prescriptionImage: rxSampleImg,
      isUrgent: true,
      createdAt: '10:30 AM',
      status: 'Pending Pharmacist Review'
    },
    {
      id: 'RX-774102',
      patientName: 'Nusrat Jahan',
      patientPhone: '01819-223344',
      address: 'Shaheb Bazar, Rajshahi',
      area: 'Rajshahi Division',
      notes: 'Please dispatch urgently for fever and allergic cough.',
      prescriptionImage: rxSampleImg,
      isUrgent: false,
      createdAt: '09:15 AM',
      status: 'Verified'
    }
  ]);

  // Order Management state
  const [recentOrders, setRecentOrders] = useState<PlacedOrder[]>([
    {
      id: 'EPH-842910',
      items: [
        {
          medicine: MEDICINES_DATABASE[0],
          unit: 'strip',
          quantity: 2
        }
      ],
      patientName: 'Tanvir Hossain',
      patientPhone: '0179970910',
      deliveryAddress: 'House 42, Road 9/A, Dhanmondi, Dhaka',
      area: 'Dhaka - Dhanmondi',
      deliveryMethod: 'express',
      paymentMethod: 'cod',
      subtotal: 120,
      discount: 12,
      deliveryFee: 99,
      total: 207,
      status: 'On The Way',
      createdAt: '11:15 AM',
      hasPrescriptionItems: false
    },
    {
      id: 'EPH-512093',
      items: [
        {
          medicine: MEDICINES_DATABASE[4],
          unit: 'strip',
          quantity: 2
        },
        {
          medicine: MEDICINES_DATABASE[9],
          unit: 'box',
          quantity: 1
        }
      ],
      patientName: 'Sadia Rahman',
      patientPhone: '01911-556677',
      deliveryAddress: 'GEC Circle, Nasirabad, Chittagong',
      area: 'Chittagong Division',
      deliveryMethod: 'standard',
      paymentMethod: 'bkash',
      subtotal: 580,
      discount: 50,
      deliveryFee: 0,
      total: 530,
      status: 'Packing',
      createdAt: '08:45 AM',
      hasPrescriptionItems: false
    }
  ]);

  // Order placement notification toast
  const [orderToast, setOrderToast] = useState<{ id: string; name: string } | null>(null);

  // Sync document title with siteName
  useEffect(() => {
    document.title = `${siteSettings.siteName} - Nationwide Online Pharmacy & Medicines | Bangladesh`;
  }, [siteSettings.siteName]);

  // Dynamic category counts calculated from active medicines list
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Medicines': medicines.length };
    MEDICINE_CATEGORIES.forEach(cat => {
      if (cat !== 'All Medicines') {
        counts[cat] = medicines.filter(m => m.category === cat).length;
      }
    });
    return counts;
  }, [medicines]);

  // Filtered and Sorted Medicines Catalog
  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      // Search matching brand, generic, or manufacturer
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesBrand = medicine.brandName.toLowerCase().includes(query);
        const matchesGeneric = medicine.generic.toLowerCase().includes(query);
        const matchesMfg = medicine.manufacturer.toLowerCase().includes(query);
        if (!matchesBrand && !matchesGeneric && !matchesMfg) return false;
      }

      // Category matching
      if (selectedCategory !== 'All Medicines' && medicine.category !== selectedCategory) {
        return false;
      }

      // Form matching
      if (selectedForm !== 'All Forms' && medicine.dosageForm !== selectedForm) {
        return false;
      }

      // Manufacturer matching
      if (selectedManufacturer !== 'All Manufacturers' && medicine.manufacturer !== selectedManufacturer) {
        return false;
      }

      // Prescription type matching
      if (prescriptionFilter === 'rx' && !medicine.isPrescriptionRequired) return false;
      if (prescriptionFilter === 'otc' && medicine.isPrescriptionRequired) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.pricePerPiece - b.pricePerPiece;
      }
      if (sortBy === 'price-desc') {
        return b.pricePerPiece - a.pricePerPiece;
      }
      if (sortBy === 'discount') {
        return b.discountPercent - a.discountPercent;
      }
      return b.rating - a.rating; // default: relevance/popularity
    });
  }, [medicines, searchQuery, selectedCategory, selectedForm, selectedManufacturer, prescriptionFilter, sortBy]);

  // Admin authentication handler
  const handleAdminLogin = (email: string, pass: string): boolean => {
    if (email === 'bharin10mim@gmail.com' && pass === '1234') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Admin CRUD for Medicines
  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines(prev => [newMed, ...prev]);
  };

  const handleUpdateMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
    if (selectedMedicineModal?.id === updatedMed.id) {
      setSelectedMedicineModal(updatedMed);
    }
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    setCartItems(prev => prev.filter(item => item.medicine.id !== id));
  };

  // Admin status update handlers
  const handleUpdateOrderStatus = (orderId: string, status: PlacedOrder['status']) => {
    setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdatePrescriptionStatus = (id: string, status: PrescriptionOrder['status']) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // Cart operations
  const handleAddToCart = (medicine: Medicine, unit: UnitType, quantity: number) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.medicine.id === medicine.id && item.unit === unit);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { medicine, unit, quantity }];
    });
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleUpdateCartUnit = (index: number, unit: UnitType) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].unit = unit;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyCoupon = (code: string): boolean => {
    if (code === 'HEALTH10' || code === 'EPHARMA50' || code === 'MIM10') {
      setAppliedCoupon(code);
      return true;
    }
    return false;
  };

  // Pricing calculations for checkout
  const cartSubtotal = cartItems.reduce((acc, item) => {
    let multiplier = 1;
    if (item.unit === 'strip') multiplier = item.medicine.stripSize;
    if (item.unit === 'box') multiplier = item.medicine.boxSize;
    const discountedPrice = item.medicine.pricePerPiece * (1 - item.medicine.discountPercent / 100);
    return acc + discountedPrice * multiplier * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon === 'HEALTH10' || appliedCoupon === 'MIM10') {
    discountAmount = cartSubtotal * 0.10;
  } else if (appliedCoupon === 'EPHARMA50') {
    discountAmount = Math.min(50, cartSubtotal);
  }

  const deliveryFee = deliveryMethod === 'express' ? 99 : (cartSubtotal >= 999 ? 0 : 50);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleOrderPlaced = (order: PlacedOrder) => {
    setRecentOrders(prev => [order, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setOrderToast({ id: order.id, name: order.patientName });
    setTimeout(() => {
      setOrderToast(null);
    }, 6000);
  };

  const handlePrescriptionSubmitted = (prescOrder: PrescriptionOrder) => {
    setPrescriptions(prev => [prescOrder, ...prev]);
    const trackingOrder: PlacedOrder = {
      id: prescOrder.id,
      items: [],
      patientName: prescOrder.patientName,
      patientPhone: prescOrder.patientPhone,
      deliveryAddress: prescOrder.address,
      area: prescOrder.area,
      deliveryMethod: prescOrder.isUrgent ? 'express' : 'standard',
      paymentMethod: 'cod',
      subtotal: 0,
      discount: 0,
      deliveryFee: prescOrder.isUrgent ? 99 : 50,
      total: 0,
      status: 'Pharmacist Reviewing',
      createdAt: prescOrder.createdAt,
      hasPrescriptionItems: true
    };
    setRecentOrders(prev => [trackingOrder, ...prev]);
    setOrderToast({ id: prescOrder.id, name: prescOrder.patientName });
    setTimeout(() => {
      setOrderToast(null);
    }, 6000);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Medicines');
    setSelectedForm('All Forms');
    setSelectedManufacturer('All Manufacturers');
    setPrescriptionFilter('all');
    setSortBy('relevance');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        siteName={siteSettings.siteName}
        hotline={siteSettings.hotline}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenUploadPrescription={() => setIsUploadRxOpen(true)}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onSelectMedicine={(med) => setSelectedMedicineModal(med)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        availableMedicines={medicines}
      />

      {/* Floating Success Toast when an order is placed */}
      {orderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white p-4 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">Order Received! Tracking ID: {orderToast.id}</div>
            <div className="text-[11px] text-emerald-200">Our pharmacist is preparing your medicine delivery for {orderToast.name}.</div>
          </div>
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="ml-2 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs font-semibold cursor-pointer"
          >
            Track
          </button>
        </div>
      )}

      {/* Hero Section & Quick Action Showcase */}
      <HeroBanner
        siteName={siteSettings.siteName}
        hotline={siteSettings.hotline}
        onOpenUploadPrescription={() => setIsUploadRxOpen(true)}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('medicines-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Medicines Catalog Layout */}
      <main id="medicines-catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Catalog Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory}
              </h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-slate-200/80 text-slate-700 rounded-full tabular-nums">
                {filteredMedicines.length} Medicines Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Genuine pharmaceuticals delivering to <strong className="text-slate-700">{selectedLocation}</strong> with hotline support <strong className="font-mono text-emerald-700">{siteSettings.hotline}</strong>.
            </p>
          </div>

          {/* Quick Active Filters or Sort shortcut */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="relevance">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* 2-Column Responsive Split: Filters Left, Medicine Grid Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Sidebar: Filters */}
          <div className="lg:col-span-1 sticky top-24">
            <MedicineFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedForm={selectedForm}
              onSelectForm={setSelectedForm}
              selectedManufacturer={selectedManufacturer}
              onSelectManufacturer={setSelectedManufacturer}
              prescriptionFilter={prescriptionFilter}
              onPrescriptionFilterChange={setPrescriptionFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              categoryCounts={categoryCounts}
              totalResults={filteredMedicines.length}
            />
          </div>

          {/* Right Area: Medicine Product Cards Grid */}
          <div className="lg:col-span-3">
            {filteredMedicines.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Pill className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No medicines found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing your search query or reset filters to see all medicines available for delivery across Bangladesh.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={handleAddToCart}
                    onSelectMedicine={(med) => setSelectedMedicineModal(med)}
                    onViewSubstitutes={(med) => setSelectedMedicineModal(med)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Trust & Regulatory Footer */}
      <TrustFooter 
        siteName={siteSettings.siteName}
        hotline={siteSettings.hotline}
      />

      {/* Modals & Slide-out Panels */}
      
      {/* 1. Admin Panel Modal (Login with bharin10mim@gmail.com / 1234) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        medicines={medicines}
        onAddMedicine={handleAddMedicine}
        onUpdateMedicine={handleUpdateMedicine}
        onDeleteMedicine={handleDeleteMedicine}
        orders={recentOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        prescriptions={prescriptions}
        onUpdatePrescriptionStatus={handleUpdatePrescriptionStatus}
        siteSettings={siteSettings}
        onUpdateSettings={setSiteSettings}
      />

      {/* 2. Medicine PDP Detail Modal with Substitutes Comparison */}
      <MedicineDetailModal
        medicine={selectedMedicineModal}
        onClose={() => setSelectedMedicineModal(null)}
        onAddToCart={handleAddToCart}
        onSelectSubstitute={(sub) => setSelectedMedicineModal(sub)}
      />

      {/* 3. Upload Prescription Modal */}
      <PrescriptionUploadModal
        isOpen={isUploadRxOpen}
        onClose={() => setIsUploadRxOpen(false)}
        onSubmitPrescription={handlePrescriptionSubmitted}
      />

      {/* 4. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateUnit={handleUpdateCartUnit}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        deliveryMethod={deliveryMethod}
        onChangeDeliveryMethod={setDeliveryMethod}
      />

      {/* 5. Complete Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        discount={discountAmount}
        deliveryFee={deliveryFee}
        total={grandTotal}
        deliveryMethod={deliveryMethod}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 6. Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        recentOrders={recentOrders}
        hotline={siteSettings.hotline}
      />

    </div>
  );
}
