import { DashboardShell } from "@/components/DashboardShell";
import { RecruiterPricingCatalog } from "@/components/PricingCatalog";
import { PaymentTrustNote } from "@/components/PaymentTrustNote";

export default function RecruiterPricingPage() {
  return (
    <DashboardShell type="recruiter">
      <div>
        <h1 className="text-3xl font-black text-navy">Recruiter Pricing</h1>
        <p className="mt-2 text-slate-600">Free recruiter access includes 2 candidate profile views. Upgrade to unlock more profile views, contact access, and resume downloads.</p>
        <PaymentTrustNote context="recruiter" />
        <RecruiterPricingCatalog />
      </div>
    </DashboardShell>
  );
}
