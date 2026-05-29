import Link from "next/link";
import { BarChart3, BriefcaseBusiness, ClipboardList, FileSearch, IndianRupee, Inbox, LogOut, ReceiptText, Settings, Sparkles, Users } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { getAdminUsername } from "@/lib/admin-auth";
import { BrandLogo } from "../BrandLogo";

const links = [
  ["/admin/dashboard", "Dashboard", BarChart3],
  ["/admin/candidates", "Candidates", Users],
  ["/admin/recruiters", "Recruiters", BriefcaseBusiness],
  ["/admin/pricing", "Pricing Plans", IndianRupee],
  ["/admin/services", "Candidate Services", Sparkles],
  ["/admin/interviews", "Interviews", ClipboardList],
  ["/admin/payments", "Payments", ReceiptText],
  ["/admin/reports", "AI Reports", FileSearch],
  ["/admin/requests", "Service Requests", Inbox],
  ["/admin/settings", "Settings", Settings]
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-navy p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="flex items-center gap-3">
            <BrandLogo href="/admin/dashboard" compact size="md" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Owner Panel</p>
              <p className="font-black">HirePilot Admin</p>
            </div>
          </div>
          <nav className="mt-6 flex gap-1 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
            {links.map(([href, label, Icon]) => (
              <Link key={href as string} href={href as string} className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-blue-50 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 lg:shrink">
                <Icon size={18} /> {label as string}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-trust">Private admin route</p>
                <h1 className="text-2xl font-black text-navy">{title}</h1>
              </div>
              <form action={logoutAdmin} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-600">{getAdminUsername()}</span>
                <button className="btn-secondary py-2" type="submit">
                  <LogOut size={16} /> Logout
                </button>
              </form>
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
