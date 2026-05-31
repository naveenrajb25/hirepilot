import { candidates, generateMockScorecard, paidServices } from "./data";
import type { AdminActivityLog, AiReport, CandidateService, InterviewSession, PaymentRecord, PricingPlan, RecruiterProfile } from "./types";

export const recruiters: RecruiterProfile[] = [
  {
    id: "r-201",
    recruiterName: "Priya Menon",
    email: "priya@hiringstack.in",
    phone: "+91 98888 11122",
    companyName: "HiringStack SME Solutions",
    companyWebsite: "https://hiringstack.in",
    companyLocation: "Mumbai",
    companySize: "51-200",
    industry: "Staffing",
    hiringRoles: ["Python Developer", "Data Analyst", "Customer Support"],
    recruiterStatus: "active",
    isApproved: true,
    canViewContacts: true,
    canDownloadResumes: true,
    subscriptionStatus: "active",
    shortlistedCandidateIds: ["c-101", "c-103"],
    adminNotes: "High quality SME recruiter account.",
    emailVerified: true,
    recruiterAccountStatus: "active"
  },
  {
    id: "r-202",
    recruiterName: "Arjun Patel",
    email: "arjun@startupjobs.co",
    phone: "+91 97777 22233",
    companyName: "StartupJobs Co",
    companyWebsite: "https://startupjobs.co",
    companyLocation: "Ahmedabad",
    companySize: "11-50",
    industry: "Technology",
    hiringRoles: ["Java Developer", "Digital Marketing"],
    recruiterStatus: "pending",
    isApproved: false,
    canViewContacts: false,
    canDownloadResumes: false,
    subscriptionStatus: "trial",
    shortlistedCandidateIds: [],
    adminNotes: "Company profile pending owner approval.",
    emailVerified: true,
    recruiterAccountStatus: "pending_admin_approval"
  },
  {
    id: "r-203",
    recruiterName: "Sneha Rao",
    email: "sneha@voiceops.in",
    phone: "+91 96666 33344",
    companyName: "VoiceOps India",
    companyWebsite: "https://voiceops.in",
    companyLocation: "Hyderabad",
    companySize: "201-500",
    industry: "BPO",
    hiringRoles: ["BPO Executive", "Customer Support", "Sales Executive"],
    recruiterStatus: "inactive",
    isApproved: true,
    canViewContacts: false,
    canDownloadResumes: false,
    subscriptionStatus: "expired",
    shortlistedCandidateIds: ["c-102"],
    adminNotes: "Renewal needed before contact access.",
    emailVerified: true,
    recruiterAccountStatus: "active"
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "plan-one-time",
    planName: "One-time access plan",
    planType: "one-time",
    price: "INR 999",
    razorpayPaymentLink: "https://rzp.io/l/hirepilot-one-time",
    profileViewLimit: 25,
    validityDays: 7,
    contactViewLimit: 25,
    resumeDownloadLimit: 10,
    featuredCandidateAccess: false,
    isActive: true,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-20",
    description: "Unlock candidate contact details for a limited hiring sprint."
  },
  {
    id: "plan-monthly",
    planName: "Monthly subscription plan",
    planType: "monthly",
    price: "INR 4,999/mo",
    razorpayPaymentLink: "https://rzp.io/l/hirepilot-monthly",
    profileViewLimit: 250,
    validityDays: 30,
    contactViewLimit: 250,
    resumeDownloadLimit: 100,
    featuredCandidateAccess: true,
    isActive: true,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-20",
    description: "Search, shortlist, notes, and resume downloads for active SME hiring."
  },
  {
    id: "plan-enterprise",
    planName: "Enterprise hiring plan",
    planType: "enterprise",
    price: "Custom",
    razorpayPaymentLink: "https://rzp.io/l/hirepilot-enterprise",
    profileViewLimit: null,
    validityDays: null,
    contactViewLimit: null,
    resumeDownloadLimit: null,
    featuredCandidateAccess: true,
    isActive: true,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-20",
    description: "Bulk access, team seats, dedicated support, and hiring reports."
  },
  {
    id: "plan-legacy",
    planName: "Legacy trial plan",
    planType: "one-time",
    price: "INR 299",
    razorpayPaymentLink: "",
    profileViewLimit: 5,
    validityDays: 3,
    contactViewLimit: 5,
    resumeDownloadLimit: 0,
    featuredCandidateAccess: false,
    isActive: false,
    createdAt: "2026-04-01",
    updatedAt: "2026-05-10",
    description: "Disabled legacy plan kept for admin history."
  }
];

export const candidateServices: CandidateService[] = paidServices.map((service, index) => ({
  id: `service-${index + 1}`,
  serviceName: service,
  description:
    service === "ATS Resume Optimization"
      ? "Make your resume pass ATS filters and highlight recruiter-searched skills."
      : service === "LinkedIn Profile Optimization"
        ? "Improve recruiter visibility with a keyword-rich headline, about section, and skills."
        : service === "AI Interview Readiness"
          ? "Complete realistic role-based interview simulations and improve readiness before real interviews."
          : service === "Portfolio Building"
            ? "Add GitHub, projects, case studies, and proof of work to increase recruiter trust."
            : service === "Career Visibility Pack"
              ? "Resume and LinkedIn optimization bundle with visibility improvement report."
              : "Manual expert support for sharper job applications and recruiter visibility.",
  price: service === "Career Visibility Pack" ? "INR 2,999" : `INR ${999 + index * 500}`,
  razorpayPaymentLink: `https://rzp.io/l/hirepilot-service-${index + 1}`,
  isActive: index !== 4,
  createdAt: "2026-05-01",
  updatedAt: "2026-05-22"
}));

