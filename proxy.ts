import { NextResponse, type NextRequest } from "next/server";
import { candidateCookieName, decodeMockSession, recruiterCookieName, type CandidateMockSession, type RecruiterMockSession } from "@/lib/mock-auth";

const adminCookieName = "hirepilot_admin_session";
const candidatePrivateRoutes = [
  "/candidate/dashboard",
  "/candidate/onboarding",
  "/candidate/portfolio",
  "/candidate/profile",
  "/candidate/interview",
  "/candidate/scorecard",
  "/candidate/services",
  "/candidate/reports"
];
const recruiterPrivatePrefixes = [
  "/recruiter/dashboard",
  "/recruiter/candidates",
  "/recruiter/candidate",
  "/recruiter/onboarding",
  "/recruiter/profile",
  "/recruiter/pricing",
  "/recruiter/shortlisted"
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/") && !request.cookies.get(adminCookieName)?.value) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (candidatePrivateRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    const session = decodeMockSession<CandidateMockSession>(request.cookies.get(candidateCookieName)?.value);
    if (!session) return NextResponse.redirect(new URL("/candidate/login?error=Unauthorized%20access.", request.url));
    if (session.candidateAccountStatus === "suspended") return NextResponse.redirect(new URL("/candidate/login?error=Your%20account%20is%20suspended.", request.url));
    if (!session.onboardingCompleted && !["/candidate/onboarding", "/candidate/portfolio", "/candidate/profile"].includes(pathname)) return NextResponse.redirect(new URL("/candidate/portfolio", request.url));
  }

  if (recruiterPrivatePrefixes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    const session = decodeMockSession<RecruiterMockSession>(request.cookies.get(recruiterCookieName)?.value);
    if (!session) return NextResponse.redirect(new URL("/recruiter/login?error=Unauthorized%20access.", request.url));
    if (session.recruiterAccountStatus === "rejected" || session.recruiterStatus === "rejected") return NextResponse.redirect(new URL("/recruiter/login?error=Recruiter%20rejected.", request.url));
    if (!session.isApproved || session.recruiterStatus !== "active") return NextResponse.redirect(new URL("/recruiter/pending-approval", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*", "/recruiter/:path*"]
};
