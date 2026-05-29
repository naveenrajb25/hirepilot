import { AdminShell } from "@/components/admin/AdminShell";
import { AdminReportsPanel } from "@/components/admin/AdminReportsPanel";
import { aiReports } from "@/lib/admin-data";

export default function AdminReportsPage() {
  return (
    <AdminShell title="AI Reports">
      <AdminReportsPanel initialReports={aiReports} />
    </AdminShell>
  );
}
