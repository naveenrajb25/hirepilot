import Link from "next/link";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/DashboardShell";
import { candidates } from "@/lib/data";
import { ScoreRing } from "@/components/ScoreRing";
import { candidateCookieName, decodeMockSession, type CandidateMockSession } from "@/lib/mock-auth";

export default async function CandidateDashboardPage() {
  const candidate = candidates[0];
  const cookieStore = await cookies();
  const session = decodeMockSession<CandidateMockSession>(cookieStore.get(candidateCookieName)?.value);
  const score = candidate.employabilityScore;
  const visibility = score < 50 ? "Low Visibility" : score < 65 ? "Improving" : score < 85 ? "Recruiter Ready" : "High Visibility";

  return (
    <DashboardShell type="candidate">
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-3xl font-black text-navy">Your Recruiter Visibility Dashboard</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
            <span className="rounded-md bg-skysoft px-3 py-2 text-navy">Logged in as {session?.email || "candidate account"}</span>
            <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Status: Verified</span>
            <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Onboarding: Completed</span>
            <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Recruiter Visibility: {visibility}</span>
          </div>
          <p className="mt-4 text-slate-600">Applied to many jobs but not getting calls? Build a recruiter-ready profile with ATS resume score, LinkedIn optimization, portfolio proof, and AI interview readiness score.</p>
          <div className="mt-5"><ScoreRing score={candidate.employabilityScore} /></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Higher scores can improve recruiter visibility. HirePilot does not guarantee job placement.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Stat label="ATS Resume Score" value="82" />
          <Stat label="LinkedIn Score" value="76" />
          <Stat label="Portfolio Strength" value="Strong" />
          <Stat label="AI Interview Score" value={candidate.aiInterviewScore} />
          <Stat label="Overall Interview Readiness" value={candidate.employabilityScore} />
          <Stat label="Visibility" value={visibility} />
        </div>
        <div className="card">
          <h2 className="text-2xl font-black text-navy">Your Recruiter Visibility Journey</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
            {["Profile completed", "Resume uploaded", "LinkedIn added", "Projects/GitHub added", "AI interview completed", "Score improved", "Visible to recruiters"].map((step) => (
              <div key={step} className="rounded-md bg-skysoft p-3 text-sm font-bold text-navy">{step}</div>
            ))}
          </div>
          <Link href="/candidate/services" className="btn-primary mt-6">Improve My Score</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link className="card hover:border-trust" href="/candidate/services">Resume ATS Optimization</Link>
          <Link className="card hover:border-trust" href="/candidate/services">LinkedIn Optimization</Link>
          <Link className="card hover:border-trust" href="/candidate/services">AI Interview Readiness</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-xl font-black text-navy">Interview history</h2>
            <p className="mt-2 text-sm text-slate-600">Standard Interview completed for Python Developer. Next recommended: Full Interview Simulation.</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-black text-navy">Improvement trend</h2>
            <p className="mt-2 text-sm text-slate-600">Readiness improved from 72 to 88 after resume, LinkedIn, and portfolio completion.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="card"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-navy">{value}</p></div>;
}
