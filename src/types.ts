export type ScanCategory = 'photo' | 'video' | 'news' | 'voice' | 'scam_text' | 'doc';

export type VerdictType = 'authentic' | 'deepfake' | 'ai_generated' | 'edited' | 'credible' | 'suspicious' | 'misleading' | 'satire' | 'misinformation' | 'safe' | 'warning' | 'scam';

export interface ScanDetailMetric {
  label: string;
  score: number; // 0 - 100
  description?: string;
}

export interface ScanRecord {
  id: string;
  category: ScanCategory;
  fileName: string;
  timestamp: string; // ISO string
  trustScore: number; // 0 - 100
  verdict: VerdictType;
  verdictLabel: string;
  thumbnail?: string; // base64 or SVG data URL
  summary: string;
  metrics: ScanDetailMetric[];
  detectedPIICount?: number;
}

export interface RedactionBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  type: 'auto' | 'manual';
}
