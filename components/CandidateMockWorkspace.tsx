"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateProfessionalScorecard } from "@/lib/data";
import type { CandidateService, PaymentRecord } from "@/lib/types";
import { RoleCombobox } from "./RoleCombobox";
import { getInterviewQuestionForRole } from "@/lib/jobRoles";
import { PaymentRequestButton } from "./BetaRequestModal";
import { ADMIN_CONFIG_UPDATED_EVENT, getActiveCandidateServices, getPayments } from "@/lib/storage/adminConfigStore";
import { getCurrentCandidate, updateCandidateProfile, type CandidateAccount } from "@/lib/storage/authProfileStore";
import { getCurrentCandidateServiceRequests, SERVICE_REQUESTS_UPDATED_EVENT, type CandidateServiceRequest } from "@/lib/storage/candidateServiceRequestStore";

type PortfolioForm = Pick<CandidateAccount, "fullName" | "email" | "mobile" | "city" | "education" | "experienceLevel" | "preferredRole" | "linkedin" | "github" | "availability" | "expectedSalary" | "resumeFileName" | "originalResumeUrl"> & {
  projectLinks: string;
  skills: string;
  languages: string;
};

const emptyPortfolio: PortfolioForm = {
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  education: "",
  experienceLevel: "",
  preferredRole: "",
  linkedin: "",
  github: "",
  projectLinks: "",
  skills: "",
  languages: "",
  availability: "",
  expectedSalary: "",
  resumeFileName: "",
  originalResumeUrl: ""
};

