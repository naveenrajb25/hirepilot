import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPaymentsPanel } from "@/components/admin/AdminPaymentsPanel";
import { paymentRecords } from "@/lib/admin-data";

export default function AdminPaymentsPage() {
  return (
    <AdminShell title="Payments">
      <AdminPaymentsPanel initialPayments={paymentRecords} />
    </AdminShell>
  );
}
