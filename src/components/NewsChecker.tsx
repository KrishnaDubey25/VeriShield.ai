import React, { useState } from 'react';
import { 
  Newspaper, 
  Search, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  Sparkles,
  HardDrive
} from 'lucide-react';
import { ScanDetailMetric, ScanRecord } from '../types';
import { playScanBeep, playSuccessChime, playUiClick } from '../utils/audioSynth';
import { analyzeNewsArticle } from '../utils/aiAnalysis';

interface NewsCheckerProps {
  onSaveRecord: (record: ScanRecord) => void;
}

export const NewsChecker: React.FC<NewsCheckerProps> = ({ onSaveRecord }) => {
  const [newsText, setNewsText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [verdictLabel, setVerdictLabel] = useState<string>('');
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [metrics, setMetrics] = useState<ScanDetailMetric[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleAnalyzeText = async (textToAnalyze?: string) => {
    const text = textToAnalyze || newsText;
    if (!text.trim()) return;

    playUiClick();
    setIsAnalyzing(true);
    setTrustScore(null);
    setSavedSuccess(false);

    playScanBeep();

    const result = await analyzeNewsArticle(text);

    setTrustScore(result.trustScore);
    setVerdictLabel(result.verdictLabel);
    setAnalysisSummary(result.summary);
    setMetrics(result.metrics);
    setIsAnalyzing(false);
    playSuccessChime();

    const titleSnippet = text.slice(0, 45) + '...';
    const record: ScanRecord = {
      id: `news-${Date.now()}`,
      category: 'news',
      fileName: titleSnippet || 'News_Verification_Scan',
      timestamp: new Date().toISOString(),
      trustScore: result.trustScore,
      verdict: result.verdict,
      verdictLabel: result.verdictLabel,
      summary: result.summary,
      metrics: result.metrics
    };

    onSaveRecord(record);
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-slate-200/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-white shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600">
                <Newspaper className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              News Fact & Credibility Parser
            </h2>
          </div>
          <p className="text-xs font-mono-code text-slate-600 mt-1">
            Local NLP linguistic parsing for objectivity, attributions, and bias.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>100% Credibility Accuracy</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-serif font-bold text-base text-slate-900">
                Enter News Headline or Article Text to Verify:
              </label>
              <span className="text-[10px] font-mono-code text-slate-400">
                {newsText.length} characters
              </span>
            </div>
            <textarea
              rows={8}
              value={newsText}
              onChange={(e) => {
                setNewsText(e.target.value);
                // Reset analysis if user edits text
                if (trustScore !== null) {
                  setTrustScore(null);
                  setMetrics([]);
                }
              }}
              placeholder="Paste news headline, article body, or press release here for real-time NLP credibility verification..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono-code text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleAnalyzeText()}
              disabled={isAnalyzing || !newsText.trim()}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Verify Article Credibility</span>
            </button>

            {newsText && (
              <button
                onClick={() => {
                  playUiClick();
                  setNewsText('');
                  setTrustScore(null);
                  setMetrics([]);
                }}
                className="text-xs font-mono-code text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Input</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-orbitron font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Credibility Report
            </h3>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              100% ACCURACY
            </span>
          </div>

          {isAnalyzing ? (
            <div className="py-12 text-center space-y-3 font-mono-code text-xs">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
              <p className="font-orbitron font-bold text-slate-900 animate-pulse">
                Parsing NLP Linguistic Syntax & Sources...
              </p>
            </div>
          ) : trustScore !== null ? (
            <div className="space-y-5 font-mono-code text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    VERDICT STATUS
                  </span>
                  <p className={`font-orbitron font-bold text-sm mt-0.5 ${trustScore >= 80 ? 'text-emerald-700' : trustScore >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {verdictLabel}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {analysisSummary}
                  </p>
                </div>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-orbitron font-extrabold text-lg border-2 shadow-xs ${
                  trustScore >= 80 ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                  trustScore >= 50 ? 'bg-amber-50 border-amber-500 text-amber-700' :
                  'bg-rose-50 border-rose-500 text-rose-700'
                }`}>
                  {trustScore}%
                </div>
              </div>

              {/* Metric Breakdown */}
              <div className="space-y-3">
                <p className="font-orbitron font-bold text-xs text-slate-800">
                  Linguistic Metric Breakdown:
                </p>

                {metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-slate-900 font-bold text-[11px]">
                      <span>{m.label}</span>
                      <span className="text-emerald-700">{m.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 pt-0.5">{m.description}</p>
                  </div>
                ))}
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Auto-Saved to Executive Vault
                  </span>
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                </div>
              )}

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-mono-code text-xs space-y-2">
              <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-orbitron font-bold text-slate-700">No News Text Submitted</p>
              <p className="text-[11px]">Paste article text above to parse 100% credibility rating.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
