export type DosageForm = 
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Suspension'
  | 'Chewable Tablet'
  | 'Cream'
  | 'Ointment'
  | 'Drops'
  | 'Injection'
  | 'Inhaler';

export type TherapeuticCategory =
  | 'All Medicines'
  | 'Acid Peptic & Gastric'
  | 'Pain, Fever & Migraine'
  | 'Allergy, Cough & Asthma'
  | 'Antibiotics & Anti-Infectives'
  | 'Cardiovascular & Blood Pressure'
  | 'Diabetes Care'
  | 'Vitamins & Minerals'
  | 'Dermatology & Skin'
  | 'Digestive & Gut Health';

export interface Medicine {
  id: string;
  brandName: string;
  strength: string;
  dosageForm: DosageForm;
  generic: string;
  manufacturer: string;
  category: TherapeuticCategory;
  pricePerPiece: number; // in BDT ৳
  stripSize: number; // units per strip
  boxSize: number; // units per box
  discountPercent: number; // e.g. 8%
  isPrescriptionRequired: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  image?: string;
  description: string;
  indications: string[];
  dosage: string;
  sideEffects: string[];
  contraindications: string;
  pregnancySafety: string;
  storage: string;
  substituteIds: string[]; // IDs of alternate brands with exact same generic
}

export type UnitType = 'piece' | 'strip' | 'box';

export interface CartItem {
  medicine: Medicine;
  unit: UnitType;
  quantity: number;
}

export interface PrescriptionOrder {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  area: string;
  notes: string;
  prescriptionImage: string;
  isUrgent: boolean;
  createdAt: string;
  status: 'Pending Pharmacist Review' | 'Verified' | 'Preparing Shipment' | 'Delivered';
}

export interface PlacedOrder {
  id: string;
  items: CartItem[];
  patientName: string;
  patientPhone: string;
  deliveryAddress: string;
  area: string;
  deliveryMethod: 'express' | 'standard';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'Confirmed' | 'Pharmacist Reviewing' | 'Packing' | 'On The Way' | 'Delivered';
  createdAt: string;
  hasPrescriptionItems: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  pass: string;
  role: 'Super Admin' | 'Senior Pharmacist' | 'Inventory Manager' | 'Dispatch Officer';
  registrationId?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  hotline: string;
  coverage: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl?: string;
  announcementNotice: string;
  isAnnouncementActive: boolean;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  pharmacistOnDuty: string;
  footerDisclaimer: string;
}
