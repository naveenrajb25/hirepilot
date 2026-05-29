import { AdminShell } from "@/components/admin/AdminShell";
import { PricingAdminPanel } from "@/components/admin/LocalAdminPanels";
import { adminActivityLogs, pricingPlans } from "@/lib/admin-data";

export default function AdminPricingPage() {
  return (
    <AdminShell title="Subscription & Pricing Management">
      <PricingAdminPanel initialPlans={pricingPlans} initialLogs={adminActivityLogs} />
    </AdminShell>
  );
}
