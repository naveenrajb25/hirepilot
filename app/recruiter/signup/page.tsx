import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { recruiterSignup } from "@/app/auth-flow-actions";
import { RoleCombobox } from "@/components/RoleCombobox";

export default function RecruiterSignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy">Recruiter Signup</h1>
        <p className="mt-2 text-slate-600">Register your company profile. Recruiter access starts after owner admin approval.</p>
        <form action={recruiterSignup} className="card mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><AuthNotice error={searchParams?.error} /></div>
          <div><label>Recruiter name</label><input className="mt-2" name="recruiterName" required /></div>
          <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
          <div><label>Password</label><input className="mt-2" name="password" type="password" minLength={8} required /></div>
          <div><label>Confirm password</label><input className="mt-2" name="confirmPassword" type="password" minLength={8} required /></div>
          <div><label>Phone</label><input className="mt-2" name="phone" required /></div>
          <div><label>Company name</label><input className="mt-2" name="companyName" required /></div>
          <div><label>Company website</label><input className="mt-2" name="companyWebsite" required /></div>
          <div><label>Company location</label><input className="mt-2" name="companyLocation" required /></div>
          <div><label>Company size</label><input className="mt-2" name="companySize" required /></div>
          <div><label>Industry</label><input className="mt-2" name="industry" required /></div>
          <div className="md:col-span-2"><RoleCombobox name="hiringRoles" label="Hiring roles" required /></div>
          <button className="btn-primary md:col-span-2" type="submit">Create recruiter account</button>
        </form>
      </main>
    </>
  );
}