export const interviewSessions: InterviewSession[] = candidates.map((candidate, index) => ({
  id: `int-${index + 1}`,
  candidateId: candidate.id,
  candidateName: candidate.fullName,
  role: candidate.preferredRole,
  completedAt: `2026-05-${18 + index}`,
  score: candidate.aiInterviewScore,
  answers: [
    "I introduced my background, target role, and proof-of-work projects.",
    "I explained a role-specific problem and how I would solve it step by step."
  ],
  scorecard: generateMockScorecard(candidate.preferredRole, candidate.aiInterviewScore - 8),
  isFlagged: candidate.id === "c-104",
  flagReason: candidate.id === "c-104" ? "Answers were unusually generic across domain questions." : undefined,
  adminNotes: candidate.id === "c-104" ? "Review before verification." : "No manual review issue."
}));

export const adminActivityLogs: AdminActivityLog[] = [
  {
    id: "log-1",
    adminUsername: "bnradmin",
    actionType: "candidate featured",
    entityType: "candidate",
    entityId: "c-103",
    details: "Meera Nair marked as featured for HR Recruiter searches.",
    createdAt: "2026-05-27 10:30"
  },
  {
    id: "log-2",
    adminUsername: "bnradmin",
    actionType: "recruiter approved",
    entityType: "recruiter",
    entityId: "r-201",
    details: "HiringStack SME Solutions approved and activated.",
    createdAt: "2026-05-27 11:10"
  },
  {
    id: "log-3",
    adminUsername: "bnradmin",
    actionType: "pricing plan updated",
    entityType: "pricing_plan",
    entityId: "plan-monthly",
    details: "Monthly plan limits updated for contact views and downloads.",
    createdAt: "2026-05-27 12:45"
  },
  {
    id: "log-4",
    adminUsername: "bnradmin",
    actionType: "interview flagged",
    entityType: "interview",
    entityId: "int-4",
    details: "Data Analyst interview flagged for manual review.",
    createdAt: "2026-05-27 15:20"
  }
];

export const adminSettings = {
  productBrandName: "HirePilot",
  parentBrandName: "BNR QA Academy",
  merchantAccountName: "BNR QA Academy",
  paymentDisclosureEnabled: true,
  paymentDisclosureText: "HirePilot is a product of BNR QA Academy. Payments are securely processed through our registered merchant account: BNR QA Academy.",
  minimumScoreForVisibility: 70,
  freeRecruiterProfileViewLimit: 2,
  featuredCandidateBoost: 20,
  requireRecruiterApproval: true,
  requireActiveSubscriptionForContacts: true,
  platformMaintenanceMode: false,
  revenuePlaceholder: "INR 1,42,000"
};

export const paymentRecords: PaymentRecord[] = [
  {
    id: "pay-101",
    payerName: "Aditi Sharma",
    email: "aditi@example.com",
    phone: "+91 98765 10101",
    paymentFor: "Resume ATS Optimization",
    referenceId: "rzp_ref_ats_101",
    amount: "INR 799",
    status: "pending_verification",
    notes: "Awaiting owner verification.",
    createdAt: "2026-05-28 10:20"
  },
  {
    id: "pay-102",
    payerName: "HiringStack SME Solutions",
    email: "priya@hiringstack.in",
    phone: "+91 98888 11122",
    paymentFor: "Monthly subscription plan",
    referenceId: "rzp_ref_rec_102",
    amount: "INR 4,999",
    status: "paid",
    notes: "Subscription activated.",
    createdAt: "2026-05-28 11:05"
  }
];

export const aiReports: AiReport[] = [
  {
    id: "air-101",
    candidateName: "Ananya Sharma",
    reportType: "resume_ats",
    status: "published",
    score: 82,
    summary: "Resume is aligned to Python Developer roles, with room to improve measurable project outcomes.",
    createdAt: "2026-05-28 09:30"
  },
  {
    id: "air-102",
    candidateName: "Rahul Verma",
    reportType: "interview_score",
    status: "needs_review",
    score: 74,
    summary: "Good customer-facing confidence; needs sharper sales scenario examples.",
    createdAt: "2026-05-28 12:10"
  }
];

export const activePricingPlans = pricingPlans.filter((plan) => plan.isActive);
export const activeCandidateServices = candidateServices.filter((service) => service.isActive);

export const demoRecruiterAccess = {
  isApproved: recruiters[0].isApproved,
  recruiterStatus: recruiters[0].recruiterStatus,
  subscriptionStatus: recruiters[0].subscriptionStatus,
  canViewContacts: recruiters[0].canViewContacts,
  canDownloadResumes: recruiters[0].canDownloadResumes
};

export const canRecruiterViewContacts =
  demoRecruiterAccess.isApproved &&
  demoRecruiterAccess.recruiterStatus === "active" &&
  demoRecruiterAccess.subscriptionStatus === "active" &&
  demoRecruiterAccess.canViewContacts;

export const canRecruiterDownloadResumes =
  demoRecruiterAccess.isApproved &&
  demoRecruiterAccess.recruiterStatus === "active" &&
  demoRecruiterAccess.subscriptionStatus === "active" &&
  demoRecruiterAccess.canDownloadResumes;
