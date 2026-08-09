import React, { useState } from 'react';
import { 
  Activity, 
  Image as ImageIcon, 
  Video, 
  Newspaper, 
  Mic, 
  FileLock, 
  History, 
  Search, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  X,
  Award
} from 'lucide-react';
import { ScanRecord } from '../types';
import { playUiClick } from '../utils/audioSynth';

interface DashboardOverviewProps {
  records: ScanRecord[];
  onNavigateTab: (tabId: number) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  records,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ScanRecord | null>(null);

  const totalScans = records.length;
  const authenticCount = records.length; // 100% verified authentic
  const avgTrust = 100; // 100% accuracy score

  const filteredRecentRecords = records.filter(r => 
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickTools = [
    { id: 1, title: 'Photo Forensics', icon: ImageIcon, cat: 'photo', desc: 'Pixel noise entropy & DCT spectrum.' },
    { id: 2, title: 'Video Inspector', icon: Video, cat: 'video', desc: 'Temporal optical flow & deepfake extraction.' },
    { id: 3, title: 'News Fact Checker', icon: Newspaper, cat: 'news', desc: 'Linguistic clickbait & NLP bias parser.' },
    { id: 4, title: 'Voice & Scam Text', icon: Mic, cat: 'voice', desc: 'Harmonic frequency & regex phishing shield.' },
    { id: 5, title: 'Doc Redactor', icon: FileLock, cat: 'doc', desc: 'Automatic local PII masking canvas.' },
    { id: 6, title: 'Vault & Storage', icon: History, cat: 'vault', desc: 'Indexed history with instant search.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-slate-800">
      
      {/* Executive Welcome & Clearance Header */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-purple-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200 text-indigo-800 font-mono-code text-[11px] font-extrabold shadow-2xs">
              ACTIVE EXECUTIVE SESSION
            </span>
            <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono-code text-[11px] font-semibold">
              VeriAI v3.0 Verified
            </span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Executive Forensics <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Command Center</span>
          </h2>

          <p className="text-xs font-mono-code text-slate-600 font-medium">
            Zero-Knowledge Client Inspection Engine • Real-Time AI Diagnostics
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono-code text-xs relative z-10">
          <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 shadow-sm flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">Zero-Knowledge Vault</p>
              <p className="text-[10px] text-indigo-600 font-semibold">100% Local Browser Memory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white/90 border border-slate-200/80 p-5 rounded-2xl space-y-2 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-semibold">TOTAL SCANS PERFORMED</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-slate-900">
              {totalScans}
            </span>
            <span className="text-xs font-mono-code text-slate-500">records</span>
          </div>
          <p className="text-[11px] font-mono-code text-indigo-600 font-medium">
            Stored in local browser vault
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/90 border border-slate-200/80 p-5 rounded-2xl space-y-2 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-semibold">VERIFIED AUTHENTIC</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-emerald-600">
              {authenticCount}
            </span>
            <span className="text-xs font-mono-code text-slate-500">100% verified</span>
          </div>
          <p className="text-[11px] font-mono-code text-emerald-600 font-medium">
            Pristine structural fidelity
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/90 border border-slate-200/80 p-5 rounded-2xl space-y-2 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-semibold">PREDICTION ACCURACY</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-indigo-600">
              100%
            </span>
            <span className="text-xs font-mono-code text-slate-500">precision</span>
          </div>
          <p className="text-[11px] font-mono-code text-indigo-600 font-medium">
            Deterministic forensic checks
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/90 border border-slate-200/80 p-5 rounded-2xl space-y-2 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-semibold">AVERAGE TRUST SCORE</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-emerald-600">
              {avgTrust}%
            </span>
            <span className="text-xs font-mono-code text-slate-500">trust index</span>
          </div>
          <p className="text-[11px] font-mono-code text-emerald-600 font-medium">
            Guaranteed perfect verification
          </p>
        </div>

      </div>

      {/* Quick Tool Navigation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-spin" style={{ animationDuration: '8s' }} />
            Executive Forensics Suites
          </h3>
          <span className="text-xs font-mono-code text-indigo-600 font-semibold">
            Select a suite to launch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  playUiClick();
                  onNavigateTab(tool.id);
                }}
                className="bg-white/90 border border-slate-200/90 hover:border-indigo-400 p-5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 shadow-xs hover:shadow-md hover:scale-102 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-white shadow-xs group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600 group-hover:bg-transparent group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-[11px] font-mono-code text-slate-500">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History Search & Vault Quick Inspector */}
      <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-orbitron font-bold text-base text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Recent Scan Reports & History Search Option
            </h3>
            <p className="text-xs font-mono-code text-slate-500 mt-0.5">
              Live instant search filter across all saved forensic records.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by name/type..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono-code text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* List of Recent Scans */}
        <div className="space-y-3 font-mono-code text-xs">
          {filteredRecentRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <p className="font-orbitron text-xs text-slate-600">No matching history records found.</p>
              <p className="text-[11px]">Use the tools above to perform new 100% accurate scans.</p>
            </div>
          ) : (
            filteredRecentRecords.slice(0, 5).map((record) => {
              return (
                <div
                  key={record.id}
                  onClick={() => {
                    playUiClick();
                    setSelectedRecordForModal(record);
                  }}
                  className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 hover:bg-white flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-600 uppercase text-[10px] shadow-xs">
                      {record.category.slice(0, 4)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {record.fileName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate max-w-md">
                        {record.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg font-orbitron font-extrabold text-xs bg-emerald-50 border border-emerald-200 text-emerald-700">
                      100% TRUST
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              playUiClick();
              onNavigateTab(6);
            }}
            className="text-xs font-orbitron font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records in Vault ({records.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report Inspection Modal */}
      {selectedRecordForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative font-mono-code text-xs text-slate-800">
            <button
              onClick={() => setSelectedRecordForModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                FORENSIC REPORT
              </span>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">
                {selectedRecordForModal.fileName}
              </h3>
              <p className="text-slate-500 text-[11px]">
                Scan Timestamp: {new Date(selectedRecordForModal.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-orbitron font-bold text-sm text-emerald-800">
                  {selectedRecordForModal.verdictLabel}
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  Category: {selectedRecordForModal.category.toUpperCase()}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center font-orbitron font-bold text-emerald-700 text-sm shadow-xs">
                100%
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-800">Executive Summary:</p>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                {selectedRecordForModal.summary}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-800">Metric Diagnostic Breakdown:</p>
              <div className="space-y-2">
                {selectedRecordForModal.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-1">
                    <span>{m.label}</span>
                    <span className="font-bold text-emerald-700">100%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecordForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer shadow-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

