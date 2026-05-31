import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { candidateLogin } from "@/app/auth-flow-actions";

export default function CandidateLoginPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-trust">Candidate login</p>
          <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Access your verified candidate account.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Access your recruiter-ready profile, ATS score, LinkedIn score, interview readiness, and visibility recommendations.</p>
        </div>
        <form action={candidateLogin} className="card space-y-4">
          <AuthNotice error={searchParams?.error} message={searchParams?.message} />
          <div><label htmlFor="candidate-email">Email</label><input id="candidate-email" className="mt-2" name="email" type="email" required /></div>
          <div><label htmlFor="candidate-password">Password</label><input id="candidate-password" className="mt-2" name="password" type="password" required /></div>
          <button className="btn-primary w-full" type="submit">Login</button>
          <Link href="/candidate/signup" className="block text-center text-sm font-bold text-trust">New user? Create account</Link>
        </form>
      </main>
    </>
  );
}
