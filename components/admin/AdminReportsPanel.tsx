"use client";

import { useState } from "react";
import type { AiReport } from "@/lib/types";
import { StatusBadge } from "./AdminControls";

export function AdminReportsPanel({ initialReports }: { initialReports: AiReport[] }) {
  const [reports, setReports] = useState(initialReports);
  const [message, setMessage] = useState("");

  function publish(id: string) {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, status: "published" } : report)));
    setMessage("AI report published and candidate scores updated.");
  }

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h2 className="text-2xl font-black text-navy">AI Reports</h2>
        <p className="mt-2 text-sm text-slate-600">Review, edit, publish, and manually process ATS, LinkedIn, interview, and overall scorecard reports.</p>
      </div>
      <div className="grid gap-4">
        {reports.map((report) => (
          <article key={report.id} className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-black text-navy">{report.candidateName}</h3><StatusBadge status={report.status} /></div>
                <p className="mt-1 text-sm font-semibold text-slate-500">{report.reportType} / Score {report.score}/100 / {report.createdAt}</p>
                <textarea className="mt-4" rows={4} value={report.summary} onChange={(event) => setReports((current) => current.map((item) => item.id === report.id ? { ...item, summary: event.target.value } : item))} />
              </div>
              <button className="btn-primary" type="button" onClick={() => publish(report.id)}>Publish report</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
