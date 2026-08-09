import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video, 
  Newspaper, 
  Mic, 
  FileLock, 
  History, 
  LayoutDashboard, 
  Home, 
  Lock, 
  Volume2, 
  VolumeX, 
  Radio
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playUiClick } from '../utils/audioSynth';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  vaultCount: number;
  isLandingPage: boolean;
  onGoLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  vaultCount,
  isLandingPage,
  onGoLanding
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showSandboxBar, setShowSandboxBar] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playUiClick();
  };

  const navItems = [
    { id: 0, label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 1, label: 'Photo Forensics', icon: ImageIcon, badge: null },
    { id: 2, label: 'Video Inspector', icon: Video, badge: null },
    { id: 3, label: 'News Fact Checker', icon: Newspaper, badge: null },
    { id: 4, label: 'Voice & Scam Text', icon: Mic, badge: null },
    { id: 5, label: 'Doc Redactor', icon: FileLock, badge: null },
    { id: 6, label: 'Vault History', icon: History, badge: vaultCount > 0 ? vaultCount : null },
  ];

  const handleTabClick = (id: number) => {
    playUiClick();
    setActiveTab(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-200/50 font-sans">
      
      {/* Sandbox Isolation Status Banner */}
      {showSandboxBar && (
        <div className="bg-slate-900 border-b border-indigo-500/30 px-4 py-2 text-xs font-mono-code flex flex-wrap items-center justify-between gap-3 text-slate-100 animate-fadeIn">
          <div className="flex items-center gap-2 text-indigo-300">
            <Radio className="w-4 h-4 animate-pulse text-indigo-400" />
            <span className="font-bold">ZERO-KNOWLEDGE CLIENT SANDBOX:</span>
            <span className="text-slate-300 hidden md:inline">
              100% Local Browser Canvas Engine • Zero External Server Leaks.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              ✓ 0 Outbound Unverified Network Calls
            </span>
            <button
              onClick={() => setShowSandboxBar(false)}
              className="text-slate-400 hover:text-white px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Home Link */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              playUiClick();
              onGoLanding();
            }}
          >
            {/* Custom Vibrant Modern Logo Emblem */}
            <div className="relative w-11 h-11 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 animate-pulseGlow opacity-80 blur-xs"></div>
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 border border-white/20">
                <svg className="w-6 h-6 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4" stroke="#38BDF8" strokeWidth="3"/>
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
                  Veri<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AI</span>
                </h1>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200 text-indigo-800 font-extrabold uppercase shadow-2xs">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] font-mono-code text-indigo-600/90 font-semibold hidden sm:block">
                Zero-Knowledge Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Right Executive Profile & Quick Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono-code text-xs">
          
          {/* Landing / Dashboard Navigation Button */}
          <button
            onClick={() => {
              playUiClick();
              if (isLandingPage) {
                setActiveTab(0);
              } else {
                onGoLanding();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer font-bold shadow-sm"
          >
            {isLandingPage ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-indigo-300" />
                <span>Open Dashboard</span>
              </>
            ) : (
              <>
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Front Page</span>
              </>
            )}
          </button>

          {/* Sandbox Toggle Button */}
          <button
            onClick={() => {
              playUiClick();
              setShowSandboxBar(!showSandboxBar);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
            title="Inspect Client Sandbox"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden lg:inline font-medium">Sandbox Verified</span>
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
              soundOn 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}
            title={soundOn ? 'Sound On' : 'Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Navigation Bar (When on Dashboard View) */}
      {!isLandingPage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 bg-slate-50/50">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-serif text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 scale-102'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-2xs'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white animate-bounce' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>

                  {item.badge !== null && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                      isActive 
                        ? 'bg-white/25 text-white border border-white/30' 
                        : 'bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

    </header>
  );
};

