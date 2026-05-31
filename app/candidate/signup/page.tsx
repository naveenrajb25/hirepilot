import { Header } from "@/components/Header";
import { CandidateSignupForm } from "@/components/CandidateAuthForms";

export default function CandidateSignupPage() {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy">Candidate Signup</h1>
        <p className="mt-2 text-slate-600">Create an account and complete your profile to improve recruiter visibility.</p>
        <CandidateSignupForm />
      </main>
    </>
  );
}
