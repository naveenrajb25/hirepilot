import { Header } from "@/components/Header";
import { getCandidate } from "@/lib/data";
import { ScoreRing } from "@/components/ScoreRing";

export default function PublicCandidateProfile({ params }: { params: { candidateId: string } }) {
  const candidate = getCandidate(params.candidateId);

  return (
    <>
      <Header />
      <main className="section">
        <div className="card">
          <h1 className="text-4xl font-black text-navy">{candidate.fullName}</h1>
          <p className="mt-2 text-slate-600">{candidate.city} · {candidate.preferredRole} · {candidate.experienceLevel}</p>
          <div className="mt-6"><ScoreRing score={candidate.employabilityScore} /></div>
          <p className="mt-6 text-slate-700">{candidate.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => <span key={skill} className="rounded-md bg-skysoft px-3 py-1 text-sm font-bold text-trust">{skill}</span>)}
          </div>
          <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            Email and phone are hidden on public profiles. Subscribed recruiters can unlock contact details and resume download.
          </div>
        </div>
      </main>
    </>
  );
}
