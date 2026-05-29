import { DashboardShell } from "@/components/DashboardShell";
import { RecruiterSearchWorkspace } from "@/components/RecruiterMockWorkspace";
import { recruiterVisibleCandidates } from "@/lib/data";

export default function RecruiterCandidatesPage() {
  return (
    <DashboardShell type="recruiter">
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-3xl font-black text-navy">Verified Candidate Search</h1>
          <p className="mt-2 text-slate-600">Search by role, skills, city, experience, score range, language, and availability. Free access includes 2 candidate profile views before upgrade.</p>
        </div>
        <RecruiterSearchWorkspace candidates={recruiterVisibleCandidates} />
      </div>
    </DashboardShell>
  );
}
