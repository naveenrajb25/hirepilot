import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, generateAiReport } from "@/lib/live-ai";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await generateAiReport(buildPrompt("Evaluate interview answers and generate overall readiness, communication, technical, confidence, problem-solving, project understanding, HR readiness, recruiter impression, strengths, weaknesses, roadmap, and next steps.", payload));
  return NextResponse.json(result);
}
