import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { recruiterLogin } from "@/app/auth-flow-actions";

export default function RecruiterLoginPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  const unverified = searchParams?.error?.includes("not verified");

  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-trust">Recruiter login</p>
          <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Access approved recruiter tools.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Recruiters must verify email and receive admin approval before candidate access.</p>
        </div>
        <form action={recruiterLogin} className="card space-y-4">
          <AuthNotice error={searchParams?.error} message={searchParams?.message} />
          <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
          <div><label>Password</label><input className="mt-2" name="password" type="password" required /></div>
          <button className="btn-primary w-full" type="submit">Login</button>
          {unverified && <Link href="/recruiter/verify" className="btn-secondary w-full">Resend verification email/OTP</Link>}
          <Link href="/recruiter/signup" className="block text-center text-sm font-bold text-trust">New user? Create recruiter account</Link>
        </form>
      </main>
    </>
  );
}
