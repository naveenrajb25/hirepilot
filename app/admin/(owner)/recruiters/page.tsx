import { AdminShell } from "@/components/admin/AdminShell";
import { RecruitersAdminPanel } from "@/components/admin/LocalAdminPanels";
import { adminActivityLogs, recruiters } from "@/lib/admin-data";

export default function AdminRecruitersPage() {
  return (
    <AdminShell title="Recruiter Management">
      <RecruitersAdminPanel initialRecruiters={recruiters} initialLogs={adminActivityLogs} />
    </AdminShell>
  );
}
