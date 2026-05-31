import { DashboardShell } from "@/components/DashboardShell";
import { RecruiterDashboardWorkspace } from "@/components/RecruiterDashboardWorkspace";

export default function RecruiterDashboardPage() {
  return (
    <DashboardShell type="recruiter">
      <RecruiterDashboardWorkspace />
    </DashboardShell>
  );
}
