import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, generateAiReport } from "@/lib/live-ai";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = await generateAiReport(buildPrompt("Generate role-based interview questions for Easy 15, Standard 25, and Full Interview Simulation 30-40 question modes using resume, skills, projects, role, experience, HR and scenario categories.", payload));
  return NextResponse.json(result);
}
