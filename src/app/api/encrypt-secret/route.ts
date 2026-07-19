import sodium from "libsodium-wrappers";
import { encryptSecretRequestSchema } from "./schema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    // Validate the incoming payload using Zod
    const { secret, key } = encryptSecretRequestSchema.parse(rawBody);

    // Wait for libsodium to be ready
    await sodium.ready;

    // Convert the secret and key to Uint8Arrays
    const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
    const binsec = sodium.from_string(secret);

    // Encrypt the secret using libsodium
    const encBytes = sodium.crypto_box_seal(binsec, binkey);

    // Convert the encrypted Uint8Array back to Base64
    const encryptedSecret = sodium.to_base64(
      encBytes,
      sodium.base64_variants.ORIGINAL
    );

    return Response.json({
      success: true,
      data: {
        encryptedSecret,
      },
    });
  } catch (error: unknown) {
    console.error("Encryption API Error:", error);
    
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Invalid request payload",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to encrypt secret.";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
