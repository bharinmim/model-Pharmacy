import React, { useState, useEffect } from 'react';
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
  Store,
  Tag,
  Percent,
  Printer,
  Sparkles,
  Megaphone,
  Truck,
  Phone,
  RotateCw,
  Copy,
  Check,
  UserCheck,
  UserPlus,
  Users,
  Image as ImageIcon,
  HelpCircle,
  FileBadge
} from 'lucide-react';
import { Medicine, PlacedOrder, PrescriptionOrder, DosageForm, TherapeuticCategory, Coupon, SiteSettings, AdminUser } from '../types/pharmacy';
import { MEDICINE_CATEGORIES, DOSAGE_FORMS, MANUFACTURERS } from '../data/medicinesData';
import heroImgDefault from '../assets/images/pharmacy_hero_medicines_1792297164466.jpg';
import deliveryImgDefault from '../assets/images/express_pharmacy_delivery_1792297164949.jpg';
import rxImgDefault from '../assets/images/prescription_desk_stethoscope_1792297165282.jpg';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentAdminUser?: AdminUser | null;
  adminUsers?: AdminUser[];
  onLogin: (email: string, pass: string) => boolean;
  onRegisterAdmin?: (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => boolean;
  onDeleteAdminUser?: (id: string) => void;
  onLogout: () => void;
  medicines: Medicine[];
  onAddMedicine: (medicine: Medicine) => void;
  onUpdateMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onQuickRestockMedicine?: (id: string, amount: number) => void;
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, status: PlacedOrder['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  prescriptions: PrescriptionOrder[];
  onUpdatePrescriptionStatus: (id: string, status: PrescriptionOrder['status']) => void;
  onConvertPrescriptionToOrder?: (prescription: PrescriptionOrder) => void;
  coupons?: Coupon[];
  onAddCoupon?: (coupon: Coupon) => void;
  onToggleCoupon?: (code: string) => void;
  onDeleteCoupon?: (code: string) => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  currentAdminUser,
  adminUsers = [],
  onLogin,
  onRegisterAdmin,
  onDeleteAdminUser,
  onLogout,
  medicines,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  onQuickRestockMedicine,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  prescriptions,
  onUpdatePrescriptionStatus,
  onConvertPrescriptionToOrder,
  coupons = [],
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  siteSettings,
  onUpdateSettings
}) => {
  // Login vs Register View mode for non-authenticated screen
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [emailInput, setEmailInput] = useState(adminUsers[0]?.email || 'bharin10mim@gmail.com');
  const [passwordInput, setPasswordInput] = useState(adminUsers[0]?.pass || '1234');
  const [loginError, setLoginError] = useState('');

  // Sign Up / Register New Person form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerRole, setRegisterRole] = useState<AdminUser['role']>('Senior Pharmacist');
  const [registerLicenseId, setRegisterLicenseId] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'prescriptions' | 'coupons' | 'staff' | 'settings'>('overview');

  // Search & Filter in Admin
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Printable Invoice Modal state
  const [invoiceOrder, setInvoiceOrder] = useState<PlacedOrder | null>(null);

  // New Coupon Modal state
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(0);
  const [couponDescription, setCouponDescription] = useState('');
  const [couponFormError, setCouponFormError] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Editing Medicine Modal State
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [medicineFormError, setMedicineFormError] = useState('');

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

  // Comprehensive Settings form allowing changing ANYTHING on the site
  const [tempSiteName, setTempSiteName] = useState(siteSettings.siteName);
  const [tempHotline, setTempHotline] = useState(siteSettings.hotline);
  const [tempCoverage, setTempCoverage] = useState(siteSettings.coverage);
  const [tempHeroBadge, setTempHeroBadge] = useState(siteSettings.heroBadge || 'Licensed Digital Pharmacy of Bangladesh');
  const [tempHeroHeadline, setTempHeroHeadline] = useState(siteSettings.heroHeadline || 'Genuine Medicines Delivered Across Whole Bangladesh');
  const [tempHeroSubheadline, setTempHeroSubheadline] = useState(siteSettings.heroSubheadline || 'Direct supply from certified manufacturers like Square, Beximco, Incepta, and Renata.');
  const [tempHeroImageUrl, setTempHeroImageUrl] = useState(siteSettings.heroImageUrl || '');
  const [tempNotice, setTempNotice] = useState(siteSettings.announcementNotice || '');
  const [tempNoticeActive, setTempNoticeActive] = useState(siteSettings.isAnnouncementActive ?? true);
  const [tempStandardFee, setTempStandardFee] = useState(siteSettings.standardDeliveryFee ?? 50);
  const [tempExpressFee, setTempExpressFee] = useState(siteSettings.expressDeliveryFee ?? 99);
  const [tempFreeThreshold, setTempFreeThreshold] = useState(siteSettings.freeDeliveryThreshold ?? 999);
  const [tempPharmacist, setTempPharmacist] = useState(siteSettings.pharmacistOnDuty || '');
  const [tempFooterDisclaimer, setTempFooterDisclaimer] = useState(siteSettings.footerDisclaimer || "Licensed by Directorate General of Drug Administration (DGDA), Ministry of Health & Family Welfare, People's Republic of Bangladesh.");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync settings whenever siteSettings prop updates
  useEffect(() => {
    setTempSiteName(siteSettings.siteName);
    setTempHotline(siteSettings.hotline);
    setTempCoverage(siteSettings.coverage);
    setTempHeroBadge(siteSettings.heroBadge || 'Licensed Digital Pharmacy of Bangladesh');
    setTempHeroHeadline(siteSettings.heroHeadline || 'Genuine Medicines Delivered Across Whole Bangladesh');
    setTempHeroSubheadline(siteSettings.heroSubheadline || 'Direct supply from certified manufacturers like Square, Beximco, Incepta, and Renata.');
    setTempHeroImageUrl(siteSettings.heroImageUrl || '');
    setTempNotice(siteSettings.announcementNotice || '');
    setTempNoticeActive(siteSettings.isAnnouncementActive ?? true);
    setTempStandardFee(siteSettings.standardDeliveryFee ?? 50);
    setTempExpressFee(siteSettings.expressDeliveryFee ?? 99);
    setTempFreeThreshold(siteSettings.freeDeliveryThreshold ?? 999);
    setTempPharmacist(siteSettings.pharmacistOnDuty || '');
    setTempFooterDisclaimer(siteSettings.footerDisclaimer || '');
  }, [siteSettings]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(emailInput.trim(), passwordInput.trim());
    if (!success) {
      setLoginError('Invalid email or password. You can switch to "Register New Person" below to sign up a new admin account.');
    }
  };

  // Handle New Person Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!registerName.trim()) {
      setRegisterError('Please enter full name');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setRegisterError('Please enter a valid email address');
      return;
    }
    if (!registerPass.trim() || registerPass.length < 3) {
      setRegisterError('Passcode must be at least 3 characters');
      return;
    }

    if (onRegisterAdmin) {
      const ok = onRegisterAdmin({
        name: registerName.trim(),
        email: registerEmail.trim(),
        pass: registerPass.trim(),
        role: registerRole,
        registrationId: registerLicenseId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
      });

      if (!ok) {
        setRegisterError('An administrator account with this email already exists. Please log in or use a different email.');
        return;
      }

      setRegisterSuccess('New Admin Account registered successfully! You are now logged in.');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPass('');
      setRegisterLicenseId('');
    }
  };

  // Save all site settings (modifies EVERYTHING on the site)
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      siteName: tempSiteName.trim() || 'Bd Model pharmacy',
      hotline: tempHotline.trim() || '01799703910',
      coverage: tempCoverage.trim() || 'Whole Bangladesh (All 64 Districts)',
      heroBadge: tempHeroBadge.trim(),
      heroHeadline: tempHeroHeadline.trim(),
      heroSubheadline: tempHeroSubheadline.trim(),
      heroImageUrl: tempHeroImageUrl.trim(),
      announcementNotice: tempNotice.trim(),
      isAnnouncementActive: tempNoticeActive,
      standardDeliveryFee: Number(tempStandardFee) || 0,
      expressDeliveryFee: Number(tempExpressFee) || 0,
      freeDeliveryThreshold: Number(tempFreeThreshold) || 0,
      pharmacistOnDuty: tempPharmacist.trim(),
      footerDisclaimer: tempFooterDisclaimer.trim()
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3500);
  };

  const openEditModal = (med: Medicine) => {
    setMedicineFormError('');
    setEditingMedicine(med);
    setFormData({ ...med });
    setIsAddingNew(false);
  };

  const openAddModal = () => {
    setMedicineFormError('');
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
    setMedicineFormError('');
    if (!formData.brandName || !formData.generic) {
      setMedicineFormError('Brand Name and Generic are required');
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

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFormError('');
    if (!couponCode.trim()) {
      setCouponFormError('Coupon code is required');
      return;
    }
    if (couponValue <= 0) {
      setCouponFormError('Discount value must be greater than 0');
      return;
    }
    if (onAddCoupon) {
      onAddCoupon({
        code: couponCode.trim().toUpperCase(),
        discountType: couponType,
        discountValue: Number(couponValue),
        minOrder: Number(couponMinOrder) || 0,
        description: couponDescription.trim() || `${couponValue}${couponType === 'percentage' ? '%' : '৳'} discount promo`,
        isActive: true
      });
      setIsAddingCoupon(false);
      setCouponCode('');
      setCouponDescription('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCoupon(text);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  // Calculations for dashboard
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pharmacist Reviewing' || o.status === 'Confirmed');
  const lowStockMedicines = medicines.filter(m => m.stockCount < 400 && m.stockCount > 0);
  const outOfStockMedicines = medicines.filter(m => m.stockCount <= 0 || !m.inStock);

  // Filtered medicines
  const filteredInventory = medicines
    .filter(m => {
      if (inventoryStockFilter === 'low') return m.stockCount < 400 && m.stockCount > 0;
      if (inventoryStockFilter === 'out') return m.stockCount <= 0 || !m.inStock;
      return true;
    })
    .filter(m => 
      m.brandName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      m.generic.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(inventorySearch.toLowerCase())
    );

  // Filtered orders
  const filteredOrders = orders
    .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
    .filter(o => 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.patientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.patientPhone.includes(orderSearch)
    );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/75 backdrop-blur-xs flex justify-center items-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* If NOT logged in: Render Login OR Sign-Up for New Person */}
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-50 overflow-y-auto">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 my-auto">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-md">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {authMode === 'login' ? 'Admin Portal Sign In' : 'Register New Admin Person'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {authMode === 'login' 
                      ? `Sign in to manage ${siteSettings.siteName}` 
                      : 'Create a new admin/pharmacist account with full access'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Toggle Tabs: Log In vs Register New Person */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In (Existing)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegisterError('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'register'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Register New Person</span>
                </button>
              </div>

              {/* VIEW A: SIGN IN FORM */}
              {authMode === 'login' && (
                <>
                  {loginError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="e.g. bharin10mim@gmail.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Security Passcode
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Quick credential selection pills */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1.5">
                      <span className="font-bold text-slate-700 block">Registered Admin Accounts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {adminUsers.map((u) => (
                          <button
                            type="button"
                            key={u.id}
                            onClick={() => {
                              setEmailInput(u.email);
                              setPasswordInput(u.pass);
                            }}
                            className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            {u.name} ({u.role})
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Authenticate & Enter Admin</span>
                    </button>
                  </form>
                </>
              )}

              {/* VIEW B: REGISTER NEW PERSON FORM */}
              {authMode === 'register' && (
                <>
                  {registerError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  {registerSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{registerSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="e.g. Md. Kamal Hossain"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="e.g. kamal@bdmodelpharmacy.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Role *
                        </label>
                        <select
                          value={registerRole}
                          onChange={(e) => setRegisterRole(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Senior Pharmacist">Senior Pharmacist</option>
                          <option value="Inventory Manager">Inventory Manager</option>
                          <option value="Dispatch Officer">Dispatch Officer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Passcode *
                        </label>
                        <input
                          type="password"
                          required
                          value={registerPass}
                          onChange={(e) => setRegisterPass(e.target.value)}
                          placeholder="••••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        DGDA License / Staff Registration ID
                      </label>
                      <input
                        type="text"
                        value={registerLicenseId}
                        onChange={(e) => setRegisterLicenseId(e.target.value)}
                        placeholder="e.g. DGDA/BD/9924"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register & Enter Admin Dashboard</span>
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>
        ) : (
          /* LOGGED IN: Full Admin Dashboard with Everything Configurable */
          <>
            {/* Admin Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm flex items-center gap-2">
                    <span>{siteSettings.siteName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      ADMIN CONTROL CENTER
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Hotline: {siteSettings.hotline} · {siteSettings.coverage}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentAdminUser?.name || 'Admin'}</span>
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    {currentAdminUser?.role} ({currentAdminUser?.email})
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar with All Options */}
            <div className="bg-slate-800 px-6 flex items-center gap-4 text-xs font-semibold overflow-x-auto scrollbar-none">
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
                <span>Medicines & Inventory ({medicines.length})</span>
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
                onClick={() => setActiveTab('coupons')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'coupons'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Promo Codes & Coupons ({coupons.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'staff'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Admin Staff ({adminUsers.length})</span>
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
                <span>Change Site & Hero Settings</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {/* TAB 1: OVERVIEW & METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Total Sales Revenue</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        ৳{totalSales.toFixed(2)}
                      </div>
                      <div className="text-emerald-700 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>All 64 Districts Delivery</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Customer Orders</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        {orders.length}
                      </div>
                      <div className="text-amber-700 text-[11px] font-semibold mt-1">
                        {pendingOrders.length} pending review / packing
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Prescription Backlog</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                        {prescriptions.length}
                      </div>
                      <div className="text-blue-700 text-[11px] font-semibold mt-1">
                        {prescriptions.filter(p => p.status === 'Pending Pharmacist Review').length} awaiting inspection
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Active Promo Codes</div>
                      <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1">
                        {coupons.filter(c => c.isActive).length} / {coupons.length}
                      </div>
                      <div className="text-emerald-700 text-[11px] font-semibold mt-1">
                        Live discounts on checkout
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts for Admin */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                      Quick Operational Actions
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <button
                        onClick={openAddModal}
                        className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-emerald-700" />
                        <span>Add Medicine</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('coupons');
                          setIsAddingCoupon(true);
                        }}
                        className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Tag className="w-4 h-4 text-blue-700" />
                        <span>Create Promo Code</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('staff')}
                        className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-indigo-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-indigo-700" />
                        <span>Manage Admin Staff</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-amber-700" />
                        <span>Change Hero & Site</span>
                      </button>
                    </div>
                  </div>

                  {/* Operational Alerts & Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders List */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Latest Customer Orders
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
                          {lowStockMedicines.length} low stock
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {lowStockMedicines.slice(0, 4).map((med) => (
                          <div key={med.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{med.brandName} {med.strength}</div>
                              <div className="text-slate-500 text-[11px]">{med.manufacturer} · {med.dosageForm}</div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-700">{med.stockCount} units</span>
                              {onQuickRestockMedicine && (
                                <button
                                  onClick={() => onQuickRestockMedicine(med.id, 100)}
                                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[10px] cursor-pointer"
                                  title="Add 100 units"
                                >
                                  +100
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY & RESTOCK MANAGEMENT */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  {/* Top Control Bar: Search, Stock Filters, Add Medicine */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Search medicines by brand, generic, or manufacturer..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                      <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
                        <button
                          onClick={() => setInventoryStockFilter('all')}
                          className={`px-3 py-1 font-medium rounded cursor-pointer ${
                            inventoryStockFilter === 'all' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
                          }`}
                        >
                          All ({medicines.length})
                        </button>
                        <button
                          onClick={() => setInventoryStockFilter('low')}
                          className={`px-3 py-1 font-medium rounded cursor-pointer ${
                            inventoryStockFilter === 'low' ? 'bg-white shadow-2xs text-amber-700 font-bold' : 'text-slate-600'
                          }`}
                        >
                          Low Stock ({lowStockMedicines.length})
                        </button>
                        <button
                          onClick={() => setInventoryStockFilter('out')}
                          className={`px-3 py-1 font-medium rounded cursor-pointer ${
                            inventoryStockFilter === 'out' ? 'bg-white shadow-2xs text-rose-700 font-bold' : 'text-slate-600'
                          }`}
                        >
                          Out of Stock ({outOfStockMedicines.length})
                        </button>
                      </div>

                      <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Medicine</span>
                      </button>
                    </div>
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
                            <th className="px-4 py-3">Current Stock</th>
                            <th className="px-4 py-3">Quick Restock</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredInventory.map((med) => (
                            <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {med.brandName}
                                <span className="block text-[11px] text-slate-400 font-normal">
                                  {med.dosageForm} {med.isPrescriptionRequired ? '· Rx Required' : '· OTC'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-800">{med.generic}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{med.strength}</div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">{med.manufacturer}</td>
                              <td className="px-4 py-3 font-mono font-bold text-slate-900">
                                ৳{med.pricePerPiece.toFixed(2)}
                                {med.discountPercent > 0 && (
                                  <span className="block text-[10px] text-emerald-700 font-sans">
                                    {med.discountPercent}% OFF
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                  med.stockCount <= 0 
                                    ? 'bg-rose-50 text-rose-700' 
                                    : med.stockCount < 400 
                                    ? 'bg-amber-50 text-amber-700' 
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {med.stockCount} units
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => onQuickRestockMedicine && onQuickRestockMedicine(med.id, 100)}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px] cursor-pointer"
                                    title="Add 100 units"
                                  >
                                    +100
                                  </button>
                                  <button
                                    onClick={() => onQuickRestockMedicine && onQuickRestockMedicine(med.id, 500)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px] cursor-pointer"
                                    title="Add 500 units"
                                  >
                                    +500
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => openEditModal(med)}
                                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                                    title="Edit Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteMedicine(med.id)}
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
                  {/* Top Bar: Search and Status Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="relative max-w-sm flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by Order ID, Phone or Name..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {['all', 'Confirmed', 'Pharmacist Reviewing', 'Packing', 'On The Way', 'Delivered'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
                            orderStatusFilter === status 
                              ? 'bg-slate-900 text-white font-bold' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {status === 'all' ? 'All Orders' : status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
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
                                {order.paymentMethod} · {order.deliveryMethod === 'express' ? '2-Hr Express' : 'Standard'}
                              </div>
                            </div>

                            {/* Status Controller & Actions */}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => setInvoiceOrder(order)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                title="View Printable Invoice"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-600" />
                                <span>Invoice</span>
                              </button>

                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                                className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 border border-emerald-200 text-emerald-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pharmacist Reviewing">Pharmacist Reviewing</option>
                                <option value="Packing">Packing Cold-Chain</option>
                                <option value="On The Way">On The Way</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {onDeleteOrder && (
                                <button
                                  onClick={() => onDeleteOrder(order.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                  title="Cancel / Delete Order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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
                  <div className="text-xs text-slate-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <strong>Registered Pharmacist Audit Queue:</strong> Verify doctor's credentials, drug interactions, and dosage before dispatching.
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                      {prescriptions.length} Total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((presc) => (
                      <div key={presc.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {presc.id}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            presc.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
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

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                          <a
                            href={`tel:${presc.patientPhone}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>Call</span>
                          </a>

                          <div className="flex items-center gap-2">
                            {onConvertPrescriptionToOrder && (
                              <button
                                onClick={() => onConvertPrescriptionToOrder(presc)}
                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded text-xs cursor-pointer flex items-center gap-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Create Order</span>
                              </button>
                            )}

                            <button
                              onClick={() => onUpdatePrescriptionStatus(presc.id, 'Verified')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROMO CODES & COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Discounts & Promotional Codes
                      </h3>
                      <p className="text-xs text-slate-500">
                        Manage active promo codes that customers can apply in checkout across Bangladesh.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingCoupon(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Promo Code</span>
                    </button>
                  </div>

                  {/* Coupons List Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Coupon Code</th>
                          <th className="px-4 py-3">Discount Value</th>
                          <th className="px-4 py-3">Minimum Order</th>
                          <th className="px-4 py-3">Description / Terms</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {coupons.map((coupon) => (
                          <tr key={coupon.code} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {coupon.code}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(coupon.code)}
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                  title="Copy Code"
                                >
                                  {copiedCoupon === coupon.code ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">
                              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} FLAT OFF`}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600">
                              {coupon.minOrder > 0 ? `৳${coupon.minOrder}` : 'No minimum'}
                            </td>
                            <td className="px-4 py-3 text-slate-600 max-w-xs">
                              {coupon.description}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                                coupon.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {coupon.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {onToggleCoupon && (
                                  <button
                                    onClick={() => onToggleCoupon(coupon.code)}
                                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                  >
                                    {coupon.isActive ? 'Disable' : 'Enable'}
                                  </button>
                                )}
                                {onDeleteCoupon && (
                                  <button
                                    onClick={() => onDeleteCoupon(coupon.code)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                    title="Delete Promo Code"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: ADMIN STAFF & USERS (SIGN IN / REGISTER FOR NEW PERSONS) */}
              {activeTab === 'staff' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-700" />
                          <span>Authorized Pharmacy Administrators & Staff</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Add new people, pharmacists, or dispatch officers who can log into this Admin Panel.
                        </p>
                      </div>

                      <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                        {adminUsers.length} Active Personnel
                      </div>
                    </div>

                    {/* Staff Accounts Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email Address</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Registration ID</th>
                            <th className="px-4 py-3">Passcode</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adminUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {user.name}
                                {currentAdminUser?.id === user.id && (
                                  <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">
                                    (You)
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-600">{user.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                  user.role === 'Super Admin'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : user.role === 'Senior Pharmacist'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-500">
                                {user.registrationId || '—'}
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-400">
                                {user.pass}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {adminUsers.length > 1 && (
                                  <button
                                    onClick={() => onDeleteAdminUser && onDeleteAdminUser(user.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                    title="Revoke Admin Access"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add New Person Directly Form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-emerald-700" />
                      <span>Add New Person to Admin Team</span>
                    </h4>

                    {registerError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{registerError}</span>
                      </div>
                    )}

                    {registerSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{registerSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="e.g. Dr. Mahbubur Rahman"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="e.g. mahbub@bdmodelpharmacy.com"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Assign Role *</label>
                        <select
                          value={registerRole}
                          onChange={(e) => setRegisterRole(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                        >
                          <option value="Senior Pharmacist">Senior Pharmacist</option>
                          <option value="Super Admin">Super Admin</option>
                          <option value="Inventory Manager">Inventory Manager</option>
                          <option value="Dispatch Officer">Dispatch Officer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Login Passcode *</label>
                        <input
                          type="text"
                          required
                          value={registerPass}
                          onChange={(e) => setRegisterPass(e.target.value)}
                          placeholder="••••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Registration / License ID</label>
                        <input
                          type="text"
                          value={registerLicenseId}
                          onChange={(e) => setRegisterLicenseId(e.target.value)}
                          placeholder="e.g. DGDA/BD/8812"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Add Person to Admin Team
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 7: CHANGE ANYTHING (COMPLETE SITE & STOREFRONT SETTINGS) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  
                  {settingsSaved && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All platform and hero parameters updated and live across the website!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">

                    {/* 1. HERO BANNER CUSTOMIZATION (CHANGE PICTURE, HEADLINE, SUBTITLE, BADGE) */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-700" />
                            <span>1. Hero Banner Content & Image Customization</span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Change the main storefront headline, subtext, badge label, and hero showcase photograph.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          Storefront Hero
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Hero Badge Label
                          </label>
                          <input
                            type="text"
                            value={tempHeroBadge}
                            onChange={(e) => setTempHeroBadge(e.target.value)}
                            placeholder="Licensed Digital Pharmacy of Bangladesh"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Hero Main Headline
                          </label>
                          <input
                            type="text"
                            value={tempHeroHeadline}
                            onChange={(e) => setTempHeroHeadline(e.target.value)}
                            placeholder="Genuine Medicines Delivered Across Whole Bangladesh"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Hero Subheadline Description
                          </label>
                          <textarea
                            rows={2}
                            value={tempHeroSubheadline}
                            onChange={(e) => setTempHeroSubheadline(e.target.value)}
                            placeholder="Direct supply from certified manufacturers like Square, Beximco, Incepta, and Renata..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Hero Picture / Photography
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={tempHeroImageUrl}
                              onChange={(e) => setTempHeroImageUrl(e.target.value)}
                              placeholder="Paste custom image URL (e.g. https://... or leave blank for default laboratory photo)"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                            />

                            {/* Preset Image Choosers */}
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="text-slate-500 font-medium">Or pick preset photo:</span>
                              <button
                                type="button"
                                onClick={() => setTempHeroImageUrl(heroImgDefault)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                              >
                                Laboratory Medicines
                              </button>
                              <button
                                type="button"
                                onClick={() => setTempHeroImageUrl(deliveryImgDefault)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                              >
                                Express Delivery Van
                              </button>
                              <button
                                type="button"
                                onClick={() => setTempHeroImageUrl(rxImgDefault)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                              >
                                Pharmacist Stethoscope Desk
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. STORE BRANDING, HOTLINE & COVERAGE */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Store className="w-4 h-4 text-emerald-700" />
                          <span>2. Brand Identity, Customer Hotline & Territory</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Controls the logo title, 24/7 hotline numbers, and operational territory everywhere.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Website Brand Name
                          </label>
                          <input
                            type="text"
                            value={tempSiteName}
                            onChange={(e) => setTempSiteName(e.target.value)}
                            placeholder="Bd Model pharmacy"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            24/7 Customer Hotline Number
                          </label>
                          <input
                            type="text"
                            value={tempHotline}
                            onChange={(e) => setTempHotline(e.target.value)}
                            placeholder="01799703910"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            Nationwide Coverage Area
                          </label>
                          <input
                            type="text"
                            value={tempCoverage}
                            onChange={(e) => setTempCoverage(e.target.value)}
                            placeholder="Whole Bangladesh (All 64 Districts)"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. TOP EMERGENCY ANNOUNCEMENT NOTICE BAR */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-emerald-700" />
                            <span>3. Top Emergency Announcement Notice Bar</span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Displays a prominent marquee at the top of the header across the storefront.
                          </p>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={tempNoticeActive}
                            onChange={(e) => setTempNoticeActive(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Show Announcement Banner</span>
                        </label>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Announcement Notice Message
                        </label>
                        <input
                          type="text"
                          value={tempNotice}
                          onChange={(e) => setTempNotice(e.target.value)}
                          placeholder="e.g. Flash 10% Discount Nationwide! Use Promo Code BDMODEL10 | Hotline: 01799703910"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    {/* 4. DELIVERY CHARGES & POLICY */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-700" />
                          <span>4. Delivery Logistics Charges & Free Shipping Policy</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Modify courier prices and minimum checkout order value for free delivery.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Standard Courier Fee (৳)
                          </label>
                          <input
                            type="number"
                            value={tempStandardFee}
                            onChange={(e) => setTempStandardFee(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Express 2-Hour Courier Fee (৳)
                          </label>
                          <input
                            type="number"
                            value={tempExpressFee}
                            onChange={(e) => setTempExpressFee(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Free Delivery Minimum Order (৳)
                          </label>
                          <input
                            type="number"
                            value={tempFreeThreshold}
                            onChange={(e) => setTempFreeThreshold(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. PHARMACY COMPLIANCE & FOOTER DISCLAIMER */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>5. Registered Pharmacist & Regulatory Legal Disclaimer</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          DGDA compliance officer and customer regulatory notices.
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Current Pharmacist On Duty Details
                        </label>
                        <input
                          type="text"
                          value={tempPharmacist}
                          onChange={(e) => setTempPharmacist(e.target.value)}
                          placeholder="Dr. Sarah Ahmed (Grade-A Reg. Pharmacist - DGDA/BD/8492)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Footer Regulatory & DGDA Compliance Disclaimer
                        </label>
                        <textarea
                          rows={2}
                          value={tempFooterDisclaimer}
                          onChange={(e) => setTempFooterDisclaimer(e.target.value)}
                          placeholder="Licensed by Directorate General of Drug Administration (DGDA)..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                        />
                      </div>
                    </div>

                    {/* SAVE EVERYTHING BUTTON */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-emerald-200 shadow-md flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-slate-900">Save All Changes</div>
                        <div className="text-[11px] text-slate-500">
                          Applies all updated headlines, pictures, contact details, fees, and regulatory copy.
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save & Apply All Changes</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* MODAL 1: Add New Promo Code / Coupon */}
      {isAddingCoupon && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Create New Promo Code
                </h3>
              </div>
              <button
                onClick={() => setIsAddingCoupon(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {couponFormError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{couponFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BDMODEL20"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold uppercase tracking-wider text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {couponType === 'percentage' ? 'Percentage (%)' : 'Amount (৳)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  placeholder="0 for no minimum"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Terms / Description</label>
                <textarea
                  rows={2}
                  value={couponDescription}
                  onChange={(e) => setCouponDescription(e.target.value)}
                  placeholder="e.g. 10% off storewide for all medicines"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Medicine Dialog */}
      {(editingMedicine || isAddingNew) && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {isAddingNew ? 'Add New Medicine to Bangladesh Catalog' : `Edit ${editingMedicine?.brandName}`}
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
              {medicineFormError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{medicineFormError}</span>
                </div>
              )}
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

      {/* MODAL 3: Printable Customer Invoice Dialog */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  DGDA Licensed Pharmacy Invoice
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {siteSettings.siteName} - Official Receipt
                </h3>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Invoice No: <strong className="font-mono text-slate-900">{invoiceOrder.id}</strong></span>
                <span>Date: <strong className="font-mono">{invoiceOrder.createdAt}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Patient: <strong className="text-slate-900">{invoiceOrder.patientName}</strong></span>
                <span>Phone: <strong className="font-mono text-emerald-800">{invoiceOrder.patientPhone}</strong></span>
              </div>
              <div>
                <span>Delivery Destination: <strong className="text-slate-900">{invoiceOrder.deliveryAddress} ({invoiceOrder.area})</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode: <strong className="uppercase font-bold">{invoiceOrder.paymentMethod}</strong></span>
                <span>Status: <strong className="text-emerald-700 font-bold">{invoiceOrder.status}</strong></span>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <div className="font-bold text-slate-900 mb-2">Prescribed Items Breakdown:</div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceOrder.items.map((it, idx) => {
                      const unitMultiplier = it.unit === 'strip' ? it.medicine.stripSize : (it.unit === 'box' ? it.medicine.boxSize : 1);
                      const unitPrice = it.medicine.pricePerPiece * (1 - it.medicine.discountPercent / 100) * unitMultiplier;
                      return (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-slate-800">
                            {it.medicine.brandName} {it.medicine.strength}
                            <span className="block text-[10px] font-normal text-slate-500">{it.medicine.generic}</span>
                          </td>
                          <td className="p-2 capitalize">{it.unit}</td>
                          <td className="p-2 text-center font-mono">{it.quantity}</td>
                          <td className="p-2 text-right font-mono">৳{(unitPrice * it.quantity).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {invoiceOrder.items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-slate-400 italic">
                          Prescription order - Medicine list audited directly by dispensing pharmacist.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1 text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳{invoiceOrder.subtotal.toFixed(2)}</span>
              </div>
              {invoiceOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount:</span>
                  <span className="font-mono">-৳{invoiceOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-mono">{invoiceOrder.deliveryFee === 0 ? 'FREE' : `৳${invoiceOrder.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-800">৳{invoiceOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Pharmacist on duty: {siteSettings.pharmacistOnDuty}. 100% Genuine DGDA certified medicine.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2 text-slate-600 font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
