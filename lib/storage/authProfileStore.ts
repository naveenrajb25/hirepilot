"use client";

import type { Candidate, RecruiterProfile } from "@/lib/types";
import { candidateCookieName, encodeMockSession, isDemoMode, recruiterCookieName, type CandidateMockSession, type RecruiterMockSession } from "@/lib/mock-auth";

export type CandidateAccount = {
  id: string;
  type: "candidate";
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  city: string;
  preferredRole: string;
  education: string;
  experienceLevel: string;
  skills: string[];
  languages: string[];
  resumeFileName: string;
  originalResumeUrl: string;
  linkedin: string;
  github: string;
  projectLinks: string[];
  availability: string;
  expectedSalary: string;
  onboardingCompleted: boolean;
  candidateAccountStatus: "active" | "suspended";
  candidateStatus: "pending" | "verified" | "featured" | "hidden" | "suspended";
  isVerified: boolean;
  isFeatured: boolean;
  isVisibleToRecruiters: boolean;
  atsScore?: number;
  linkedinScore?: number;
  aiInterviewScore?: number;
  employabilityScore?: number;
  createdAt: string;
};

export type RecruiterAccount = {
  id: string;
  type: "recruiter";
  recruiterName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  companyWebsite: string;
  companyLocation: string;
  companySize: string;
  industry: string;
  hiringRoles: string[];
  recruiterAccountStatus: "pending_admin_approval" | "active" | "rejected";
  recruiterStatus: "pending" | "approved" | "rejected" | "active" | "inactive" | "suspended";
  isApproved: boolean;
  canViewContacts: boolean;
  canDownloadResumes: boolean;
  subscriptionStatus: "trial" | "active" | "expired" | "none";
  activePlan?: string;
  shortlistedCandidateIds: string[];
  createdAt: string;
};

type CandidateProfilePatch = Omit<Partial<CandidateAccount>, "skills" | "languages" | "projectLinks"> & {
  skills?: string[] | string;
  languages?: string[] | string;
  projectLinks?: string[] | string;
};

type RecruiterProfilePatch = Omit<Partial<RecruiterAccount>, "hiringRoles"> & {
  hiringRoles?: string[] | string;
};

const keys = {
  candidates: "hirepilot.auth.candidates",
  recruiters: "hirepilot.auth.recruiters",
  currentCandidateId: "hirepilot.auth.currentCandidateId",
  currentRecruiterId: "hirepilot.auth.currentRecruiterId"
};

