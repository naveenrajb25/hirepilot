import { DashboardShell } from "@/components/DashboardShell";
import { recruiterVisibleCandidates } from "@/lib/data";

export default function RecruiterShortlistedPage() {
  return (
    <DashboardShell type="recruiter">
      <div className="grid gap-4">
        <div className="card">
          <h1 className="text-3xl font-black text-navy">Shortlisted Candidates</h1>
          <p className="mt-2 text-slate-600">Review candidates saved for follow-up and final screening.</p>
        </div>
        {recruiterVisibleCandidates.slice(0, 2).map((candidate) => (
          <div key={candidate.id} className="card">
            <h2 className="text-xl font-black text-navy">{candidate.fullName}</h2>
            <p className="mt-1 text-sm text-slate-600">{candidate.preferredRole} · {candidate.city} · Score {candidate.employabilityScore}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
