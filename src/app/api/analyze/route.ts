import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Gemini ke liye
import { analysisSchema } from "@/schemas/leetcode_analysis.schema";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 1. Handle Preflight OPTIONS requests
export async function OPTIONS() {
  return Response.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Frontend se baseUrl bhi nikal liya
    const {
      code,
      provider,
      userAPIKey,
      modelId,
      language,
      problemTitle,
      baseUrl,
    } = body;

    if (!userAPIKey) {
      return Response.json(
        { success: false, error: "API Key is missing." },
        { status: 400, headers: corsHeaders },
      );
    }

    let aiModel;

    // 2. Provider ke hisab se AI Model setup karna (Bina ENV variables ke)
    switch (provider) {
      case "openai":
        const openai = createOpenAI({ apiKey: userAPIKey });
        aiModel = openai(modelId);
        break;

      case "groq":
        // Groq is OpenAI compatible, just needs a different base URL
        const groq = createOpenAI({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: userAPIKey,
        });
        aiModel = groq(modelId);
        break;

      case "openrouter":
        // OpenRouter is also OpenAI compatible
        const openrouter = createOpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: userAPIKey,
        });
        aiModel = openrouter(modelId);
        break;

      case "custom":
        if (!baseUrl)
          throw new Error("Base URL is required for custom providers.");
        const customProvider = createOpenAI({
          baseURL: baseUrl,
          apiKey: userAPIKey,
        });
        aiModel = customProvider(modelId);
        break;

      case "gemini":
        const google = createGoogleGenerativeAI({ apiKey: userAPIKey });
        aiModel = google(modelId);
        break;

      default:
        return Response.json(
          { success: false, error: "Invalid provider selected." },
          { status: 400, headers: corsHeaders },
        );
    }

    // 3. AI SDK Call
    const result = await generateText({
      model: aiModel,
      output: Output.object({ schema: analysisSchema }),
      system: "You have to generate the response in following structure only.",
      prompt: `Analyze the following LeetCode code and provide time/space complexity and structure feedback.

Language Used:
${language}
Problem Title:
${problemTitle}
Code:
${code}

CRITICAL INSTRUCTION: You MUST return the output EXACTLY as a valid raw JSON object matching the provided schema. Do NOT wrap the JSON in markdown blocks (like \`\`\`json). Do NOT add any extra text, explanations, or conversational filler before or after the JSON. Just the raw JSON object.

EXAMPLE EXPECTED OUTPUT:

{
  "approach": {
    "summary": "Hmm, passes but could be cleaner.",
    "current": "Iterative Brute Force",
    "suggested": "Two Pointers",
    "keyIdea": "Reduce complexity from O(N²) to O(N) by using two pointers starting from ends."
  },
  "efficiency": {
    "timeCurrent": "O(N²)",
    "timeSuggested": "O(N)",
    "spaceCurrent": "O(1)",
    "spaceSuggested": "O(1)",
    "suggestions": "Loop optimization needed."
  },
  "codeStyle": {
    "readability": "Poor",
    "structure": "Good",
    "suggestions": "Add indentation and meaningful variable names."
  }
}
`,
    });

    return Response.json(
      { success: true, data: result.output },
      { headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Something went wrong during analysis.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
