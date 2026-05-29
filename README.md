# HirePilot

AI-powered employability verification and hiring platform helping candidates improve visibility and recruiters discover qualified talent faster.

HirePilot helps job seekers build recruiter-ready profiles with ATS resume scoring, LinkedIn optimization, portfolio proof, and AI interview readiness. Recruiters can discover pre-screened candidates with controlled profile views, scorecards, contact access, and resume downloads.

## Launch Goals

- Acquire 50 candidate profiles.
- Acquire 5 recruiter subscriptions.
- Keep free recruiter access limited to 2 candidate profile views.

## Features

- Candidate signup, verification, profile builder, dashboard, ATS/LinkedIn/interview readiness services, scorecards, and public profiles.
- Recruiter signup, company profile, admin approval, candidate search, 2 free profile views, paid plan upgrade, shortlist, notes, and controlled contact/resume access.
- Private owner admin panel for candidates, recruiters, services, plans, Razorpay payment links, payments, reports, subscriptions, activity logs, and platform settings.
- Server-side Gemini AI integration through secure API routes, with professional processing fallback when `GEMINI_API_KEY` is unavailable.
- Supabase-ready schema for production data persistence, with local persistence fallback when Supabase is not configured.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` for local development and configure these variables in Vercel Project Settings for production.

```bash
ADMIN_EMAIL=
ADMIN_PASSWORD=
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
ENABLE_INTERNAL_DEMO_ACCOUNTS=false
```

- `ADMIN_EMAIL`: Owner admin login email/username for the hidden `/admin` route.
- `ADMIN_PASSWORD`: Strong owner admin password. Do not commit it.
- `GEMINI_API_KEY`: Optional server-side Gemini key for AI reports.
- `NEXT_PUBLIC_SUPABASE_URL`: Optional Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Optional Supabase anon key. Configure RLS before production use.
- `SUPABASE_SERVICE_ROLE_KEY`: Optional server-only Supabase service key. Never expose in client code.
- `NEXT_PUBLIC_APP_URL`: Canonical production URL, for example `https://your-domain.com`.
- `ENABLE_INTERNAL_DEMO_ACCOUNTS`: Optional server-side switch for silent internal demo account access in production.

## Internal Testing

Internal demo credentials are available only for owner/local testing and are not displayed in public UI:

- Candidate: `candidate@demo.com` / `Demo@123`
- Recruiter: `recruiter@demo.com` / `Demo@123`

Demo login works automatically in local development. In production, set `ENABLE_INTERNAL_DEMO_ACCOUNTS=true` only if the owner explicitly needs silent internal testing access.

## Hidden Owner Admin Panel

Admin is available only by direct URL:

```text
/admin
```

No admin links are shown in public navigation. Admin authentication is separate from candidate/recruiter auth and uses an HTTP-only cookie. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before deployment.

Admin routes include dashboard, candidates, recruiters, pricing, services, interviews, payments, reports, requests, and settings.

## Payments

HirePilot uses admin-controlled Razorpay payment links, not full Razorpay API integration.

Flow:

1. Admin adds Razorpay payment links for services and recruiter plans.
2. Candidate or recruiter clicks Pay Now.
3. HirePilot shows a purchase confirmation explaining that payments are processed through the registered merchant account BNR QA Academy.
4. User opens the Razorpay link, completes payment, and submits payment reference details.
5. Admin verifies payment under `/admin/payments`.
6. Paid candidate services unlock and recruiter subscriptions become active after admin verification.

## AI Integration

Server routes:

- `/api/ai/resume-ats`
- `/api/ai/linkedin-optimization`
- `/api/ai/interview-questions`
- `/api/ai/interview-score`
- `/api/ai/overall-scorecard`

If `GEMINI_API_KEY` is configured, requests are processed server-side with Gemini. If unavailable, the app returns a professional processing message without exposing implementation details to users.

## Supabase Setup

1. Create a Supabase project.
2. Run `database/schema.sql`.
3. Create a resume storage bucket.
4. Enable email/password auth.
5. Add row-level security policies before production launch.
6. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

If Supabase variables are not configured, HirePilot continues with local persistence for launch testing.

## Security Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, or admin credentials to frontend code.
- Keep `ADMIN_PASSWORD` strong and private.
- Public users cannot access private dashboard routes without the correct session and account status.
- Recruiter contacts and resume downloads are gated by approval, subscription, limits, and admin permissions.
- Admin routes are hidden from public navigation and protected by a separate owner session cookie.
- Never commit `.env`, `.env.local`, `.env.production`, `.vercel`, or build artifacts.

## GitHub Preparation

Run these commands from the project root:

```bash
git init
git add .
git commit -m "Prepare HirePilot for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hirepilot.git
git push -u origin main
```

## Vercel Deployment

1. Create a GitHub repository.
2. Push the HirePilot code to GitHub.
3. Open Vercel and choose **Add New Project**.
4. Import the GitHub repository.
5. Add all required environment variables in **Project Settings > Environment Variables**.
6. Set `NEXT_PUBLIC_APP_URL` to the final Vercel/custom-domain URL.
7. Deploy.
8. After deployment, open `/admin` directly and configure services, recruiter plans, Razorpay links, and platform settings.

## Production Test Checklist

Candidate:

- Signup works.
- Login works.
- Profile builder saves expected values.
- Candidate services display admin-active services only.
- Pay Now opens Razorpay link after the BNR QA Academy disclosure.
- Payment confirmation creates an admin-visible payment record.
- Admin payment verification unlocks the service workflow.

Recruiter:

- Signup works.
- Pending approval state works.
- Admin can approve/reject/suspend recruiters.
- Candidate search works.
- Free profile view limit is 2 and persists on refresh.
- Recruiter plan payment confirmation creates an admin-visible payment record.
- Admin payment verification activates the subscription state.

Admin:

- `/admin` is hidden from public navigation.
- Admin login works with environment credentials.
- Candidate management works.
- Recruiter management works.
- Services, prices, active status, display order, and Razorpay links persist.
- Recruiter plans, prices, limits, active status, display order, and Razorpay links persist.
- Payments can be marked paid, failed, refunded, and noted.
- Reports and settings pages render.

Deployment:

- `npm install` succeeds.
- `npm run typecheck` succeeds.
- `npm run build` succeeds.
- No public demo/mock/beta/test credential labels are visible.
- No secrets are committed.
