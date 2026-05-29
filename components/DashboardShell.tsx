import { cookies } from "next/headers";
import { BriefcaseBusiness, LogOut, UserRound } from "lucide-react";
import { candidateLogout, recruiterLogout } from "@/app/auth-flow-actions";
import { candidateCookieName, decodeMockSession, recruiterCookieName, type CandidateMockSession, type RecruiterMockSession } from "@/lib/mock-auth";
import { BrandLogo } from "./BrandLogo";
import { DashboardNavLinks } from "./DashboardNavLinks";

const links = {
  candidate: [
    ["/candidate/dashboard", "Dashboard"],
    ["/candidate/portfolio", "Portfolio"],
    ["/candidate/interview", "AI Interview"],
    ["/candidate/scorecard", "Scorecard"],
    ["/candidate/services", "Services"],
    ["/candidate/profile", "Profile"]
  ],
  recruiter: [
    ["/recruiter/dashboard", "Dashboard"],
    ["/recruiter/candidates", "Search Candidates"],
    ["/recruiter/shortlisted", "Shortlisted"],
    ["/recruiter/pricing", "Pricing/Subscription"],
    ["/recruiter/profile", "Company Profile"]
  ]
};

export async function DashboardShell({
  children,
  type
}: {
  children: React.ReactNode;
  type: "candidate" | "recruiter";
}) {
  const cookieStore = await cookies();
  const candidate = type === "candidate" ? decodeMockSession<CandidateMockSession>(cookieStore.get(candidateCookieName)?.value) : null;
  const recruiter = type === "recruiter" ? decodeMockSession<RecruiterMockSession>(cookieStore.get(recruiterCookieName)?.value) : null;
  const email = candidate?.email || recruiter?.email || "account@hirepilot.com";
  const logout = type === "candidate" ? candidateLogout : recruiterLogout;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <BrandLogo href={type === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard"} />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-md bg-skysoft px-3 py-2 font-bold text-navy">
              {type === "candidate" ? <UserRound size={16} /> : <BriefcaseBusiness size={16} />}
              {email}
            </span>
            <form action={logout}>
              <button className="btn-secondary py-2" type="submit"><LogOut size={16} /> Logout</button>
            </form>
          </div>
        </div>
      </header>
      <div className="section grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-slate-200 bg-white p-2 shadow-soft lg:sticky lg:top-24 lg:h-fit">
          <DashboardNavLinks links={links[type]} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
