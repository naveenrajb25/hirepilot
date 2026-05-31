import { Header } from "@/components/Header";
import { CandidateLoginForm } from "@/components/CandidateAuthForms";
import { Suspense } from "react";

export default function CandidateLoginPage() {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-trust">Candidate login</p>
          <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Access your verified candidate account.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Access your recruiter-ready profile, ATS score, LinkedIn score, interview readiness, and visibility recommendations.</p>
        </div>
        <Suspense fallback={<div className="card">Loading login form...</div>}>
          <CandidateLoginForm />
        </Suspense>
      </main>
    </>
  );
}
