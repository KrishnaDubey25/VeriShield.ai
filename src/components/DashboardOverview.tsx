import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  ShieldCheck
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { ScanRecord } from '../types';
import { playUiClick } from '../utils/audioSynth';

interface DashboardOverviewProps {
  records: ScanRecord[];
  onNavigateTab: (tabId: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  photo: '#6366F1', // Indigo
  video: '#A855F7', // Purple
  news: '#EC4899',  // Pink
  voice: '#F43F5E', // Rose
  scam_text: '#F59E0B', // Amber
  doc: '#10B981',   // Emerald
};

const VERDICT_COLORS: Record<string, string> = {
  Authentic: '#10B981',   // Emerald
  Deepfake: '#F43F5E',    // Rose
  'AI Generated': '#A855F7', // Purple
  Suspicious: '#F59E0B',  // Amber
  Safe: '#3B82F6',        // Blue
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  records,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ScanRecord | null>(null);

  // Dynamic Metrics derived directly from records
  const totalScans = records.length;
  
  const authenticCount = useMemo(() => 
    records.filter(r => ['authentic', 'credible', 'safe'].includes(r.verdict.toLowerCase())).length,
    [records]
  );

  const threatCount = useMemo(() => 
    records.filter(r => ['deepfake', 'ai_generated', 'scam', 'suspicious', 'misinformation', 'misleading', 'warning'].includes(r.verdict.toLowerCase())).length,
    [records]
  );

  const avgTrust = useMemo(() => {
    if (records.length === 0) return 100;
    const sum = records.reduce((acc, r) => acc + (r.trustScore || 100), 0);
    return Math.round(sum / records.length);
  }, [records]);

  // Chart Data 1: Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      photo: 0,
      video: 0,
      news: 0,
      voice: 0,
      scam_text: 0,
      doc: 0,
    };
    records.forEach(r => {
      const cat = r.category || 'photo';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const labels: Record<string, string> = {
      photo: 'Photo Forensics',
      video: 'Video Inspection',
      news: 'News Checker',
      voice: 'Voice Analysis',
      scam_text: 'Scam Text Shield',
      doc: 'Document Redaction',
    };

    return Object.keys(counts).map(cat => ({
      name: labels[cat] || cat,
      value: counts[cat],
      color: CATEGORY_COLORS[cat] || '#6366F1',
    })).filter(item => item.value > 0);
  }, [records]);

  // Chart Data 2: Verdict Threat Breakdown (Pie Chart)
  const verdictData = useMemo(() => {
    const verdictCounts: Record<string, number> = {
      'Authentic': 0,
      'Deepfake': 0,
      'AI Generated': 0,
      'Suspicious': 0,
      'Safe': 0,
    };

    records.forEach(r => {
      const v = r.verdict ? r.verdict.toLowerCase() : 'authentic';
      if (['authentic', 'credible'].includes(v)) verdictCounts['Authentic']++;
      else if (['deepfake'].includes(v)) verdictCounts['Deepfake']++;
      else if (['ai_generated'].includes(v)) verdictCounts['AI Generated']++;
      else if (['scam', 'suspicious', 'misleading', 'warning'].includes(v)) verdictCounts['Suspicious']++;
      else verdictCounts['Safe']++;
    });

    return Object.keys(verdictCounts).map(v => ({
      name: v,
      value: verdictCounts[v],
      color: VERDICT_COLORS[v] || '#6366F1',
    })).filter(item => item.value > 0);
  }, [records]);

  // Chart Data 3: Activity & Trust Score Timeline (Area Chart)
  const timelineData = useMemo(() => {
    if (records.length === 0) return [];
    
    // Sort records by timestamp
    const sorted = [...records].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Group by formatted date/time
    const groups: Record<string, { count: number; totalTrust: number }> = {};
    sorted.forEach((r, idx) => {
      const dateStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const label = `${dateStr} (#${idx + 1})`;
      if (!groups[label]) {
        groups[label] = { count: 0, totalTrust: 0 };
      }
      groups[label].count += 1;
      groups[label].totalTrust += r.trustScore;
    });

    return Object.keys(groups).map((key) => ({
      time: key,
      scans: groups[key].count,
      trustScore: Math.round(groups[key].totalTrust / groups[key].count),
    }));
  }, [records]);

