import { z } from "zod";

export const encryptSecretRequestSchema = z.object({
  secret: z.string().min(1, "Secret is required"),
  key: z.string().min(1, "Base64 key is required"),
});
