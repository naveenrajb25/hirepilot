import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, generateAiReport } from "@/lib/live-ai";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await generateAiReport(buildPrompt("Generate a LinkedIn optimization report with score, improved headline, improved about section, recruiter keywords, visibility tips, and skills to add.", payload));
  return NextResponse.json(result);
}