  // Chart Data 4: Category Comparison (Bar Chart)
  const categoryBarData = useMemo(() => {
    const stats: Record<string, { count: number; totalTrust: number }> = {
      Photo: { count: 0, totalTrust: 0 },
      Video: { count: 0, totalTrust: 0 },
      News: { count: 0, totalTrust: 0 },
      Voice: { count: 0, totalTrust: 0 },
      Document: { count: 0, totalTrust: 0 },
    };

    records.forEach(r => {
      let key = 'Photo';
      if (r.category === 'video') key = 'Video';
      else if (r.category === 'news') key = 'News';
      else if (r.category === 'voice' || r.category === 'scam_text') key = 'Voice';
      else if (r.category === 'doc') key = 'Document';

      stats[key].count += 1;
      stats[key].totalTrust += r.trustScore || 100;
    });

    return Object.keys(stats).map(k => ({
      category: k,
      totalScans: stats[k].count,
      avgTrust: stats[k].count > 0 ? Math.round(stats[k].totalTrust / stats[k].count) : 100,
    }));
  }, [records]);

  // Chart Data 5: Multi-Point Forensic Radar Diagnostics
  const radarData = useMemo(() => {
    let entropyTotal = 0, flowTotal = 0, spectralTotal = 0, piiTotal = 0, nlpTotal = 0, metadataTotal = 0;
    const len = Math.max(records.length, 1);

    records.forEach(r => {
      r.metrics.forEach(m => {
        const lbl = m.label.toLowerCase();
        if (lbl.includes('noise') || lbl.includes('pixel') || lbl.includes('prnu')) entropyTotal += m.score;
        else if (lbl.includes('optical') || lbl.includes('frame') || lbl.includes('flow')) flowTotal += m.score;
        else if (lbl.includes('audio') || lbl.includes('spectral') || lbl.includes('voice')) spectralTotal += m.score;
        else if (lbl.includes('pii') || lbl.includes('mask') || lbl.includes('redact')) piiTotal += m.score;
        else if (lbl.includes('bias') || lbl.includes('credibility') || lbl.includes('clickbait')) nlpTotal += m.score;
        else metadataTotal += m.score;
      });
    });

    return [
      { metric: 'Pixel Noise', score: Math.round(entropyTotal / len) || 98 },
      { metric: 'Optical Flow', score: Math.round(flowTotal / len) || 96 },
      { metric: 'Audio Spectral', score: Math.round(spectralTotal / len) || 99 },
      { metric: 'PII Density', score: Math.round(piiTotal / len) || 95 },
      { metric: 'Linguistic Bias', score: Math.round(nlpTotal / len) || 97 },
      { metric: 'Metadata Depth', score: Math.round(metadataTotal / len) || 100 },
    ];
  }, [records]);

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
              VeriAI v3.0 Real-Time Analytics
            </span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Executive Forensics <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Analytics Center</span>
          </h2>

          <p className="text-xs font-mono-code text-slate-600 font-medium">
            Dynamic Zero-Knowledge Intelligence & Live Forensic Data Visualizations
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

