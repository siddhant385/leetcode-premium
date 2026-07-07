import { z } from "zod";
export const analysisSchema = z.object({
  approach: z.object({
    summary: z.string().describe("e.g. Hmm, passes but could be cleaner."),
    current: z
      .string()
      .describe(
        "Current approach used in the problem eg. Iterative Brute Force",
      ),
    suggested: z
      .string()
      .describe(
        "Suggested approach to be used in the problem eg. Two pointers",
      ),
    keyIdea: z
      .string()
      .describe(
        "Suggestion given to user for better problem solving eg. Reduce complexity from O(N²) to O(N) by using two pointers starting from ends.",
      ),
  }),
  efficiency: z.object({
    timeCurrent: z
      .string()
      .describe(
        "Current Time complexity of the code provided only in terms of O no text. e.g.,O(N²)",
      ),
    timeSuggested: z
      .string()
      .describe(
        "suggested optimal time complexity only in terms of O no text eg. O(N)",
      ),
    spaceCurrent: z
      .string()
      .describe("Current Space complexity only in terms of O no text eg. O(1)"),
    spaceSuggested: z
      .string()
      .describe(
        "Suggested Space complexity only in terms of O no text eg. O(1)",
      ),
    suggestions: z
      .string()
      .describe(
        "Suggestion give to user ofr better for better problem solving eg. Loop optimization needed",
      ),
  }),
  codeStyle: z.object({
    readability: z
      .string()
      .describe("How much the code is readable eg. Good Bad Excellent poor"),
    structure: z
      .string()
      .describe("How is the code structure eg. Good Bad Excellent poor"),
    suggestions: z
      .string()
      .optional()
      .describe(
        "Suggestion to be applied for the code structure and readability eg. Add indentation and meaningful variable names.",
      ),
  }),
});

export type AnalysisSchemaType = z.infer<typeof analysisSchema>;
