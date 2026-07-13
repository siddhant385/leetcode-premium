import { NextRequest, NextResponse } from "next/server";
import { slugSchema, questionResponseSchema } from "./schema";
import leetcodeDB from "@data/optimized_leetcode_data.json";

export async function GET(
  request: NextRequest,
  // BASS YAHAN TYPE CHANGE KIYA HAI -> Promise wrap kar diya
  { params }: { params: Promise<{ slug: string }> },
) {
  // 1. Validate Input (Slug)
  const resolvedParams = await params;
  const slugValidation = slugSchema.safeParse(resolvedParams.slug);

  if (!slugValidation.success) {
    return NextResponse.json(
      { error: "Invalid slug format", details: slugValidation.error.format() },
      { status: 400 },
    );
  }

  const cleanSlug = slugValidation.data;
  const rawQuestionData = (leetcodeDB as Record<string, any>)[cleanSlug];

  if (!rawQuestionData) {
    return NextResponse.json(
      { error: "Company data not found for this question" },
      { status: 404 },
    );
  }

  // 2. Validate Output (Response)
  const responseValidation = questionResponseSchema.safeParse(rawQuestionData);

  if (!responseValidation.success) {
    // Agar hamara internal JSON galti se corrupt ho gaya ho
    console.error("Data mismatch in JSON DB:", responseValidation.error);
    return NextResponse.json(
      { error: "Internal Server Error: Data format mismatch" },
      { status: 500 },
    );
  }

  // 3. Send perfectly structured and validated data
  return NextResponse.json(responseValidation.data, { status: 200 });
}
