import { DashboardShell } from "@/components/DashboardShell";
import { CandidateDashboardWorkspace } from "@/components/CandidateDashboardWorkspace";

export default function CandidateDashboardPage() {
  return (
    <DashboardShell type="candidate">
      <CandidateDashboardWorkspace />
    </DashboardShell>
  );
}
