"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentCandidate, type CandidateAccount } from "@/lib/storage/authProfileStore";
import { getCurrentCandidateServiceRequests, SERVICE_REQUESTS_UPDATED_EVENT, type CandidateServiceRequest } from "@/lib/storage/candidateServiceRequestStore";

export function CandidateReportsWorkspace() {
  const [candidate, setCandidate] = useState<CandidateAccount | null>(null);
  const [requests, setRequests] = useState<CandidateServiceRequest[]>([]);

  useEffect(() => {
    const load = () => {
      setCandidate(getCurrentCandidate());
      setRequests(getCurrentCandidateServiceRequests());
    };
    load();
    window.addEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(SERVICE_REQUESTS_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const completed = requests.find((request) => request.requestStatus === "completed");

  if (!candidate) {
    return (
      <div className="card">
        <h1 className="text-2xl font-black text-navy">Session expired</h1>
        <p className="mt-2 text-slate-600">Please login again to view reports.</p>
        <Link href="/candidate/login" className="btn-primary mt-5">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Documents and Reports</h1>
        <p className="mt-2 text-slate-600">Download your improved resume and reports after the HirePilot admin team completes your service request.</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><tr><th className="py-3">Document</th><th>Status</th><th>Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            <DocumentRow label="Original Resume" url={candidate.originalResumeUrl} fallback={candidate.resumeFileName} action="Download Original Resume" />
            <DocumentRow label="Improved Resume DOCX" url={completed?.improvedResumeDocxUrl} action="Download Improved Resume" />
            <DocumentRow label="Improved Resume PDF" url={completed?.improvedResumePdfUrl} action="Download Improved Resume PDF" />
            <DocumentRow label="ATS Report PDF" url={completed?.atsReportPdfUrl} action="Download ATS Report PDF" />
            <DocumentRow label="LinkedIn Report PDF" url={completed?.linkedinReportPdfUrl} action="Download LinkedIn Report PDF" />
          </tbody>
        </table>
      </div>

      <div className="grid gap-4">
        <h2 className="text-2xl font-black text-navy">Service Status</h2>
        {requests.length === 0 ? (
          <div className="card">
            <p className="text-sm font-bold text-slate-600">No service requests yet.</p>
            <Link href="/candidate/services" className="btn-primary mt-4">Improve My Visibility</Link>
          </div>
        ) : requests.map((request) => (
          <div key={request.id} className="card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-black text-navy">{request.serviceName}</h3>
                <p className="mt-1 text-sm text-slate-600">Payment: {request.paymentStatus} / Status: {request.requestStatus}</p>
              </div>
              <Link href="/candidate/services" className="btn-secondary">View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentRow({ label, url, fallback, action }: { label: string; url?: string; fallback?: string; action: string }) {
  return (
    <tr>
      <td className="py-4 font-black text-navy">{label}</td>
      <td className="text-slate-600">{url ? "Available" : fallback ? `Uploaded: ${fallback}` : "Not available yet"}</td>
      <td>
        {url ? (
          <a className="btn-secondary px-3 py-2" href={url} download target="_blank" rel="noreferrer">{action}</a>
        ) : (
          <button className="btn-secondary px-3 py-2 opacity-60" type="button" disabled>Not available yet</button>
        )}
      </td>
    </tr>
  );
}
