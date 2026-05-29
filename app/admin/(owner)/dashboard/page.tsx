import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/AdminControls";
import { adminActivityLogs, adminSettings, interviewSessions, paymentRecords, recruiters } from "@/lib/admin-data";
import { candidates } from "@/lib/data";

export default function AdminDashboardPage() {
  const subscribedRecruiters = recruiters.filter((recruiter) => recruiter.subscriptionStatus === "active").length;
  const unverifiedCandidates = candidates.filter((candidate) => !candidate.emailVerified).length;
  const verifiedCandidates = candidates.filter((candidate) => candidate.emailVerified).length;
  const pendingRecruiters = recruiters.filter((recruiter) => recruiter.recruiterAccountStatus === "pending_admin_approval" || recruiter.recruiterStatus === "pending").length;
  const approvedRecruiters = recruiters.filter((recruiter) => recruiter.isApproved).length;
  const rejectedRecruiters = recruiters.filter((recruiter) => recruiter.recruiterStatus === "rejected").length;
  const currentSubscriptions = recruiters.filter((recruiter) => recruiter.subscriptionStatus === "active").length;
  const pendingPayments = paymentRecords.filter((payment) => payment.status === "pending_verification").length;

  return (
    <AdminShell title="Overview Dashboard">
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric label="Total candidates" value={candidates.length} />
          <Metric label="Total recruiters" value={recruiters.length} />
          <Metric label="AI interviews" value={interviewSessions.length} />
          <Metric label="Scorecards" value={interviewSessions.length} />
          <Metric label="Subscribed recruiters" value={subscribedRecruiters} />
          <Metric label="Revenue" value={adminSettings.revenuePlaceholder} />
          <Metric label="Unverified candidates" value={unverifiedCandidates} />
          <Metric label="Verified candidates" value={verifiedCandidates} />
          <Metric label="Pending recruiter approvals" value={pendingRecruiters} />
          <Metric label="Approved recruiters" value={approvedRecruiters} />
          <Metric label="Rejected recruiters" value={rejectedRecruiters} />
          <Metric label="Target candidate profiles" value="50" />
          <Metric label="Current candidate profiles" value={candidates.length} />
          <Metric label="Target recruiter subscriptions" value="5" />
          <Metric label="Current subscriptions" value={currentSubscriptions} />
          <Metric label="Pending payments" value={pendingPayments} />
          <Metric label="Pending approvals" value={pendingRecruiters} />
        </section>
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="card xl:col-span-1">
            <h2 className="text-xl font-black text-navy">Recent candidate signups</h2>
            <div className="mt-4 grid gap-3">
              {candidates.slice(0, 3).map((candidate) => (
                <Link key={candidate.id} href="/admin/candidates" className="rounded-md border border-slate-200 p-3 hover:border-trust">
                  <p className="font-bold text-navy">{candidate.fullName}</p>
                  <p className="text-sm text-slate-600">{candidate.preferredRole} · {candidate.city}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="card xl:col-span-1">
            <h2 className="text-xl font-black text-navy">Recent recruiter signups</h2>
            <div className="mt-4 grid gap-3">
              {recruiters.map((recruiter) => (
                <Link key={recruiter.id} href="/admin/recruiters" className="rounded-md border border-slate-200 p-3 hover:border-trust">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-navy">{recruiter.companyName}</p>
                    <StatusBadge status={recruiter.recruiterStatus} />
                  </div>
                  <p className="text-sm text-slate-600">{recruiter.recruiterName}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="card xl:col-span-1">
            <h2 className="text-xl font-black text-navy">Recent admin activity</h2>
            <div className="mt-4 grid gap-3">
              {adminActivityLogs.map((log) => (
                <div key={log.id} className="rounded-md border border-slate-200 p-3">
                  <p className="font-bold text-navy">{log.actionType}</p>
                  <p className="text-sm text-slate-600">{log.details}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{log.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-navy">{value}</p>
    </div>
  );
}
