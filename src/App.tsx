import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { PhotoDetector } from './components/PhotoDetector';
import { VideoInspector } from './components/VideoInspector';
import { NewsChecker } from './components/NewsChecker';
import { VoiceAndScamAnalyzer } from './components/VoiceAndScamAnalyzer';
import { DocRedactor } from './components/DocRedactor';
import { VaultHistory } from './components/VaultHistory';
import { ScanRecord } from './types';
import { getVaultRecords, saveVaultRecord } from './utils/storage';
import { ShieldCheck, Lock, HardDrive, WifiOff } from 'lucide-react';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Overview, 1..6 = suites
  const [vaultRecords, setVaultRecords] = useState<ScanRecord[]>([]);

  // Initialize session & local vault storage
  useEffect(() => {
    const records = getVaultRecords();
    setVaultRecords(records);
  }, []);

  const refreshVault = () => {
    setVaultRecords(getVaultRecords());
  };

  const handleSaveRecord = (record: ScanRecord) => {
    const updated = saveVaultRecord(record);
    setVaultRecords(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsLandingPage(false);
        }}
        vaultCount={vaultRecords.length}
        isLandingPage={isLandingPage}
        onGoLanding={() => setIsLandingPage(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Landing Page View */}
        {isLandingPage ? (
          <LandingPage
            onExploreDashboard={() => {
              setIsLandingPage(false);
              setActiveTab(0);
            }}
          />
        ) : (
          /* Dashboard Views */
          <div>
            {activeTab === 0 && (
              <DashboardOverview
                key="overview"
                records={vaultRecords}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 1 && <PhotoDetector key="photo" onSaveRecord={handleSaveRecord} />}
            {activeTab === 2 && <VideoInspector key="video" onSaveRecord={handleSaveRecord} />}
            {activeTab === 3 && <NewsChecker key="news" onSaveRecord={handleSaveRecord} />}
            {activeTab === 4 && <VoiceAndScamAnalyzer key="voice" onSaveRecord={handleSaveRecord} />}
            {activeTab === 5 && <DocRedactor key="doc" onSaveRecord={handleSaveRecord} />}
            {activeTab === 6 && (
              <VaultHistory
                key="vault"
                records={vaultRecords}
                onRefreshRecords={refreshVault}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-6 text-xs font-mono-code text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200/80">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-orbitron font-bold text-slate-800">
                VeriShield AI — Executive Zero-Knowledge Forensics
              </p>
              <p className="text-[11px] text-slate-500">
                100% Client-Side Browser Engine • Zero External Data Leaks
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Lock className="w-3.5 h-3.5" />
              Local Privacy Verified
            </span>
            <span className="flex items-center gap-1 text-indigo-700 font-medium">
              <HardDrive className="w-3.5 h-3.5" />
              Browser Memory Sandbox
            </span>
            <span className="flex items-center gap-1 text-teal-700 font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              Offline Capable
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

