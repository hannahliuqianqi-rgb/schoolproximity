/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, School } from './types';
import { INITIAL_SCHOOLS } from './data/schoolsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { MapSearchScreen } from './components/MapSearchScreen';
import { SchoolInsightsScreen } from './components/SchoolInsightsScreen';
import { DataMethodologyScreen } from './components/DataMethodologyScreen';
import { MopAlertsScreen } from './components/MopAlertsScreen';
import { MopAlertModal } from './components/MopAlertModal';
import { SignInModal } from './components/SignInModal';
import { ContactSupportModal } from './components/ContactSupportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [selectedSchool, setSelectedSchool] = useState<School>(INITIAL_SCHOOLS[0]);

  // Modals state
  const [mopModalOpen, setMopModalOpen] = useState(false);
  const [mopModalSchool, setMopModalSchool] = useState<School | null>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectOrAddSchool = (school: School) => {
    setSchools((prev) => {
      const exists = prev.some((s) => s.id === school.id || s.name.toLowerCase() === school.name.toLowerCase());
      if (exists) return prev;
      return [school, ...prev];
    });
    setSelectedSchool(school);
  };

  const handleOpenMopModal = (school: School) => {
    setMopModalSchool(school);
    setMopModalOpen(true);
  };

  const handleViewSchoolInsights = (school: School) => {
    handleSelectOrAddSchool(school);
    setActiveTab('hdb-insights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2.5 border border-slate-800 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schools={schools}
        selectedSchool={selectedSchool}
        onSelectSchool={handleSelectOrAddSchool}
        onOpenSignIn={() => setSignInModalOpen(true)}
        user={user}
        onSignOut={() => {
          setUser(null);
          showToast('Signed out successfully');
        }}
      />

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'home' && (
          <HomeScreen
            schools={schools}
            onSelectSchool={handleSelectOrAddSchool}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'find-schools' && (
          <MapSearchScreen
            schools={schools}
            selectedSchool={selectedSchool}
            onSelectSchool={handleSelectOrAddSchool}
            onViewSchoolInsights={handleViewSchoolInsights}
          />
        )}

        {activeTab === 'hdb-insights' && (
          <SchoolInsightsScreen
            school={selectedSchool}
            schools={schools}
            onSelectSchool={handleSelectOrAddSchool}
            onOpenMopModal={handleOpenMopModal}
          />
        )}

        {activeTab === 'mop-alerts' && (
          <MopAlertsScreen
            onOpenMopModal={handleOpenMopModal}
            onSelectSchool={setSelectedSchool}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'faq' && (
          <DataMethodologyScreen
            onOpenContact={() => setContactModalOpen(true)}
          />
        )}
      </main>

      {/* Footer (omitted on map search to maximize screen real estate, visible on all other pages) */}
      {activeTab !== 'find-schools' && (
        <Footer
          setActiveTab={setActiveTab}
          onOpenContact={() => setContactModalOpen(true)}
        />
      )}

      {/* Modals */}
      <MopAlertModal
        isOpen={mopModalOpen}
        school={mopModalSchool}
        onClose={() => setMopModalOpen(false)}
        onSuccess={(summary) => showToast(summary)}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSignInSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />

      <ContactSupportModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}

