import { AdminShell } from "@/components/admin/AdminShell";
import { ServicesAdminPanel } from "@/components/admin/LocalAdminPanels";
import { adminActivityLogs, candidateServices } from "@/lib/admin-data";

export default function AdminServicesPage() {
  return (
    <AdminShell title="Candidate Paid Services Management">
      <ServicesAdminPanel initialServices={candidateServices} initialLogs={adminActivityLogs} />
    </AdminShell>
  );
}
