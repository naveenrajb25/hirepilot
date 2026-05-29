import { DashboardShell } from "@/components/DashboardShell";
import { CandidatePortfolioEditor } from "@/components/CandidateMockWorkspace";

export default function CandidatePortfolioPage() {
  return (
    <DashboardShell type="candidate">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Portfolio Builder</h1>
        <p className="mt-2 text-slate-600">Your HirePilot portfolio is designed to help recruiters understand your skills faster than a normal resume. GitHub and project links are optional, but improve recruiter trust and visibility.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-emerald-50 p-3 font-bold text-emerald-700">Portfolio strength: Strong</div>
          <div className="rounded-md bg-skysoft p-3 font-bold text-navy">ATS resume readiness: Good</div>
          <div className="rounded-md bg-skysoft p-3 font-bold text-navy">AI interview status: Completed</div>
        </div>
        <div className="mt-6"><CandidatePortfolioEditor /></div>
      </div>
    </DashboardShell>
  );
}
