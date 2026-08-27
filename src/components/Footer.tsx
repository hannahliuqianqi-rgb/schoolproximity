import React from 'react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenContact }) => {
  return (
    <footer className="bg-white border-t border-slate-200 w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-6 md:py-8 w-full max-w-[1400px] mx-auto gap-4 md:gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[14px]" data-weight="fill">
                school
              </span>
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">
              SchoolProximity <span className="text-indigo-600">SG</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} SchoolProximity SG. Data sourced from HDB Open Data, OneMap SLA, and URA Realis.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-xs font-semibold text-slate-600">
          <button
            onClick={() => {
              setActiveTab('faq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
          >
            About the 1km Rule
          </button>
          <button
            onClick={() => {
              setActiveTab('faq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
          >
            Data Methodology
          </button>
          <button
            onClick={() => {
              setActiveTab('faq');
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenContact}
            className="text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none cursor-pointer"
          >
            Contact Support
          </button>
        </nav>
      </div>
    </footer>
  );
};
