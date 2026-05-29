import { generateMockScorecard } from "./data";
import { getInterviewQuestionForRole } from "./jobRoles";

export async function createInterviewQuestion(role: string, step: number) {
  if (step === 0) return getInterviewQuestionForRole(role);
  return "Share one measurable result, project, or situation that proves your readiness for this role.";
}

export async function scoreInterview(role: string, answers: string[]) {
  // Replace this with OpenAI or Gemini in production. Keep the return shape stable for the UI.
  const completeness = answers.join(" ").length > 180 ? 78 : 68;
  return generateMockScorecard(role, completeness);
}
