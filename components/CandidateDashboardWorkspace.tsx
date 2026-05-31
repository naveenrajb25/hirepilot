"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ScoreRing } from "@/components/ScoreRing";
import { getCurrentCandidate, type CandidateAccount } from "@/lib/storage/authProfileStore";
import { getCurrentCandidateServiceRequests, SERVICE_REQUESTS_UPDATED_EVENT, type CandidateServiceRequest } from "@/lib/storage/candidateServiceRequestStore";

function scoreLabel(score?: number) {
  return typeof score === "number" ? score : "Not analyzed";
}

function visibility(score?: number) {
  if (typeof score !== "number") return "Low Visibility";
  if (score < 50) return "Low Visibility";
  if (score < 65) return "Improving";
  if (score < 85) return "Recruiter Ready";
  return "High Visibility";
}

function completion(account: CandidateAccount) {
  const fields = [
    account.fullName,
    account.email,
    account.mobile,
    account.city,
    account.preferredRole,
    account.education,
    account.experienceLevel,
    account.resumeFileName,
    account.linkedin,
    account.skills.length,
    account.languages.length
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export function CandidateDashboardWorkspace() {
  const [candidate, setCandidate] = useState<CandidateAccount | null>(null);
  const [requests, setRequests] = useState<CandidateServiceRequest[]>([]);

  useEffect(() => {
    const load = () => {
      setCandidate(getCurrentCandidate());
      setRequests(getCurrentCandidateServiceRequests());
    };
    load();
    window.addEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const profileCompletion = useMemo(() => candidate ? completion(candidate) : 0, [candidate]);
  const overallScore = candidate?.employabilityScore;
  const visibilityStatus = visibility(overallScore);
  const latestCompleted = requests.find((request) => request.requestStatus === "completed") || requests[0];
  const atsScore = latestCompleted?.atsScore ?? candidate?.atsScore;
  const linkedinScore = latestCompleted?.linkedinScore ?? candidate?.linkedinScore;
  const visibilityScore = latestCompleted?.visibilityScore ?? candidate?.employabilityScore;
  const keywordScore = latestCompleted?.keywordScore;
  const formattingScore = latestCompleted?.formattingScore;
  const headlineQualityScore = latestCompleted?.headlineQualityScore;

  if (!candidate) {
    return (
      <div className="card">
        <h1 className="text-2xl font-black text-navy">Session expired</h1>
        <p className="mt-2 text-slate-600">Please login again to continue.</p>
        <Link href="/candidate/login" className="btn-primary mt-5">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Welcome, {candidate.fullName}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">{candidate.email}</span>
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">{candidate.city}</span>
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">{candidate.preferredRole}</span>
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Account: Active</span>
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Recruiter Visibility: {visibilityStatus}</span>
        </div>
        <p className="mt-4 text-slate-600">Applied to jobs but not getting calls? Your resume may not be ATS-friendly. Improve your resume and LinkedIn profile to increase recruiter visibility.</p>
        <div className="mt-5"><ScoreRing score={visibilityScore ?? profileCompletion} /></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Higher scores can improve recruiter visibility. HirePilot does not guarantee job placement.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Profile completion" value={`${profileCompletion}%`} />
        <Stat label="Resume status" value={candidate.resumeFileName ? "Uploaded" : "Not started"} />
        <Stat label="LinkedIn status" value={candidate.linkedin ? "Added" : "Not started"} />
        <Stat label="ATS Resume Score" value={scoreLabel(atsScore)} />
        <Stat label="Keyword Score" value={scoreLabel(keywordScore)} />
        <Stat label="Formatting Score" value={scoreLabel(formattingScore)} />
        <Stat label="Visibility Score" value={scoreLabel(visibilityScore)} />
        <Stat label="LinkedIn Score" value={scoreLabel(linkedinScore)} />
        <Stat label="Headline Quality" value={scoreLabel(headlineQualityScore)} />
        <Stat label="Recruiter Visibility" value={visibilityStatus} />
        <Stat label="Overall Employability" value={scoreLabel(latestCompleted?.overallEmployabilityScore ?? candidate.employabilityScore)} />
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-black text-navy">Documents and Reports</h2>
        <p className="mt-2 text-sm text-slate-600">Download your improved resume and reports after the HirePilot admin team completes processing.</p>
        <table className="mt-5 w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><tr><th className="py-3">Document</th><th>Status</th><th>Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            <DocumentRow label="Original Resume" url={candidate.originalResumeUrl} fallback={candidate.resumeFileName} action="Download Original Resume" />
            <DocumentRow label="Improved Resume DOCX" url={latestCompleted?.improvedResumeDocxUrl} action="Download Improved Resume" />
            <DocumentRow label="Improved Resume PDF" url={latestCompleted?.improvedResumePdfUrl} action="Download Improved Resume PDF" />
            <DocumentRow label="ATS Report" url={latestCompleted?.atsReportPdfUrl} action="Download ATS Report PDF" />
            <DocumentRow label="LinkedIn Report" url={latestCompleted?.linkedinReportPdfUrl} action="Download LinkedIn Report PDF" />
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="text-2xl font-black text-navy">Profile completion</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Basic details", true],
            ["Resume uploaded", Boolean(candidate.resumeFileName)],
            ["LinkedIn added", Boolean(candidate.linkedin)],
            ["Skills added", candidate.skills.length > 0],
            ["Languages added", candidate.languages.length > 0],
            ["Service requested", requests.length > 0]
          ].map(([step, done]) => (
            <div key={String(step)} className={`rounded-md p-3 text-sm font-bold ${done ? "bg-emerald-50 text-emerald-700" : "bg-skysoft text-navy"}`}>{step}</div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/candidate/portfolio" className="btn-primary">Complete profile</Link>
          <Link href="/candidate/services?service=ats-resume" className="btn-secondary">Improve My Resume</Link>
          <Link href="/candidate/services?service=linkedin" className="btn-secondary">Optimize My LinkedIn</Link>
          <Link href="/candidate/services" className="btn-secondary">Improve My Visibility</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link className="card hover:border-trust" href="/candidate/services">Resume ATS Optimization</Link>
        <Link className="card hover:border-trust" href="/candidate/services">LinkedIn Optimization</Link>
        <Link className="card hover:border-trust" href="/candidate/services">Career Visibility Pack</Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="card"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-navy">{value}</p></div>;
}

function DocumentRow({ label, url, fallback, action }: { label: string; url?: string; fallback?: string; action: string }) {
  return (
    <tr>
      <td className="py-4 font-black text-navy">{label}</td>
      <td className="text-slate-600">{url ? "Available" : fallback ? `Uploaded: ${fallback}` : "Not available yet"}</td>
      <td>
        {url ? (
          <a className="btn-secondary px-3 py-2" href={url} download target="_blank" rel="noreferrer">{action}</a>
        ) : (
          <button className="btn-secondary px-3 py-2 opacity-60" type="button" disabled>Not available yet</button>
        )}
      </td>
    </tr>
  );
}
