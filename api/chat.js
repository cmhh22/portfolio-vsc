/* Vercel serverless � streams Copilot from Gemini */
const SYSTEM_PROMPT = `You are CMHH's Copilot � friendly AI for Carlos Manuel Hern�ndez's portfolio. Answer only about Carlos. Be professional, max 3 paragraphs. Spanish or English.`;

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") return jsonError(405, "Method not allowed");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return jsonError(500, "API key not set");
  
  let body = {};
  try { body = await req.json(); } catch (e) {}
  const msg = (body?.message || "").toString().trim();
  if (!msg) return jsonError(400, "Missing message");
  
  try {
    const requestBody = {
      contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + msg }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    };

    const modelUrls = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    ];

    let res = null;
    let lastStatus = 502;
    let lastErrorText = "";

    for (const modelUrl of modelUrls) {
      res = await fetch(modelUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) break;

      lastStatus = res.status;
      lastErrorText = await res.text().catch(() => "");
      console.error("API:", res.status, lastErrorText.slice(0, 120), modelUrl);
      if (res.status !== 429 && res.status !== 404) break;
    }

    if (!res || !res.ok) {
      return jsonError(502, "API " + lastStatus);
    }

    const j = await res.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || j?.text;
    if (!text) return jsonError(502, "No response");
    
    const encoder = new TextEncoder();
    const words = text.split(/(\s+)/);
    const stream = new ReadableStream({
      start(ctrl) {
        let i = 0;
        const send = () => {
          if (i >= words.length) {
            ctrl.enqueue(encoder.encode("data: " + JSON.stringify({ done: true }) + "\n\n"));
            ctrl.close();
            return;
          }
          if (words[i]) ctrl.enqueue(encoder.encode("data: " + JSON.stringify({ text: words[i] }) + "\n\n"));
          i++;
          setTimeout(send, 20);
        };
        send();
      }
    });
    
    return new Response(stream, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    });
  } catch (e) {
    console.error(e);
    return jsonError(502, String(e));
  }
}

function jsonError(s, m) {
  return new Response(JSON.stringify({ error: m }), {
    status: s,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }
  });
}
