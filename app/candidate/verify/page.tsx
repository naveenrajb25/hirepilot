import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { verifyCandidateOtp } from "@/app/auth-flow-actions";

export default function CandidateVerifyPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] place-items-center">
        <form action={verifyCandidateOtp} className="card w-full max-w-md space-y-4">
          <h1 className="text-3xl font-black text-navy">Verify Candidate Email</h1>
          <AuthNotice error={searchParams?.error} message={searchParams?.message || "Please verify your email to activate your account."} />
          <p className="rounded-md bg-skysoft p-3 text-sm font-bold text-trust">Enter the verification code sent to your email.</p>
          <div><label>OTP</label><input className="mt-2" name="otp" inputMode="numeric" required /></div>
          <button className="btn-primary w-full" type="submit">Verify account</button>
        </form>
      </main>
    </>
  );
}
