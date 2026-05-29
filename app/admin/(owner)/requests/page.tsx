import { AdminShell } from "@/components/admin/AdminShell";
import { AdminRequestsPanel } from "@/components/admin/AdminRequestsPanel";

export default function AdminRequestsPage() {
  return (
    <AdminShell title="Service Requests">
      <AdminRequestsPanel />
    </AdminShell>
  );
}
