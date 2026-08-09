import { GoogleGenAI, Type } from '@google/genai';
import { ScanDetailMetric, RedactionBox } from '../types';

export interface NewsAnalysisResult {
  trustScore: number;
  verdict: 'credible' | 'suspicious' | 'misleading' | 'satire';
  verdictLabel: string;
  summary: string;
  metrics: ScanDetailMetric[];
}

export interface ScamAnalysisResult {
  trustScore: number;
  verdict: 'safe' | 'warning' | 'scam';
  verdictLabel: string;
  summary: string;
  metrics: ScanDetailMetric[];
}

export interface PhotoAnalysisResult {
  trustScore: number;
  verdict: 'authentic' | 'ai_generated' | 'edited' | 'deepfake';
  verdictLabel: string;
  summary: string;
  metrics: ScanDetailMetric[];
}

export interface DocRedactionResult {
  documentType: string;
  summary: string;
  piiBoxes: RedactionBox[];
}

export interface VideoAnalysisResult {
  trustScore: number;
  verdict: 'authentic' | 'deepfake' | 'edited';
  verdictLabel: string;
  summary: string;
  metrics: ScanDetailMetric[];
}

let clientAIInstance: GoogleGenAI | null = null;

function getClientAI(): GoogleGenAI | null {
  if (!clientAIInstance) {
    const apiKey = 
      (import.meta as any).env?.VITE_GEMINI_API_KEY || 
      (import.meta as any).env?.GEMINI_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined) ||
      (typeof window !== 'undefined' ? (window as any).GEMINI_API_KEY : undefined);
    
    if (apiKey) {
      try {
        clientAIInstance = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn('Failed to initialize client GoogleGenAI:', e);
      }
    }
  }
  return clientAIInstance;
}

// 1. News Analysis Client Utility
export async function analyzeNewsArticle(text: string): Promise<NewsAnalysisResult> {
  let serverErrorMsg = '';

  // Try backend first
  try {
    const response = await fetch('/api/analyze/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (response.ok && data && typeof data.trustScore === 'number') {
      return data;
    }
    if (data && data.error) {
      serverErrorMsg = data.error;
    }
  } catch (err: any) {
    console.warn('Backend news analysis error:', err);
    serverErrorMsg = err.message || 'Server connection failed';
  }

  // Try direct client Gemini API if key is set locally
  const clientAI = getClientAI();
  if (clientAI) {
    try {
      const response = await clientAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Perform an objective, rigorous news credibility analysis for the following article text or headline:
"${text}"

Evaluate key factual claims, source attributions, emotional bias/sensationalism, and logical consistency. Provide accurate ratings (0-100%).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.NUMBER },
              verdict: { type: Type.STRING },
              verdictLabel: { type: Type.STRING },
              summary: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  },
                  required: ['label', 'score', 'description']
                }
              }
            },
            required: ['trustScore', 'verdict', 'verdictLabel', 'summary', 'metrics']
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      if (result && typeof result.trustScore === 'number') {
        return result;
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini news analysis failed:', clientErr);
      serverErrorMsg = clientErr.message || serverErrorMsg;
    }
  }

  throw new Error(serverErrorMsg || 'Gemini API key is required. Please set GEMINI_API_KEY in environment or AI Studio secrets.');
}

// 2. Scam / Message Analysis Client Utility
export async function analyzeScamMessage(text: string): Promise<ScamAnalysisResult> {
  let serverErrorMsg = '';

  try {
    const response = await fetch('/api/analyze/scam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (response.ok && data && typeof data.trustScore === 'number') {
      return data;
    }
    if (data && data.error) {
      serverErrorMsg = data.error;
    }
  } catch (err: any) {
    console.warn('Backend scam analysis error:', err);
    serverErrorMsg = err.message || 'Server connection failed';
  }

  const clientAI = getClientAI();
  if (clientAI) {
    try {
      const response = await clientAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze the following message / SMS / email / voice transcript for security threats, scams, phishing links, social engineering tactics, or legitimate notifications:
"${text}"

Provide a precise threat assessment.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.NUMBER },
              verdict: { type: Type.STRING },
              verdictLabel: { type: Type.STRING },
              summary: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  },
                  required: ['label', 'score', 'description']
                }
              }
            },
            required: ['trustScore', 'verdict', 'verdictLabel', 'summary', 'metrics']
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      if (result && typeof result.trustScore === 'number') {
        return result;
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini scam analysis failed:', clientErr);
      serverErrorMsg = clientErr.message || serverErrorMsg;
    }
  }

  throw new Error(serverErrorMsg || 'Gemini API key is required. Please set GEMINI_API_KEY in environment or AI Studio secrets.');
}

