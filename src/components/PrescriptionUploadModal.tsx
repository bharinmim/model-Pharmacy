import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Truck
} from 'lucide-react';
import rxImg from '../assets/images/prescription_desk_stethoscope_1792297165282.jpg';
import { POPULAR_LOCATIONS } from '../data/medicinesData';
import { PrescriptionOrder } from '../types/pharmacy';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrescription: (order: PrescriptionOrder) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrescription
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('01712-345678');
  const [area, setArea] = useState(POPULAR_LOCATIONS[0]);
  const [address, setAddress] = useState('House 42, Road 9/A, Dhanmondi, Dhaka-1209');
  const [notes, setNotes] = useState('Please provide 1 month supply of each medicine written on the prescription.');
  const [isUrgent, setIsUrgent] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>(rxImg);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const [formError, setFormError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!patientName.trim()) {
      setFormError('Please enter patient name');
      return;
    }
    if (!patientPhone.trim()) {
      setFormError('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrderId = `RX-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: PrescriptionOrder = {
        id: newOrderId,
        patientName,
        patientPhone,
        address,
        area,
        notes,
        prescriptionImage: uploadedImage,
        isUrgent,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending Pharmacist Review'
      };
      onSubmitPrescription(order);
      setSubmittedId(newOrderId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Upload Doctor's Prescription
              </h3>
              <p className="text-xs text-emerald-200/90">
                A licensed pharmacist will review and call you within 15 mins to confirm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Prescription Order Received!
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900">{submittedId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-semibold text-slate-900">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Location:</span>
                <span className="text-slate-900">{area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Call:</span>
                <span className="font-bold text-emerald-700">Within 15 minutes</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our registered 'A' grade pharmacist is inspecting your prescription for correct dosages, brand availability, and interactions.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Back to Medicine Catalog
            </button>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Prescription File Dropzone */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5">
                Prescription Image / Document (Photo or PDF)
              </label>
              <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 rounded-xl p-4 text-center transition-colors relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    Click to select file or drag photo here
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Supports JPG, PNG, WebP or PDF (Max 15MB)
                  </span>
                </div>
              </div>

              {/* Prescription Preview Thumbnail */}
              {uploadedImage && (
                <div className="mt-2 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <img 
                      src={uploadedImage} 
                      alt="Prescription preview" 
                      className="w-10 h-10 object-cover rounded border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs">
                        Doctor_Prescription_Document.jpg
                      </span>
                      <span className="text-emerald-700 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Attached & ready for pharmacist
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Ready</span>
                </div>
              )}
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Delivery Area & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  City & Delivery Zone *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Detailed Street / House Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, Dhaka"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Special Instructions for Pharmacist (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please confirm substitute brands if original is out of stock, or mention number of days required"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              ></textarea>
            </div>

            {/* Urgent Express checkbox */}
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Request Priority Express Delivery (Nationwide)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Cold-chain temperature dispatch across Whole Bangladesh
                  </span>
                </div>
              </label>
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting to Pharmacist...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Prescription Order</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
