import { DashboardShell } from "@/components/DashboardShell";
import { CandidateReportsWorkspace } from "@/components/CandidateReportsWorkspace";

export default function CandidateReportsPage() {
  return (
    <DashboardShell type="candidate">
      <CandidateReportsWorkspace />
    </DashboardShell>
  );
}
