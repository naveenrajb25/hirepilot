import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { completeCandidateOnboarding } from "@/app/auth-flow-actions";
import { AuthNotice } from "@/components/AuthNotice";

export default function CandidateOnboardingPage({ searchParams }: { searchParams?: { message?: string } }) {
  return (
    <DashboardShell type="candidate">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Candidate Onboarding</h1>
        <div className="mt-3"><AuthNotice message={searchParams?.message} /></div>
        <p className="mt-2 text-slate-600">Complete your portfolio, take the AI interview, and unlock an employability scorecard.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Profile basics", "Resume and links", "Skills and role"].map((item) => (
            <div key={item} className="rounded-md bg-skysoft p-4 font-bold text-navy">{item}</div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/candidate/portfolio" className="btn-secondary">Start portfolio</Link>
          <form action={completeCandidateOnboarding}>
            <button className="btn-primary" type="submit">Mark onboarding complete</button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
