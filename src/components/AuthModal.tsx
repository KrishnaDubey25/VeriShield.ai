import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  Mail, 
  ArrowRight, 
  X, 
  ShieldAlert,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, EXECUTIVE_PROFILES, loginLocalUser } from '../utils/auth';
import { playUiClick, playSuccessChime } from '../utils/audioSynth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Chief Forensics Director');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and official email.');
      return;
    }

    playSuccessChime();
    const customUser: UserProfile = {
      id: `usr-custom-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role.trim() || 'Executive Forensics Auditor',
      clearanceLevel: 5,
      loginTimestamp: new Date().toISOString()
    };

    const loggedIn = loginLocalUser(customUser);
    onLoginSuccess(loggedIn);
    onClose();
  };

  const handleProfileLogin = (profile: UserProfile) => {
    playSuccessChime();
    const loggedIn = loginLocalUser(profile);
    onLoginSuccess(loggedIn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A11]/80 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 glow-indigo">
        
        {/* Close button */}
        <button
          onClick={() => {
            playUiClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="font-orbitron text-xl sm:text-2xl font-extrabold text-slate-100 tracking-wide">
            VeriShield <span className="text-indigo-400">Executive Access</span>
          </h2>

          <p className="text-xs font-mono-code text-slate-400 max-w-sm mx-auto">
            Client-Side Sandbox Authentication. Zero Supabase or External Database required.
          </p>
        </div>

        {/* Security Confirmation Notice */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3 text-xs font-mono-code text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Local Sandbox Verified: Instant offline authentication without remote API calls.</span>
        </div>

        {/* Executive Profiles One-Click Access */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
            One-Click Executive Access:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {EXECUTIVE_PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileLogin(profile)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1E293B]/80 border border-slate-700/60 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-bold font-orbitron text-indigo-300">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-orbitron font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {profile.name}
                    </p>
                    <p className="text-[11px] font-mono-code text-slate-400">
                      {profile.role} • <span className="text-emerald-400">Clearance Lvl {profile.clearanceLevel}</span>
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono-code text-xs flex items-center gap-1 group-hover:bg-indigo-500/20">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0F172A] px-3 font-mono-code text-[11px] text-slate-500 uppercase">
            or custom login
          </span>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5 font-mono-code text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Executive Full Name:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Krishna Dubey"
                className="w-full bg-[#090D16] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Corporate Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. director@verishield.ai"
                className="w-full bg-[#090D16] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-400 hover:to-emerald-300 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Launch Executive Dashboard</span>
          </button>
        </form>

      </div>
    </div>
  );
};