const maxAge = 60 * 60 * 24 * 14;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function setCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function toList(value: string | string[]) {
  if (Array.isArray(value)) return value;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function candidateSession(account: CandidateAccount): CandidateMockSession {
  return {
    type: "candidate",
    fullName: account.fullName,
    email: account.email,
    password: account.password,
    emailVerified: true,
    candidateAccountStatus: account.candidateAccountStatus,
    onboardingCompleted: account.onboardingCompleted,
    mobile: account.mobile,
    city: account.city,
    preferredRole: account.preferredRole,
    resumeUrl: account.originalResumeUrl || account.resumeFileName,
    linkedin: account.linkedin,
    github: account.github,
    skills: account.skills,
    aiInterviewScore: account.aiInterviewScore,
    employabilityScore: account.employabilityScore
  };
}

function recruiterSession(account: RecruiterAccount): RecruiterMockSession {
  return {
    type: "recruiter",
    recruiterName: account.recruiterName,
    email: account.email,
    password: account.password,
    emailVerified: true,
    recruiterAccountStatus: account.recruiterAccountStatus,
    recruiterStatus: account.recruiterStatus,
    isApproved: account.isApproved,
    companyName: account.companyName,
    companyWebsite: account.companyWebsite,
    companyLocation: account.companyLocation,
    companySize: account.companySize,
    industry: account.industry,
    hiringRoles: account.hiringRoles,
    activePlan: account.activePlan,
    canViewContacts: account.canViewContacts,
    canDownloadResumes: account.canDownloadResumes
  };
}

function demoCandidate(): CandidateAccount {
  return {
    id: "candidate-demo",
    type: "candidate",
    fullName: "Internal Candidate",
    email: "candidate@demo.com",
    password: "Demo@123",
    mobile: "+91 90000 11111",
    city: "Bengaluru",
    preferredRole: "Python Developer",
    education: "B.Tech Computer Science",
    experienceLevel: "Fresher",
    skills: ["Python", "SQL", "FastAPI", "Communication"],
    languages: ["English", "Hindi"],
    resumeFileName: "sample-resume.pdf",
    originalResumeUrl: "",
    linkedin: "https://linkedin.com/in/candidate-profile",
    github: "https://github.com/candidate-profile",
    projectLinks: ["https://github.com/candidate-profile/project"],
    availability: "Immediate",
    expectedSalary: "4-6 LPA",
    onboardingCompleted: true,
    candidateAccountStatus: "active",
    candidateStatus: "verified",
    isVerified: true,
    isFeatured: false,
    isVisibleToRecruiters: true,
    atsScore: 82,
    linkedinScore: 76,
    aiInterviewScore: 86,
    employabilityScore: 88,
    createdAt: new Date().toISOString()
  };
}

function demoRecruiter(): RecruiterAccount {
  return {
    id: "recruiter-demo",
    type: "recruiter",
    recruiterName: "Internal Recruiter",
    email: "recruiter@demo.com",
    password: "Demo@123",
    phone: "+91 90000 22222",
    companyName: "Internal Hiring Pvt Ltd",
    companyWebsite: "https://hiring.example",
    companyLocation: "Mumbai",
    companySize: "51-200",
    industry: "Technology",
    hiringRoles: ["Python Developer", "Data Analyst"],
    recruiterAccountStatus: "active",
    recruiterStatus: "active",
    isApproved: true,
    canViewContacts: true,
    canDownloadResumes: true,
    subscriptionStatus: "active",
    activePlan: "Monthly Subscription",
    shortlistedCandidateIds: [],
    createdAt: new Date().toISOString()
  };
}

export function getCandidateAccounts() {
  return readJson<CandidateAccount[]>(keys.candidates, []);
}

export function saveCandidateAccounts(accounts: CandidateAccount[]) {
  writeJson(keys.candidates, accounts);
}

export function createCandidateAccount(input: Pick<CandidateAccount, "fullName" | "email" | "password" | "mobile" | "city" | "preferredRole">) {
  const accounts = getCandidateAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === input.email.toLowerCase())) {
    return { ok: false, message: "An account with this email already exists." };
  }
  const account: CandidateAccount = {
    ...input,
    id: `candidate-${Date.now()}`,
    type: "candidate",
    education: "",
    experienceLevel: "",
    skills: [],
    languages: [],
    resumeFileName: "",
    originalResumeUrl: "",
    linkedin: "",
    github: "",
    projectLinks: [],
    availability: "",
    expectedSalary: "",
    onboardingCompleted: false,
    candidateAccountStatus: "active",
    candidateStatus: "pending",
    isVerified: false,
    isFeatured: false,
    isVisibleToRecruiters: true,
    createdAt: new Date().toISOString()
  };
  saveCandidateAccounts([account, ...accounts]);
  return { ok: true, account };
}

export function loginCandidate(email: string, password: string) {
  const accounts = getCandidateAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    || (isDemoMode() && email === "candidate@demo.com" && password === "Demo@123" ? demoCandidate() : null);
  if (!account) return { ok: false, message: "Invalid email or password" };
  if (account.candidateAccountStatus === "suspended") return { ok: false, message: "Your account is suspended." };
  window.localStorage.setItem(keys.currentCandidateId, account.id);
  setCookie(candidateCookieName, encodeMockSession(candidateSession(account)));
  return { ok: true, account };
}

export function getCurrentCandidate() {
  if (!canUseStorage()) return null;
  const currentId = window.localStorage.getItem(keys.currentCandidateId);
  if (!currentId) return null;
  if (currentId === "candidate-demo") return demoCandidate();
  return getCandidateAccounts().find((account) => account.id === currentId) || null;
}

