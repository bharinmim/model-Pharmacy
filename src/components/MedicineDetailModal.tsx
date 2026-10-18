import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Repeat, 
  FileText, 
  Package, 
  Clock, 
  Heart, 
  Share2,
  Plus,
  Minus
} from 'lucide-react';
import { Medicine, UnitType } from '../types/pharmacy';
import { MEDICINES_DATABASE } from '../data/medicinesData';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onAddToCart: (medicine: Medicine, unit: UnitType, quantity: number) => void;
  onSelectSubstitute: (substitute: Medicine) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  onAddToCart,
  onSelectSubstitute
}) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'substitutes' | 'dosage'>('clinical');
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('strip');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  if (!medicine) return null;

  // Retrieve substitute medicines
  const substitutes = MEDICINES_DATABASE.filter(m => medicine.substituteIds.includes(m.id));

  // Multipliers
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      {/* Modal Dialog */}
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
              <Pill className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {medicine.brandName}
                </h2>
                <span className="text-sm font-semibold font-mono text-slate-600">
                  {medicine.strength}
                </span>
                {medicine.isPrescriptionRequired ? (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Rx Required
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    OTC
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span>{medicine.dosageForm}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">{medicine.generic}</span>
                <span aria-hidden="true">·</span>
                <span>{medicine.manufacturer}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Purchase Bar */}
        <div className="px-6 py-3.5 bg-emerald-50/50 border-b border-emerald-100/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-500">Unit Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900">
                  ৳{discountedUnitPrice.toFixed(2)}
                </span>
                {medicine.discountPercent > 0 && (
                  <span className="text-xs line-through text-slate-400 font-mono">
                    ৳{regularUnitPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Unit Selector */}
            <div className="flex bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setSelectedUnit('piece')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedUnit === 'piece' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 Pc
              </button>
              <button
                onClick={() => setSelectedUnit('strip')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedUnit === 'strip' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Strip ({medicine.stripSize})
              </button>
              <button
                onClick={() => setSelectedUnit('box')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedUnit === 'box' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Box ({medicine.boxSize})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold font-mono tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <span className="font-mono tabular-nums">৳{totalPrice.toFixed(1)}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('clinical')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'clinical'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Overview & Uses
          </button>
          <button
            onClick={() => setActiveTab('substitutes')}
            className={`py-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'substitutes'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Repeat className="w-4 h-4 text-emerald-600" />
            <span>Alternate Brands & Substitutes</span>
            <span className="font-mono text-xs px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
              {substitutes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('dosage')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'dosage'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dosage & Administration
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {activeTab === 'clinical' && (
            <>
              {/* Clinical Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {medicine.description}
                </p>
              </div>

              {/* Indications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Indications & Medical Uses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {medicine.indications.map((ind, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Effects & Contraindications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Possible Side Effects</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-950/80 list-disc list-inside">
                    {medicine.sideEffects.map((side, i) => (
                      <li key={i}>{side}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>Contraindications</span>
                  </h4>
                  <p className="text-xs text-rose-950/80 leading-relaxed">
                    {medicine.contraindications}
                  </p>
                </div>
              </div>

              {/* Pregnancy & Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">Pregnancy & Lactation:</span>
                  <span>{medicine.pregnancySafety}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">Storage Instructions:</span>
                  <span>{medicine.storage}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'substitutes' && (
            <div>
              <div className="mb-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-800">
                  <Repeat className="w-4 h-4 text-emerald-600" />
                  <span>Generic Substitute Information</span>
                </div>
                <p>
                  These medicines contain the exact same active pharmaceutical ingredient (<strong>{medicine.generic}</strong>) 
                  with the same strength and therapeutic efficacy, manufactured by licensed pharmaceutical companies in Bangladesh. 
                  You can compare prices and switch freely.
                </p>
              </div>

              {substitutes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No other brand substitutes registered for this unique strength or combination yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {substitutes.map((sub) => {
                    const subPrice = sub.pricePerPiece * (1 - sub.discountPercent / 100);
                    const currentPrice = medicine.pricePerPiece * (1 - medicine.discountPercent / 100);
                    const diffPercent = ((subPrice - currentPrice) / currentPrice) * 100;

                    return (
                      <div key={sub.id} className="p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">{sub.brandName}</span>
                            <span className="text-xs font-mono text-slate-500">{sub.strength}</span>
                            <span className="text-xs text-slate-400">{sub.dosageForm}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Manufactured by <strong className="text-slate-700">{sub.manufacturer}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold font-mono text-base text-slate-900 tabular-nums">
                              ৳{subPrice.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ pc</span>
                            </div>
                            {diffPercent < 0 ? (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Save {Math.abs(diffPercent).toFixed(0)}%
                              </span>
                            ) : diffPercent > 0 ? (
                              <span className="text-[11px] text-slate-400">
                                +{diffPercent.toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                Same price
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectSubstitute(sub)}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => onAddToCart(sub, 'strip', 1)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                            >
                              Add Strip
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dosage' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Standard Dosage Administration</span>
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {medicine.dosage}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold block mb-1">Crucial Medical Disclaimer:</span>
                <span>
                  Dosage recommendations displayed are for informational reference only. Always adhere strictly 
                  to the dosing schedule and duration prescribed by your registered MBBS doctor or specialist.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
