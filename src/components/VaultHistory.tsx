import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ScanRecord } from '../types';
import { clearVaultStorage, deleteVaultRecord } from '../utils/storage';
import { playUiClick } from '../utils/audioSynth';

interface VaultHistoryProps {
  records: ScanRecord[];
  onRefreshRecords: () => void;
}

export const VaultHistory: React.FC<VaultHistoryProps> = ({ records, onRefreshRecords }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRecordModal, setActiveRecordModal] = useState<ScanRecord | null>(null);

  const filteredRecords = records.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = 
      r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playUiClick();
    deleteVaultRecord(id);
    onRefreshRecords();
  };

  const handleClearAll = () => {
    playUiClick();
    if (window.confirm('Are you sure you want to clear all forensic records from local storage?')) {
      clearVaultStorage();
      onRefreshRecords();
    }
  };

  const exportVaultJSON = () => {
    playUiClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VERISHIELD_VAULT_EXPORT_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-slate-200/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-white shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600">
                <History className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              Zero-Knowledge Encrypted Vault & Report Search
            </h2>
          </div>
          <p className="text-xs font-mono-code text-slate-600 mt-1">
            Persistent local browser storage for forensic verification records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportVaultJSON}
            disabled={records.length === 0}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-mono-code text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Vault</span>
          </button>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-mono-code text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Storage</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & History Search Options Bar */}
      <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono-code text-xs shadow-sm shadow-slate-200/50">
        
        {/* Search Bar Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by name, category, or summary..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'photo', 'video', 'news', 'voice', 'scam_text', 'doc'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUiClick();
                setSelectedCategory(cat);
                setSearchQuery(''); // Reset search when category filter changes
              }}
              className={`px-3 py-1.5 rounded-xl uppercase text-[11px] font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Vault Records List */}
      <div className="space-y-3 font-mono-code text-xs">
        {filteredRecords.length === 0 ? (
          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-12 text-center text-slate-500 space-y-2 shadow-sm shadow-slate-200/50">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-orbitron font-bold text-slate-700">No Matching Vault Records</p>
            <p className="text-[11px]">
              Try clearing your search query or run a new scan from the tools menu.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => {
                playUiClick();
                setActiveRecordModal(record);
              }}
              className="bg-white/90 border border-slate-200/90 hover:border-indigo-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-indigo-600 uppercase text-[11px]">
                  {record.category.slice(0, 4)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {record.fileName}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      • {new Date(record.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xl">
                    {record.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-slate-100 pt-2 sm:pt-0">
                <span className="px-3 py-1 rounded-xl font-orbitron font-extrabold text-xs border bg-emerald-50 border-emerald-200 text-emerald-700">
                  100% TRUST
                </span>

                <button
                  onClick={(e) => handleDelete(record.id, e)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Modal */}
      {activeRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative font-mono-code text-xs">
            <button
              onClick={() => setActiveRecordModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                FORENSIC REPORT RECORD
              </span>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">
                {activeRecordModal.fileName}
              </h3>
              <p className="text-slate-500 text-[11px]">
                Scan Timestamp: {new Date(activeRecordModal.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-orbitron font-bold text-sm text-emerald-700">
                  {activeRecordModal.verdictLabel}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Category: {activeRecordModal.category.toUpperCase()}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center font-orbitron font-bold text-emerald-700 text-sm">
                100%
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-800">Executive Summary:</p>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                {activeRecordModal.summary}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-800">Metric Diagnostic Breakdown:</p>
              <div className="space-y-2">
                {activeRecordModal.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-1">
                    <span>{m.label}</span>
                    <span className="font-bold text-emerald-700">100%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveRecordModal(null)}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100 cursor-pointer"
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
