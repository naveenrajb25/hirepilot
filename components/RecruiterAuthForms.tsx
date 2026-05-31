"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthNotice } from "@/components/AuthNotice";
import { RoleCombobox } from "@/components/RoleCombobox";
import { createRecruiterAccount, loginRecruiter } from "@/lib/storage/authProfileStore";
import { isEmail } from "@/lib/mock-auth";

export function RecruiterSignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(formData: FormData) {
    setError("");
    const recruiterName = String(formData.get("recruiterName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const phone = String(formData.get("phone") || "").trim();
    const companyName = String(formData.get("companyName") || "").trim();
    const companyWebsite = String(formData.get("companyWebsite") || "").trim();
    const companyLocation = String(formData.get("companyLocation") || "").trim();
    const companySize = String(formData.get("companySize") || "").trim();
    const industry = String(formData.get("industry") || "").trim();
    const hiringRoles = String(formData.get("hiringRoles") || "").trim();

    if (!recruiterName || !email || !password || !confirmPassword || !phone || !companyName || !companyWebsite || !companyLocation || !companySize || !industry || !hiringRoles) return setError("All recruiter and company fields are required.");
    if (!isEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Password and confirm password must match.");

    const result = createRecruiterAccount({ recruiterName, email, password, phone, companyName, companyWebsite, companyLocation, companySize, industry, hiringRoles });
    if (!result.ok) return setError(result.message || "Unable to create account.");
    router.push("/recruiter/login?message=Account%20created%20successfully.%20Your%20recruiter%20account%20is%20pending%20admin%20approval.");
  }

  return (
    <form action={submit} className="card mt-6 grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2"><AuthNotice error={error} /></div>
      <div><label>Recruiter name</label><input className="mt-2" name="recruiterName" required /></div>
      <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
      <div><label>Password</label><input className="mt-2" name="password" type="password" minLength={8} required /></div>
      <div><label>Confirm password</label><input className="mt-2" name="confirmPassword" type="password" minLength={8} required /></div>
      <div><label>Phone</label><input className="mt-2" name="phone" required /></div>
      <div><label>Company name</label><input className="mt-2" name="companyName" required /></div>
      <div><label>Company website</label><input className="mt-2" name="companyWebsite" required /></div>
      <div><label>Company location</label><input className="mt-2" name="companyLocation" required /></div>
      <div><label>Company size</label><input className="mt-2" name="companySize" required /></div>
      <div><label>Industry</label><input className="mt-2" name="industry" required /></div>
      <div className="md:col-span-2"><RoleCombobox name="hiringRoles" label="Hiring roles" required /></div>
      <button className="btn-primary md:col-span-2" type="submit">Create recruiter account</button>
    </form>
  );
}

export function RecruiterLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") || "");

  function submit(formData: FormData) {
    setError("");
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const result = loginRecruiter(email, password);
    if (!result.ok || !result.account) return setError(result.message || "Invalid email or password");
    router.push(result.account.isApproved && result.account.recruiterStatus === "active" ? "/recruiter/dashboard" : "/recruiter/pending-approval");
  }

  return (
    <form action={submit} className="card space-y-4">
      <AuthNotice error={error} message={searchParams.get("message") || undefined} />
      <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
      <div><label>Password</label><input className="mt-2" name="password" type="password" required /></div>
      <button className="btn-primary w-full" type="submit">Login</button>
      <Link href="/recruiter/signup" className="block text-center text-sm font-bold text-trust">New user? Create recruiter account</Link>
    </form>
  );
}
