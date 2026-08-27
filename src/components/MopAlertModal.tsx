import React, { useState } from 'react';
import { School, FlatType } from '../types';

interface MopAlertModalProps {
  isOpen: boolean;
  school: School | null;
  onClose: () => void;
  onSuccess: (alertSummary: string) => void;
}

export const MopAlertModal: React.FC<MopAlertModalProps> = ({
  isOpen,
  school,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetFlatType, setTargetFlatType] = useState<FlatType>('4-Room');
  const [maxBudget, setMaxBudget] = useState<number>(850000);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !school) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess(`MOP alert set for ${school.name} (${targetFlatType}, max $${(maxBudget / 1000).toLocaleString()}k)! Notification sent to ${email || 'your account'}.`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]" data-weight="fill">
              notifications_active
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Set Up MOP & Resale Alert
            </h3>
            <p className="text-xs text-slate-500">{school.name} (1km Zone)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Receive an automated SMS/email instant notification whenever a flat within 1km reaches its 5-year MOP or gets newly transacted below your target ceiling.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Flat Size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['3-Room', '4-Room', '5-Room', 'Executive'] as FlatType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTargetFlatType(type)}
                  className={`py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    targetFlatType === type
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Max Target Budget</span>
              <span className="text-indigo-600 font-bold">${(maxBudget / 1000).toLocaleString()}k</span>
            </div>
            <input
              type="range"
              min="500000"
              max="1500000"
              step="25000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. parent@family.sg"
              className="w-full px-3 py-2 rounded-md text-xs bg-white text-slate-800 border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number (For WhatsApp/SMS Alerts)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+65 9123 4567"
              className="w-full px-3 py-2 rounded-md text-xs bg-white text-slate-800 border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <span>Registering Alert...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">add_alert</span>
                  <span>Activate Free MOP Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
