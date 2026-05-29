import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, generateAiReport } from "@/lib/live-ai";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await generateAiReport(buildPrompt("Generate an overall HirePilot scorecard combining ATS score, LinkedIn score, portfolio strength, AI interview score, visibility level, strengths, weaknesses, roadmap, and recruiter-ready summary.", payload));
  return NextResponse.json(result);
}
