import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1, "Slug cannot be empty")
  .regex(/^[a-z0-9-]+$/, "Invalid slug format");

export const questionResponseSchema = z.object({
  title: z.string(),
  companies: z.record(
    z.string(), // Company name (e.g., 'google')
    z.record(
      z.string(), // Time period (e.g., 'Thirty Days')
      z.object({
        frequency: z.union([z.string(), z.number()]), // Handle strings or parsed numbers
      }),
    ),
  ),
});

export type slubSchemaType = z.infer<typeof slugSchema>;
export type questionResponseSchema = z.infer<typeof questionResponseSchema>;
