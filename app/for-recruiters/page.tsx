import Link from "next/link";
import { Header } from "@/components/Header";

const items = [
  "Register company profile",
  "Verify recruiter account",
  "Wait for admin approval",
  "Search verified candidates",
  "Filter by role, city, skills, language, and score",
  "View contact and download resume after subscription",
  "Save hiring time"
];

export default function ForRecruitersPage() {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy sm:text-5xl">Tired of screening endless resumes?</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">HirePilot helps you discover candidates with pre-screened profiles, AI interview scores, and recruiter-ready summaries.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => <div key={item} className="card font-bold text-navy">{item}</div>)}
        </div>
        <Link href="/recruiter/signup" className="btn-primary mt-8">Find Verified Candidates</Link>
      </main>
    </>
  );
}
