import { Header } from "@/components/Header";
import { RecruiterSignupForm } from "@/components/RecruiterAuthForms";

export default function RecruiterSignupPage() {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy">Recruiter Signup</h1>
        <p className="mt-2 text-slate-600">Register your company profile. Recruiter access starts after owner admin approval.</p>
        <RecruiterSignupForm />
      </main>
    </>
  );
}
