import React, { useState, useMemo, useEffect, useRef } from 'react';
import { School, FlatType, SchoolPhase } from '../types';
import { performDynamicSearch } from '../services/schoolSearch';

interface MapSearchScreenProps {
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
  onViewSchoolInsights: (school: School) => void;
}

export const MapSearchScreen: React.FC<MapSearchScreenProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  onViewSchoolInsights
}) => {
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType>('4-Room');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [phaseFilter, setPhaseFilter] = useState<SchoolPhase | 'All'>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1200000);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(5.0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapLayer, setMapLayer] = useState<'standard' | 'mrt' | 'density'>('standard');
  const [activeBlockTooltip, setActiveBlockTooltip] = useState<string | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState<boolean>(false);

  // Dynamic Search in Map Sidebar
  const [searchQuery, setSearchQuery] = useState('');
  const [oneMapResults, setOneMapResults] = useState<School[]>([]);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mapSearchRef.current && !mapSearchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setOneMapResults([]);
      setIsSearchingOneMap(false);
      return;
    }

    setIsSearchingOneMap(true);
    const timer = setTimeout(async () => {
      try {
        const { oneMapMatches } = await performDynamicSearch(searchQuery, schools);
        const uniqueOneMap = oneMapMatches.filter(
          om => !schools.some(ls => ls.name.toLowerCase() === om.name.toLowerCase())
        );
        setOneMapResults(uniqueOneMap);
      } catch {
        setOneMapResults([]);
      } finally {
        setIsSearchingOneMap(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, schools]);

  // Filter schools based on selected filters and optional search query
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          school.name.toLowerCase().includes(q) ||
          school.planningArea.toLowerCase().includes(q) ||
          school.address.toLowerCase().includes(q) ||
          school.postalCode.includes(searchQuery.trim());
        if (!matchesSearch) return false;
      }
      if (phaseFilter !== 'All' && school.phaseCategory !== phaseFilter) return false;
      if (school.avg4RoomPrice > maxPriceFilter) return false;
      if (school.distanceToUser && school.distanceToUser > maxDistanceFilter) return false;
      return true;
    });
  }, [schools, searchQuery, phaseFilter, maxPriceFilter, maxDistanceFilter]);

  const flatTypes: FlatType[] = ['4-Room', '3-Room', '5-Room', 'Executive'];

  return (
    <div className="w-full h-[calc(100vh-58px)] flex flex-col md:flex-row relative overflow-hidden bg-[#F1F5F9]">
      {/* Left Sidebar: Filters & School List (Matches High Density theme sidebar) */}
      <aside className={`w-full md:w-[380px] h-full bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col z-30 absolute md:relative transform transition-transform duration-200 ${
        mobileListOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
      } shadow-xl md:shadow-none shrink-0`}>
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 shrink-0 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[20px]">filter_list</span>
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">School Filters</h2>
            </div>
            <button
              onClick={() => setMobileListOpen(false)}
              className="md:hidden text-slate-400 p-1 rounded hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Live Dynamic Search Bar */}
          <div className="relative" ref={mapSearchRef}>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowSearchResults(true);
                }}
                placeholder="Search any school, street, or postal..."
                className="w-full pl-8 pr-7 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {isSearchingOneMap ? (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              ) : null}
            </div>

            {/* Dynamic OneMap Live Dropdown */}
            {showSearchResults && oneMapResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1.5 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                  <span>OneMap Address Search</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">Live OneMap</span>
                </div>
                {oneMapResults.map((omSchool) => (
                  <button
                    key={omSchool.id}
                    onClick={() => {
                      onSelectSchool(omSchool);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center justify-between group transition-colors border-b border-slate-800/60 last:border-none cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[13px] text-emerald-400">location_on</span>
                        <p className="font-semibold text-xs text-white group-hover:text-indigo-400 truncate">
                          {omSchool.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate ml-4.5">{omSchool.address}</p>
                    </div>
                    <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded font-semibold shrink-0">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Flat Configuration Buttons */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
              Flat Configuration
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {flatTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFlatType(type)}
                  className={`px-2 py-1.5 rounded font-semibold text-center transition-colors cursor-pointer ${
                    selectedFlatType === type
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Counter and Filter Toggle Button */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} matched
            </span>
            <button
              onClick={() => setFilterModalOpen(!filterModalOpen)}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Parameters</span>
              {(phaseFilter !== 'All' || maxPriceFilter < 1200000 || maxDistanceFilter < 5) && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Parameters Drawer in sidebar */}
          {filterModalOpen && (
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 shadow-md space-y-2.5 animate-in fade-in duration-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter Settings</span>
                <button
                  onClick={() => {
                    setPhaseFilter('All');
                    setMaxPriceFilter(1200000);
                    setMaxDistanceFilter(5);
                  }}
                  className="text-[10px] text-indigo-400 hover:underline font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Phase Category */}
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Registration Phase</label>
                <select
                  value={phaseFilter}
                  onChange={(e) => setPhaseFilter(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Phases</option>
                  <option value="Phase 2A">Phase 2A (Alumni & Staff)</option>
                  <option value="Phase 2B">Phase 2B (Grassroots & Religious)</option>
                  <option value="Phase 2C">Phase 2C (Open Citizen/PR)</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Max 4-Room Price:</span>
                  <span className="font-semibold text-indigo-400">${(maxPriceFilter / 1000).toLocaleString()}k</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="1200000"
                  step="50000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Max Radius:</span>
                  <span className="font-semibold text-indigo-400">{maxDistanceFilter} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={maxDistanceFilter}
                  onChange={(e) => setMaxDistanceFilter(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* School List Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-slate-900">
          {filteredSchools.map((school) => {
            const isSelected = school.id === selectedSchool.id;
            return (
              <div
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className={`rounded-lg p-3 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-xs leading-snug ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}>
                    {school.name}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ml-2 ${
                    school.phaseCategory === 'Phase 2A'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  }`}>
                    {school.phaseCategory}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2">
                  {school.planningArea} • {school.distanceToUser ? `${school.distanceToUser}km away` : 'Priority Zone'}
                </p>

                <div className="flex items-center justify-between border-t border-slate-700/60 pt-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Avg. {selectedFlatType}
                    </span>
                    <span className="font-bold text-white text-xs">
                      ${(selectedFlatType === '3-Room'
                        ? school.avg4RoomPrice * 0.65
                        : selectedFlatType === '5-Room'
                        ? school.avg4RoomPrice * 1.35
                        : school.avg4RoomPrice
                      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      YOY Trend
                    </span>
                    <span className={`font-semibold flex items-center justify-end gap-0.5 text-xs ${
                      school.trendType === 'Increasing' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      <span className="material-symbols-outlined text-[13px]">
                        {school.trendType === 'Increasing' ? 'trending_up' : 'trending_flat'}
                      </span>
                      +{school.priceTrendYoy}%
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSchoolInsights(school);
                    }}
                    className="w-full mt-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>View HDB Analytics</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Alert */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <span className="material-symbols-outlined text-[16px]">notifications</span>
            </div>
            <div className="text-[11px] leading-tight">
              <p className="text-white font-medium">1km MOP Tracking Active</p>
              <p className="text-slate-400">Monitoring 42 pipeline clusters</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Map Area */}
      <section className="flex-1 relative bg-slate-200 overflow-hidden">
        {/* Map Canvas Background */}
        <div
          className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-300 filter contrast-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvjFJ95F-KQ6DSCdzw069fAZ7GrcQeBTdaftR1zLVlbmVH72bOn_Dn2ZeEqLhe4rX4mmb4NTPRFeel6G3jCrxvPBLYFpXprqQO29uAuIlcHNQnQdv0Hd78ycvanQqi6agbTNd6iiwsMVS4EhjhUPAV0CMnZqXEWWOCGQfQRjHT3z98AkaPTDVq5wwqkAJzwVUQXc5qbHUegEUXBBbgy0nMDZ7L6hiLnT1yPZZttoDBZsVN4J6EExHg')`,
            transform: `scale(${zoomLevel})`
          }}
        ></div>

        {/* Crisp High Density Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>

        {/* Map Overlay Canvas */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Dynamic 1km Radius Zone around selected school */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-indigo-600 bg-indigo-500/15 pointer-events-auto transition-all duration-300 flex items-center justify-center"
            style={{
              left: `${selectedSchool.coordinates.mapX}%`,
              top: `${selectedSchool.coordinates.mapY}%`,
              width: `${240 * zoomLevel}px`,
              height: `${240 * zoomLevel}px`
            }}
          >
            <div className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-200">
              1km Priority Zone
            </div>
          </div>

          {/* School Pins */}
          {schools.map((school) => {
            const isSelected = school.id === selectedSchool.id;
            return (
              <div
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                style={{
                  left: `${school.coordinates.mapX}%`,
                  top: `${school.coordinates.mapY}%`
                }}
              >
                <div className={`rounded-full flex items-center justify-center shadow-md border-2 transition-transform ${
                  isSelected
                    ? 'w-8 h-8 bg-indigo-600 border-white scale-110 ring-2 ring-indigo-400'
                    : 'w-6 h-6 bg-slate-800 border-white hover:scale-110'
                }`}>
                  <span className="material-symbols-outlined text-white text-[14px]" data-weight="fill">
                    school
                  </span>
                </div>

                {/* High Density school label */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm pointer-events-none border transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-700 border-indigo-300 opacity-100'
                    : 'bg-white text-slate-700 border-slate-200 opacity-0 group-hover:opacity-100'
                }`}>
                  {school.name}
                </div>
              </div>
            );
          })}

          {/* Sample HDB Block Pins in 1km radius of selected school */}
          {selectedSchool.transactions.map((tx, idx) => {
            const offsetX = (idx === 0 ? -6 : idx === 1 ? 5 : idx === 2 ? -4 : 4) * zoomLevel;
            const offsetY = (idx === 0 ? -5 : idx === 1 ? 4 : idx === 2 ? 6 : -4) * zoomLevel;
            const isOrange = idx % 2 === 0;

            return (
              <div
                key={tx.id}
                onClick={() => setActiveBlockTooltip(activeBlockTooltip === tx.id ? null : tx.id)}
                className="absolute pointer-events-auto cursor-pointer group z-15"
                style={{
                  left: `${selectedSchool.coordinates.mapX + offsetX}%`,
                  top: `${selectedSchool.coordinates.mapY + offsetY}%`
                }}
              >
                <div className="relative">
                  <div className={`w-3.5 h-3.5 rounded-full border border-white shadow-sm transition-transform group-hover:scale-125 ${
                    isOrange ? 'bg-orange-500' : 'bg-indigo-600'
                  }`}></div>

                  {/* Tooltip on hover */}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-white border border-slate-200 text-slate-900 text-xs px-2.5 py-1 rounded shadow-md transition-all ${
                    activeBlockTooltip === tx.id ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <p className="font-bold text-[11px] text-slate-800">{tx.blockStreet}</p>
                    <p className="text-[10px] text-slate-500">
                      {tx.flatType} • <span className="font-semibold text-indigo-600">${(tx.price / 1000).toLocaleString()}k</span> • {tx.distanceKm}km
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Top Left Focus Banner */}
          <div className="absolute top-3 left-3 pointer-events-auto hidden md:flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm text-slate-800">
            <div className="w-6 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-[15px]" data-weight="fill">pin_drop</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Selected Focus</p>
              <p className="font-bold text-xs text-slate-800 leading-tight">{selectedSchool.name}</p>
            </div>
            <button
              onClick={() => onViewSchoolInsights(selectedSchool)}
              className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs transition-colors cursor-pointer"
            >
              Analytics
            </button>
          </div>

          {/* Floating Controls (Top Right) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 pointer-events-auto">
            <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-slate-200">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                className="p-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-200 cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
                className="p-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-200 cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  onSelectSchool(schools[0]);
                }}
                className="p-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Center Map"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            <button
              onClick={() => setMapLayer(mapLayer === 'standard' ? 'mrt' : 'standard')}
              className={`bg-white p-2 rounded-lg shadow-sm text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center border border-slate-200 cursor-pointer ${
                mapLayer === 'mrt' ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500' : ''
              }`}
              title="Toggle Transit Overlay"
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
            </button>
          </div>

          {/* Floating High Density Legend (Bottom Right) */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-sm pointer-events-auto border border-slate-200 text-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Legend
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-slate-700">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <span>School</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                <span>HDB Resale</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="w-3.5 h-3.5 rounded-full border border-dashed border-indigo-600 bg-indigo-500/20"></div>
              <span>1km Priority Radius</span>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar for toggling school list drawer */}
        <div className="md:hidden absolute bottom-3 left-3 right-3 z-40">
          <button
            onClick={() => setMobileListOpen(true)}
            className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg shadow-md font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">list</span>
            <span>View {filteredSchools.length} Filtered Schools</span>
          </button>
        </div>
      </section>
    </div>
  );
};
