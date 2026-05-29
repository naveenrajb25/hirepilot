"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleCombobox } from "./RoleCombobox";

const initialProfile = {
  fullName: "Candidate Profile",
  email: "candidate@example.com",
  mobile: "+91 90000 11111",
  city: "Bengaluru",
  preferredRole: "Python Developer",
  education: "B.Tech Computer Science",
  experienceLevel: "Fresher",
  skills: "Python, SQL, FastAPI, Communication",
  languages: "English, Hindi",
  linkedin: "https://linkedin.com/in/candidate-profile",
  github: "https://github.com/candidate-profile",
  projects: "AI resume parser, Inventory analytics dashboard"
};

export function CandidatePrivateProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState("");

  function update(key: keyof typeof initialProfile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Candidate Profile</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Account status: Verified</span>
          <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Onboarding status: Completed</span>
        </div>
        {saved && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{saved}</div>}
      </div>

      <form className="card grid gap-4 md:grid-cols-2">
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className={["skills", "languages", "projects"].includes(key) ? "md:col-span-2" : ""}>
            {key === "preferredRole" ? (
              <RoleCombobox value={value} onChange={(role) => update("preferredRole", role)} />
            ) : ["skills", "languages", "projects"].includes(key) ? (
              <>
              <label>{key.replace(/([A-Z])/g, " $1")}</label>
              <textarea className="mt-2" rows={3} value={value} onChange={(event) => update(key as keyof typeof initialProfile, event.target.value)} />
              </>
            ) : (
              <>
              <label>{key.replace(/([A-Z])/g, " $1")}</label>
              <input className="mt-2" value={value} onChange={(event) => update(key as keyof typeof initialProfile, event.target.value)} />
              </>
            )}
          </div>
        ))}
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={() => setSaved("Profile changes saved.")}>Save changes</button>
          <Link href="/profile/c-101" className="btn-secondary">View public profile</Link>
        </div>
      </form>
    </div>
  );
}
