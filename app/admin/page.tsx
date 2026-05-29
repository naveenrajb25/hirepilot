import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { loginAdmin } from "./actions";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { BrandLogo } from "@/components/BrandLogo";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  if (await isAdminSessionValid()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-navy px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <BrandLogo href="" compact size="lg" />
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-trust">Owner Admin</p>
            <h1 className="text-2xl font-black text-navy">HirePilot Admin</h1>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Private owner access only. This route is intentionally hidden from public navigation.
        </p>
        {searchParams?.error === "invalid" && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            Invalid admin credentials
          </div>
        )}
        <form action={loginAdmin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-username">Username</label>
            <input id="admin-username" className="mt-2" name="username" autoComplete="username" required />
          </div>
          <div>
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" className="mt-2" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn-primary w-full" type="submit">
            <LockKeyhole size={18} /> Login to admin
          </button>
        </form>
      </section>
    </main>
  );
}
