import { DashboardShell } from "@/components/DashboardShell";
import { CandidateServiceCards } from "@/components/CandidateMockWorkspace";
import { PaymentTrustNote } from "@/components/PaymentTrustNote";

export default function CandidateServicesPage() {
  return (
    <DashboardShell type="candidate">
      <div>
        <h1 className="text-3xl font-black text-navy">Candidate Optimization Services</h1>
        <p className="mt-2 text-slate-600">Improve your ATS resume score, LinkedIn profile, and AI interview readiness so recruiters can understand your strengths faster.</p>
        <PaymentTrustNote context="services" />
        <div className="mt-6"><CandidateServiceCards /></div>
      </div>
    </DashboardShell>
  );
}
