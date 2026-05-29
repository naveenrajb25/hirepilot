import { DashboardShell } from "@/components/DashboardShell";
import { CandidateScorecardWorkspace } from "@/components/CandidateMockWorkspace";

export default function ScorecardPage() {
  return (
    <DashboardShell type="candidate">
      <CandidateScorecardWorkspace />
    </DashboardShell>
  );
}
