"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  candidateCookieName,
  decodeMockSession,
  encodeMockSession,
  isEmail,
  isDemoMode,
  recruiterCookieName,
  type CandidateMockSession,
  type RecruiterMockSession
} from "@/lib/mock-auth";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14
};

function required(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function fail(path: string, error: string): never {
  redirect(`${path}?error=${encodeURIComponent(error)}`);
}

export async function candidateSignup(formData: FormData) {
  const fullName = required(formData, "fullName");
  const email = required(formData, "email");
  const password = required(formData, "password");
  const confirmPassword = required(formData, "confirmPassword");
  const mobile = required(formData, "mobile");
  const city = required(formData, "city");
  const preferredRole = required(formData, "preferredRole");

  if (!fullName || !email || !password || !confirmPassword || !mobile || !city || !preferredRole) fail("/candidate/signup", "All fields are required.");
  if (!isEmail(email)) fail("/candidate/signup", "Enter a valid email address.");
  if (password.length < 8) fail("/candidate/signup", "Password must be at least 8 characters.");
  if (password !== confirmPassword) fail("/candidate/signup", "Password and confirm password must match.");

  const session: CandidateMockSession = {
    type: "candidate",
    fullName,
    email,
    password,
    emailVerified: false,
    candidateAccountStatus: "pending_verification",
    onboardingCompleted: false
  };

  const cookieStore = await cookies();
  cookieStore.set(candidateCookieName, encodeMockSession(session), cookieOptions);
  redirect("/candidate/verify?message=Please%20verify%20your%20email%20to%20activate%20your%20account.");
}

export async function verifyCandidateOtp(formData: FormData) {
  const otp = required(formData, "otp");
  const cookieStore = await cookies();
  const session = decodeMockSession<CandidateMockSession>(cookieStore.get(candidateCookieName)?.value);
  if (!session) redirect("/candidate/signup?error=Session%20expired.%20Please%20sign%20up%20again.");
  if (otp !== "123456") fail("/candidate/verify", "OTP invalid.");

  cookieStore.set(candidateCookieName, encodeMockSession({ ...session, emailVerified: true, candidateAccountStatus: "active" }), cookieOptions);
  redirect("/candidate/onboarding?message=Account%20verified%20successfully.");
}

export async function candidateLogin(formData: FormData) {
  const email = required(formData, "email");
  const password = required(formData, "password");
  const cookieStore = await cookies();

  // TODO: Remove demo credentials before production launch.
  if (isDemoMode() && email === "candidate@demo.com" && password === "Demo@123") {
    cookieStore.set(candidateCookieName, encodeMockSession(createDemoCandidateSession()), cookieOptions);
    redirect("/candidate/dashboard?message=Login%20successful.");
  }

  const session = decodeMockSession<CandidateMockSession>(cookieStore.get(candidateCookieName)?.value);

  if (!session || session.email !== email || session.password !== password) fail("/candidate/login", "Login failed.");
  if (!session.emailVerified || session.candidateAccountStatus === "pending_verification") fail("/candidate/login", "Your account is not verified. Please verify your email first.");
  if (session.candidateAccountStatus === "suspended") fail("/candidate/login", "Your account is suspended.");

  redirect(session.onboardingCompleted ? "/candidate/dashboard" : "/candidate/portfolio");
}

export async function completeCandidateOnboarding() {
  const cookieStore = await cookies();
  const session = decodeMockSession<CandidateMockSession>(cookieStore.get(candidateCookieName)?.value);
  if (!session) redirect("/candidate/login?error=Session%20expired.");
  cookieStore.set(candidateCookieName, encodeMockSession({ ...session, onboardingCompleted: true }), cookieOptions);
  redirect("/candidate/dashboard");
}

export async function recruiterSignup(formData: FormData) {
  const recruiterName = required(formData, "recruiterName");
  const email = required(formData, "email");
  const password = required(formData, "password");
  const confirmPassword = required(formData, "confirmPassword");
  const phone = required(formData, "phone");
  const companyName = required(formData, "companyName");
  const companyWebsite = required(formData, "companyWebsite");
  const companyLocation = required(formData, "companyLocation");
  const companySize = required(formData, "companySize");
  const industry = required(formData, "industry");
  const hiringRoles = required(formData, "hiringRoles");

  if (!recruiterName || !email || !password || !confirmPassword || !phone || !companyName || !companyWebsite || !companyLocation || !companySize || !industry || !hiringRoles) fail("/recruiter/signup", "All recruiter and company fields are required.");
  if (!isEmail(email)) fail("/recruiter/signup", "Enter a valid email address.");
  if (password.length < 8) fail("/recruiter/signup", "Password must be at least 8 characters.");
  if (password !== confirmPassword) fail("/recruiter/signup", "Password and confirm password must match.");

  const session: RecruiterMockSession = {
    type: "recruiter",
    recruiterName,
    email,
    password,
    emailVerified: false,
    recruiterAccountStatus: "pending_verification",
    recruiterStatus: "pending",
    isApproved: false
  };

  const cookieStore = await cookies();
  cookieStore.set(recruiterCookieName, encodeMockSession(session), cookieOptions);
  redirect("/recruiter/verify?message=Please%20verify%20your%20email.%20After%20verification,%20your%20company%20profile%20will%20be%20sent%20for%20admin%20approval.");
}

export async function verifyRecruiterOtp(formData: FormData) {
  const otp = required(formData, "otp");
  const cookieStore = await cookies();
  const session = decodeMockSession<RecruiterMockSession>(cookieStore.get(recruiterCookieName)?.value);
  if (!session) redirect("/recruiter/signup?error=Session%20expired.%20Please%20sign%20up%20again.");
  if (otp !== "123456") fail("/recruiter/verify", "OTP invalid.");

  cookieStore.set(recruiterCookieName, encodeMockSession({ ...session, emailVerified: true, recruiterAccountStatus: "pending_admin_approval" }), cookieOptions);
  redirect("/recruiter/pending-approval?message=Account%20verified%20successfully.");
}

export async function recruiterLogin(formData: FormData) {
  const email = required(formData, "email");
  const password = required(formData, "password");
  const cookieStore = await cookies();

  // TODO: Remove demo credentials before production launch.
  if (isDemoMode() && email === "recruiter@demo.com" && password === "Demo@123") {
    cookieStore.set(recruiterCookieName, encodeMockSession(createDemoRecruiterSession()), cookieOptions);
    redirect("/recruiter/dashboard?message=Login%20successful.");
  }

  const session = decodeMockSession<RecruiterMockSession>(cookieStore.get(recruiterCookieName)?.value);

  if (!session || session.email !== email || session.password !== password) fail("/recruiter/login", "Login failed.");
  if (!session.emailVerified || session.recruiterAccountStatus === "pending_verification") fail("/recruiter/login", "Your account is not verified. Please verify your email first.");
  if (session.recruiterAccountStatus === "rejected" || session.recruiterStatus === "rejected") fail("/recruiter/login", "Recruiter rejected.");
  if (!session.isApproved || session.recruiterStatus !== "active") redirect("/recruiter/pending-approval");

  redirect("/recruiter/dashboard");
}

export async function mockApproveCurrentRecruiter() {
  const cookieStore = await cookies();
  const session = decodeMockSession<RecruiterMockSession>(cookieStore.get(recruiterCookieName)?.value);
  if (!session) redirect("/recruiter/login?error=Session%20expired.");
  cookieStore.set(recruiterCookieName, encodeMockSession({ ...session, recruiterAccountStatus: "active", recruiterStatus: "active", isApproved: true }), cookieOptions);
  redirect("/recruiter/dashboard?message=Recruiter%20approved.");
}

export async function candidateLogout() {
  const cookieStore = await cookies();
  cookieStore.set(candidateCookieName, "", { ...cookieOptions, maxAge: 0 });
  redirect("/candidate/login?message=Logged%20out%20successfully");
}

export async function recruiterLogout() {
  const cookieStore = await cookies();
  cookieStore.set(recruiterCookieName, "", { ...cookieOptions, maxAge: 0 });
  redirect("/recruiter/login?message=Logged%20out%20successfully");
}

export async function demoCandidateLogin() {
  // TODO: Remove demo credentials and this shortcut before production launch.
  if (!isDemoMode()) redirect("/candidate/login?error=Demo%20login%20is%20disabled.");

  const cookieStore = await cookies();
  cookieStore.set(candidateCookieName, encodeMockSession(createDemoCandidateSession()), cookieOptions);
  redirect("/candidate/dashboard?message=Login%20successful.");
}

function createDemoCandidateSession(): CandidateMockSession {
  return {
    type: "candidate",
    fullName: "Demo Candidate",
    email: "candidate@demo.com",
    password: "Demo@123",
    emailVerified: true,
    candidateAccountStatus: "active",
    onboardingCompleted: true,
    mobile: "+91 90000 11111",
    city: "Bengaluru",
    preferredRole: "Python Developer",
    resumeUrl: "/sample-resume.pdf",
    linkedin: "https://linkedin.com/in/demo-candidate",
    github: "https://github.com/demo-candidate",
    skills: ["Python", "SQL", "FastAPI", "Communication"],
    aiInterviewScore: 86,
    employabilityScore: 88
  };
}

export async function demoRecruiterLogin() {
  // TODO: Remove demo credentials and this shortcut before production launch.
  if (!isDemoMode()) redirect("/recruiter/login?error=Demo%20login%20is%20disabled.");

  const cookieStore = await cookies();
  cookieStore.set(recruiterCookieName, encodeMockSession(createDemoRecruiterSession()), cookieOptions);
  redirect("/recruiter/dashboard?message=Login%20successful.");
}

function createDemoRecruiterSession(): RecruiterMockSession {
  return {
    type: "recruiter",
    recruiterName: "Demo Recruiter",
    email: "recruiter@demo.com",
    password: "Demo@123",
    emailVerified: true,
    recruiterAccountStatus: "active",
    recruiterStatus: "active",
    isApproved: true,
    companyName: "Demo Hiring Pvt Ltd",
    companyWebsite: "https://demo-hiring.example",
    companyLocation: "Mumbai",
    companySize: "51-200",
    industry: "Technology",
    hiringRoles: ["Python Developer", "Data Analyst"],
    activePlan: "Monthly Subscription",
    canViewContacts: true,
    canDownloadResumes: true
  };
}
