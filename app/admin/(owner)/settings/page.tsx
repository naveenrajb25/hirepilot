import { AdminMockForm } from "@/components/admin/AdminControls";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminSettings } from "@/lib/admin-data";

const settings = [
  ["Product brand name", adminSettings.productBrandName],
  ["Parent brand name", adminSettings.parentBrandName],
  ["Merchant account name", adminSettings.merchantAccountName],
  ["Payment disclosure", adminSettings.paymentDisclosureEnabled ? "Enabled" : "Disabled"],
  ["Payment disclosure text", adminSettings.paymentDisclosureText],
  ["Minimum score for recruiter visibility", adminSettings.minimumScoreForVisibility],
  ["Featured candidate boost", adminSettings.featuredCandidateBoost],
  ["Require recruiter approval", adminSettings.requireRecruiterApproval ? "Enabled" : "Disabled"],
  ["Require active subscription for contacts", adminSettings.requireActiveSubscriptionForContacts ? "Enabled" : "Disabled"],
  ["Platform maintenance mode", adminSettings.platformMaintenanceMode ? "Enabled" : "Disabled"],
  ["Revenue placeholder", adminSettings.revenuePlaceholder]
];

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Admin Settings">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <h2 className="text-xl font-black text-navy">Current platform rules</h2>
          <div className="mt-5 grid gap-3">
            {settings.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3">
                <p className="font-bold text-slate-700">{label}</p>
                <p className="font-black text-navy">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <AdminMockForm
          title="Edit platform settings"
          fields={["Product brand name", "Parent brand name", "Merchant account name", "Payment disclosure enabled", "Payment disclosure text", "Candidate visibility rules", "Minimum score", "Featured candidate boost", "Recruiter access rules", "Maintenance mode", "Revenue placeholder"]}
        />
      </div>
    </AdminShell>
  );
}
