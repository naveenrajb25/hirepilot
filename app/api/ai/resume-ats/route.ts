import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, generateAiReport } from "@/lib/live-ai";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await generateAiReport(buildPrompt("Generate an ATS report with ATS score, missing keywords, role match score, formatting issues, skill suggestions, suggested bullet points, recruiter visibility impact, and final improvement summary.", payload));
  return NextResponse.json(result);
}
