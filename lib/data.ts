import type { Candidate, Role, Scorecard } from "./types";
import { allJobRoles } from "./jobRoles";

export const roles = allJobRoles;

export const candidates: Candidate[] = [
  {
    id: "c-101",
    fullName: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98765 43210",
    city: "Pune",
    education: "B.Tech Computer Science",
    experienceLevel: "Fresher",
    preferredRole: "Python Developer",
    linkedin: "https://linkedin.com/in/ananya-sharma",
    github: "https://github.com/ananya-dev",
    projectLinks: ["Inventory analytics dashboard", "AI resume parser"],
    skills: ["Python", "SQL", "FastAPI", "Problem solving"],
    languages: ["English", "Hindi", "Marathi"],
    aiInterviewScore: 86,
    employabilityScore: 88,
    summary: "Python fresher with strong project discipline, clear communication, and recruiter-ready portfolio evidence.",
    resumeUrl: "/sample-resume.pdf",
    candidateStatus: "featured",
    isVerified: true,
    isFeatured: true,
    isVisibleToRecruiters: true,
    adminNotes: "Strong portfolio proof and interview quality.",
    emailVerified: true,
    candidateAccountStatus: "active",
    onboardingCompleted: true
  },
  {
    id: "c-102",
    fullName: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 91234 56780",
    city: "Delhi",
    education: "B.Com",
    experienceLevel: "1 year",
    preferredRole: "Sales Executive",
    linkedin: "https://linkedin.com/in/rahul-verma",
    projectLinks: ["Retail lead tracker", "Cold outreach playbook"],
    skills: ["Lead generation", "CRM", "Negotiation", "Hindi communication"],
    languages: ["English", "Hindi"],
    aiInterviewScore: 74,
    employabilityScore: 76,
    summary: "Sales candidate with practical lead handling experience and good customer-facing confidence.",
    resumeUrl: "/sample-resume.pdf",
    candidateStatus: "verified",
    isVerified: true,
    isFeatured: false,
    isVisibleToRecruiters: true,
    adminNotes: "Good fit for inside sales and field sales screening.",
    emailVerified: true,
    candidateAccountStatus: "active",
    onboardingCompleted: true
  },
  {
    id: "c-103",
    fullName: "Meera Nair",
    email: "meera.nair@example.com",
    phone: "+91 99887 77665",
    city: "Bengaluru",
    education: "MBA HR",
    experienceLevel: "2 years",
    preferredRole: "HR Recruiter",
    linkedin: "https://linkedin.com/in/meera-nair",
    projectLinks: ["Campus hiring tracker"],
    skills: ["Sourcing", "Screening", "Excel", "Interview coordination"],
    languages: ["English", "Hindi", "Malayalam"],
    aiInterviewScore: 91,
    employabilityScore: 92,
    summary: "Recruitment professional with strong screening judgment and clear stakeholder communication.",
    resumeUrl: "/sample-resume.pdf",
    candidateStatus: "featured",
    isVerified: true,
    isFeatured: true,
    isVisibleToRecruiters: true,
    adminNotes: "Featured HR profile for SME recruiter searches.",
    emailVerified: true,
    candidateAccountStatus: "active",
    onboardingCompleted: true
  },
  {
    id: "c-104",
    fullName: "Imran Khan",
    email: "imran.khan@example.com",
    phone: "+91 90123 45678",
    city: "Hyderabad",
    education: "B.Sc Statistics",
    experienceLevel: "Fresher",
    preferredRole: "Data Analyst",
    linkedin: "https://linkedin.com/in/imran-khan",
    github: "https://github.com/imran-data",
    projectLinks: ["Sales insights workbook", "Power BI churn report"],
    skills: ["Excel", "SQL", "Power BI", "Statistics"],
    languages: ["English", "Hindi", "Telugu"],
    aiInterviewScore: 68,
    employabilityScore: 69,
    summary: "Analyst fresher with portfolio potential; needs sharper storytelling and resume positioning.",
    resumeUrl: "/sample-resume.pdf",
    candidateStatus: "pending",
    isVerified: false,
    isFeatured: false,
    isVisibleToRecruiters: true,
    adminNotes: "Needs portfolio review before verification.",
    emailVerified: false,
    candidateAccountStatus: "pending_verification",
    onboardingCompleted: false
  }
];

export const getCandidate = (id: string) => candidates.find((candidate) => candidate.id === id) ?? candidates[0];

export const recruiterVisibleCandidates = candidates
  .filter((candidate) => candidate.isVisibleToRecruiters !== false)
  .filter((candidate) => !["hidden", "suspended"].includes(candidate.candidateStatus ?? "pending"))
  .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.employabilityScore - a.employabilityScore);

export function generateProfessionalScorecard(role: string, base = 72): Scorecard {
  const roleBoost = role.includes("Developer") || role.includes("Engineer") || role === "Data Analyst" ? 6 : 3;
  const overall = Math.min(96, base + roleBoost);

  return {
    overall,
    communication: Math.min(94, overall - 4),
    domain: Math.min(97, overall + 2),
    confidence: Math.min(92, overall - 1),
    problemSolving: Math.min(95, overall + 1),
    resumeStrength: Math.max(52, overall - 8),
    portfolioStrength: Math.max(50, overall - 5),
    strengths: ["Role clarity", "Structured answers", "Evidence-backed skills"],
    weaknesses: ["Resume keywords can improve", "Needs sharper STAR examples", "Portfolio links need stronger outcomes"],
    roadmap: [
      "Rewrite summary around target role and measurable outcomes",
      "Practice five role-specific interview scenarios",
      "Add two proof-of-work projects or case studies",
      "Improve LinkedIn headline and featured section"
    ],
    recommendation:
      overall >= 80
        ? "Recommended for recruiter visibility and first-round screening."
        : "Needs optimization before priority recruiter visibility."
  };
}

export const generateMockScorecard = generateProfessionalScorecard;

export const paidServices = [
  "ATS Resume Optimization",
  "LinkedIn Profile Optimization",
  "Career Visibility Pack"
];
