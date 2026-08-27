import React, { useState, useEffect, useRef } from 'react';
import { School, ActiveTab } from '../types';
import { performDynamicSearch } from '../services/schoolSearch';
import { DisqusComments } from './DisqusComments';

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
  const [localSuggestions, setLocalSuggestions] = useState<School[]>([]);
  const [oneMapSuggestions, setOneMapSuggestions] = useState<School[]>([]);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchInput.trim().length < 2) {
      setLocalSuggestions([]);
      setOneMapSuggestions([]);
      setIsSearchingOneMap(false);
      setShowDropdown(false);
      return;
    }

    // 1. Instant local match
    const filtered = schools.filter(
      s =>
        s.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        s.planningArea.toLowerCase().includes(searchInput.toLowerCase()) ||
        s.address.toLowerCase().includes(searchInput.toLowerCase()) ||
        s.postalCode.includes(searchInput.trim())
    );
    setLocalSuggestions(filtered);
    setShowDropdown(true);

    // 2. Debounced OneMap API query
    setIsSearchingOneMap(true);
    const timer = setTimeout(async () => {
      try {
        const { oneMapMatches } = await performDynamicSearch(searchInput, schools);
        // Exclude ones that already exist in local matches by name
        const uniqueOneMap = oneMapMatches.filter(
          om => !schools.some(ls => ls.name.toLowerCase() === om.name.toLowerCase())
        );
        setOneMapSuggestions(uniqueOneMap);
      } catch {
        setOneMapSuggestions([]);
      } finally {
        setIsSearchingOneMap(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, schools]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      const match = localSuggestions[0] || oneMapSuggestions[0];
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

  const handleSelectSchool = (school: School) => {
    onSelectSchool(school);
    setShowDropdown(false);
    setActiveTab('hdb-insights');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-10">
        <div className="w-full md:w-1/2 flex flex-col gap-5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700">Live OneMap Geocoding & MOE 1km Priority</span>
          </div>

          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-slate-900 tracking-tight">
            Find your home,<br className="hidden sm:inline" />
            <span className="text-indigo-600">
              secure their future.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-lg">
            Search <strong>any Singapore primary school</strong>, postal code, or address. Live dynamic geocoding powered by OneMap with instant 1km/2km HDB transacted prices and MOP pipeline analytics.
          </p>

          {/* Search Bar */}
          <div className="relative w-full mt-1" ref={searchContainerRef}>
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
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => {
                  if (searchInput.trim().length >= 2) setShowDropdown(true);
                }}
                placeholder="Type any primary school, postal code or street (e.g. Nan Chiau, Ai Tong, 268097)..."
                className="w-full bg-transparent border-none text-xs md:text-sm px-3 py-1.5 focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
              {isSearchingOneMap && (
                <div className="w-4 h-4 mr-2 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
              )}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Suggestions dropdown */}
            {showDropdown && (localSuggestions.length > 0 || oneMapSuggestions.length > 0) && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {/* Local MOE School Matches */}
                {localSuggestions.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span>Primary School Directory ({localSuggestions.length})</span>
                      <span className="text-[9px] text-indigo-600 font-semibold">MOE Verified</span>
                    </div>
                    {localSuggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSchool(s)}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-indigo-600">school</span>
                            <span className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                              {s.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate ml-5">
                            {s.address} • {s.planningArea}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold shrink-0">
                          Avg ${s.avgPsf1km} psf
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* OneMap Dynamic Live Results */}
                {oneMapSuggestions.length > 0 && (
                  <div className={localSuggestions.length > 0 ? 'mt-2 pt-1 border-t border-slate-100' : ''}>
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span>OneMap Live Address Results ({oneMapSuggestions.length})</span>
                      <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        OneMap API
                      </span>
                    </div>
                    {oneMapSuggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSchool(s)}
                        className="w-full px-4 py-2 text-left hover:bg-indigo-50/50 flex items-center justify-between group transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-emerald-600">location_on</span>
                            <span className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                              {s.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate ml-5">
                            {s.address} ({s.postalCode})
                          </span>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold shrink-0">
                          1km Priority
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Popular Schools Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 font-medium">Quick Select:</span>
            {schools.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSchool(s)}
                className="text-xs font-medium px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-slate-700 rounded shadow-xs transition-all cursor-pointer"
              >
                {s.name.replace(' Primary School', '').replace(' Primary', '').replace(' School', '')}
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

        {/* Community & Parent Comments Forum */}
        <div className="mt-8">
          <DisqusComments
            identifier="schoolproximity-home"
            title="SchoolProximity Singapore - Parents & Housing Forum"
            description="Discuss primary school registration strategies, MOE 1km boundary rules, balloting risks, and HDB resale experiences with Singapore parents and property seekers."
          />
        </div>
      </section>
    </div>
  );
};
