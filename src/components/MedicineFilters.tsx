import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { 
  MEDICINE_CATEGORIES, 
  MANUFACTURERS, 
  DOSAGE_FORMS 
} from '../data/medicinesData';
import { TherapeuticCategory } from '../types/pharmacy';

interface MedicineFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedForm: string;
  onSelectForm: (form: string) => void;
  selectedManufacturer: string;
  onSelectManufacturer: (mfg: string) => void;
  prescriptionFilter: 'all' | 'rx' | 'otc';
  onPrescriptionFilterChange: (type: 'all' | 'rx' | 'otc') => void;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'discount';
  onSortChange: (sort: 'relevance' | 'price-asc' | 'price-desc' | 'discount') => void;
  onResetFilters: () => void;
  categoryCounts: Record<string, number>;
  totalResults: number;
}

export const MedicineFilters: React.FC<MedicineFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedForm,
  onSelectForm,
  selectedManufacturer,
  onSelectManufacturer,
  prescriptionFilter,
  onPrescriptionFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  categoryCounts,
  totalResults
}) => {
  const isAnyFilterActive = 
    selectedCategory !== 'All Medicines' || 
    selectedForm !== 'All Forms' || 
    selectedManufacturer !== 'All Manufacturers' || 
    prescriptionFilter !== 'all' || 
    sortBy !== 'relevance';

  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs divide-y divide-slate-100">
      
      {/* Header with Results Count & Reset */}
      <div className="pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Filter Catalog
          </h2>
        </div>
        {isAnyFilterActive && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Prescription Requirement Filter */}
      <div className="py-4">
        <span className="text-xs font-bold text-slate-900 block mb-2.5">
          Prescription Type
        </span>
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => onPrescriptionFilterChange('all')}
            className={`py-1.5 px-2 rounded font-medium transition-colors cursor-pointer ${
              prescriptionFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onPrescriptionFilterChange('otc')}
            className={`py-1.5 px-2 rounded font-medium transition-colors cursor-pointer ${
              prescriptionFilter === 'otc'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OTC Only
          </button>
          <button
            onClick={() => onPrescriptionFilterChange('rx')}
            className={`py-1.5 px-2 rounded font-medium transition-colors cursor-pointer ${
              prescriptionFilter === 'rx'
                ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rx Only
          </button>
        </div>
      </div>

      {/* Therapeutic Category */}
      <div className="py-4">
        <span className="text-xs font-bold text-slate-900 block mb-2">
          Therapeutic Category
        </span>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {MEDICINE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dosage Form Filter */}
      <div className="py-4">
        <label className="text-xs font-bold text-slate-900 block mb-2">
          Dosage Form
        </label>
        <select
          value={selectedForm}
          onChange={(e) => onSelectForm(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
        >
          {DOSAGE_FORMS.map((form) => (
            <option key={form} value={form}>
              {form}
            </option>
          ))}
        </select>
      </div>

      {/* Manufacturer Filter */}
      <div className="py-4">
        <label className="text-xs font-bold text-slate-900 block mb-2">
          Pharmaceutical Manufacturer
        </label>
        <select
          value={selectedManufacturer}
          onChange={(e) => onSelectManufacturer(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
        >
          {MANUFACTURERS.map((mfg) => (
            <option key={mfg} value={mfg}>
              {mfg}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="pt-4">
        <label className="text-xs font-bold text-slate-900 block mb-2">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
        >
          <option value="relevance">Most Popular / Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Highest Discount %</option>
        </select>
      </div>

    </aside>
  );
};