export function updateCandidateProfile(patch: CandidateProfilePatch) {
  const current = getCurrentCandidate();
  if (!current) return null;
  const updated: CandidateAccount = {
    ...current,
    ...patch,
    skills: patch.skills ? toList(patch.skills) : current.skills,
    languages: patch.languages ? toList(patch.languages) : current.languages,
    projectLinks: patch.projectLinks ? toList(patch.projectLinks) : current.projectLinks,
    onboardingCompleted: true
  };
  if (updated.id !== "candidate-demo") {
    saveCandidateAccounts(getCandidateAccounts().map((account) => account.id === updated.id ? updated : account));
  }
  window.localStorage.setItem(keys.currentCandidateId, updated.id);
  setCookie(candidateCookieName, encodeMockSession(candidateSession(updated)));
  return updated;
}

export function logoutCandidate() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(keys.currentCandidateId);
  clearCookie(candidateCookieName);
}

export function getCandidateAdminRows(fallback: Candidate[]) {
  const accounts = getCandidateAccounts().map(candidateAccountToAdminRow);
  const emails = new Set(accounts.map((account) => account.email.toLowerCase()));
  return [...accounts, ...fallback.filter((candidate) => !emails.has(candidate.email.toLowerCase()))];
}

export function updateCandidateAccountFromAdmin(id: string, patch: Partial<Candidate>) {
  const accounts = getCandidateAccounts();
  saveCandidateAccounts(accounts.map((account) => {
    if (account.id !== id) return account;
    return {
      ...account,
      candidateAccountStatus: patch.candidateAccountStatus === "pending_verification" ? account.candidateAccountStatus : patch.candidateAccountStatus ?? account.candidateAccountStatus,
      candidateStatus: patch.candidateStatus ?? account.candidateStatus,
      isVerified: patch.isVerified ?? account.isVerified,
      isFeatured: patch.isFeatured ?? account.isFeatured,
      isVisibleToRecruiters: patch.isVisibleToRecruiters ?? account.isVisibleToRecruiters
    };
  }));
}

export function deleteCandidateAccountFromAdmin(id: string) {
  saveCandidateAccounts(getCandidateAccounts().filter((account) => account.id !== id));
}

export function candidateAccountToAdminRow(account: CandidateAccount): Candidate {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    phone: account.mobile,
    city: account.city,
    education: account.education || "Not added",
    experienceLevel: account.experienceLevel || "Not added",
    preferredRole: account.preferredRole,
    linkedin: account.linkedin,
    github: account.github,
    projectLinks: account.projectLinks,
    skills: account.skills,
    languages: account.languages,
    aiInterviewScore: account.aiInterviewScore ?? 0,
    employabilityScore: account.employabilityScore ?? 0,
    summary: `${account.fullName} is building a recruiter-ready HirePilot profile for ${account.preferredRole}.`,
    resumeUrl: account.originalResumeUrl || account.resumeFileName || "#",
    candidateStatus: account.candidateStatus,
    isVerified: account.isVerified,
    isFeatured: account.isFeatured,
    isVisibleToRecruiters: account.isVisibleToRecruiters,
    emailVerified: true,
    candidateAccountStatus: account.candidateAccountStatus,
    onboardingCompleted: account.onboardingCompleted
  };
}

export function getRecruiterAccounts() {
  return readJson<RecruiterAccount[]>(keys.recruiters, []);
}

export function saveRecruiterAccounts(accounts: RecruiterAccount[]) {
  writeJson(keys.recruiters, accounts);
}

export function createRecruiterAccount(input: Pick<RecruiterAccount, "recruiterName" | "email" | "password" | "phone" | "companyName" | "companyWebsite" | "companyLocation" | "companySize" | "industry"> & { hiringRoles: string }) {
  const accounts = getRecruiterAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === input.email.toLowerCase())) {
    return { ok: false, message: "An account with this email already exists." };
  }
  const account: RecruiterAccount = {
    ...input,
    id: `recruiter-${Date.now()}`,
    type: "recruiter",
    hiringRoles: toList(input.hiringRoles),
    recruiterAccountStatus: "pending_admin_approval",
    recruiterStatus: "pending",
    isApproved: false,
    canViewContacts: false,
    canDownloadResumes: false,
    subscriptionStatus: "none",
    shortlistedCandidateIds: [],
    createdAt: new Date().toISOString()
  };
  saveRecruiterAccounts([account, ...accounts]);
  return { ok: true, account };
}

