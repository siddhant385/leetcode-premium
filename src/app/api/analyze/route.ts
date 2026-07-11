import { generateText, Output } from "ai";
import { aiModel } from "@/lib/ai/provider";
import { solutionAnalyzerPrompt } from "@/lib/ai/prompts";
import { analysisRequestSchema, analysisSchema } from "./schema";
export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    const body = analysisRequestSchema.parse(rawBody);

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

    const model = aiModel(provider, userAPIKey, modelId, baseUrl);

    // 2. Provider ke hisab se AI Model setup karna (Bina ENV variables ke)

    // 3. AI SDK Call
    const result = await generateText({
      model: model,
      output: Output.object({ schema: analysisSchema }),
      system: solutionAnalyzerPrompt,
      prompt: `Analyze the following LeetCode code and provide time/space complexity and structure feedback.

Language Used:
${language}
Problem Title:
${problemTitle}
Code:
${code}
`,
    });

    return Response.json({ success: true, data: result.output });
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Something went wrong during analysis.",
      },
      { status: 500 },
    );
  }
}
