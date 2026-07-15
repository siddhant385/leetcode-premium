import { z } from "zod";

// 1. Zod Schema Define Karo
export const authPayloadSchema = z.object({
  code: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Authorization code is required"
          : "Code must be a string",
    })
    .min(1, "Code cannot be empty"),
});
