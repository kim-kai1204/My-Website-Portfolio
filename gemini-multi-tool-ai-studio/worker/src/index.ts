interface Env {
  GEMINI_API_KEY: string;
}

const MODEL = "gemini-3-flash-preview";
const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";
const SYSTEM_PROMPT =
  "당신은 매우 지능적이고 친절한 AI 비서입니다. 모든 질문에 한국어로 친절하고 정확하게 답변해 주세요.";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const jsonResponse = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers || {}),
    },
  });

const errorResponse = (message: string, status = 400) =>
  new Response(message, { status, headers: corsHeaders });

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl);
  if (!match) {
    return { mimeType: "image/jpeg", data: dataUrl };
  }
  return { mimeType: match[1], data: match[2] };
};

const extractText = (payload: any) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((part: any) => part.text || "").join("").trim();
};

const callGemini = async (env: Env, body: unknown) => {
  const response = await fetch(`${API_ROOT}/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, text };
  }

  return { ok: true, data: JSON.parse(text) };
};

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return errorResponse("Method Not Allowed", 405);
    }

    if (!env.GEMINI_API_KEY) {
      return errorResponse("Missing GEMINI_API_KEY", 500);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");
    const payload = await request.json<Record<string, unknown>>();

    if (path === "/v1/chat") {
      const message = String(payload.message || "").trim();
      if (!message) return errorResponse("Message is required");

      const result = await callGemini(env, {
        contents: [{ role: "user", parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      });

      if (!result.ok) return errorResponse(result.text, result.status);
      return jsonResponse({ text: extractText(result.data) });
    }

    if (path === "/v1/analyze-image") {
      const image = String(payload.image || "");
      const prompt = String(payload.prompt || "");
      if (!image) return errorResponse("Image is required");

      const { mimeType, data } = parseDataUrl(image);
      const result = await callGemini(env, {
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data, mimeType } },
              { text: prompt || "이 이미지를 상세히 분석해 주세요." },
            ],
          },
        ],
      });

      if (!result.ok) return errorResponse(result.text, result.status);
      return jsonResponse({ text: extractText(result.data) });
    }

    if (path === "/v1/analyze-text") {
      const text = String(payload.text || "").trim();
      if (!text) return errorResponse("Text is required");

      const result = await callGemini(env, {
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "다음 텍스트를 분석하여 감정(sentiment), 주제(topics), 요약(summary)을 포함한 구조화된 데이터를 한국어로 제공해 주세요:\n\n" +
                  text,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              sentiment: {
                type: "STRING",
                description: "Positive(긍정), Negative(부정), 또는 Neutral(중립)",
              },
              score: { type: "NUMBER", description: "0에서 1 사이의 긍정 점수" },
              topics: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    relevance: { type: "NUMBER" },
                  },
                  required: ["name", "relevance"],
                },
              },
              summary: { type: "STRING" },
            },
            required: ["sentiment", "score", "topics", "summary"],
          },
        },
      });

      if (!result.ok) return errorResponse(result.text, result.status);

      const raw = extractText(result.data);
      const cleaned = raw.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(cleaned);
        return jsonResponse({ result: parsed });
      } catch {
        return errorResponse("Failed to parse analysis response", 500);
      }
    }

    return errorResponse("Not Found", 404);
  },
};
