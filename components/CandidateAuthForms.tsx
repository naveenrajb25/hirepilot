"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthNotice } from "@/components/AuthNotice";
import { RoleCombobox } from "@/components/RoleCombobox";
import { createCandidateAccount, loginCandidate } from "@/lib/storage/authProfileStore";
import { isEmail } from "@/lib/mock-auth";

export function CandidateSignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(formData: FormData) {
    setError("");
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const mobile = String(formData.get("mobile") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const preferredRole = String(formData.get("preferredRole") || "").trim();

    if (!fullName || !email || !password || !confirmPassword || !mobile || !city || !preferredRole) return setError("All fields are required.");
    if (!isEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Password and confirm password must match.");

    const result = createCandidateAccount({ fullName, email, password, mobile, city, preferredRole });
    if (!result.ok) return setError(result.message || "Unable to create account.");
    router.push("/candidate/login?message=Profile%20created%20successfully.%20Please%20login%20to%20continue.");
  }

  return (
    <form action={submit} className="card mt-6 grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2"><AuthNotice error={error} /></div>
      <div><label>Full name</label><input className="mt-2" name="fullName" required /></div>
      <div><label>Email</label><input className="mt-2" name="email" type="email" required /></div>
      <div><label>Password</label><input className="mt-2" name="password" type="password" minLength={8} required /></div>
      <div><label>Confirm password</label><input className="mt-2" name="confirmPassword" type="password" minLength={8} required /></div>
      <div><label>Mobile number</label><input className="mt-2" name="mobile" required /></div>
      <div><label>City</label><input className="mt-2" name="city" required /></div>
      <div className="md:col-span-2"><RoleCombobox name="preferredRole" required /></div>
      <button className="btn-primary md:col-span-2" type="submit">Create account</button>
    </form>
  );
}

export function CandidateLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") || "");

  function submit(formData: FormData) {
    setError("");
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const result = loginCandidate(email, password);
    if (!result.ok || !result.account) return setError(result.message || "Invalid email or password");
    router.push("/candidate/dashboard");
  }

  return (
    <form action={submit} className="card space-y-4">
      <AuthNotice error={error} message={searchParams.get("message") || undefined} />
      <div><label htmlFor="candidate-email">Email</label><input id="candidate-email" className="mt-2" name="email" type="email" required /></div>
      <div><label htmlFor="candidate-password">Password</label><input id="candidate-password" className="mt-2" name="password" type="password" required /></div>
      <button className="btn-primary w-full" type="submit">Login</button>
      <Link href="/candidate/signup" className="block text-center text-sm font-bold text-trust">New user? Create account</Link>
    </form>
  );
}
