"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleCombobox } from "./RoleCombobox";
import { getCurrentCandidate, updateCandidateProfile, type CandidateAccount } from "@/lib/storage/authProfileStore";

type ProfileForm = Pick<CandidateAccount, "fullName" | "email" | "mobile" | "city" | "preferredRole" | "education" | "experienceLevel" | "linkedin" | "github" | "availability" | "expectedSalary"> & {
  skills: string;
  languages: string;
  projectLinks: string;
};

const emptyProfile: ProfileForm = {
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  preferredRole: "",
  education: "",
  experienceLevel: "",
  skills: "",
  languages: "",
  linkedin: "",
  github: "",
  projectLinks: "",
  availability: "",
  expectedSalary: ""
};

export function CandidatePrivateProfile() {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    const candidate = getCurrentCandidate();
    if (!candidate) return;
    setProfile({
      fullName: candidate.fullName,
      email: candidate.email,
      mobile: candidate.mobile,
      city: candidate.city,
      preferredRole: candidate.preferredRole,
      education: candidate.education,
      experienceLevel: candidate.experienceLevel,
      skills: candidate.skills.join(", "),
      languages: candidate.languages.join(", "),
      linkedin: candidate.linkedin,
      github: candidate.github,
      projectLinks: candidate.projectLinks.join(", "),
      availability: candidate.availability,
      expectedSalary: candidate.expectedSalary
    });
  }, []);

  function update(key: keyof ProfileForm, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function save() {
    updateCandidateProfile(profile);
    setSaved("Profile changes saved.");
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Candidate Profile</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Account status: Active</span>
          <span className="rounded-md bg-skysoft px-3 py-2 text-navy">Email: {profile.email || "Not loaded"}</span>
        </div>
        {saved && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{saved}</div>}
      </div>

      <form className="card grid gap-4 md:grid-cols-2">
        <div><label>Full name</label><input className="mt-2" value={profile.fullName} onChange={(event) => update("fullName", event.target.value)} /></div>
        <div><label>Email</label><input className="mt-2 bg-slate-100 text-slate-600" value={profile.email} readOnly /></div>
        <div><label>Mobile number</label><input className="mt-2" value={profile.mobile} onChange={(event) => update("mobile", event.target.value)} /></div>
        <div><label>City</label><input className="mt-2" value={profile.city} onChange={(event) => update("city", event.target.value)} /></div>
        <div className="md:col-span-2"><RoleCombobox value={profile.preferredRole} onChange={(role) => update("preferredRole", role)} /></div>
        <div><label>Education</label><input className="mt-2" value={profile.education} onChange={(event) => update("education", event.target.value)} /></div>
        <div><label>Experience level</label><input className="mt-2" value={profile.experienceLevel} onChange={(event) => update("experienceLevel", event.target.value)} /></div>
        <div><label>LinkedIn profile</label><input className="mt-2" value={profile.linkedin} onChange={(event) => update("linkedin", event.target.value)} /></div>
        <div><label>GitHub link optional</label><input className="mt-2" value={profile.github} onChange={(event) => update("github", event.target.value)} /></div>
        <div><label>Availability</label><input className="mt-2" value={profile.availability} onChange={(event) => update("availability", event.target.value)} /></div>
        <div><label>Expected salary optional</label><input className="mt-2" value={profile.expectedSalary} onChange={(event) => update("expectedSalary", event.target.value)} /></div>
        <div className="md:col-span-2"><label>Skills</label><textarea className="mt-2" rows={3} value={profile.skills} onChange={(event) => update("skills", event.target.value)} /></div>
        <div className="md:col-span-2"><label>Languages</label><textarea className="mt-2" rows={3} value={profile.languages} onChange={(event) => update("languages", event.target.value)} /></div>
        <div className="md:col-span-2"><label>Project links optional</label><textarea className="mt-2" rows={3} value={profile.projectLinks} onChange={(event) => update("projectLinks", event.target.value)} /></div>
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={save}>Save changes</button>
          <Link href="/candidate/portfolio" className="btn-secondary">Open portfolio builder</Link>
        </div>
      </form>
    </div>
  );
}
