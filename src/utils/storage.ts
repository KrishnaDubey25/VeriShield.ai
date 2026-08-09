import { ScanRecord } from '../types';

const STORAGE_KEY = 'verishield_executive_vault_v2';

// Executive initial verified records
const INITIAL_VAULT_RECORDS: ScanRecord[] = [
  {
    id: 'rec-exec-01',
    category: 'photo',
    fileName: 'high_resolution_portrait_audit.png',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    trustScore: 100,
    verdict: 'authentic',
    verdictLabel: '✓ 100% VERIFIED AUTHENTIC (PERFECT FORENSIC INTEGRITY)',
    summary: 'Natural pixel noise variance and consistent RGB channel entropy verified with 100% confidence.',
    metrics: [
      { label: 'Pixel Noise Entropy', score: 100 },
      { label: 'RGB Channel Covariance', score: 100 },
      { label: 'DCT High-Pass Frequency', score: 100 },
      { label: 'GAN Artifact Density', score: 0 }
    ]
  },
  {
    id: 'rec-exec-02',
    category: 'news',
    fileName: 'Global Economic Outlook Report - Peer Reviewed',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    trustScore: 100,
    verdict: 'credible',
    verdictLabel: '✓ 100% CREDIBLE NEWS REPORT (VERIFIED SOURCE)',
    summary: 'High objectivity score, verified academic/institutional sources, and zero clickbait triggers detected.',
    metrics: [
      { label: 'Objectivity Index', score: 100 },
      { label: 'Source Attribution Integrity', score: 100 },
      { label: 'Linguistic Consistency', score: 100 }
    ]
  },
  {
    id: 'rec-exec-03',
    category: 'voice',
    fileName: 'Corporate_Board_Meeting_Audio_Verification.wav',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    trustScore: 100,
    verdict: 'authentic',
    verdictLabel: '✓ 100% VERIFIED AUTHENTIC VOICE STREAM',
    summary: 'Acoustic harmonics, spectral pitch continuous, and voice vocal fold resonance fully verified.',
    metrics: [
      { label: 'Acoustic Harmonics', score: 100 },
      { label: 'Spectral Pitch Integrity', score: 100 },
      { label: 'Vocal Fold Continuity', score: 100 }
    ]
  }
];

export const getVaultRecords = (): ScanRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VAULT_RECORDS));
      return INITIAL_VAULT_RECORDS;
    }
    return JSON.parse(raw) as ScanRecord[];
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return INITIAL_VAULT_RECORDS;
  }
};

export const saveVaultRecord = (record: ScanRecord): ScanRecord[] => {
  try {
    const records = getVaultRecords();
    const updated = [record, ...records.filter(r => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    return getVaultRecords();
  }
};

export const deleteVaultRecord = (id: string): ScanRecord[] => {
  try {
    const records = getVaultRecords();
    const updated = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete from localStorage:', err);
    return getVaultRecords();
  }
};

export const clearVaultStorage = (): ScanRecord[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
    return [];
  }
};
