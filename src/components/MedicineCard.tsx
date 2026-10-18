import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Minus, 
  Check, 
  ShieldAlert, 
  Repeat, 
  Info,
  PackageCheck
} from 'lucide-react';
import { Medicine, UnitType } from '../types/pharmacy';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine, unit: UnitType, quantity: number) => void;
  onSelectMedicine: (medicine: Medicine) => void;
  onViewSubstitutes: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onAddToCart,
  onSelectMedicine,
  onViewSubstitutes
}) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('strip');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // Compute unit multiplier and price
  const getMultiplier = (unit: UnitType) => {
    if (unit === 'piece') return 1;
    if (unit === 'strip') return medicine.stripSize;
    if (unit === 'box') return medicine.boxSize;
    return 1;
  };

  const multiplier = getMultiplier(selectedUnit);
  const regularUnitPrice = medicine.pricePerPiece * multiplier;
  const discountedUnitPrice = regularUnitPrice * (1 - medicine.discountPercent / 100);
  const totalPrice = discountedUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(medicine, selectedUnit, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group">
      
      {/* Top Card Body */}
      <div className="p-4 sm:p-5">
        
        {/* Header Metadata: Manufacturer & Rx Requirement */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
          <span className="truncate font-medium text-slate-600 max-w-[170px]">
            {medicine.manufacturer}
          </span>
          <div className="shrink-0">
            {medicine.isPrescriptionRequired ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                <span className="font-mono font-bold">Rx</span>
                <span className="hidden sm:inline">Required</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                OTC
              </span>
            )}
          </div>
        </div>

        {/* Brand Name & Strength */}
        <div className="cursor-pointer" onClick={() => onSelectMedicine(medicine)}>
          <div className="flex items-baseline gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {medicine.brandName}
            </h3>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {medicine.strength}
            </span>
          </div>

          {/* Dosage form & Generic Molecule */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-700 font-medium">{medicine.dosageForm}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 truncate">{medicine.generic}</span>
          </div>
        </div>

        {/* Unit Selector (Piece / Strip / Box) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex justify-between items-center">
            <span>Select Unit Size:</span>
            {medicine.substituteIds.length > 0 && (
              <button
                onClick={() => onViewSubstitutes(medicine)}
                className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Repeat className="w-3 h-3" />
                <span>{medicine.substituteIds.length} Alternatives</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedUnit('piece')}
              className={`py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                selectedUnit === 'piece'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 Pc
            </button>
            <button
              type="button"
              onClick={() => setSelectedUnit('strip')}
              className={`py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                selectedUnit === 'strip'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Strip ({medicine.stripSize})
            </button>
            <button
              type="button"
              onClick={() => setSelectedUnit('box')}
              className={`py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                selectedUnit === 'box'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Box ({medicine.boxSize})
            </button>
          </div>
        </div>

        {/* Price display with discount */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                ৳{discountedUnitPrice.toFixed(2)}
              </span>
              {medicine.discountPercent > 0 && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  ৳{regularUnitPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              MRP per {selectedUnit} ({multiplier} {multiplier > 1 ? 'units' : 'unit'})
            </div>
          </div>

          {medicine.discountPercent > 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
              {medicine.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Quantity Stepper + Add To Cart + Quick PDP trigger */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-50 flex items-center gap-2">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-l transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-semibold font-mono tabular-nums text-slate-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-r transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
            isAddedFeedback
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {isAddedFeedback ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <span>Add to Cart</span>
              <span className="font-mono tabular-nums text-[11px] opacity-90">
                · ৳{totalPrice.toFixed(1)}
              </span>
            </>
          )}
        </button>

        {/* Info button to open PDP details */}
        <button
          type="button"
          onClick={() => onSelectMedicine(medicine)}
          title="View Medical Information"
          className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
