import React, { useState } from 'react';
import { School, FlatType } from '../types';
import { LiveTransportCard } from './LiveTransportCard';

interface SchoolInsightsScreenProps {
  school: School;
  schools: School[];
  onSelectSchool: (school: School) => void;
  onOpenMopModal: (school: School) => void;
}

export const SchoolInsightsScreen: React.FC<SchoolInsightsScreenProps> = ({
  school,
  schools,
  onSelectSchool,
  onOpenMopModal
}) => {
  const [showAllTx, setShowAllTx] = useState(false);
  const [selectedTxType, setSelectedTxType] = useState<FlatType>('All');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [showMrtList, setShowMrtList] = useState(false);

  const displayedTransactions = school.transactions.filter((tx) => {
    if (selectedTxType === 'All') return true;
    return tx.flatType === selectedTxType;
  });

  const txToShow = showAllTx ? displayedTransactions : displayedTransactions.slice(0, 3);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* School Switcher Bar */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-500">Selected School:</span>
          <select
            value={school.id}
            onChange={(e) => {
              const matched = schools.find((s) => s.id === e.target.value);
              if (matched) onSelectSchool(matched);
            }}
            className="font-bold text-indigo-600 bg-transparent border-none focus:outline-none cursor-pointer text-xs md:text-sm"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-800">
                {s.name} ({s.planningArea})
              </option>
            ))}
          </select>
        </div>
        <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded hidden sm:inline">
          Live Data Synced
        </span>
      </div>

      {/* Header Section */}
      <section className="flex flex-col md:flex-row gap-5 items-start justify-between">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-xs font-semibold mb-2 border border-emerald-200 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">school</span>
            Primary School Zone ({school.phaseCategory})
          </div>
          <h1 className="font-bold text-2xl md:text-3xl leading-tight text-slate-900 mb-1.5 tracking-tight">
            {school.name}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-indigo-600 text-[18px]">
              location_on
            </span>
            {school.address}
          </p>
        </div>

        {/* Top Right Summary Box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-5 shrink-0 w-full md:w-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Avg PSF (1km)
            </p>
            <p className="font-bold text-xl md:text-2xl text-slate-900 leading-tight">
              ${school.avgPsf1km}{' '}
              <span className="text-xs text-slate-400 font-normal">psf</span>
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +{school.psfChangeQoq}% vs last Q
            </p>
          </div>

          <div className="hidden sm:block w-px bg-slate-200"></div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Transactions (6M)
            </p>
            <p className="font-bold text-xl md:text-2xl text-slate-900 leading-tight">
              {school.transactions6m}
            </p>
            <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[13px] text-indigo-600">home</span>
              HDB Resale
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Left (Chart + Tx Table) vs Right (Sidebar Map + MOP Alert CTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (2 Cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-sm md:text-base text-slate-900">
                  Price Trend within 1km (Last 12 Months)
                </h2>
                <p className="text-xs text-slate-500">
                  Median transacted pricing based on HDB Open Data registry
                </p>
              </div>

              {/* Legend */}
              <div className="flex gap-3 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> 5-Room
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 4-Room
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-dashed border-slate-300"></span> 3-Room
                </span>
              </div>
            </div>

            {/* High fidelity interactive chart */}
            <div className="w-full h-[300px] relative border-b border-l border-slate-200 flex items-end pt-4 pr-4 ml-8">
              {/* Y-axis labels */}
              <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-[11px] font-medium text-slate-400 py-2 text-right w-8">
                <span>$1.2M</span>
                <span>$900k</span>
                <span>$600k</span>
                <span>$300k</span>
                <span>$0</span>
              </div>

              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-[30px] pointer-events-none">
                <div className="w-full border-t border-slate-100"></div>
                <div className="w-full border-t border-slate-100"></div>
                <div className="w-full border-t border-slate-100"></div>
                <div className="w-full border-t border-slate-100"></div>
                <div className="w-full border-t border-slate-100"></div>
              </div>

              {/* SVG Curve Lines matching high density styling */}
              <svg className="w-full h-full absolute inset-0 pt-2 pb-[30px]" preserveAspectRatio="none" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="grad5Room" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="grad4Room" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* 5-Room Fill Area & Line */}
                <path
                  d="M0,210 Q60,195 160,195 T320,135 T480,105 T640,125 T800,70 L800,300 L0,300 Z"
                  fill="url(#grad5Room)"
                />
                <path
                  d="M0,210 Q60,195 160,195 T320,135 T480,105 T640,125 T800,70"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* 4-Room Fill Area & Line */}
                <path
                  d="M0,260 Q60,250 160,235 T320,215 T480,190 T640,180 T800,140 L800,300 L0,300 Z"
                  fill="url(#grad4Room)"
                />
                <path
                  d="M0,260 Q60,250 160,235 T320,215 T480,190 T640,180 T800,140"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* 3-Room Line (Dashed) */}
                <path
                  d="M0,285 Q80,280 180,282 T360,270 T540,268 T700,255 T800,245"
                  fill="none"
                  stroke="#94a3b8"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                />
              </svg>

              {/* Interactive Hover Columns */}
              <div className="absolute inset-0 flex justify-between pt-2 pb-[30px]">
                {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, idx) => (
                  <div
                    key={m}
                    onMouseEnter={() => setHoveredMonth(m)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex-1 h-full relative cursor-pointer group flex flex-col justify-end items-center"
                  >
                    <div className="w-full h-full absolute inset-0 hover:bg-slate-50/60 transition-colors"></div>

                    {/* Tooltip on hover */}
                    {hoveredMonth === m && (
                      <div className="absolute top-4 bg-white border border-slate-200 text-slate-800 text-[11px] p-2.5 rounded-lg shadow-lg z-20 whitespace-nowrap">
                        <p className="font-bold border-b border-slate-100 pb-1 mb-1 text-indigo-600">
                          {m} 2023 Medians
                        </p>
                        <p className="text-indigo-700 font-medium">5-Room: ~${(idx > 3 ? 840 : 620) + idx * 25}k</p>
                        <p className="text-orange-600 font-medium">4-Room: ~${(idx > 3 ? 590 : 420) + idx * 30}k</p>
                        <p className="text-slate-500">3-Room: ~$520k</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 w-full flex justify-between text-[11px] font-medium text-slate-500 px-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </section>

          {/* Recent Transactions List */}
          <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <h2 className="font-bold text-sm md:text-base text-slate-900">
                Recent HDB Resale Transactions (1km Radius)
              </h2>

              {/* Flat Type Filter */}
              <div className="flex gap-1 text-xs font-medium">
                {(['All', '3-Room', '4-Room', '5-Room'] as FlatType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTxType(t)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      selectedTxType === t
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-semibold">Block & Street</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold">Distance</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                  {txToShow.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {tx.blockStreet}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Built {tx.builtYear} • {tx.floorAreaSqm} sqm
                          {tx.storeyRange && ` • Flr ${tx.storeyRange}`}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">{tx.flatType}</td>
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                          <span className="material-symbols-outlined text-[13px]">
                            straighten
                          </span>
                          {tx.distanceKm}km
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-indigo-600">
                        ${tx.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-[11px] text-slate-400">
                        {tx.dateStr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {displayedTransactions.length > 3 && (
              <button
                onClick={() => setShowAllTx(!showAllTx)}
                className="w-full mt-3 py-2 font-semibold text-xs text-indigo-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none cursor-pointer"
              >
                <span>
                  {showAllTx ? 'Show Fewer Transactions' : `View All ${displayedTransactions.length} Transactions`}
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  {showAllTx ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            )}
          </section>

          {/* Live Commute & Transit Hub (LTA DataMall) */}
          <LiveTransportCard
            schoolName={school.name}
            defaultBusStop={school.postalCode ? '83139' : '83139'}
          />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-5">
          {/* Map Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Map Header Preview */}
            <div className="h-44 bg-slate-100 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center filter contrast-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1QwMYf-sqGUfjZD9xfrohVugLVakpmlz1Osdji3dSAqyf4kg3zvErb_iRXQRIrYnfWXCNV9qjRSA5YqY00JjS5STEb8TvJFEZH55ho4cqP3fgdgGDoioeqdZcmyB99HQAKEjEi7qVkmrJ-kwYJmnA6h2vi4qJZAPDNex7NMe8ePMyBVpR7J91duw9GcunDcWKRPr_Lg6QHjZFK3jYsRJDuv7Sz3koJY9rd-QC-TnPduNUT2z52vrQ')`
                }}
              ></div>

              {/* 1km radius visual cue */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-indigo-600 bg-indigo-500/20"></div>
                <span
                  className="absolute material-symbols-outlined text-orange-500 text-[28px] drop-shadow"
                  data-weight="fill"
                >
                  location_on
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-sm text-slate-800 mb-1">
                Proximity Overview
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Properties within the 1km radius carry priority eligibility for Phase 2C primary school registration.
              </p>

              {/* Stats pair */}
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 p-2.5 rounded-lg text-center border border-slate-200">
                  <span className="font-bold text-lg text-slate-800 block">
                    {school.hdbBlocks1kmCount}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold leading-tight block">
                    HDB Blocks (1km)
                  </span>
                </div>

                <div
                  onClick={() => setShowMrtList(!showMrtList)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg text-center border border-slate-200 cursor-pointer transition-colors"
                >
                  <span className="font-bold text-lg text-indigo-600 block">
                    {school.mrtStationsNearbyCount}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold leading-tight block">
                    MRT Stations
                  </span>
                </div>
              </div>

              {/* Nearby MRT drawer */}
              {showMrtList && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Nearby MRT Stations:</p>
                  {school.mrtNearby.map((mrt) => (
                    <div key={mrt.name} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
                      <span className="font-medium text-slate-700">{mrt.name}</span>
                      <span className="text-indigo-600 font-semibold">{mrt.distKm}km</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Call to Action: Track this Area (High Density Dark Accent Panel) */}
          <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-sm text-white mb-1.5">
              Track this Priority Area
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Get notified when new HDB flats within 1km of {school.name} reach their MOP or are listed for sale.
            </p>

            <button
              onClick={() => onOpenMopModal(school)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Set Up MOP Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
