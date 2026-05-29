import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";

export default function RecruiterPendingApprovalPage({ searchParams }: { searchParams?: { message?: string } }) {
  return (
    <>
      <Header />
      <main className="section grid min-h-[calc(100vh-72px)] place-items-center">
        <section className="card w-full max-w-2xl">
          <h1 className="text-3xl font-black text-navy">Waiting for Admin Approval</h1>
          <AuthNotice message={searchParams?.message} />
          <p className="mt-4 text-slate-600">Your email is verified. Your recruiter account is waiting for admin approval. You will get access after approval.</p>
        </section>
      </main>
    </>
  );
}