      {/* Dynamic Metric Cards computed from real records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-bold text-slate-600">TOTAL SCANS PERFORMED</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-slate-900">
              {totalScans}
            </span>
            <span className="text-xs font-mono-code text-slate-500">records</span>
          </div>
          <p className="text-[11px] font-mono-code text-indigo-600 font-semibold">
            Stored in local browser vault
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl space-y-2 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-bold text-slate-600">VERIFIED AUTHENTIC</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-emerald-600">
              {authenticCount}
            </span>
            <span className="text-xs font-mono-code text-slate-500">
              ({totalScans > 0 ? Math.round((authenticCount / totalScans) * 100) : 100}%)
            </span>
          </div>
          <p className="text-[11px] font-mono-code text-emerald-600 font-semibold">
            Pristine structural fidelity
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl space-y-2 shadow-xs hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-bold text-slate-600">THREATS / ANOMALIES</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-rose-600">
              {threatCount}
            </span>
            <span className="text-xs font-mono-code text-slate-500">flagged</span>
          </div>
          <p className="text-[11px] font-mono-code text-rose-600 font-semibold">
            Deepfakes, AI, & Phishing
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/90 border border-slate-200/90 p-5 rounded-2xl space-y-2 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono-code font-bold text-slate-600">AVERAGE TRUST SCORE</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-purple-600">
              {avgTrust}%
            </span>
            <span className="text-xs font-mono-code text-slate-500">trust index</span>
          </div>
          <p className="text-[11px] font-mono-code text-purple-600 font-semibold">
            Overall system confidence
          </p>
        </div>

      </div>

      {/* PIE CHARTS & ANALYTICS VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pie Chart 1: Media Category Distribution */}
        <div className="lg:col-span-6 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Media Suite Distribution
              </h3>
            </div>
            <span className="text-[11px] font-mono-code font-semibold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
              {categoryData.length} Active Categories
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-mono-code font-semibold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart 2: Threat & Verdict Breakdown */}
        <div className="lg:col-span-6 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Threat & Verdict Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-mono-code font-semibold px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
              Verdict Analysis
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {verdictData.map((entry, index) => (
                    <Cell key={`verdict-cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-mono-code font-semibold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LINE & BAR CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Area Chart: Scan Activity & Trust Score Curve */}
        <div className="lg:col-span-7 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                <LineIcon className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Verification Volume & Trust Score Timeline
              </h3>
            </div>
            <span className="text-[11px] font-mono-code font-semibold text-slate-500">
              Chronological Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px',
                    border: 'none'
                  }} 
                />
                <Area type="monotone" dataKey="trustScore" name="Trust Score (%)" stroke="#A855F7" fillOpacity={1} fill="url(#colorTrust)" strokeWidth={2} />
                <Area type="monotone" dataKey="scans" name="Scan Volume" stroke="#6366F1" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Suite Comparison */}
        <div className="lg:col-span-5 bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Category Scan Volume
              </h3>
            </div>
            <span className="text-[11px] font-mono-code font-semibold text-slate-500">
              Comparative Analysis
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px',
                    border: 'none'
                  }} 
                />
                <Bar dataKey="totalScans" name="Total Scans" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avgTrust" name="Avg Trust %" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RADAR CHART: FORENSIC DIAGNOSTICS INTENSITY */}
      <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-200/50">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Forensic Diagnostic Vector Radar
            </h3>
          </div>
          <span className="text-[11px] font-mono-code font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            6-Point Inspection Matrix
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" stroke="#475569" fontSize={11} tick={{ fill: '#334155', fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
              <Radar name="Diagnostic Intensity Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  fontSize: '12px',
                  border: 'none'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
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
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Recent Scan Reports & Vault Filter
            </h3>
            <p className="text-xs font-mono-code text-slate-500 mt-0.5">
              Live search filter across all saved forensic records.
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
              <p className="font-serif text-sm text-slate-600 font-bold">No matching history records found.</p>
              <p className="text-[11px]">Use the tools above to perform new scans.</p>
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
                    <span className={`px-2.5 py-1 rounded-lg font-serif font-bold text-xs ${
                      ['authentic', 'credible', 'safe'].includes(record.verdict.toLowerCase())
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border border-rose-200 text-rose-700'
                    }`}>
                      {record.trustScore}% TRUST
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
            className="text-xs font-serif font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
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
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                FORENSIC REPORT
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {selectedRecordForModal.fileName}
              </h3>
              <p className="text-slate-500 text-[11px]">
                Scan Timestamp: {new Date(selectedRecordForModal.timestamp).toLocaleString()}
              </p>
            </div>

            <div className={`p-4 rounded-2xl flex items-center justify-between border ${
              ['authentic', 'credible', 'safe'].includes(selectedRecordForModal.verdict.toLowerCase())
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div>
                <p className={`font-serif font-bold text-base ${
                  ['authentic', 'credible', 'safe'].includes(selectedRecordForModal.verdict.toLowerCase())
                    ? 'text-emerald-800'
                    : 'text-rose-800'
                }`}>
                  {selectedRecordForModal.verdictLabel}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Category: {selectedRecordForModal.category.toUpperCase()}
                </p>
              </div>

              <div className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center font-serif font-bold text-sm shadow-xs ${
                ['authentic', 'credible', 'safe'].includes(selectedRecordForModal.verdict.toLowerCase())
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-rose-500 text-rose-700'
              }`}>
                {selectedRecordForModal.trustScore}%
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
                    <span className="font-bold text-indigo-700">{m.score}%</span>
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
