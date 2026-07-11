import { PROVIDERS } from "@/lib/ai/provider";
import { z } from "zod";

export const analysisRequestSchema = z.object({
  code: z.string(),
  provider: z.enum(PROVIDERS),
  userAPIKey: z.string().min(1, "API key should not be empty"),
  modelId: z.string().min(1, "modelId should not be empty"),
  language: z.string(),
  problemTitle: z.string().min(1, "problem title should not be empty"),
  baseUrl: z.string().optional(),
});

export const analysisSchema = z.object({
  approach: z.object({
    summary: z.string().describe("e.g. Hmm, passes but could be cleaner."),
    current: z
      .string()
      .describe(
        "Current approach used in the problem, e.g., Iterative Brute Force",
      ),
    suggested: z
      .string()
      .describe("Suggested optimal approach to be used, e.g., Two pointers"),
    keyIdea: z
      .string()
      .describe(
        "Suggestion given to user for better problem solving, e.g., Reduce complexity from O(N²) to O(N) by using two pointers starting from ends.",
      ),
  }),
  efficiency: z.object({
    timeCurrent: z
      .string()
      .regex(/^O\(.*\)$/, "Must be exactly in O(...) format")
      .describe(
        "Strictly ONE word Big-O notation ONLY. e.g., O(N), O(N^2), O(N log N). No extra text whatsoever.",
      ),
    timeSuggested: z
      .string()
      .regex(/^O\(.*\)$/, "Must be exactly in O(...) format")
      .describe(
        "Strictly ONE word suggested Big-O notation ONLY. e.g., O(1), O(N).",
      ),
    spaceCurrent: z
      .string()
      .regex(/^O\(.*\)$/, "Must be exactly in O(...) format")
      .describe("Strictly ONE word Big-O space complexity ONLY. e.g., O(1)"),
    spaceSuggested: z
      .string()
      .regex(/^O\(.*\)$/, "Must be exactly in O(...) format")
      .describe(
        "Strictly ONE word suggested space complexity ONLY. e.g., O(N)",
      ),
    suggestions: z
      .string()
      .describe(
        "Actionable suggestion given to user for optimizing loops or space, e.g., Loop optimization needed.",
      ),
  }),
  codeStyle: z.object({
    readability: z
      .enum(["Poor", "Average", "Good", "Excellent"])
      .describe(
        "Categorize the code readability strictly into one of these options.",
      ),

    structure: z
      .enum(["Poor", "Average", "Good", "Excellent"])
      .describe(
        "Categorize the code structure strictly into one of these options.",
      ),

    suggestions: z
      .string()
      .describe(
        "Suggestions to improve code structure and readability, e.g., Add indentation and meaningful variable names.",
      ),
  }),
});

// TypeScript type generation
export type AnalysisSchemaType = z.infer<typeof analysisSchema>;