// 3. Photo Forensics Client Utility
export async function analyzePhotoData(imageBase64: string, mimeType: string): Promise<PhotoAnalysisResult> {
  let serverErrorMsg = '';

  try {
    const response = await fetch('/api/analyze/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType })
    });
    const data = await response.json();
    if (response.ok && data && typeof data.trustScore === 'number') {
      return data;
    }
    if (data && data.error) {
      serverErrorMsg = data.error;
    }
  } catch (err: any) {
    console.warn('Backend photo analysis error:', err);
    serverErrorMsg = err.message || 'Server connection failed';
  }

  const clientAI = getClientAI();
  if (clientAI) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const response = await clientAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: cleanBase64
              }
            },
            {
              text: `Examine this photo for visual authenticity, AI generation indicators (Midjourney, DALL-E, Stable Diffusion, Flux, Sora, Imagen), face manipulation, lighting consistency, texture patterns, and visual subject.
Describe specifically what is depicted in the photo and provide a factual, realistic forensic evaluation.`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.NUMBER },
              verdict: { type: Type.STRING },
              verdictLabel: { type: Type.STRING },
              summary: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  },
                  required: ['label', 'score', 'description']
                }
              }
            },
            required: ['trustScore', 'verdict', 'verdictLabel', 'summary', 'metrics']
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      if (result && typeof result.trustScore === 'number') {
        return result;
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini photo analysis failed:', clientErr);
      serverErrorMsg = clientErr.message || serverErrorMsg;
    }
  }

  throw new Error(serverErrorMsg || 'Gemini API key is required. Please set GEMINI_API_KEY in environment or AI Studio secrets.');
}

// 4. Document PII Analysis Client Utility
export async function analyzeDocPII(imageBase64: string, mimeType: string): Promise<DocRedactionResult> {
  let serverErrorMsg = '';

  try {
    const response = await fetch('/api/analyze/doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType })
    });
    const data = await response.json();
    if (response.ok && data && Array.isArray(data.piiBoxes)) {
      return data;
    }
    if (data && data.error) {
      serverErrorMsg = data.error;
    }
  } catch (err: any) {
    console.warn('Backend doc PII analysis error:', err);
    serverErrorMsg = err.message || 'Server connection failed';
  }

  const clientAI = getClientAI();
  if (clientAI) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const response = await clientAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: cleanBase64
              }
            },
            {
              text: `Perform document OCR and locate ALL sensitive PII items in this document image (such as Social Security Numbers, Tax IDs, Credit Card / IBAN numbers, Phone numbers, Physical Addresses, Passports, Private Emails, Dates of Birth, Signatures).
For each sensitive item found, provide bounding box coordinates in percentage terms (x: 0-100%, y: 0-100%, width: 0-100%, height: 0-100%) where x and y represent top-left corner percentages relative to the image dimensions.`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentType: { type: Type.STRING },
              summary: { type: Type.STRING },
              piiBoxes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ['id', 'x', 'y', 'width', 'height', 'label']
                }
              }
            },
            required: ['documentType', 'summary', 'piiBoxes']
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      if (result && Array.isArray(result.piiBoxes)) {
        return result;
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini doc analysis failed:', clientErr);
      serverErrorMsg = clientErr.message || serverErrorMsg;
    }
  }

  throw new Error(serverErrorMsg || 'Gemini API key is required. Please set GEMINI_API_KEY in environment or AI Studio secrets.');
}

// 5. Video Deepfake Analysis Client Utility
export async function analyzeVideoData(videoName: string, thumbnailBase64?: string, mimeType?: string): Promise<VideoAnalysisResult> {
  let serverErrorMsg = '';

  try {
    const response = await fetch('/api/analyze/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoName, thumbnailBase64, mimeType })
    });
    const data = await response.json();
    if (response.ok && data && typeof data.trustScore === 'number') {
      return data;
    }
    if (data && data.error) {
      serverErrorMsg = data.error;
    }
  } catch (err: any) {
    console.warn('Backend video analysis error:', err);
    serverErrorMsg = err.message || 'Server connection failed';
  }

  const clientAI = getClientAI();
  if (clientAI) {
    try {
      let contentsPayload: any = `Analyze video file "${videoName || 'video.mp4'}" for AI face synthesis, deepfake lip-sync anomalies, temporal lighting artifacts, and optical flow inconsistencies. Provide a realistic forensic report.`;
      if (thumbnailBase64) {
        const cleanBase64 = thumbnailBase64.replace(/^data:image\/\w+;base64,/, '');
        contentsPayload = {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: cleanBase64
              }
            },
            {
              text: `Analyze this frame from video file "${videoName || 'video.mp4'}" for facial reenactment, deepfake lip-sync mismatch, optical flow anomalies, temporal frame jitter, and visual authenticity. Provide a realistic assessment.`
            }
          ]
        };
      }

      const response = await clientAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contentsPayload,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.NUMBER },
              verdict: { type: Type.STRING },
              verdictLabel: { type: Type.STRING },
              summary: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  },
                  required: ['label', 'score', 'description']
                }
              }
            },
            required: ['trustScore', 'verdict', 'verdictLabel', 'summary', 'metrics']
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      if (result && typeof result.trustScore === 'number') {
        return result;
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini video analysis failed:', clientErr);
      serverErrorMsg = clientErr.message || serverErrorMsg;
    }
  }

  throw new Error(serverErrorMsg || 'Gemini API key is required. Please set GEMINI_API_KEY in environment or AI Studio secrets.');
}
