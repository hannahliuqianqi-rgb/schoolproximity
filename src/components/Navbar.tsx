import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, School } from '../types';
import { performDynamicSearch } from '../services/schoolSearch';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
  onOpenSignIn: () => void;
  user: { name: string; email: string } | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  schools,
  selectedSchool,
  onSelectSchool,
  onOpenSignIn,
  user,
  onSignOut
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localMatches, setLocalMatches] = useState<School[]>([]);
  const [oneMapMatches, setOneMapMatches] = useState<School[]>([]);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setLocalMatches([]);
      setOneMapMatches([]);
      setIsSearchingOneMap(false);
      return;
    }

    const filtered = schools.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planningArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.postalCode.includes(searchQuery.trim())
    );
    setLocalMatches(filtered);

    setIsSearchingOneMap(true);
    const timer = setTimeout(async () => {
      try {
        const { oneMapMatches: omResults } = await performDynamicSearch(searchQuery, schools);
        const uniqueOneMap = omResults.filter(
          om => !schools.some(ls => ls.name.toLowerCase() === om.name.toLowerCase())
        );
        setOneMapMatches(uniqueOneMap);
      } catch {
        setOneMapMatches([]);
      } finally {
        setIsSearchingOneMap(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, schools]);

  const handleSelectSchool = (school: School) => {
    onSelectSchool(school);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setActiveTab('hdb-insights');
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50 w-full shrink-0">
      <div className="flex justify-between items-center px-4 md:px-6 py-2.5 w-full max-w-[1400px] mx-auto min-h-[58px]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <span className="material-symbols-outlined text-[18px]" data-weight="fill">school</span>
            </div>
            <span className="font-bold text-base md:text-lg text-slate-800 tracking-tight">
              SchoolProximity<span className="text-indigo-600">SG</span>
            </span>
          </button>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded uppercase tracking-wider border border-slate-200">
            v2.4.0
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => setActiveTab('find-schools')}
            className={`font-semibold text-xs py-1 transition-all focus:outline-none cursor-pointer ${
              activeTab === 'find-schools'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Schools
          </button>
          <button
            onClick={() => setActiveTab('hdb-insights')}
            className={`font-semibold text-xs py-1 transition-all focus:outline-none cursor-pointer ${
              activeTab === 'hdb-insights'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HDB Insights
          </button>
          <button
            onClick={() => setActiveTab('mop-alerts')}
            className={`font-semibold text-xs py-1 transition-all focus:outline-none cursor-pointer ${
              activeTab === 'mop-alerts'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MOP Alerts
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`font-semibold text-xs py-1 transition-all focus:outline-none cursor-pointer ${
              activeTab === 'faq'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Right Search & Action */}
        <div className="flex items-center gap-3">
          {/* Live Status indicator */}
          <div className="hidden lg:flex items-center gap-2 text-slate-500 text-xs border-r border-slate-200 pr-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-medium text-slate-600">Live Market Data</span>
          </div>

          {/* Quick Search on Map/Insights */}
          {(activeTab === 'find-schools' || activeTab === 'hdb-insights') && (
            <div ref={searchRef} className="relative hidden md:block">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search school or area..."
                  className="pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-slate-800 w-56 placeholder:text-slate-400"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && (localMatches.length > 0 || oneMapMatches.length > 0) && (
                <div className="absolute right-0 top-full mt-1.5 w-84 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
                  {localMatches.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <span>MOE Primary Schools ({localMatches.length})</span>
                        <span className="text-[9px] text-indigo-600 font-semibold">Verified</span>
                      </div>
                      {localMatches.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectSchool(s)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                              {s.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{s.planningArea} • {s.postalCode}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded shrink-0">
                            Avg ${s.avgPsf1km}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {oneMapMatches.length > 0 && (
                    <div className={localMatches.length > 0 ? 'mt-1 pt-1 border-t border-slate-100' : ''}>
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <span>OneMap Live Address Search ({oneMapMatches.length})</span>
                        <span className="text-[9px] text-emerald-600 font-semibold">OneMap</span>
                      </div>
                      {oneMapMatches.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectSchool(s)}
                          className="w-full px-3 py-2 text-left hover:bg-indigo-50/50 flex items-center justify-between group transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                              {s.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{s.address}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded shrink-0">
                            1km Priority
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 py-1 px-3 rounded-md border border-slate-200">
              <span className="material-symbols-outlined text-indigo-600 text-[16px]" data-weight="fill">
                account_circle
              </span>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                {user.name}
              </span>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-600 ml-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 p-1.5 rounded-md bg-slate-100 border border-slate-200 hover:bg-slate-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-1.5 font-semibold text-xs ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('find-schools');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-1.5 font-semibold text-xs ${
              activeTab === 'find-schools' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            Find Schools (Map)
          </button>
          <button
            onClick={() => {
              setActiveTab('hdb-insights');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-1.5 font-semibold text-xs ${
              activeTab === 'hdb-insights' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            HDB Insights ({selectedSchool.name.split(' ')[0]})
          </button>
          <button
            onClick={() => {
              setActiveTab('mop-alerts');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-1.5 font-semibold text-xs ${
              activeTab === 'mop-alerts' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            MOP Alerts
          </button>
          <button
            onClick={() => {
              setActiveTab('faq');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-1.5 font-semibold text-xs ${
              activeTab === 'faq' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            Data & Methodology (FAQ)
          </button>
        </div>
      )}
    </header>
  );
};
