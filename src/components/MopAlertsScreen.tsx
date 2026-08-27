import React, { useState } from 'react';
import { MOP_ALERTS_DATA, INITIAL_SCHOOLS } from '../data/schoolsData';
import { School, MopAlertItem } from '../types';

interface MopAlertsScreenProps {
  onOpenMopModal: (school: School) => void;
  onSelectSchool: (school: School) => void;
  setActiveTab: (tab: any) => void;
}

export const MopAlertsScreen: React.FC<MopAlertsScreenProps> = ({
  onOpenMopModal,
  onSelectSchool,
  setActiveTab
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [subscribedAlerts, setSubscribedAlerts] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSubscribe = (item: MopAlertItem) => {
    if (subscribedAlerts.includes(item.id)) {
      setSubscribedAlerts(subscribedAlerts.filter((id) => id !== item.id));
      showToast(`Removed alert for ${item.estateName}`);
    } else {
      setSubscribedAlerts([...subscribedAlerts, item.id]);
      showToast(`Subscribed to MOP alert for ${item.estateName}!`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = MOP_ALERTS_DATA.filter((item) => {
    if (selectedPhase === 'All') return true;
    if (selectedPhase === 'Approaching') return item.status.includes('Approaching');
    if (selectedPhase === '2025') return item.status.includes('2025');
    if (selectedPhase === '2026') return item.status.includes('2026');
    return true;
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 border border-slate-800 text-xs font-semibold">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner (High Density Style) */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">notifications_active</span>
            BTO MOP Radar Singapore
          </div>
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
            Upcoming MOP Supply within 1km Priority Zones
          </h1>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Track HDB developments nearing their 5-year Minimum Occupation Period. Be the first to know when units in coveted primary school zones become eligible for open market resale.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-1.5">
          {['All', 'Approaching', '2025', '2026'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedPhase(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedPhase === filter
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter === 'All' ? 'All MOP Pipelines' : filter === 'Approaching' ? 'Under 6 Months' : `MOP in ${filter}`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredItems.length} estates in school zones
        </span>
      </div>

      {/* MOP Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isSubscribed = subscribedAlerts.includes(item.id);
          const schoolObj = INITIAL_SCHOOLS.find((s) => s.id === item.schoolId);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.estMopDate}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.status.includes('Approaching')
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-0.5">
                  {item.estateName}
                </h3>
                <p className="text-xs text-slate-500 mb-3">{item.blockAddress}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target School:</span>
                    <button
                      onClick={() => {
                        if (schoolObj) {
                          onSelectSchool(schoolObj);
                          setActiveTab('hdb-insights');
                        }
                      }}
                      className="font-bold text-indigo-600 hover:underline text-right cursor-pointer"
                    >
                      {item.schoolName}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distance:</span>
                    <span className="font-semibold text-emerald-700">{item.distanceKm} km (Within 1km)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Units:</span>
                    <span className="font-semibold text-slate-800">~{item.unitsCount} flats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Types:</span>
                    <span className="font-medium text-slate-700">{item.flatTypes.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => toggleSubscribe(item)}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSubscribed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSubscribed ? 'check' : 'notifications'}
                  </span>
                  <span>{isSubscribed ? 'Alert Active' : 'Set MOP Alert'}</span>
                </button>

                {schoolObj && (
                  <button
                    onClick={() => {
                      onSelectSchool(schoolObj);
                      setActiveTab('hdb-insights');
                    }}
                    title="View School Insights"
                    className="p-2 rounded-md border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
