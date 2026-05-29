import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12">
      <section className="card w-full max-w-lg text-center">
        <div className="flex justify-center">
          <BrandLogo href="/" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-trust">Page not found</p>
        <h1 className="mt-2 text-3xl font-black text-navy">This page is not available</h1>
        <p className="mt-3 text-slate-600">The page may have moved, or the link may be incorrect.</p>
        <Link href="/" className="btn-primary mt-6 justify-center">
          Go to HirePilot home
        </Link>
      </section>
    </main>
  );
}
