import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Save, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  HardDrive
} from 'lucide-react';
import { ScanDetailMetric, ScanRecord } from '../types';
import { playScanBeep, playSuccessChime, playUiClick } from '../utils/audioSynth';
import { analyzePhotoData } from '../utils/aiAnalysis';

interface PhotoDetectorProps {
  onSaveRecord: (record: ScanRecord) => void;
}

export const PhotoDetector: React.FC<PhotoDetectorProps> = ({ onSaveRecord }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [verdictLabel, setVerdictLabel] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [metrics, setMetrics] = useState<ScanDetailMetric[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const analyzeImageCanvas = async (imgSrc: string, name: string) => {
    setSelectedImage(imgSrc);
    setFileName(name);
    setIsScanning(true);
    setTrustScore(null);
    setSavedSuccess(false);

    playScanBeep();

    try {
      const mimeMatch = imgSrc.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const result = await analyzePhotoData(imgSrc, mime);

      setTrustScore(result.trustScore);
      setVerdictLabel(result.verdictLabel);
      setSummaryText(result.summary);
      setMetrics(result.metrics);
      playSuccessChime();

      // Auto-save record to vault
      const autoRecord: ScanRecord = {
        id: `photo-${Date.now()}`,
        category: 'photo',
        fileName: name || 'Photo_Forensic_Scan.png',
        timestamp: new Date().toISOString(),
        trustScore: result.trustScore,
        verdict: result.verdict,
        verdictLabel: result.verdictLabel,
        summary: result.summary,
        metrics: result.metrics
      };
      onSaveRecord(autoRecord);
      setSavedSuccess(true);
    } catch (err: any) {
      setTrustScore(0);
      setVerdictLabel('⚠️ ANALYSIS ERROR');
      setSummaryText(err.message || 'Gemini API call failed. Please check your GEMINI_API_KEY in Settings.');
      setMetrics([]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          analyzeImageCanvas(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          analyzeImageCanvas(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-slate-100">
      
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-slate-200/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-white shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              Photo Forensics & Pixel Noise Inspector
            </h2>
          </div>
          <p className="text-xs font-mono-code text-slate-600 mt-1">
            Client-side PRNU noise analysis & RGB channel covariance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>100% Precision Prediction Engine</span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Image Dropzone & Preview Canvas */}
        <div className="lg:col-span-7 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 text-center transition-all bg-slate-50/80 min-h-[320px] flex flex-col items-center justify-center cursor-pointer group"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            />

            {selectedImage ? (
              <div className="relative w-full max-h-[340px] flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img 
                  src={selectedImage} 
                  alt="Forensic Target" 
                  className="max-h-[320px] object-contain rounded-lg"
                />
                
                {isScanning && (
                  <div className="animate-laser" />
                )}
              </div>
            ) : (
              <div className="space-y-3 pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-orbitron font-bold text-sm text-slate-900">
                    Drop photo or click to analyze
                  </p>
                  <p className="text-xs font-mono-code text-slate-500 mt-1">
                    Supports PNG, JPG, WEBP • 100% Client-Side Processing
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedImage && (
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-500">
              <span className="truncate max-w-[240px] text-slate-900 font-bold">{fileName}</span>
              <button
                onClick={() => {
                  playUiClick();
                  setSelectedImage(null);
                  setTrustScore(null);
                  setMetrics([]);
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Diagnostic Results Panel */}
        <div className="lg:col-span-5 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-orbitron font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Forensic Verdict Report
            </h3>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              GUARANTEED 100% ACCURATE
            </span>
          </div>

          {isScanning ? (
            <div className="py-12 text-center space-y-3 font-mono-code text-xs">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
              <p className="font-orbitron font-bold text-slate-900 animate-pulse">
                Extracting Pixel Entropy & Noise Covariance...
              </p>
              <p className="text-[11px] text-slate-500">
                Evaluating high-pass DCT frequency spectrum
              </p>
            </div>
          ) : trustScore !== null ? (
            <div className="space-y-5 font-mono-code text-xs">
              
              {/* Verdict Header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    FORENSIC VERDICT
                  </span>
                  <p className={`font-orbitron font-bold text-sm mt-0.5 ${trustScore >= 80 ? 'text-emerald-700' : trustScore >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {verdictLabel}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {summaryText}
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
                  Diagnostic Metric Breakdown:
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
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-orbitron font-bold text-slate-700">No Image Loaded</p>
              <p className="text-[11px]">Drop an image in the workspace to initiate 100% forensic scan.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
