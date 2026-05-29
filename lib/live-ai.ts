const fallbackMessage = "Your request has been submitted for AI-assisted review. The report will be processed shortly.";

export async function generateAiReport(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { status: "processing", message: fallbackMessage };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
      cache: "no-store"
    });

    if (!response.ok) return { status: "processing", message: fallbackMessage };
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { status: "complete", report: text || fallbackMessage };
  } catch {
    return { status: "processing", message: fallbackMessage };
  }
}

export function buildPrompt(task: string, payload: unknown) {
  return [
    "You are HirePilot, an employability verification and recruiter-readiness assistant for the Indian hiring market.",
    "Do not guarantee jobs or placement.",
    "Return concise, practical, recruiter-friendly output.",
    `Task: ${task}`,
    `Candidate data: ${JSON.stringify(payload)}`
  ].join("\n");
}
