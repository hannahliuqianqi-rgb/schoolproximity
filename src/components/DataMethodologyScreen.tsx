import React from 'react';

interface DataMethodologyScreenProps {
  onOpenContact: () => void;
}

export const DataMethodologyScreen: React.FC<DataMethodologyScreenProps> = ({ onOpenContact }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-10 space-y-10">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">
          Data & Methodology
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Understanding how we source and calculate our insights to help you make informed decisions for your family's home in Singapore.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 1km Rule Explanation (Spans 8 cols on desktop) */}
        <div className="md:col-span-8 bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-indigo-600 text-[28px]">
              share_location
            </span>
            <h2 className="font-bold text-xl md:text-2xl text-slate-900">
              The "1km Rule" Explained
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
            <p>
              In Singapore's Primary One (P1) registration exercise, proximity to the school is a crucial factor in priority admission, specifically during Phases 2B and 2C.
            </p>

            {/* Priority Hierarchy Box */}
            <div className="bg-slate-50 p-4 md:p-5 rounded-lg border-l-4 border-indigo-600 border border-slate-200 my-4">
              <strong className="text-indigo-600 text-xs md:text-sm block mb-2 font-bold uppercase tracking-wider">
                Priority Hierarchy:
              </strong>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-xs md:text-sm">
                <li>Singapore Citizens living <strong className="text-slate-900 font-semibold">within 1km</strong> of the school.</li>
                <li>Singapore Citizens living between 1km and 2km.</li>
                <li>Singapore Citizens living outside 2km.</li>
                <li>Permanent Residents (following the same distance tiers).</li>
              </ol>
            </div>

            <p className="text-slate-600">
              Our platform calculates this distance using the official Home-School Distance (HSD) methodology defined by the Ministry of Education (MOE) and the Singapore Land Authority (SLA), ensuring precision for your property search.
            </p>

            {/* Precision Radius Mapping Visual */}
            <div className="relative h-44 rounded-lg overflow-hidden mt-6 bg-slate-50 flex items-center justify-center border border-slate-200">
              <div className="absolute inset-0 border-2 border-dashed border-indigo-200 opacity-60 rounded-full scale-150 transform -translate-y-1/4"></div>
              <div className="absolute w-56 h-56 border border-indigo-300 opacity-40 rounded-full"></div>
              <div className="z-10 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-indigo-600 text-[36px] mb-1">
                  home_pin
                </span>
                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-white shadow-xs px-3 py-1 rounded-md border border-slate-200">
                  Precision Radius Mapping
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources (Spans 4 cols on desktop) */}
        <div className="md:col-span-4 flex flex-col gap-5">
          {/* Data Source 1: HDB Open Data */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-xs flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]">
                  database
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  HDB Open Data
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                We leverage official data from data.gov.sg for comprehensive HDB block information, historical resale prices, and MOP (Minimum Occupation Period) estimates.
              </p>
            </div>
            <div>
              <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded text-[11px] font-semibold">
                Updated Monthly
              </span>
            </div>
          </div>

          {/* Data Source 2: URA Realis */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-xs flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-emerald-600 text-[22px]">
                  analytics
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  URA Realis
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Private property transaction data and trends are sourced directly from the Urban Redevelopment Authority's REALIS system for authoritative accuracy.
              </p>
            </div>
            <div>
              <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-semibold">
                Live Sync
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-5 pt-2">
        <h2 className="font-bold text-xl md:text-2xl text-slate-900 text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 mb-1.5">
              How accurate is the 1km radius?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We use coordinates from OneMap (SLA) to calculate the straight-line distance from the school's boundary to the property's postal code, matching official MOE guidelines.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 mb-1.5">
              Are all primary schools included?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, our database includes all MOE primary schools in Singapore. We also track schools undergoing temporary relocation or rebuilding.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 mb-1.5">
              How often are property prices updated?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              HDB resale data is synced monthly when officially released. Private property data is updated semi-weekly based on URA transaction lodgments.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 mb-1.5">
              What does 'MOP Alert' mean?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our system tracks newer HDB flats approaching their 5-year Minimum Occupation Period, giving you early visibility into potential upcoming resale supply in your desired school zones.
            </p>
          </div>
        </div>
      </section>

      {/* About SchoolProximity SG & Support Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-xs">
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-slate-900 mb-2">
            About SchoolProximity SG
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
            We are dedicated to helping parents navigate the high-stakes Singapore property market with precision. By combining official data with an intuitive interface, we aim to reduce the stress of finding a home near your preferred primary school.
          </p>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Key Partners & Sources
            </span>
            <span className="font-semibold text-xs md:text-sm text-indigo-600">
              OneMap API, HDB Open Data, data.gov.sg, URA Realis
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start md:items-end md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-8">
          <h3 className="font-bold text-base text-slate-900 mb-1.5">
            Need Assistance?
          </h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm">
            Our dedicated support team is here to help with your data inquiries or technical questions.
          </p>
          <button
            onClick={onOpenContact}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Contact Support</span>
          </button>
        </div>
      </section>
    </div>
  );
};
