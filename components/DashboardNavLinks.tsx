"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNavLinks({ links }: { links: string[][] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
      {links.map(([href, label]) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              active ? "bg-skysoft text-trust" : "text-slate-700 hover:bg-skysoft hover:text-trust"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