export function loginRecruiter(email: string, password: string) {
  const accounts = getRecruiterAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    || (isDemoMode() && email === "recruiter@demo.com" && password === "Demo@123" ? demoRecruiter() : null);
  if (!account) return { ok: false, message: "Invalid email or password" };
  if (account.recruiterAccountStatus === "rejected" || account.recruiterStatus === "rejected") return { ok: false, message: "Recruiter rejected." };
  window.localStorage.setItem(keys.currentRecruiterId, account.id);
  setCookie(recruiterCookieName, encodeMockSession(recruiterSession(account)));
  return { ok: true, account };
}

export function getCurrentRecruiter() {
  if (!canUseStorage()) return null;
  const currentId = window.localStorage.getItem(keys.currentRecruiterId);
  if (!currentId) return null;
  if (currentId === "recruiter-demo") return demoRecruiter();
  return getRecruiterAccounts().find((account) => account.id === currentId) || null;
}

export function updateRecruiterProfile(patch: RecruiterProfilePatch) {
  const current = getCurrentRecruiter();
  if (!current) return null;
  const updated: RecruiterAccount = {
    ...current,
    ...patch,
    hiringRoles: patch.hiringRoles ? toList(patch.hiringRoles) : current.hiringRoles
  };
  if (updated.id !== "recruiter-demo") {
    saveRecruiterAccounts(getRecruiterAccounts().map((account) => account.id === updated.id ? updated : account));
  }
  window.localStorage.setItem(keys.currentRecruiterId, updated.id);
  setCookie(recruiterCookieName, encodeMockSession(recruiterSession(updated)));
  return updated;
}

export function logoutRecruiter() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(keys.currentRecruiterId);
  clearCookie(recruiterCookieName);
}

export function getRecruiterAdminRows(fallback: RecruiterProfile[]) {
  const accounts = getRecruiterAccounts().map(recruiterAccountToAdminRow);
  const emails = new Set(accounts.map((account) => account.email.toLowerCase()));
  return [...accounts, ...fallback.filter((recruiter) => !emails.has(recruiter.email.toLowerCase()))];
}

export function recruiterAccountToAdminRow(account: RecruiterAccount): RecruiterProfile {
  return {
    id: account.id,
    recruiterName: account.recruiterName,
    email: account.email,
    phone: account.phone,
    companyName: account.companyName,
    companyWebsite: account.companyWebsite,
    companyLocation: account.companyLocation,
    companySize: account.companySize,
    industry: account.industry,
    hiringRoles: account.hiringRoles,
    recruiterStatus: account.recruiterStatus,
    isApproved: account.isApproved,
    canViewContacts: account.canViewContacts,
    canDownloadResumes: account.canDownloadResumes,
    subscriptionStatus: account.subscriptionStatus,
    shortlistedCandidateIds: account.shortlistedCandidateIds,
    emailVerified: true,
    recruiterAccountStatus: account.recruiterAccountStatus
  };
}

export function updateRecruiterAccountFromAdmin(id: string, patch: Partial<RecruiterProfile>) {
  const accounts = getRecruiterAccounts();
  saveRecruiterAccounts(accounts.map((account) => {
    if (account.id !== id) return account;
    const nextAccountStatus = patch.recruiterAccountStatus === "pending_verification"
      ? account.recruiterAccountStatus
      : patch.recruiterAccountStatus ?? account.recruiterAccountStatus;
    return {
      ...account,
      recruiterStatus: patch.recruiterStatus ?? account.recruiterStatus,
      recruiterAccountStatus: nextAccountStatus,
      isApproved: patch.isApproved ?? account.isApproved,
      canViewContacts: patch.canViewContacts ?? account.canViewContacts,
      canDownloadResumes: patch.canDownloadResumes ?? account.canDownloadResumes,
      subscriptionStatus: patch.subscriptionStatus ?? account.subscriptionStatus
    };
  }));
}

export function deleteRecruiterAccountFromAdmin(id: string) {
  saveRecruiterAccounts(getRecruiterAccounts().filter((account) => account.id !== id));
}
