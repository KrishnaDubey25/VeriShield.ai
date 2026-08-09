import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. News Credibility Analysis Endpoint
app.post("/api/analyze/news", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Perform an objective, rigorous news credibility analysis for the following article text or headline:
"${text}"

Evaluate key factual claims, source citations, emotional bias/sensationalism, and logical consistency. Provide accurate ratings (0-100%).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trustScore: { type: Type.NUMBER, description: "Credibility score out of 100" },
            verdict: { type: Type.STRING, description: "credible, suspicious, misleading, or satire" },
            verdictLabel: { type: Type.STRING, description: "Concise verdict badge title" },
            summary: { type: Type.STRING, description: "Detailed, objective analysis summary of claims and sources" },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["label", "score", "description"]
              }
            }
          },
          required: ["trustScore", "verdict", "verdictLabel", "summary", "metrics"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("News analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze news" });
  }
});

// 2. Scam / Phishing / Voice Message Analysis Endpoint
app.post("/api/analyze/scam", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Message text is required" });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze the following message / SMS / email / voice transcript for security threats, scams, phishing links, social engineering tactics, or legitimate notifications:
"${text}"

Provide a precise threat assessment.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trustScore: { type: Type.NUMBER, description: "Safety score out of 100 (100 = completely safe & verified, <50 = dangerous scam)" },
            verdict: { type: Type.STRING, description: "safe, warning, or scam" },
            verdictLabel: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Detailed security analysis explaining identified risks or verified safety cues" },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["label", "score", "description"]
              }
            }
          },
          required: ["trustScore", "verdict", "verdictLabel", "summary", "metrics"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Scam analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze message" });
  }
});

// 3. Photo Forensics Endpoint
app.post("/api/analyze/photo", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64
            }
          },
          {
            text: `Examine this photo for visual authenticity, AI generation indicators (Midjourney, DALL-E, Stable Diffusion, Flux), face manipulation, lighting consistency, texture patterns, and visual subject.
Describe specifically what is depicted in the photo and provide a factual, realistic forensic evaluation.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trustScore: { type: Type.NUMBER, description: "Authenticity score 0-100" },
            verdict: { type: Type.STRING, description: "authentic, ai_generated, edited, or deepfake" },
            verdictLabel: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Detailed report describing the photo contents, optical lighting, and forensic indicators" },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["label", "score", "description"]
              }
            }
          },
          required: ["trustScore", "verdict", "verdictLabel", "summary", "metrics"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Photo analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze photo" });
  }
});

// 4. Document PII Detection Endpoint
app.post("/api/analyze/doc", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
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
        responseMimeType: "application/json",
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
                required: ["id", "x", "y", "width", "height", "label"]
              }
            }
          },
          required: ["documentType", "summary", "piiBoxes"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Doc PII analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze document PII" });
  }
});

// 5. Video Deepfake Analysis Endpoint
app.post("/api/analyze/video", async (req, res) => {
  try {
    const { videoName, thumbnailBase64, mimeType } = req.body;
    
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    let contentsPayload: any = `Analyze video file "${videoName || "video.mp4"}" for AI face synthesis, deepfake lip-sync anomalies, temporal lighting artifacts, and optical flow inconsistencies. Provide a realistic forensic report.`;

    if (thumbnailBase64) {
      const cleanBase64 = thumbnailBase64.replace(/^data:image\/\w+;base64,/, "");
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64
            }
          },
          {
            text: `Analyze this frame from video file "${videoName || "video.mp4"}" for facial reenactment, deepfake lip-sync mismatch, optical flow anomalies, temporal frame jitter, and visual authenticity. Provide a realistic assessment.`
          }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
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
                required: ["label", "score", "description"]
              }
            }
          },
          required: ["trustScore", "verdict", "verdictLabel", "summary", "metrics"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Video analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze video" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
