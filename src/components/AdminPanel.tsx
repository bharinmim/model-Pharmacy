import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  ChevronRight,
  TrendingUp,
  X,
  ShieldCheck,
  Eye,
  Store
} from 'lucide-react';
import { Medicine, PlacedOrder, PrescriptionOrder, DosageForm, TherapeuticCategory } from '../types/pharmacy';
import { MEDICINE_CATEGORIES, DOSAGE_FORMS, MANUFACTURERS } from '../data/medicinesData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
  medicines: Medicine[];
  onAddMedicine: (medicine: Medicine) => void;
  onUpdateMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, status: PlacedOrder['status']) => void;
  prescriptions: PrescriptionOrder[];
  onUpdatePrescriptionStatus: (id: string, status: PrescriptionOrder['status']) => void;
  siteSettings: {
    siteName: string;
    hotline: string;
    coverage: string;
  };
  onUpdateSettings: (settings: { siteName: string; hotline: string; coverage: string }) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  medicines,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  orders,
  onUpdateOrderStatus,
  prescriptions,
  onUpdatePrescriptionStatus,
  siteSettings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  // Login form state
  const [emailInput, setEmailInput] = useState('bharin10mim@gmail.com');
  const [passwordInput, setPasswordInput] = useState('1234');
  const [loginError, setLoginError] = useState('');

  // Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'prescriptions' | 'inventory' | 'settings'>('overview');

  // Search & Filter in Admin
  const [inventorySearch, setInventorySearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Editing Medicine Modal State
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for Add/Edit Medicine
  const [formData, setFormData] = useState<Partial<Medicine>>({
    brandName: '',
    strength: '',
    dosageForm: 'Tablet',
    generic: '',
    manufacturer: 'Square Pharmaceuticals PLC',
    category: 'Pain, Fever & Migraine',
    pricePerPiece: 2.0,
    stripSize: 10,
    boxSize: 100,
    discountPercent: 8,
    isPrescriptionRequired: false,
    inStock: true,
    stockCount: 500,
    description: '',
    indications: ['Relief of pain and fever'],
    dosage: '1 tablet 3 times daily after meals.',
    sideEffects: ['Mild gastrointestinal upset'],
    contraindications: 'Hypersensitivity to components',
    pregnancySafety: 'Safe under medical supervision',
    storage: 'Store below 30°C in a dry place',
    substituteIds: []
  });

  // Settings form
  const [tempSiteName, setTempSiteName] = useState(siteSettings.siteName);
  const [tempHotline, setTempHotline] = useState(siteSettings.hotline);
  const [tempCoverage, setTempCoverage] = useState(siteSettings.coverage);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(emailInput.trim(), passwordInput.trim());
    if (!success) {
      setLoginError('Invalid credentials. Required: bharin10mim@gmail.com / 1234');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      siteName: tempSiteName,
      hotline: tempHotline,
      coverage: tempCoverage
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({ ...med });
    setIsAddingNew(false);
  };

  const openAddModal = () => {
    setEditingMedicine(null);
    setFormData({
      id: `med-${Date.now()}`,
      brandName: '',
      strength: '500 mg',
      dosageForm: 'Tablet',
      generic: '',
      manufacturer: 'Square Pharmaceuticals PLC',
      category: 'Pain, Fever & Migraine',
      pricePerPiece: 2.50,
      stripSize: 10,
      boxSize: 100,
      discountPercent: 8,
      isPrescriptionRequired: false,
      inStock: true,
      stockCount: 500,
      rating: 4.8,
      reviewsCount: 12,
      description: 'Manufactured according to GMP standards in Bangladesh.',
      indications: ['Symptomatic treatment according to physician advice'],
      dosage: 'Take as directed by doctor',
      sideEffects: ['Standard clinical profile'],
      contraindications: 'Known allergy',
      pregnancySafety: 'Consult physician',
      storage: 'Store below 30°C',
      substituteIds: []
    });
    setIsAddingNew(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.generic) {
      alert('Brand Name and Generic are required');
      return;
    }

    if (isAddingNew) {
      const newMed: Medicine = {
        id: `med-${Date.now()}`,
        brandName: formData.brandName || '',
        strength: formData.strength || '500mg',
        dosageForm: (formData.dosageForm as DosageForm) || 'Tablet',
        generic: formData.generic || '',
        manufacturer: formData.manufacturer || 'Square Pharmaceuticals PLC',
        category: (formData.category as TherapeuticCategory) || 'Pain, Fever & Migraine',
        pricePerPiece: Number(formData.pricePerPiece) || 1.0,
        stripSize: Number(formData.stripSize) || 10,
        boxSize: Number(formData.boxSize) || 100,
        discountPercent: Number(formData.discountPercent) || 0,
        isPrescriptionRequired: Boolean(formData.isPrescriptionRequired),
        inStock: Boolean(formData.inStock),
        stockCount: Number(formData.stockCount) || 100,
        rating: 4.8,
        reviewsCount: 1,
        description: formData.description || 'Quality medicine available across Bangladesh.',
        indications: formData.indications || ['Pain', 'Fever'],
        dosage: formData.dosage || 'As directed by physician',
        sideEffects: formData.sideEffects || ['Mild upset'],
        contraindications: formData.contraindications || 'Hypersensitivity',
        pregnancySafety: formData.pregnancySafety || 'Doctor consultation required',
        storage: formData.storage || 'Store in cool dry place',
        substituteIds: formData.substituteIds || []
      };
      onAddMedicine(newMed);
    } else if (editingMedicine) {
      const updatedMed: Medicine = {
        ...editingMedicine,
        ...formData
      } as Medicine;
      onUpdateMedicine(updatedMed);
    }

    setEditingMedicine(null);
    setIsAddingNew(false);
  };

  // Calculations for dashboard
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pharmacist Reviewing' || o.status === 'Confirmed');
  const lowStockMedicines = medicines.filter(m => m.stockCount < 400);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/75 backdrop-blur-xs flex justify-center items-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* If NOT logged in: Render Login View */}
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-md">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Admin Portal Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage medicines, customer orders, prescriptions & settings
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="bharin10mim@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Sign In to Admin Console</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
                  Default credentials configured: <span className="font-mono text-slate-600">bharin10mim@gmail.com</span> / <span className="font-mono text-slate-600">1234</span>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Admin Dashboard View */
          <>
            {/* Top Bar */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
                  AP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {siteSettings.siteName} — Admin Dashboard
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Admin
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>Logged in: <strong className="text-slate-300">bharin10mim@gmail.com</strong></span>
                    <span>·</span>
                    <span>Hotline: <strong className="text-emerald-400">{siteSettings.hotline}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Storefront</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-800 px-6 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Metrics</span>
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Medicines Inventory ({medicines.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'prescriptions'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Prescription Queue ({prescriptions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Settings & Hotline</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Total Revenue</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        ৳{totalSales.toFixed(2)}
                      </div>
                      <div className="text-emerald-700 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>All Bangladesh Operations</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Active Orders</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        {orders.length}
                      </div>
                      <div className="text-amber-700 text-[11px] font-semibold mt-1">
                        {pendingOrders.length} pending review / dispatch
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Prescriptions Uploaded</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        {prescriptions.length}
                      </div>
                      <div className="text-blue-700 text-[11px] font-semibold mt-1">
                        Awaiting Pharmacist review
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Medicines in Stock</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        {medicines.length}
                      </div>
                      <div className="text-slate-500 text-[11px] font-semibold mt-1">
                        Square, Beximco, Incepta & more
                      </div>
                    </div>
                  </div>

                  {/* Operational Alerts & Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders List */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Recent Orders from Nationwide Customers
                        </h4>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-emerald-700 font-semibold text-xs hover:underline cursor-pointer"
                        >
                          View All
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {orders.slice(0, 4).map((order) => (
                          <div key={order.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900 font-mono">{order.id}</div>
                              <div className="text-slate-500 text-[11px]">
                                {order.patientName} · {order.area} ({order.patientPhone})
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold font-mono text-slate-900">৳{order.total.toFixed(2)}</div>
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low Stock Warning */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            Inventory Threshold Alerts
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {lowStockMedicines.length} items
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {lowStockMedicines.slice(0, 4).map((med) => (
                          <div key={med.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{med.brandName} {med.strength}</div>
                              <div className="text-slate-500 text-[11px]">{med.manufacturer} · {med.dosageForm}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-amber-700">{med.stockCount} units</span>
                              <div className="text-[10px] text-slate-400">Reorder recommended</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY & CATALOG MANAGEMENT */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Search medicines by name, generic, or manufacturer..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <button
                      onClick={openAddModal}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Medicine</span>
                    </button>
                  </div>

                  {/* Medicines Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-4 py-3">Medicine Brand</th>
                            <th className="px-4 py-3">Generic & Strength</th>
                            <th className="px-4 py-3">Manufacturer</th>
                            <th className="px-4 py-3">Price / Piece</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Rx Type</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {medicines
                            .filter(m => 
                              m.brandName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                              m.generic.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                              m.manufacturer.toLowerCase().includes(inventorySearch.toLowerCase())
                            )
                            .map((med) => (
                              <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900">
                                  {med.brandName}
                                  <span className="block text-[11px] text-slate-400 font-normal">
                                    {med.dosageForm}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-800">{med.generic}</div>
                                  <div className="font-mono text-slate-500 text-[11px]">{med.strength}</div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {med.manufacturer}
                                </td>
                                <td className="px-4 py-3 font-mono font-bold text-slate-900 tabular-nums">
                                  ৳{med.pricePerPiece.toFixed(2)}
                                  {med.discountPercent > 0 && (
                                    <span className="text-[10px] text-emerald-700 block">
                                      {med.discountPercent}% OFF
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    med.stockCount < 400 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {med.stockCount} pcs
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {med.isPrescriptionRequired ? (
                                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                      Rx Required
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                      OTC
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => openEditModal(med)}
                                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                                      title="Edit Medicine"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete ${med.brandName}?`)) {
                                          onDeleteMedicine(med.id);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                      title="Delete Medicine"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="relative max-w-sm flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by Order ID, Phone or Name..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      Showing {orders.length} total orders across Bangladesh
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders
                      .filter(o => 
                        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.patientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.patientPhone.includes(orderSearch)
                      )
                      .map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-base font-mono text-slate-900">
                                  {order.id}
                                </span>
                                {order.hasPrescriptionItems && (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    Rx Attached
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  Placed at {order.createdAt}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                Patient: <strong>{order.patientName}</strong> · Phone: <strong className="font-mono text-emerald-800">{order.patientPhone}</strong>
                              </div>
                              <div className="text-xs text-slate-500">
                                Delivery Address: {order.deliveryAddress} ({order.area})
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                              <div className="text-right">
                                <div className="text-base font-extrabold font-mono text-slate-900">
                                  ৳{order.total.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-400 uppercase">
                                  {order.paymentMethod}
                                </div>
                              </div>

                              {/* Status Controller */}
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[11px] text-slate-400">Status:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                                  className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-600"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Pharmacist Reviewing">Pharmacist Reviewing</option>
                                  <option value="Packing">Packing Cold-Chain</option>
                                  <option value="On The Way">On The Way</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Ordered items list */}
                          {order.items.length > 0 && (
                            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex flex-wrap gap-x-4 gap-y-1">
                              {order.items.map((it, idx) => (
                                <span key={idx}>
                                  <strong>{it.quantity}x</strong> {it.medicine.brandName} {it.medicine.strength} ({it.unit})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PRESCRIPTION QUEUE */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <strong>Licensed Pharmacist Prescription Inspection Queue:</strong> Verify doctor's stamp, registration, drug names, strength, and patient dosage instructions before verifying the order.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((presc) => (
                      <div key={presc.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {presc.id}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {presc.status}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <div>Patient: <strong>{presc.patientName}</strong></div>
                          <div>Phone: <strong className="font-mono text-emerald-800">{presc.patientPhone}</strong></div>
                          <div>Location: {presc.area}</div>
                          <div>Address: {presc.address}</div>
                          {presc.notes && (
                            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-600">
                              Note: "{presc.notes}"
                            </div>
                          )}
                        </div>

                        {/* Prescription image snapshot preview */}
                        {presc.prescriptionImage && (
                          <div className="rounded-lg overflow-hidden border border-slate-200 h-36 bg-slate-100 flex items-center justify-center">
                            <img
                              src={presc.prescriptionImage}
                              alt="Doctor prescription"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <a
                            href={`tel:${presc.patientPhone}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs"
                          >
                            Call Patient
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdatePrescriptionStatus(presc.id, 'Verified')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                            >
                              Approve & Dispatch
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SITE SETTINGS & HOTLINE */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Platform Brand & Contact Settings
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Updates the storefront brand title, customer hotline, and delivery region across Bangladesh in real time.
                    </p>
                  </div>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Settings saved! The website name, hotline, and coverage are now live.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Website Brand Name
                      </label>
                      <input
                        type="text"
                        value={tempSiteName}
                        onChange={(e) => setTempSiteName(e.target.value)}
                        placeholder="e.g. Mim Pharma"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Displays in navbar, browser tabs, invoices, and footer.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Customer Hotline Number
                      </label>
                      <input
                        type="text"
                        value={tempHotline}
                        onChange={(e) => setTempHotline(e.target.value)}
                        placeholder="0179970910"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Hotline for direct customer assistance and emergency 24/7 delivery.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Coverage Area
                      </label>
                      <input
                        type="text"
                        value={tempCoverage}
                        onChange={(e) => setTempCoverage(e.target.value)}
                        placeholder="Whole Bangladesh (All 64 Districts)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Delivery coverage area displayed to customers.
                      </span>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* Add / Edit Medicine Modal Dialog */}
      {(editingMedicine || isAddingNew) && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isAddingNew ? 'Add New Medicine to Catalog' : `Edit ${editingMedicine?.brandName}`}
              </h3>
              <button
                onClick={() => {
                  setEditingMedicine(null);
                  setIsAddingNew(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Napa Extra"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strength *</label>
                  <input
                    type="text"
                    required
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 500 mg + 65 mg"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Generic Molecule *</label>
                  <input
                    type="text"
                    required
                    value={formData.generic}
                    onChange={(e) => setFormData({ ...formData, generic: e.target.value })}
                    placeholder="e.g. Paracetamol + Caffeine"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as DosageForm })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {DOSAGE_FORMS.filter(f => f !== 'All Forms').map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
                  <select
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {MANUFACTURERS.filter(m => m !== 'All Manufacturers').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Therapeutic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TherapeuticCategory })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {MEDICINE_CATEGORIES.filter(c => c !== 'All Medicines').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price / Piece (৳)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.pricePerPiece}
                    onChange={(e) => setFormData({ ...formData, pricePerPiece: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strip Size</label>
                  <input
                    type="number"
                    value={formData.stripSize}
                    onChange={(e) => setFormData({ ...formData, stripSize: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count (Units)</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPrescriptionRequired}
                      onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className="font-bold text-rose-700">Prescription Required (Rx)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Overview</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMedicine(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
