import { DashboardShell } from "@/components/DashboardShell";
import { CandidateInterviewWorkspace } from "@/components/CandidateMockWorkspace";

export default function InterviewPage() {
  return (
    <DashboardShell type="candidate">
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-3xl font-black text-navy">AI Interview & Employability Verification</h1>
          <p className="mt-2 text-slate-600">Your AI interview helps recruiters understand your communication, role knowledge, confidence, and practical thinking before they contact you.</p>
          <p className="mt-3 rounded-md bg-skysoft p-3 text-sm font-semibold text-navy">Choose Easy, Standard, or Full Interview Simulation mode to build a recruiter-ready interview readiness report.</p>
        </div>
        <CandidateInterviewWorkspace />
      </div>
    </DashboardShell>
  );
}
