import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/for-candidates">For Candidates</Link>
          <Link href="/for-recruiters">For Recruiters</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-secondary px-3 py-2">
            Login
          </Link>
          <Link href="/signup" className="btn-primary px-3 py-2">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
