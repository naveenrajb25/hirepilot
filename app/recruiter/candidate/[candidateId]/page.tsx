import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { getCandidate, recruiterVisibleCandidates } from "@/lib/data";
import { ScoreRing } from "@/components/ScoreRing";
import { canRecruiterDownloadResumes, canRecruiterViewContacts } from "@/lib/admin-data";

export default function RecruiterCandidateDetail({ params }: { params: { candidateId: string } }) {
  const candidate = getCandidate(params.candidateId);
  const isVisible = recruiterVisibleCandidates.some((visibleCandidate) => visibleCandidate.id === candidate.id);
  const contactUnlocked = isVisible && canRecruiterViewContacts;
  const resumeUnlocked = isVisible && canRecruiterDownloadResumes;
  const portfolioStrength = candidate.github && candidate.projectLinks.length ? "Strong" : candidate.linkedin ? "Average" : "Weak";
  const visibility = candidate.employabilityScore >= 75 ? "High visibility" : candidate.employabilityScore >= 50 ? "Medium visibility" : "Low visibility";

  return (
    <DashboardShell type="recruiter">
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-3xl font-black text-navy">{candidate.fullName}</h1>
          <p className="mt-2 text-slate-600">{candidate.preferredRole} / {candidate.city} / {candidate.experienceLevel}</p>
          <div className="mt-5"><ScoreRing score={candidate.employabilityScore} /></div>
          <p className="mt-5 text-slate-700">{candidate.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["AI Pre-Screened", "ATS Resume Uploaded", "LinkedIn Added", `${portfolioStrength} portfolio`, visibility].map((item) => (
              <span key={item} className="rounded-md bg-skysoft px-2 py-1 text-xs font-black text-trust">{item}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card">
            <h2 className="text-xl font-black text-navy">AI Scorecard</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Metric label="Employability score" value={`${candidate.employabilityScore}/100`} />
              <Metric label="AI interview score" value={`${candidate.aiInterviewScore}/100`} />
              <Metric label="Portfolio strength" value={portfolioStrength} />
            </div>
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              Recruiter summary: {candidate.summary}
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-black text-navy">Contact and Resume</h2>
            {contactUnlocked ? (
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>Email: {candidate.email}</p>
                <p>Phone: {candidate.phone}</p>
                <p><a className="font-bold text-trust" href={candidate.linkedin}>LinkedIn profile</a></p>
                {candidate.github ? <p><a className="font-bold text-trust" href={candidate.github}>GitHub profile</a></p> : null}
                {candidate.projectLinks.length ? <p>Projects: {candidate.projectLinks.join(", ")}</p> : null}
                {resumeUnlocked ? (
                  <a className="btn-primary mt-3" href={candidate.resumeUrl}>Download resume</a>
                ) : (
                  <p className="rounded-md bg-amber-50 p-3 font-semibold text-amber-700">Resume downloads require admin permission and an active subscription.</p>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-slate-600">
                  Subscribe to view contact and download resume. Recruiter access requires approval, active status, subscription, and admin permission.
                </p>
                <Link href="/recruiter/pricing" className="btn-primary mt-4">Subscribe to view contact and download resume</Link>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-black text-navy">Skills Match and Notes</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{skill}</span>)}
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3 text-emerald-800">
                <strong>Strengths:</strong> clear role fit, visible proof of work, interview score available.
              </div>
              <div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-amber-800">
                <strong>Concerns:</strong> validate notice period, salary fit, and final communication round.
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" type="button">Shortlist candidate</button>
              <button className="btn-secondary" type="button">Add note</button>
            </div>
            <textarea className="mt-4" rows={4} placeholder="Private recruiter note..." />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-black text-navy">{value}</p>
    </div>
  );
}
