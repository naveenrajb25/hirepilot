"use client";

import { useState } from "react";
import { AlertTriangle, Check, Search, SlidersHorizontal, X } from "lucide-react";

export function AdminFilters({
  searchPlaceholder,
  filters
}: {
  searchPlaceholder: string;
  filters: string[];
}) {
  return (
    <div className="card grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_repeat(3,180px)]">
      <div className="flex items-center gap-2">
        <Search className="text-slate-400" size={18} />
        <input placeholder={searchPlaceholder} />
      </div>
      {filters.map((filter) => (
        <select key={filter}>
          <option>{filter}</option>
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      ))}
      <button className="btn-secondary" type="button">
        <SlidersHorizontal size={16} /> Apply
      </button>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status.includes("active") || status.includes("verified") || status.includes("featured") || status.includes("approved")
    ? "bg-emerald-50 text-emerald-700"
    : status.includes("suspended") || status.includes("rejected") || status.includes("hidden")
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";

  return <span className={`rounded-md px-2 py-1 text-xs font-black uppercase tracking-wide ${tone}`}>{status}</span>;
}

export function AdminActionButtons({ actions, danger }: { actions: string[]; danger?: string }) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button key={action} className="btn-secondary px-3 py-2" type="button">
          <Check size={15} /> {action}
        </button>
      ))}
      {danger && (
        <>
          <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700" type="button" onClick={() => setConfirming(danger)}>
            <AlertTriangle size={15} className="inline" /> {danger}
          </button>
          {confirming && (
            <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
              <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 pb-6 shadow-soft">
                <h2 className="text-xl font-black text-navy">Confirm {confirming}</h2>
                <p className="mt-2 text-sm text-slate-600">This action should be reviewed carefully. Admin activity is recorded for operational tracking.</p>
                <div className="mt-5 flex justify-end gap-2">
                  <button className="btn-secondary" type="button" onClick={() => setConfirming(null)}>
                    <X size={16} /> Cancel
                  </button>
                  <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white" type="button" onClick={() => setConfirming(null)}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function AdminMockForm({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="card">
      <h2 className="text-xl font-black text-navy">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input className="mt-2" placeholder={field} />
          </div>
        ))}
      </div>
      <button className="btn-primary mt-4" type="button">Save changes</button>
    </div>
  );
}
