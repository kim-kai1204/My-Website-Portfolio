
import { AnalysisResult } from "../types";

const runtimeBase =
  typeof window !== "undefined" && (window as Window & { __GEMINI_PROXY_URL__?: string }).__GEMINI_PROXY_URL__
    ? (window as Window & { __GEMINI_PROXY_URL__?: string }).__GEMINI_PROXY_URL__
    : "";
const rawBase = runtimeBase || import.meta.env.VITE_GEMINI_PROXY_URL || "";
const API_BASE = rawBase.replace(/\/+$/, "");

const request = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  if (!API_BASE) {
    throw new Error("VITE_GEMINI_PROXY_URL is not set");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Proxy request failed");
  }

  return response.json() as Promise<T>;
};

export class GeminiService {
  static async chat(message: string) {
    const data = await request<{ text: string }>("/v1/chat", { message });
    return data.text;
  }

  static async analyzeImage(
    base64Image: string,
    prompt: string = "이 이미지를 상세히 분석해 주세요. 감지된 객체, 주요 색상, 그리고 짧은 설명을 한국어로 작성해 주세요."
  ): Promise<string> {
    const data = await request<{ text: string }>("/v1/analyze-image", {
      image: base64Image,
      prompt,
    });
    return data.text || "분석 결과를 생성하지 못했습니다.";
  }

  static async analyzeText(text: string): Promise<AnalysisResult> {
    const data = await request<{ result: AnalysisResult }>("/v1/analyze-text", { text });
    return data.result;
  }
}
