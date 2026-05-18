/* Vercel serverless function — streams Copilot chat from Google Gemini.
   Free tier: gemini-1.5-flash · 15 req/min · 1,500 req/day · no card needed.

   Required env var (set in Vercel dashboard):
     GEMINI_API_KEY  — get one at https://aistudio.google.com/apikey

   Returns Server-Sent Events (SSE). Each event is a JSON line: {"text": "..."}.
   Final line is {"done": true}. On error: {"error": "..."}.
*/

const SYSTEM_PROMPT = `You are CMHH's Copilot — a short, friendly AI assistant embedded in Carlos Manuel Hernández's portfolio.

Briefing:
- Carlos Manuel Hernández, 4th-year CS student at UCLV (Cuba), AI-Driven Software Engineer · ML Engineer in progress · Data Scientist.
- Experience:
  * AI-Driven Software Engineer @ Freelance (Nov 2025 — present) — built a production Telegram bot for accounting/inventory using OpenAI, asyncio, SQLite — cut manual data entry by 40%.
  * University Intern @ ETECSA (Cuba's national telecom, Sept-Oct 2024) — led Asset Sync reconciling finance DBs and operational inventories. Python + Django + Pandas + Docker + GitHub Actions. Reduced manual processing by 95%.
- Projects (github.com/cmhh22):
  * etecsa-asset-sync — real production system, anomaly detection, A-F data quality, 45+ pytest tests, full CI/CD.
  * ml-bigdata — NYC Taxi 1.5M+ rows with Dask, XGBoost R²=0.8234, SHAP, LightGBM live on Streamlit.
  * minecraft-llm-agent — Node.js bot "Bartolo" driven by GPT-4.1 / Grok-3 / Mistral / DeepSeek, live JS generation, SES sandbox.
  * transformer-experiments — BERT vs Qwen emotion classification (~92.6%, BERT 6× faster) + RAG with ChromaDB.
  * pytorch-deep-learning — MLP/MNIST 98%, EfficientNet-B0/CIFAR-10 98%, Bi-LSTM+Attention/IMDB 88%.
  * eda-storytelling — Streamlit Airbnb NYC dashboard, K-means, geographic heatmaps, Pareto analysis.
- Stack: Python, SQL, JS/TS, C++. PyTorch, scikit-learn, XGBoost, LightGBM, TensorFlow, HuggingFace. LangChain, ChromaDB, RAG, LLM agents, OpenAI / GitHub Models API. Django, FastAPI, Node.js, Socket.io. Pandas, NumPy, Dask, PostgreSQL, MySQL, SQLite. Docker, GitHub Actions, MLflow, Git, Streamlit.
- Certifications: HackerRank Python & SQL, Kaggle (Python, Pandas, Intro/Intermediate ML), HuggingFace NLP (in progress).
- Languages: Spanish (native), English (professional working).
- Looking for: AI/ML internships, research, remote AI/ML positions, open-source collaborations.
- Contact: carlosmanuelhdezhdez@gmail.com · +53 56658638 · github.com/cmhh22 · linkedin.com/in/cmhh22 · Cuba.

Easter egg: if literally asked "who built this portfolio?", reply: "Carlos built it with Claude. The whole thing is a VS Code metaphor — every section is a 'file' in the editor. Pretty meta, right? 😄"

Rules:
- Only answer about Carlos. Redirect kindly otherwise.
- Reply in the same language the user uses (Spanish or English).
- Be enthusiastic but professional. Plain text only, no markdown headers. Max 3 short paragraphs.`;

// Use Edge runtime for true streaming
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders(),
    });
  }
  if (req.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return jsonError(500, "GEMINI_API_KEY not set on the server.");

  let body;
  try { body = await req.json(); } catch { body = {}; }
  const userMessage = (body?.message || "").toString().trim();
  if (!userMessage) return jsonError(400, "Missing 'message' field.");
  if (userMessage.length > 1000) return jsonError(400, "Message too long (max 1000 chars).");

  // Real streaming with Gemini API streamGenerateContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent`;
  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userMessage }] 
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });
  } catch (e) {
    console.error("Upstream fetch error:", e);
    return jsonError(502, "Upstream fetch failed: " + String(e));
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    console.error("Upstream error:", upstream.status, errText.slice(0, 300));
    return jsonError(502, "API error " + upstream.status);
  }

  // Stream Gemini chunks as SSE events
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode("data: " + JSON.stringify({ done: true }) + "\n\n"));
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines[lines.length - 1]; // Keep incomplete line in buffer

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
              const chunk = JSON.parse(line);
              const text = extractTextFromResponse(chunk);
              if (text) {
                controller.enqueue(encoder.encode("data: " + JSON.stringify({ text }) + "\n\n"));
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      } catch (e) {
        console.error("Stream error:", e);
        controller.enqueue(encoder.encode("data: " + JSON.stringify({ error: "Stream failed" }) + "\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

function extractTextFromResponse(j) {
  if (!j) return null;
  // v1 generateContent response shape (primary)
  try {
    const tryPaths = [
      (o) => o?.candidates?.[0]?.content?.parts?.[0]?.text,
      (o) => o?.contents?.[0]?.parts?.[0]?.text,
      (o) => o?.text,
    ];
    for (const p of tryPaths) {
      const v = p(j);
      if (v && typeof v === "string" && v.trim()) return v.trim();
    }
  } catch (e) {
    console.error("extractTextFromResponse error:", e);
  }
  return null;
}