export function CandidatePortfolioEditor() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioForm>(emptyPortfolio);
  const [saved, setSaved] = useState("");
  const strengthScore = [portfolio.resumeFileName, portfolio.linkedin, portfolio.skills, portfolio.projectLinks, portfolio.github].filter(Boolean).length;
  const strength = strengthScore >= 4 ? "Strong" : strengthScore >= 2 ? "Average" : "Weak";

  useEffect(() => {
    const candidate = getCurrentCandidate();
    if (!candidate) return;
    setPortfolio({
      fullName: candidate.fullName,
      email: candidate.email,
      mobile: candidate.mobile,
      city: candidate.city,
      education: candidate.education,
      experienceLevel: candidate.experienceLevel,
      preferredRole: candidate.preferredRole,
      linkedin: candidate.linkedin,
      github: candidate.github,
      projectLinks: candidate.projectLinks.join(", "),
      skills: candidate.skills.join(", "),
      languages: candidate.languages.join(", "),
      availability: candidate.availability,
      expectedSalary: candidate.expectedSalary,
      resumeFileName: candidate.resumeFileName,
      originalResumeUrl: candidate.originalResumeUrl
    });
  }, []);

  function update(key: keyof PortfolioForm, value: string) {
    setPortfolio((current) => ({ ...current, [key]: value }));
  }

  function save() {
    updateCandidateProfile({
      ...portfolio,
      skills: portfolio.skills,
      languages: portfolio.languages,
      projectLinks: portfolio.projectLinks
    });
    setSaved("Portfolio completed successfully.");
    window.setTimeout(() => router.push("/candidate/dashboard?message=Portfolio%20completed%20successfully."), 700);
  }

  function handleResume(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPortfolio((current) => ({
        ...current,
        resumeFileName: file.name,
        originalResumeUrl: String(reader.result || "")
      }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6">
      {saved && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{saved}</div>}
      <form className="grid gap-4 md:grid-cols-2">
        <div><label>Full name</label><input className="mt-2" value={portfolio.fullName} onChange={(event) => update("fullName", event.target.value)} /></div>
        <div><label>Email</label><input className="mt-2 bg-slate-100 text-slate-600" value={portfolio.email} readOnly /></div>
        <div><label>Mobile number</label><input className="mt-2" value={portfolio.mobile} onChange={(event) => update("mobile", event.target.value)} /></div>
        <div><label>City</label><input className="mt-2" value={portfolio.city} onChange={(event) => update("city", event.target.value)} /></div>
        <div><label>Education</label><input className="mt-2" value={portfolio.education} onChange={(event) => update("education", event.target.value)} /></div>
        <div><label>Experience level</label><input className="mt-2" value={portfolio.experienceLevel} onChange={(event) => update("experienceLevel", event.target.value)} /></div>
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
          <label>Resume upload</label>
          <input className="mt-2" type="file" onChange={(event) => handleResume(event.target.files?.[0])} />
          {portfolio.resumeFileName && <p className="mt-1 text-xs font-bold text-slate-500">Current resume: {portfolio.resumeFileName}</p>}
        </div>
        <div>
          <label>LinkedIn profile</label>
          <input className="mt-2" value={portfolio.linkedin} onChange={(event) => update("linkedin", event.target.value)} />
        </div>
        <div>
          <label>GitHub link optional</label>
          <input className="mt-2" value={portfolio.github} onChange={(event) => update("github", event.target.value)} />
        </div>
        <div>
          <label>Project links</label>
          <p className="mt-1 text-xs font-semibold text-slate-500">Optional, but improves recruiter trust and visibility.</p>
          <textarea className="mt-2" rows={4} value={portfolio.projectLinks} onChange={(event) => update("projectLinks", event.target.value)} />
        </div>
        <div>
          <label>Skills editor</label>
          <textarea className="mt-2" rows={4} value={portfolio.skills} onChange={(event) => update("skills", event.target.value)} />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={save}>Save portfolio changes</button>
          <Link href="/candidate/profile" className="btn-secondary">View profile</Link>
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

  useEffect(() => {
    const candidate = getCurrentCandidate();
    if (candidate?.preferredRole) setRole(candidate.preferredRole);
  }, []);

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
  const [candidate, setCandidate] = useState<CandidateAccount | null>(null);
  useEffect(() => {
    setCandidate(getCurrentCandidate());
  }, []);
  const hasScore = typeof candidate?.employabilityScore === "number";
  const activeBase = candidate?.employabilityScore ?? base;
  const scorecard = useMemo(() => generateProfessionalScorecard(candidate?.preferredRole || "Candidate", activeBase), [candidate?.preferredRole, activeBase]);

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-2xl font-black text-navy">Employability Scorecard</h2>
        <p className="mt-3 text-5xl font-black text-trust">{hasScore ? `${scorecard.overall}/100` : "Not started"}</p>
        <p className="mt-2 text-slate-600">{hasScore ? (scorecard.overall >= 75 ? "You are recruiter-ready. Your profile can be shown higher in recruiter search." : scorecard.overall >= 50 ? "You are partially recruiter-ready. Improve resume, LinkedIn, and interview score for better visibility." : "Your profile needs improvement before recruiters can take you seriously.") : "Complete your portfolio and interview readiness steps to generate a scorecard."}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {[
            `ATS resume ${candidate?.atsScore ?? "Not started"}`,
            `LinkedIn ${candidate?.linkedinScore ?? "Not started"}`,
            `Portfolio ${candidate?.onboardingCompleted ? "In progress" : "Not started"}`,
            `AI interview ${candidate?.aiInterviewScore ?? "Not started"}`,
            `Visibility ${hasScore ? (scorecard.overall >= 75 ? "High" : "Medium") : "Not started"}`
          ].map((item) => <div key={item} className="rounded-md bg-skysoft p-3 text-sm font-bold text-navy">{item}</div>)}
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
  const [requests, setRequests] = useState<CandidateServiceRequest[]>([]);

  useEffect(() => {
    const load = () => {
      setServices(getActiveCandidateServices());
      setPayments(getPayments());
      setRequests(getCurrentCandidateServiceRequests());
    };
    load();
    window.addEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
    window.addEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
      window.removeEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const v1Services = services.filter((service) => {
    const name = service.serviceName.toLowerCase();
    return name.includes("ats") || name.includes("resume") || name.includes("linkedin") || name.includes("visibility pack") || name.includes("bundle");
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {v1Services.map((service) => {
        const isUnlocked = payments.some((payment) => payment.paymentFor === service.serviceName && payment.status === "paid");
        const request = requests.find((item) => item.serviceName === service.serviceName);
        const isLinkedIn = service.serviceName.toLowerCase().includes("linkedin");
        const isBundle = service.serviceName.toLowerCase().includes("pack") || service.serviceName.toLowerCase().includes("bundle");
        const currentScore = isLinkedIn ? request?.linkedinScore : request?.atsScore;
        const actionLabel = isBundle ? "Get Career Visibility Pack" : isLinkedIn ? "Optimize My LinkedIn" : "Improve My Resume";
        const deliverables = isLinkedIn
          ? ["Optimized headline", "About section", "Skills recommendations", "Recruiter visibility tips", "LinkedIn Report PDF"]
          : isBundle
            ? ["Improved ATS Resume DOCX", "Improved ATS Resume PDF", "LinkedIn Optimization Report", "Visibility Improvement Report"]
            : ["AI-enhanced ATS resume", "Editable DOCX download", "PDF download", "Recruiter-friendly formatting", "Keyword optimization", "ATS Report PDF"];

        return (
          <div key={service.id} className="card">
            <h2 className="text-xl font-black text-navy">{service.serviceName}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-3 text-2xl font-black text-trust">{service.price}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <p className="rounded-md bg-skysoft p-3 font-bold text-navy">Current Score: {typeof currentScore === "number" ? `${currentScore}/100` : "Not analyzed"}</p>
              <p className="rounded-md bg-emerald-50 p-3 font-bold text-emerald-700">Potential Score: {isLinkedIn ? "90+/100" : "85+/100"}</p>
              {request && <p className="rounded-md bg-slate-100 p-3 font-bold text-slate-700">Service status: {statusLabel(request.requestStatus)}</p>}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {deliverables.map((item) => <li key={item} className="rounded-md border border-slate-200 p-2">{item}</li>)}
            </ul>
            {isUnlocked && request?.requestStatus === "completed" ? <ServiceUnlockedFlow serviceName={service.serviceName} /> : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <PaymentRequestButton label={actionLabel} requestType={service.serviceName} amount={service.price} paymentLink={service.paymentLink || service.razorpayPaymentLink} requestKind="candidate_service" />
              <button className="btn-secondary" type="button">Contact HirePilot Support</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function statusLabel(status: CandidateServiceRequest["requestStatus"]) {
  const labels = {
    payment_pending: "Payment Pending",
    payment_submitted: "Payment Submitted",
    payment_verified: "Payment Verified",
    processing: "Processing",
    completed: "Completed"
  };
  return labels[status];
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
