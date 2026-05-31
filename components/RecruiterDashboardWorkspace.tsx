"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { candidates } from "@/lib/data";
import { adminSettings } from "@/lib/admin-data";
import { getCurrentRecruiter, type RecruiterAccount } from "@/lib/storage/authProfileStore";

export function RecruiterDashboardWorkspace() {
  const [recruiter, setRecruiter] = useState<RecruiterAccount | null>(null);

  useEffect(() => {
    setRecruiter(getCurrentRecruiter());
  }, []);

  if (!recruiter) {
    return (
      <div className="card">
        <h1 className="text-2xl font-black text-navy">Session expired</h1>
        <p className="mt-2 text-slate-600">Please login again to continue.</p>
        <Link href="/recruiter/login" className="btn-primary mt-5">Go to login</Link>
      </div>
    );
  }

  const highScoreCandidates = candidates.filter((candidate) => candidate.employabilityScore >= 75).length;

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Find AI Pre-Screened Candidates Faster</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Tired of screening endless resumes? HirePilot helps {recruiter.companyName} discover candidates with pre-screened profiles, AI interview scores, and recruiter-ready summaries.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">Logged in as {recruiter.email}</span>
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">{recruiter.companyName}</span>
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Status: {recruiter.isApproved ? "Approved" : "Pending approval"}</span>
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Subscription: {recruiter.subscriptionStatus}</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Total candidates" value={candidates.length} />
        <Stat label="AI pre-screened" value={candidates.length} />
        <Stat label="High-score candidates" value={highScoreCandidates} />
        <Stat label="Shortlisted" value={recruiter.shortlistedCandidateIds.length} />
        <Stat label="Free profile views used" value={`0/${adminSettings.freeRecruiterProfileViewLimit}`} />
        <Stat label="Active plan" value={recruiter.activePlan || "Free Access"} />
        <Stat label="Contact views left" value={recruiter.canViewContacts ? 42 : 0} />
        <Stat label="Resume downloads left" value={recruiter.canDownloadResumes ? 18 : 0} />
      </div>
      <div className="card">
        <h2 className="text-xl font-black text-navy">Recruiter Workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {["Search candidate", "Filter by skill/score", "View AI scorecard", "Download resume", "Contact candidate", "Shortlist"].map((step, index) => (
            <div key={step} className="rounded-md border border-slate-200 p-3 text-sm font-bold text-slate-700">
              <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-skysoft text-xs text-trust">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
      <Link href="/recruiter/candidates" className="btn-primary w-fit">Search pre-screened candidates</Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-navy">{value}</p>
    </div>
  );
}
