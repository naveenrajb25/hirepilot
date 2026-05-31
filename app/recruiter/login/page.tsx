import { Header } from "@/components/Header";
import { RecruiterLoginForm } from "@/components/RecruiterAuthForms";
import { Suspense } from "react";

export default function RecruiterLoginPage() {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-trust">Recruiter login</p>
          <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Access approved recruiter tools.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Recruiters need admin approval before candidate search and profile access.</p>
        </div>
        <Suspense fallback={<div className="card">Loading login form...</div>}>
          <RecruiterLoginForm />
        </Suspense>
      </main>
    </>
  );
}
