import { DashboardShell } from "@/components/DashboardShell";
import { CompanyProfileEditor } from "@/components/RecruiterMockWorkspace";

export default function RecruiterProfilePage() {
  return (
    <DashboardShell type="recruiter">
      <CompanyProfileEditor />
    </DashboardShell>
  );
}
