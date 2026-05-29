import { DashboardShell } from "@/components/DashboardShell";
import { CompanyProfileEditor } from "@/components/RecruiterMockWorkspace";

export default function RecruiterOnboardingPage() {
  return (
    <DashboardShell type="recruiter">
      <CompanyProfileEditor />
    </DashboardShell>
  );
}
