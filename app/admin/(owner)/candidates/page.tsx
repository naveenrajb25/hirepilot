import { AdminShell } from "@/components/admin/AdminShell";
import { CandidatesAdminPanel } from "@/components/admin/LocalAdminPanels";
import { adminActivityLogs } from "@/lib/admin-data";
import { candidates } from "@/lib/data";

export default function AdminCandidatesPage() {
  return (
    <AdminShell title="Candidate Management">
      <CandidatesAdminPanel initialCandidates={candidates} initialLogs={adminActivityLogs} />
    </AdminShell>
  );
}
