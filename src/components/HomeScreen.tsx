import React, { useState } from 'react';
import { School, ActiveTab } from '../types';

interface HomeScreenProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  schools,
  onSelectSchool,
  setActiveTab
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<School[]>([]);

  const handleInputChange = (val: string) => {
    setSearchInput(val);
    if (val.trim().length > 1) {
      const filtered = schools.filter(
        s =>
          s.name.toLowerCase().includes(val.toLowerCase()) ||
          s.planningArea.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      const match = schools.find(
        s =>
          s.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          s.planningArea.toLowerCase().includes(searchInput.toLowerCase())
      );
      if (match) {
        onSelectSchool(match);
        setActiveTab('hdb-insights');
      } else {
        setActiveTab('find-schools');
      }
    } else {
      setActiveTab('find-schools');
    }
  };

  const handleQuickSchoolClick = (school: School) => {
    onSelectSchool(school);
    setActiveTab('hdb-insights');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-10">
        <div className="w-full md:w-1/2 flex flex-col gap-5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-semibold text-slate-700">Official MOE 1km Priority Analytics</span>
          </div>

          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-slate-900 tracking-tight">
            Find your home,<br className="hidden sm:inline" />
            <span className="text-indigo-600">
              secure their future.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-lg">
            Navigate the Singapore property market with precision. Identify HDB flats within 1km of priority primary schools with live transacted pricing and MOP availability.
          </p>

          {/* Search Bar */}
          <div className="relative w-full mt-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all"
            >
              <span className="material-symbols-outlined text-slate-400 ml-2.5 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search primary school (e.g. Nan Chiau, Nanyang, Tao Nan)..."
                className="w-full bg-transparent border-none text-xs md:text-sm px-3 py-1.5 focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-40 max-h-60 overflow-y-auto custom-scrollbar">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleQuickSchoolClick(s)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2">({s.planningArea})</span>
                    </div>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      Avg ${s.avgPsf1km} psf
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Popular Schools Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 font-medium">Quick Select:</span>
            {schools.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => handleQuickSchoolClick(s)}
                className="text-xs font-medium px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-slate-700 rounded shadow-xs transition-all cursor-pointer"
              >
                {s.name.replace(' Primary School', '').replace(' Primary', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc433_HEbE5A4EA2K19SeC-ZFfW6F4bWhI6ea6okhaQkBrmN1VAKfqkxMsF4RIcBcSLB8GIUn956DLzvz80A7E1JogngP5QpWbng1u6Y74gg2DphAk2VS0VMJ3I5zibnTERt1tUpnR00cOf5ONUBfr4k0LEeJvsKikUZuVHaDQumVyPaaA_a8epgBhKE2Rg4ifSLMBeBTDlst0agHT4KS-cNon4ncxczsflEbj1ygBZryDbvQUQcn_"
            alt="Singaporean family studying proximity map overlooking cityscape"
            className="w-full h-full object-cover rounded-xl object-center transform group-hover:scale-102 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Value Proposition Bento Grid */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">
              Proximity Intelligence Modules
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Instant HDB analytics filtered strictly by school radius boundaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prop 1: Estimate Costs (Span 2) */}
          <div
            onClick={() => setActiveTab('hdb-insights')}
            className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 flex flex-col justify-between transition-all group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-orange-600 text-[22px]" data-weight="fill">
                  calculate
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1.5">
                Estimate HDB costs within 1km
              </h3>
              <p className="text-xs md:text-sm text-slate-600 max-w-md leading-relaxed">
                Instantly view median resale prices, flat size breakdowns, and PSF ranges for HDB clusters within official priority zones.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-indigo-600 font-semibold text-xs">
              <span>Explore pricing analytics</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Prop 2: Live data */}
          <div
            onClick={() => setActiveTab('faq')}
            className="col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 flex flex-col justify-between transition-all group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]" data-weight="fill">
                  database
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1.5">
                Live Data from HDB & SLA
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Real-time resale data from data.gov.sg with SLA OneMap geospatial priority calculations.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-indigo-600 font-semibold text-xs">
              <span>Read data methodology</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Prop 3: Plan for school registration (Span 3) */}
          <div
            onClick={() => setActiveTab('find-schools')}
            className="col-span-1 md:col-span-3 bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 flex flex-col md:flex-row items-center gap-6 transition-all cursor-pointer group"
          >
            <div className="shrink-0 w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-emerald-600 text-[28px]" data-weight="fill">
                school
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg text-slate-800 mb-1">
                Interactive Radius & School Registration Map
              </h3>
              <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Filter schools by ballot phase risk, check 1km and 1–2km boundary rings, and track upcoming MOP maturity pipelines across estates.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-xs shadow-xs transition-colors">
                Launch Map Search
                <span className="material-symbols-outlined text-[16px]">map</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
