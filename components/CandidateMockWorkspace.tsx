"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { generateProfessionalScorecard } from "@/lib/data";
import type { CandidateService, PaymentRecord } from "@/lib/types";
import { RoleCombobox } from "./RoleCombobox";
import { getInterviewQuestionForRole } from "@/lib/jobRoles";
import { PaymentRequestButton } from "./BetaRequestModal";
import { ADMIN_CONFIG_UPDATED_EVENT, getActiveCandidateServices, getPayments } from "@/lib/storage/adminConfigStore";

const candidatePortfolio = {
  fullName: "Candidate Profile",
  email: "candidate@example.com",
  phone: "+91 90000 11111",
  city: "Bengaluru",
  education: "B.Tech Computer Science",
  experienceLevel: "Fresher",
  preferredRole: "Python Developer",
  linkedin: "https://linkedin.com/in/candidate-profile",
  github: "https://github.com/candidate-profile",
  projects: "AI resume parser, Inventory analytics dashboard",
  skills: "Python, SQL, FastAPI, Communication",
  languages: "English, Hindi",
  availability: "Immediate",
  expectedSalary: "4-6 LPA"
};

export function CandidatePortfolioEditor() {
  const [portfolio, setPortfolio] = useState(candidatePortfolio);
  const [saved, setSaved] = useState("");
  const strengthScore = [portfolio.linkedin, portfolio.skills, portfolio.projects, portfolio.github].filter(Boolean).length;
  const strength = strengthScore >= 4 ? "Strong" : strengthScore >= 2 ? "Average" : "Weak";

  function update(key: keyof typeof candidatePortfolio, value: string) {
    setPortfolio((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6">
      {saved && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{saved}</div>}
      <form className="grid gap-4 md:grid-cols-2">
        {(["fullName", "email", "phone", "city", "education", "experienceLevel", "linkedin", "github"] as const).map((key) => (
          <div key={key}>
            <label>{key.replace(/([A-Z])/g, " $1")}</label>
            <input className="mt-2" value={portfolio[key]} onChange={(event) => update(key, event.target.value)} />
          </div>
        ))}
        <div>
          <label>Availability</label>
          <input className="mt-2" value={portfolio.availability} onChange={(event) => update("availability", event.target.value)} />
        </div>
        <div>
          <label>Expected salary optional</label>
          <input className="mt-2" value={portfolio.expectedSalary} onChange={(event) => update("expectedSalary", event.target.value)} />
        </div>
        <div className="md:col-span-2">
          <RoleCombobox value={portfolio.preferredRole} onChange={(role) => update("preferredRole", role)} />
        </div>
        <div>
          <label>Resume upload placeholder</label>
          <input className="mt-2" type="file" />
        </div>
        <div>
          <label>Project links</label>
          <p className="mt-1 text-xs font-semibold text-slate-500">Optional, but improves recruiter trust and visibility.</p>
          <textarea className="mt-2" rows={4} value={portfolio.projects} onChange={(event) => update("projects", event.target.value)} />
        </div>
        <div>
          <label>Skills editor</label>
          <textarea className="mt-2" rows={4} value={portfolio.skills} onChange={(event) => update("skills", event.target.value)} />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={() => setSaved("Portfolio changes saved.")}>Save portfolio changes</button>
          <Link href="/profile/c-101" className="btn-secondary">View public profile</Link>
        </div>
      </form>
      <div className="card bg-skysoft">
        <h3 className="text-xl font-black text-navy">Portfolio Strength: {strength}</h3>
        <p className="mt-2 text-sm text-slate-600">Resume, LinkedIn, skills, projects, and interview readiness increase recruiter trust and visibility.</p>
      </div>
    </div>
  );
}

export function CandidateInterviewWorkspace() {
  const [role, setRole] = useState("Python Developer");
  const [mode, setMode] = useState("Standard Interview");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selectedMode = interviewModes.find((item) => item.name === mode) ?? interviewModes[1];

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h2 className="text-2xl font-black text-navy">AI Interview Readiness Simulation</h2>
        <p className="mt-2 text-slate-600">Your interview report helps recruiters understand communication, role knowledge, confidence, practical thinking, and project understanding before they contact you.</p>
        <div className="mt-4">
          <RoleCombobox value={role} onChange={setRole} label="Target role" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {interviewModes.map((item) => {
            const selected = item.name === mode;
            return (
              <button
                key={item.name}
                className={`rounded-lg border p-4 text-left transition hover:border-trust ${selected ? "border-trust bg-skysoft ring-2 ring-trust/15" : "border-slate-200 bg-white"}`}
                type="button"
                onClick={() => setMode(item.name)}
                aria-pressed={selected}
              >
                <span className="block text-base font-black text-navy">{item.name}</span>
                <span className="mt-2 block text-sm font-bold text-trust">{item.questions} / {item.duration}</span>
                <span className="mt-2 block text-sm text-slate-600">{item.description}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-md bg-skysoft p-3 text-sm font-bold text-navy">{selectedMode.name}: {selectedMode.questions} covering resume, skills, projects, HR, and scenario questions.</div>
        <p className="mt-4 text-slate-600">Question: {getInterviewQuestionForRole(role)}</p>
        <textarea className="mt-4" rows={7} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer here..." />
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={() => { setSubmitted((current) => [`${mode} / ${role}: ${answer || "Interview answer submitted for evaluation."}`, ...current]); setAnswer(""); setMessage("Interview answer submitted for evaluation."); }}>Submit answer</button>
          <button className="btn-secondary" type="button" onClick={() => { setSubmitted([]); setAnswer(""); setMessage("Interview restarted."); }}>Start/restart interview</button>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-black text-navy">Interview answers</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {(submitted.length ? submitted : ["Your submitted answers will appear here as you complete the simulation."]).map((item) => <li key={item} className="rounded-md border border-slate-200 p-3">{item}</li>)}
        </ul>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {["Communication score 84", "Role knowledge score 82", "Confidence score 80", "Problem-solving score 86", "Recruiter summary ready"].map((item) => (
          <div key={item} className="card text-sm font-black text-navy">{item}</div>
        ))}
      </div>
    </div>
  );
}

export function CandidateScorecardWorkspace() {
  const [base, setBase] = useState(78);
  const scorecard = useMemo(() => generateProfessionalScorecard("Python Developer", base), [base]);

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-2xl font-black text-navy">Employability Scorecard</h2>
        <p className="mt-3 text-5xl font-black text-trust">{scorecard.overall}/100</p>
        <p className="mt-2 text-slate-600">{scorecard.overall >= 75 ? "You are recruiter-ready. Your profile can be shown higher in recruiter search." : scorecard.overall >= 50 ? "You are partially recruiter-ready. Improve resume, LinkedIn, and interview score for better visibility." : "Your profile needs improvement before recruiters can take you seriously."}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {["ATS resume 82", "LinkedIn 76", "Portfolio 88", "AI interview 86", `Visibility ${scorecard.overall >= 75 ? "High" : "Medium"}`].map((item) => <div key={item} className="rounded-md bg-skysoft p-3 text-sm font-bold text-navy">{item}</div>)}
        </div>
        <button className="btn-primary mt-5" type="button" onClick={() => setBase((value) => (value >= 84 ? 76 : value + 4))}>Refresh scorecard</button>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/candidate/services" className="btn-secondary">Improve My Score</Link>
          <Link href="/profile/c-101" className="btn-secondary">View Public Profile</Link>
          <button className="btn-secondary" type="button">Share Profile</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {scorecard.roadmap.map((item) => <div className="card text-sm font-semibold text-slate-700" key={item}>{item}</div>)}
      </div>
    </div>
  );
}

export function CandidateServiceCards() {
  const [services, setServices] = useState<CandidateService[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const load = () => {
      setServices(getActiveCandidateServices());
      setPayments(getPayments());
    };
    load();
    window.addEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => {
        const isUnlocked = payments.some((payment) => payment.paymentFor === service.serviceName && payment.status === "paid");

        return (
          <div key={service.id} className="card">
            <h2 className="text-xl font-black text-navy">{service.serviceName}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-3 text-2xl font-black text-trust">{service.price}</p>
            {isUnlocked ? (
              <ServiceUnlockedFlow serviceName={service.serviceName} />
            ) : (
              <p className="mt-4 rounded-md bg-skysoft p-3 text-sm font-semibold text-navy">This service activates after payment verification by the HirePilot admin team.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <PaymentRequestButton label="Pay Now" requestType={service.serviceName} amount={service.price} paymentLink={service.paymentLink || service.razorpayPaymentLink} />
              <button className="btn-secondary" type="button">Contact HirePilot Support</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const interviewModes = [
  {
    name: "Easy Interview",
    questions: "15 questions",
    duration: "~5 minutes",
    description: "Beginner-friendly screening for freshers and quick readiness checks."
  },
  {
    name: "Standard Interview",
    questions: "25 questions",
    duration: "~15 minutes",
    description: "Role-focused interview covering resume, skills, projects, and HR."
  },
  {
    name: "Full Interview Simulation",
    questions: "30-40 questions",
    duration: "~30 minutes",
    description: "Deep technical, scenario, project, and HR readiness evaluation."
  }
];

function ServiceUnlockedFlow({ serviceName }: { serviceName: string }) {
  const [report, setReport] = useState("");

  async function requestReport() {
    const endpoint = serviceName.includes("Resume")
      ? "/api/ai/resume-ats"
      : serviceName.includes("LinkedIn")
        ? "/api/ai/linkedin-optimization"
        : "/api/ai/interview-questions";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ serviceName, role: "Python Developer", skills: "Python, SQL, Communication" })
    });
    const data = await response.json();
    setReport(data.report || data.message || "Your request has been submitted for AI-assisted review. The report will be processed shortly.");
  }

  return (
    <div className="mt-4 rounded-md bg-slate-50 p-3">
      <p className="text-sm font-bold text-navy">Unlocked workflow preview</p>
      <div className="mt-3 grid gap-2">
        <textarea rows={3} placeholder={serviceName.includes("LinkedIn") ? "Paste LinkedIn headline/about section and target role" : serviceName.includes("Interview") ? "Paste resume, skills, projects, and target role" : "Paste resume text and target role"} />
        <button className="btn-secondary w-fit px-3 py-2" type="button" onClick={requestReport}>
          {serviceName.includes("LinkedIn") ? "Generate LinkedIn Report" : serviceName.includes("Interview") ? "Generate Interview Readiness Plan" : "Generate ATS Report"}
        </button>
        {report && <p className="rounded-md bg-white p-3 text-sm font-semibold text-slate-700">{report}</p>}
      </div>
    </div>
  );
}
