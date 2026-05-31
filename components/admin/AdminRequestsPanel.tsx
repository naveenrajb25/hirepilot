"use client";

import { useEffect, useState } from "react";
import { getCandidateServiceRequests, updateCandidateServiceRequest, type CandidateServiceRequest, type CandidateServiceRequestStatus } from "@/lib/storage/candidateServiceRequestStore";

const requestStatuses: CandidateServiceRequestStatus[] = ["payment_submitted", "payment_verified", "processing", "completed"];

function statusLabel(status: CandidateServiceRequestStatus) {
  const labels = {
    payment_pending: "Payment Pending",
    payment_submitted: "Payment Submitted",
    payment_verified: "Payment Verified",
    processing: "Processing",
    completed: "Completed"
  };
  return labels[status];
}

export function AdminRequestsPanel() {
  const [requests, setRequests] = useState<CandidateServiceRequest[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRequests(getCandidateServiceRequests());
  }, []);

  const filtered = requests.filter((request) =>
    [request.candidateName, request.email, request.phone, request.serviceName, request.paymentStatus, request.requestStatus]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function updateRequest(id: string, patch: Partial<CandidateServiceRequest>) {
    updateCandidateServiceRequest(id, patch);
    setRequests(getCandidateServiceRequests());
    setMessage("Service request updated.");
  }

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h2 className="text-2xl font-black text-navy">Candidate Service Requests</h2>
        <p className="mt-2 text-sm text-slate-600">
          Process V1 resume and LinkedIn optimization orders. Use external file links until Supabase Storage or another upload provider is connected.
        </p>
        <input className="mt-5" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidate, email, service, payment, or status" />
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 && <div className="card text-sm font-bold text-slate-600">No candidate service requests yet.</div>}
        {filtered.map((request) => (
          <div key={request.id} className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-black text-navy">{request.candidateName}</h3>
                <p className="mt-1 text-sm text-slate-600">{request.email} / {request.phone || "Phone not added"}</p>
                <p className="mt-3 font-bold text-trust">{request.serviceName} / {request.amount}</p>
                <p className="mt-1 text-sm text-slate-600">Payment: {request.paymentStatus} / Reference: {request.paymentReference || "Not added"}</p>
                <p className="mt-1 text-sm text-slate-600">LinkedIn: {request.linkedinUrl || "Not added"}</p>
                <p className="mt-1 text-sm text-slate-600">Original resume: {request.originalResumeUrl ? "Available" : request.originalResumeName || "Not uploaded"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateRequest(request.id, { paymentStatus: "paid", requestStatus: "payment_verified" })}>Verify payment</button>
                {requestStatuses.map((status) => (
                  <button
                    key={status}
                    className={request.requestStatus === status ? "btn-primary px-3 py-2" : "btn-secondary px-3 py-2"}
                    type="button"
                    onClick={() => updateRequest(request.id, { requestStatus: status })}
                  >
                    {statusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <AdminInput label="Improved Resume DOCX URL" value={request.improvedResumeDocxUrl || ""} onChange={(value) => updateRequest(request.id, { improvedResumeDocxUrl: value })} />
              <AdminInput label="Improved Resume PDF URL" value={request.improvedResumePdfUrl || ""} onChange={(value) => updateRequest(request.id, { improvedResumePdfUrl: value })} />
              <AdminInput label="ATS Report PDF URL" value={request.atsReportPdfUrl || ""} onChange={(value) => updateRequest(request.id, { atsReportPdfUrl: value })} />
              <AdminInput label="LinkedIn Report PDF URL" value={request.linkedinReportPdfUrl || ""} onChange={(value) => updateRequest(request.id, { linkedinReportPdfUrl: value })} />
              <AdminInput label="Visibility Report PDF URL" value={request.visibilityReportPdfUrl || ""} onChange={(value) => updateRequest(request.id, { visibilityReportPdfUrl: value })} />
              <AdminInput label="Admin notes" value={request.adminNotes || ""} onChange={(value) => updateRequest(request.id, { adminNotes: value })} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
              <ScoreInput label="ATS" value={request.atsScore} onChange={(value) => updateRequest(request.id, { atsScore: value })} />
              <ScoreInput label="Keyword" value={request.keywordScore} onChange={(value) => updateRequest(request.id, { keywordScore: value })} />
              <ScoreInput label="Formatting" value={request.formattingScore} onChange={(value) => updateRequest(request.id, { formattingScore: value })} />
              <ScoreInput label="Visibility" value={request.visibilityScore} onChange={(value) => updateRequest(request.id, { visibilityScore: value })} />
              <ScoreInput label="LinkedIn" value={request.linkedinScore} onChange={(value) => updateRequest(request.id, { linkedinScore: value })} />
              <ScoreInput label="Headline" value={request.headlineQualityScore} onChange={(value) => updateRequest(request.id, { headlineQualityScore: value })} />
              <ScoreInput label="Overall" value={request.overallEmployabilityScore} onChange={(value) => updateRequest(request.id, { overallEmployabilityScore: value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><label>{label}</label><input className="mt-2" value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function ScoreInput({ label, value, onChange }: { label: string; value?: number; onChange: (value: number) => void }) {
  return <div><label>{label}</label><input className="mt-2" type="number" min={0} max={100} value={value ?? ""} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}
