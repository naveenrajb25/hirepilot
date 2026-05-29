import Link from "next/link";
import { MapPin, Star, Briefcase } from "lucide-react";
import type { Candidate } from "@/lib/types";
import { ScoreRing } from "./ScoreRing";

export function CandidateCard({ candidate, subscribed = false }: { candidate: Candidate; subscribed?: boolean }) {
  return (
    <article className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-navy">{candidate.fullName}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <Briefcase size={16} /> {candidate.preferredRole}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} /> {candidate.city} · {candidate.experienceLevel}
          </p>
        </div>
        <ScoreRing score={candidate.employabilityScore} label="Score" />
      </div>
      <p className="text-sm text-slate-600">{candidate.summary}</p>
      <div className="flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <span key={skill} className="rounded-md bg-skysoft px-3 py-1 text-xs font-bold text-trust">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Link href={`/recruiter/candidate/${candidate.id}`} className="btn-primary">
          View profile
        </Link>
        <Link href={`/profile/${candidate.id}`} className="btn-secondary">
          Public page
        </Link>
        {subscribed && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
            <Star size={16} /> Contact unlocked
          </span>
        )}
      </div>
    </article>
  );
}
