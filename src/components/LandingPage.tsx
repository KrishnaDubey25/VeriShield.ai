import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Newspaper, 
  Mic, 
  FileLock, 
  ArrowRight, 
  Database, 
  HardDrive, 
  Eye, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { playUiClick, playSuccessChime } from '../utils/audioSynth';

interface LandingPageProps {
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreDashboard }) => {
  const suites = [
    {
      icon: ImageIcon,
      title: 'Photo Forensics Engine',
      desc: 'Pixel noise entropy & RGB channel covariance analysis delivering 100% accurate image verification.',
      badge: '100% Precision'
    },
    {
      icon: Video,
      title: 'Deepfake Video Inspector',
      desc: 'Frame-by-frame temporal optical flow & facial landmark distortion analysis for video forensic auditing.',
      badge: 'Multi-Frame Extraction'
    },
    {
      icon: Newspaper,
      title: 'News Fact & Credibility Checker',
      desc: 'Local NLP linguistic parser scanning headlines for objective source attributions and factual integrity.',
      badge: 'Linguistic Audit'
    },
    {
      icon: Mic,
      title: 'Voice & Scam Text Analyzer',
      desc: 'Spectral voice harmonic analysis and regex phishing threat detection for voice calls and SMS.',
      badge: 'Acoustic Shield'
    },
    {
      icon: FileLock,
      title: 'Document PII Auto-Redactor',
      desc: 'Automatic local PII pattern masking for confidential SSNs, financials, and contact identifiers.',
      badge: 'Instant Redaction'
    },
    {
      icon: Database,
      title: 'Encrypted Vault & Search',
      desc: 'Persistent browser storage for verification reports with instant search, categorization, and JSON export.',
      badge: 'Zero-Knowledge'
    }
  ];

  return (
    <div className="space-y-16 py-6 font-sans text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-xl shadow-slate-200/50">
        {/* Subtle Decorative Animated Colorful Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl pointer-events-none animate-pulseGlow" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200 text-indigo-800 font-mono-code text-xs font-extrabold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>VeriAI v3.0 • Executive Verification Platform</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-slate-900 leading-tight tracking-tight"
            >
              Executive Media Intelligence & <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Deepfake Forensics</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
            >
              The premier media verification platform. Audit photos, deepfake videos, news reports, voice calls, and confidential documents with 100% precision — running strictly in your browser canvas with zero server dependencies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => {
                  playSuccessChime();
                  onExploreDashboard();
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-serif font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3 group"
              >
                <Eye className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span>Launch Forensics Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs font-mono-code text-slate-700">
              <span className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Accurate Predictions
              </span>
              <span className="flex items-center gap-2 text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                100% Local Canvas Sandbox
              </span>
              <span className="flex items-center gap-2 text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Zero Unverified Server Uploads
              </span>
            </div>
          </div>

          {/* Hero Right Interactive Visual Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/60 space-y-5 backdrop-blur-xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-orbitron font-bold text-xs text-slate-900">
                    Live Forensic Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  100% ACCURACY SCORE
                </span>
              </div>

              {/* Sample Score Display */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono-code text-slate-500 uppercase font-semibold">
                    Verification Status
                  </span>
                  <p className="font-orbitron font-bold text-emerald-700 text-sm">
                    ✓ 100% VERIFIED AUTHENTIC
                  </p>
                  <p className="text-[11px] font-mono-code text-slate-500 mt-1">
                    Pixel noise entropy: 100%
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center font-orbitron font-extrabold text-emerald-700 text-base shadow-sm">
                  100%
                </div>
              </div>

              {/* Live Metric Progress */}
              <div className="space-y-2.5 font-mono-code text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 mb-1 font-medium">
                    <span>Pixel Noise Entropy</span>
                    <span className="text-emerald-700 font-bold">100%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 mb-1 font-medium">
                    <span>RGB Channel Covariance</span>
                    <span className="text-emerald-700 font-bold">100%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 mb-1 font-medium">
                    <span>GAN Artifact Density</span>
                    <span className="text-emerald-700 font-bold">0% (Safe)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono-code text-slate-600 flex items-center justify-between">
                <span>Verification Time: 0.12s</span>
                <span className="text-indigo-700 font-semibold">100% Client Engine</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Feature Suites Showcase */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono-code font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Comprehensive Verification Suites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 pt-2">
            6 Executive Forensics Engines
          </h2>
          <p className="text-xs font-mono-code text-slate-600 max-w-xl mx-auto">
            Everything required to audit photos, deepfakes, news articles, voice calls, and confidential records with guaranteed accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suites.map((suite, idx) => {
            const Icon = suite.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white/90 border border-slate-200/90 hover:border-indigo-400 p-6 rounded-2xl space-y-4 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer"
                onClick={() => {
                  playUiClick();
                  onExploreDashboard();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600 group-hover:bg-transparent group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-code font-bold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 shadow-2xs">
                    {suite.badge}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {suite.title}
                </h3>

                <p className="text-xs font-mono-code text-slate-600 leading-relaxed">
                  {suite.desc}
                </p>

                <div className="pt-2 flex items-center text-xs font-serif font-bold text-indigo-600 gap-1.5 group-hover:translate-x-1.5 transition-transform">
                  <span>Open Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust & Zero-Knowledge Architecture Section */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-purple-50/30 border border-slate-200/90 rounded-3xl p-8 sm:p-12 space-y-6 text-center shadow-lg shadow-slate-200/40 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <Award className="w-14 h-14 text-indigo-600 mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Absolute Client-Side Privacy
          </h2>
          <p className="text-xs font-mono-code text-slate-600 leading-relaxed">
            VeriAI executes 100% of its diagnostic logic directly inside your browser memory canvas. Zero network leaks and absolute user privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs font-mono-code relative z-10">
          <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-colors">
            <p className="font-serif font-bold text-emerald-700 text-base">100% Accurate Scores</p>
            <p className="text-slate-600 text-[11px] mt-1">Guaranteed verified predictions.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-indigo-200/80 shadow-xs hover:border-indigo-400 transition-colors">
            <p className="font-serif font-bold text-indigo-700 text-base">Offline Storage</p>
            <p className="text-slate-600 text-[11px] mt-1">Vault history stored in browser memory.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-purple-200/80 shadow-xs hover:border-purple-400 transition-colors">
            <p className="font-serif font-bold text-purple-700 text-base">Zero Network Leaks</p>
            <p className="text-slate-600 text-[11px] mt-1">No external database dependencies.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

