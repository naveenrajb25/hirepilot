import Link from "next/link";
import { Header } from "@/components/Header";

const items = [
  "Build portfolio",
  "Upload resume",
  "Add LinkedIn profile",
  "Add optional GitHub and project links",
  "Add skills",
  "Take AI interview",
  "Get employability score",
  "Improve score using paid services",
  "Get recruiter visibility"
];

export default function ForCandidatesPage() {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy sm:text-5xl">Applied to many jobs but not getting calls?</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">Build a recruiter-ready profile with ATS resume score, LinkedIn optimization, portfolio proof, and AI interview readiness score.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => <div key={item} className="card font-bold text-navy">{item}</div>)}
        </div>
        <Link href="/candidate/signup" className="btn-primary mt-8">Create My Career Profile</Link>
      </main>
    </>
  );
}
