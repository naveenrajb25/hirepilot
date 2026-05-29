import { DashboardShell } from "@/components/DashboardShell";
import { CandidatePrivateProfile } from "@/components/CandidatePrivateProfile";

export default function CandidateProfilePage() {
  return (
    <DashboardShell type="candidate">
      <CandidatePrivateProfile />
    </DashboardShell>
  );
}
