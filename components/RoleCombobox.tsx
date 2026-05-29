"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { jobRoleCategories } from "@/lib/jobRoles";

export function RoleCombobox({
  name,
  label = "Preferred role",
  value,
  onChange,
  required = false
}: {
  name?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(value || "");
  const [custom, setCustom] = useState("");
  const selectedValue = selected === "Others" ? custom : selected;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobRoleCategories
      .map((group) => ({
        ...group,
        roles: group.roles.filter((role) => role.toLowerCase().includes(needle))
      }))
      .filter((group) => group.roles.length > 0);
  }, [query]);

  function choose(role: string) {
    setSelected(role);
    onChange?.(role);
  }

  function changeCustom(next: string) {
    setCustom(next);
    onChange?.(next);
  }

  return (
    <div className="relative">
      <label>{label}</label>
      <input type="hidden" name={name} value={selectedValue} required={required} />
      <div className="rounded-md border border-slate-200 bg-white p-2 focus-within:border-trust focus-within:ring-4 focus-within:ring-blue-100">
        <div className="flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
          <Search size={16} className="text-slate-400" />
          <input className="h-10 border-0 px-0 shadow-none focus:ring-0" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search job roles..." />
        </div>
        <div className="mt-2 max-h-60 overflow-y-auto overscroll-contain rounded-md border border-slate-100 bg-white pr-1">
          {filtered.map((group) => (
            <div key={group.category} className="p-1">
              <p className="sticky top-0 z-10 bg-white px-2 py-1 text-xs font-black uppercase tracking-widest text-trust">{group.category}</p>
              <div className="grid gap-1">
                {group.roles.map((role) => (
                  <button key={role} type="button" onClick={() => choose(role)} className={`rounded-md px-3 py-2 text-left text-sm font-semibold ${selected === role ? "bg-trust text-white" : "text-slate-700 hover:bg-skysoft"}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selected === "Others" && (
          <div className="mt-3">
            <label>Enter your preferred role</label>
            <input value={custom} onChange={(event) => changeCustom(event.target.value)} placeholder="Enter your preferred role" required={required} />
          </div>
        )}
        <p className="mt-2 truncate text-xs font-semibold text-slate-500">Selected: {selectedValue || "None"}</p>
      </div>
    </div>
  );
}
