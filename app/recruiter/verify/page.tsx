import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { verifyRecruiterOtp } from "@/app/auth-flow-actions";

export default function RecruiterVerifyPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] place-items-center">
        <form action={verifyRecruiterOtp} className="card w-full max-w-md space-y-4">
          <h1 className="text-3xl font-black text-navy">Verify Recruiter Email</h1>
          <AuthNotice error={searchParams?.error} message={searchParams?.message || "Please verify your email. After verification, your company profile will be sent for admin approval."} />
          <p className="rounded-md bg-skysoft p-3 text-sm font-bold text-trust">Enter the verification code sent to your email.</p>
          <div><label>OTP</label><input className="mt-2" name="otp" inputMode="numeric" required /></div>
          <button className="btn-primary w-full" type="submit">Verify email</button>
        </form>
      </main>
    </>
  );
}
