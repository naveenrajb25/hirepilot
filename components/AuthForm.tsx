import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

type Props = {
  userType: "Candidate" | "Recruiter";
};

export function AuthForm({ userType }: Props) {
  const nextPath = userType === "Candidate" ? "/candidate/onboarding" : "/recruiter/onboarding";

  return (
    <main className="section grid min-h-[calc(100vh-72px)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-trust">{userType} access</p>
        <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">
          Sign up or log in with email and password.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Supabase Auth is wired as a drop-in integration. Use configured authentication for live accounts.
        </p>
      </div>
      <form className="card space-y-4">
        <div>
          <label>Email</label>
          <div className="mt-2 flex items-center gap-2">
            <Mail className="text-slate-400" size={18} />
            <input type="email" placeholder={`${userType.toLowerCase()}@example.com`} />
          </div>
        </div>
        <div>
          <label>Password</label>
          <div className="mt-2 flex items-center gap-2">
            <Lock className="text-slate-400" size={18} />
            <input type="password" placeholder="Minimum 8 characters" />
          </div>
        </div>
        <Link href={nextPath} className="btn-primary w-full">
          Continue <ArrowRight size={18} />
        </Link>
      </form>
    </main>
  );
}
