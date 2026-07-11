// /src/lib/ai/provider.ts
// This file contains gateway for providers
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createGroq } from "@ai-sdk/groq";
export const PROVIDERS = [
  "openai",
  "gemini",
  "anthropic",
  "groq",
  "custom",
] as const;
export type ProviderName = (typeof PROVIDERS)[number];

export function aiModel(
  aiProvider: ProviderName,
  api_key: string,
  model_id: string,
  base_url: string = "",
) {
  // 2. Early return pattern
  switch (aiProvider) {
    case "openai":
      const openai = createOpenAI({ apiKey: api_key });
      return openai(model_id);

    case "gemini":
      const gemini = createGoogleGenerativeAI({ apiKey: api_key });
      return gemini(model_id);

    case "anthropic":
      const anthropic = createAnthropic({ apiKey: api_key });
      return anthropic(model_id);
    case "groq":
      const groq = createGroq({ apiKey: api_key });
      return groq(model_id);

    case "custom":
      if (!base_url) {
        throw new Error("Base URL is required for custom providers");
      }
      const customProvider = createOpenAICompatible({
        name: "custom",
        baseURL: base_url,
        apiKey: api_key,
      });
      return customProvider(model_id);

    default:
      throw new Error("Invalid provider or model");
  }
}
