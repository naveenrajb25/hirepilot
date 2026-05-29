import { AdminShell } from "@/components/admin/AdminShell";
import { InterviewsAdminPanel } from "@/components/admin/LocalAdminPanels";
import { adminActivityLogs, interviewSessions } from "@/lib/admin-data";

export default function AdminInterviewsPage() {
  return (
    <AdminShell title="Interview & Scorecard Management">
      <InterviewsAdminPanel initialSessions={interviewSessions} initialLogs={adminActivityLogs} />
    </AdminShell>
  );
}
