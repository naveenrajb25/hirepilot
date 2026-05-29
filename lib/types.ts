export type Role =
  | "Software Testing"
  | "Java Developer"
  | "Python Developer"
  | "AI Automation"
  | "Digital Marketing"
  | "Sales Executive"
  | "Customer Support"
  | "HR Recruiter"
  | "BPO Executive"
  | "Business Development Executive"
  | "Data Analyst"
  | "Accountant";

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  education: string;
  experienceLevel: string;
  preferredRole: string;
  linkedin: string;
  github?: string;
  projectLinks: string[];
  skills: string[];
  languages: string[];
  aiInterviewScore: number;
  employabilityScore: number;
  summary: string;
  resumeUrl: string;
  candidateStatus?: "pending" | "verified" | "featured" | "hidden" | "suspended";
  isVerified?: boolean;
  isFeatured?: boolean;
  isVisibleToRecruiters?: boolean;
  adminNotes?: string;
  emailVerified?: boolean;
  candidateAccountStatus?: "pending_verification" | "active" | "suspended";
  onboardingCompleted?: boolean;
};

export type Scorecard = {
  overall: number;
  communication: number;
  domain: number;
  confidence: number;
  problemSolving: number;
  resumeStrength: number;
  portfolioStrength: number;
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
  recommendation: string;
};

export type RecruiterStatus = "pending" | "approved" | "rejected" | "active" | "inactive" | "suspended";

export type RecruiterProfile = {
  id: string;
  recruiterName: string;
  email: string;
  phone: string;
  companyName: string;
  companyWebsite: string;
  companyLocation: string;
  companySize: string;
  industry: string;
  hiringRoles: string[];
  gstOrRegistration?: string;
  recruiterStatus: RecruiterStatus;
  isApproved: boolean;
  canViewContacts: boolean;
  canDownloadResumes: boolean;
  subscriptionStatus: "trial" | "active" | "expired" | "none";
  shortlistedCandidateIds: string[];
  adminNotes?: string;
  emailVerified?: boolean;
  recruiterAccountStatus?: "pending_verification" | "pending_admin_approval" | "active" | "rejected";
};

export type PricingPlan = {
  id: string;
  planName: string;
  planType: "one-time" | "monthly" | "enterprise";
  price: string;
  paymentLink?: string;
  razorpayPaymentLink?: string;
  profileViewLimit?: number | null;
  validityDays: number | null;
  contactViewLimit: number | null;
  resumeDownloadLimit: number | null;
  featuredCandidateAccess: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  displayOrder?: number;
};

export type CandidateService = {
  id: string;
  serviceName: string;
  description: string;
  price: string;
  paymentLink?: string;
  razorpayPaymentLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  displayOrder?: number;
};

export type PaymentStatus = "pending_verification" | "paid" | "failed" | "refunded";

export type PaymentRecord = {
  id: string;
  payerName: string;
  email: string;
  phone: string;
  paymentFor: string;
  referenceId: string;
  amount: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
};

export type AiReport = {
  id: string;
  candidateName: string;
  reportType: "resume_ats" | "linkedin_optimization" | "interview_score" | "overall_scorecard";
  status: "processing" | "published" | "needs_review";
  score: number;
  summary: string;
  createdAt: string;
};

export type InterviewSession = {
  id: string;
  candidateId: string;
  candidateName: string;
  role: string;
  completedAt: string;
  score: number;
  answers: string[];
  scorecard: Scorecard;
  isFlagged: boolean;
  flagReason?: string;
  adminNotes?: string;
};

export type AdminActivityLog = {
  id: string;
  adminUsername: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
};
