export type CandidateMockSession = {
  type: "candidate";
  fullName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  candidateAccountStatus: "pending_verification" | "active" | "suspended";
  onboardingCompleted: boolean;
  mobile?: string;
  city?: string;
  preferredRole?: string;
  resumeUrl?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  aiInterviewScore?: number;
  employabilityScore?: number;
};

export type RecruiterMockSession = {
  type: "recruiter";
  recruiterName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  recruiterAccountStatus: "pending_verification" | "pending_admin_approval" | "active" | "rejected";
  recruiterStatus: "pending" | "approved" | "rejected" | "active" | "inactive" | "suspended";
  isApproved: boolean;
  companyName?: string;
  companyWebsite?: string;
  companyLocation?: string;
  companySize?: string;
  industry?: string;
  hiringRoles?: string[];
  activePlan?: string;
  canViewContacts?: boolean;
  canDownloadResumes?: boolean;
};

export const candidateCookieName = "hirepilot_candidate_mock";
export const recruiterCookieName = "hirepilot_recruiter_mock";

export function encodeMockSession(session: CandidateMockSession | RecruiterMockSession) {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeMockSession<T>(value?: string): T | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch {
    return null;
  }
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isDemoMode() {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_INTERNAL_DEMO_ACCOUNTS === "true";
}
