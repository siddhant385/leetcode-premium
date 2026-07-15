// app/api/auth/github/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { authPayloadSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedData = authPayloadSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsedData.error.format() },
        { status: 400 },
      );
    }

    const { code } = parsedData.data;

    const githubRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      },
    );

    const data = await githubRes.json();

    if (data.error) {
      console.error("[GitHub Auth Error]:", data.error_description);
      return NextResponse.json(
        { error: data.error_description || data.error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { accessToken: data.access_token },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Proxy Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
