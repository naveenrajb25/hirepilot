import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, FileCheck, Search, Sparkles, Target, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { PaymentTrustNote } from "@/components/PaymentTrustNote";

const candidateProblems = [
  "Resume not ATS-friendly",
  "LinkedIn profile not optimized",
  "No proof of projects or skills",
  "Recruiters cannot trust your profile",
  "No interview readiness score",
  "Your profile gets lost among thousands of applicants"
];

const candidateSolutions = ["ATS Resume Score", "LinkedIn Optimization", "GitHub/Project Links", "AI Interview Readiness", "Employability Score", "Recruiter Visibility"];
const recruiterProblems = ["Manual screening is slow", "Many resumes look similar", "Fake skills are hard to detect", "Freshers need extra validation", "Recruiters waste time on unfit candidates"];
const recruiterSolutions = ["Filter by role and skills", "View AI interview score", "Check portfolio proof", "Download resume", "View contact details", "Shortlist faster"];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section grid min-h-[82vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="mt-5 text-5xl font-black leading-tight text-navy sm:text-6xl">
              Stop applying blindly. Get discovered by recruiters with an AI-verified profile.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              Applied to many jobs but not getting calls? Build a recruiter-ready profile with ATS resume score, LinkedIn optimization, portfolio proof, and AI interview readiness score.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" href="/candidate/signup">Create My Career Profile <ArrowRight size={18} /></Link>
              <Link className="btn-secondary" href="/recruiter/signup">Find Verified Candidates <Search size={18} /></Link>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500">HirePilot improves visibility and readiness, but does not guarantee job placement.</p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-navy p-5 text-white shadow-soft">
              <div className="flex items-center gap-3">
                <Sparkles className="text-saffron" />
                <h2 className="text-2xl font-black">AI-verified recruiter-ready profile</h2>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["ATS Score 82", "LinkedIn Ready", "AI Interview 88", "High Visibility"].map((item) => (
                  <div key={item} className="rounded-md bg-white/10 p-4 text-sm font-bold">{item}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card"><Users className="text-trust" /><p className="mt-3 text-2xl font-black text-navy">Candidates</p><p className="text-sm text-slate-600">Build proof, not just a resume.</p></div>
              <div className="card"><BriefcaseBusiness className="text-trust" /><p className="mt-3 text-2xl font-black text-navy">Recruiters</p><p className="text-sm text-slate-600">Hire AI pre-screened candidates faster.</p></div>
            </div>
          </div>
        </section>

        <ProblemSolution title="Applied to many jobs but still no calls?" items={candidateProblems} />
        <CardSection title="Build a recruiter-ready profile with HirePilot" items={candidateSolutions} icon="candidate" />
        <ProblemSolution title="Too many resumes. Too little time." items={recruiterProblems} dark />
        <CardSection title="Find AI pre-screened candidates faster" items={recruiterSolutions} icon="recruiter" />

        <section className="section grid gap-6 lg:grid-cols-2">
          <HowItWorks title="For Candidates" steps={["Create profile", "Upload resume", "Add LinkedIn/GitHub/projects", "Take AI interview", "Get score and suggestions", "Become visible to recruiters"]} />
          <HowItWorks title="For Recruiters" steps={["Create company profile", "Choose hiring role", "Search verified candidates", "Filter by AI score and skills", "View resume/contact", "Shortlist and contact"]} />
        </section>

        <section className="section text-center">
          <h2 className="text-3xl font-black text-navy">Build proof, improve readiness, and get recruiter-visible.</h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="btn-primary" href="/candidate/signup">Create My Career Profile</Link>
            <Link className="btn-secondary" href="/recruiter/signup">Find Verified Candidates</Link>
          </div>
          <div className="mx-auto mt-6 max-w-xl"><PaymentTrustNote context="footer" /></div>
        </section>
      </main>
    </>
  );
}

function ProblemSolution({ title, items, dark = false }: { title: string; items: string[]; dark?: boolean }) {
  return (
    <section className={dark ? "bg-navy text-white" : "bg-white"}>
      <div className="section">
        <h2 className={`text-3xl font-black ${dark ? "text-white" : "text-navy"}`}>{title}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {items.map((item) => <div key={item} className={`rounded-lg border p-4 font-semibold ${dark ? "border-white/15 bg-white/10 text-blue-50" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{item}</div>)}
        </div>
      </div>
    </section>
  );
}

function CardSection({ title, items, icon }: { title: string; items: string[]; icon: "candidate" | "recruiter" }) {
  return (
    <section className="section">
      <h2 className="text-3xl font-black text-navy">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="card">
            {icon === "candidate" ? <BadgeCheck className="text-trust" /> : <Target className="text-trust" />}
            <p className="mt-3 text-lg font-black text-navy">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="card">
      <FileCheck className="text-trust" />
      <h2 className="mt-3 text-2xl font-black text-navy">{title}</h2>
      <ol className="mt-4 grid gap-3">
        {steps.map((step, index) => <li key={step} className="rounded-md bg-skysoft p-3 font-bold text-navy">{index + 1}. {step}</li>)}
      </ol>
    </div>
  );
}
