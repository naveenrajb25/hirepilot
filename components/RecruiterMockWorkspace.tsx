"use client";

import { useEffect, useMemo, useState } from "react";
import type { Candidate } from "@/lib/types";
import { RoleCombobox } from "./RoleCombobox";
import { adminSettings } from "@/lib/admin-data";
import { getCurrentRecruiter, updateRecruiterProfile } from "@/lib/storage/authProfileStore";

const profileViewUsageKey = "hirepilot.recruiter.profileViewsUsed";

export function RecruiterSearchWorkspace({ candidates }: { candidates: Candidate[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("all");
  const [experience, setExperience] = useState("all");
  const [language, setLanguage] = useState("all");
  const [minAiScore, setMinAiScore] = useState("0");
  const [minEmployabilityScore, setMinEmployabilityScore] = useState("0");
  const [portfolioStrength, setPortfolioStrength] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [profileViewsUsed, setProfileViewsUsed] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = Number(localStorage.getItem(profileViewUsageKey) || "0");
    if (Number.isFinite(saved)) setProfileViewsUsed(saved);
  }, []);

  function recordProfileView() {
    setProfileViewsUsed((used) => {
      const next = used + 1;
      localStorage.setItem(profileViewUsageKey, String(next));
      return next;
    });
  }

  const cities = Array.from(new Set(candidates.map((candidate) => candidate.city)));
  const experiences = Array.from(new Set(candidates.map((candidate) => candidate.experienceLevel)));
  const languages = Array.from(new Set(candidates.flatMap((candidate) => candidate.languages)));

  const filtered = useMemo(() => candidates.filter((candidate) => {
    const haystack = [candidate.fullName, candidate.preferredRole, candidate.city, candidate.experienceLevel, ...candidate.skills, ...candidate.languages].join(" ").toLowerCase();
    const strength = getPortfolioStrength(candidate);

    return haystack.includes(query.toLowerCase())
      && (city === "all" || candidate.city === city)
      && (experience === "all" || candidate.experienceLevel === experience)
      && (language === "all" || candidate.languages.includes(language))
      && (!role || candidate.preferredRole.toLowerCase().includes(role.toLowerCase()))
      && candidate.aiInterviewScore >= Number(minAiScore)
      && candidate.employabilityScore >= Number(minEmployabilityScore)
      && (portfolioStrength === "all" || strength === portfolioStrength)
      && (availability === "all" || availability === "immediate");
  }), [candidates, query, city, role, experience, language, minAiScore, minEmployabilityScore, portfolioStrength, availability]);

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h1 className="text-2xl font-black text-navy">Search AI pre-screened candidates</h1>
        <p className="mt-2 text-sm text-slate-600">
          Stop wasting time screening endless resumes. Filter candidates who already have profile proof, AI interview scores, and recruiter-ready summaries.
        </p>
        <p className="mt-3 rounded-md bg-skysoft p-3 text-sm font-bold text-navy">
          Free access includes {adminSettings.freeRecruiterProfileViewLimit} candidate profile views. Upgrade to unlock more profile views, contacts, and resume downloads.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates by role, city, skill, language, score" />
          <RoleCombobox value={role} onChange={setRole} label="Preferred role" />
          <select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">All cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={experience} onChange={(event) => setExperience(event.target.value)}><option value="all">All experience</option>{experiences.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={minAiScore} onChange={(event) => setMinAiScore(event.target.value)}><option value="0">Any AI interview score</option><option value="60">AI score 60+</option><option value="75">AI score 75+</option><option value="85">AI score 85+</option></select>
          <select value={minEmployabilityScore} onChange={(event) => setMinEmployabilityScore(event.target.value)}><option value="0">Any employability score</option><option value="50">Employability 50+</option><option value="75">Employability 75+</option><option value="85">Employability 85+</option></select>
          <select value={portfolioStrength} onChange={(event) => setPortfolioStrength(event.target.value)}><option value="all">Any portfolio strength</option><option value="Strong">Strong</option><option value="Average">Average</option><option value="Weak">Weak</option></select>
          <select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="all">Any availability</option><option value="immediate">Immediate joiners</option></select>
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((candidate) => {
          const isShortlisted = shortlist.includes(candidate.id);
          const strength = getPortfolioStrength(candidate);
          const visibility = candidate.employabilityScore >= 75 ? "High Visibility Candidate" : candidate.employabilityScore >= 50 ? "Medium Visibility" : "Low Visibility";
          const freeLimitReached = profileViewsUsed >= adminSettings.freeRecruiterProfileViewLimit;

          return (
            <div key={candidate.id} className="card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-black text-navy">{candidate.fullName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{candidate.preferredRole} / {candidate.city} / {candidate.experienceLevel}</p>
                  <p className="mt-3 text-sm text-slate-600">{candidate.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge>AI Pre-Screened</Badge>
                    <Badge>ATS Resume Uploaded</Badge>
                    <Badge>LinkedIn Added</Badge>
                    {candidate.github || candidate.projectLinks.length ? <Badge>Project Proof Added</Badge> : null}
                    <Badge>{visibility}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <Metric label="Employability" value={`${candidate.employabilityScore}/100`} />
                    <Metric label="AI interview" value={`${candidate.aiInterviewScore}/100`} />
                    <Metric label="Portfolio strength" value={strength} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{skill}</span>)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {freeLimitReached ? (
                    <a className="btn-primary px-3 py-2" href="/recruiter/pricing">Upgrade to view more profiles</a>
                  ) : (
                    <a className="btn-secondary px-3 py-2" href={`/recruiter/candidate/${candidate.id}`} onClick={recordProfileView}>View profile</a>
                  )}
                  <button className="btn-secondary px-3 py-2" type="button" onClick={() => setMessage(`Contact unlocked: ${candidate.email}, ${candidate.phone}`)}>View contact</button>
                  <button className="btn-secondary px-3 py-2" type="button" onClick={() => setMessage("Resume download placeholder triggered.")}>Download resume</button>
                  <button className="btn-primary px-3 py-2" type="button" onClick={() => { setShortlist((current) => isShortlisted ? current.filter((id) => id !== candidate.id) : [...current, candidate.id]); setMessage(isShortlisted ? "Candidate removed from shortlist." : "Candidate shortlisted."); }}>{isShortlisted ? "Remove shortlist" : "Shortlist"}</button>
                </div>
              </div>
              <textarea className="mt-4" rows={3} value={notes[candidate.id] || ""} onChange={(event) => setNotes((current) => ({ ...current, [candidate.id]: event.target.value }))} placeholder="Add recruiter notes..." />
              <button className="btn-secondary mt-3" type="button" onClick={() => setMessage("Recruiter note saved.")}>Add notes</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompanyProfileEditor() {
  const [company, setCompany] = useState({
    recruiterName: "Recruiter",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companySize: "",
    industry: "Technology",
    hiringRoles: "Python Developer, Data Analyst",
    phone: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const recruiter = getCurrentRecruiter();
    if (!recruiter) return;
    setCompany({
      recruiterName: recruiter.recruiterName,
      companyName: recruiter.companyName,
      companyWebsite: recruiter.companyWebsite,
      companyLocation: recruiter.companyLocation,
      companySize: recruiter.companySize,
      industry: recruiter.industry,
      hiringRoles: recruiter.hiringRoles.join(", "),
      phone: recruiter.phone
    });
  }, []);

  function save() {
    updateRecruiterProfile(company);
    setMessage("Company profile saved.");
  }

  return (
    <div className="card">
      {message && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <h1 className="text-3xl font-black text-navy">Company Profile</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Object.entries(company).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            <input className="mt-2" value={value} onChange={(event) => setCompany((current) => ({ ...current, [key]: event.target.value }))} />
          </div>
        ))}
      </div>
      <button className="btn-primary mt-5" type="button" onClick={save}>Save company profile</button>
    </div>
  );
}

function getPortfolioStrength(candidate: Candidate) {
  if (candidate.github && candidate.projectLinks.length && candidate.linkedin) return "Strong";
  if (candidate.linkedin && candidate.skills.length >= 3) return "Average";
  return "Weak";
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-skysoft px-2 py-1 text-xs font-black text-trust">{children}</span>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-black text-navy">{value}</p>
    </div>
  );
}
