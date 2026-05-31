import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { candidateSignup } from "@/app/auth-flow-actions";
import { RoleCombobox } from "@/components/RoleCombobox";

export default function CandidateSignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy">Candidate Signup</h1>
        <p className="mt-2 text-slate-600">Create an account and complete your profile to improve recruiter visibility.</p>
        <form action={candidateSignup} className="card mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><AuthNotice error={searchParams?.error} /></div>
          <div><label>Full name</label><input className="mt-2" name="fullName" required /></div>
          <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
          <div><label>Password</label><input className="mt-2" name="password" type="password" minLength={8} required /></div>
          <div><label>Confirm password</label><input className="mt-2" name="confirmPassword" type="password" minLength={8} required /></div>
          <div><label>Mobile number</label><input className="mt-2" name="mobile" required /></div>
          <div><label>City</label><input className="mt-2" name="city" required /></div>
          <div className="md:col-span-2"><RoleCombobox name="preferredRole" required /></div>
          <button className="btn-primary md:col-span-2" type="submit">Create account</button>
        </form>
      </main>
    </>
  );
}
