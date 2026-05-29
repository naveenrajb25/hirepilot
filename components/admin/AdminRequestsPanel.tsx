"use client";

import { useState } from "react";

type RequestStatus = "New" | "Contacted" | "Converted" | "Closed";

type ServiceRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestType: string;
  status: RequestStatus;
  notes: string;
};

const initialRequests: ServiceRequest[] = [
  {
    id: "req-101",
    name: "Aditi Sharma",
    email: "aditi@example.com",
    phone: "+91 98765 10101",
    requestType: "ATS Resume Optimization",
    status: "New",
    notes: "Needs fresher resume for Python roles."
  },
  {
    id: "req-102",
    name: "Vikram Hiring",
    email: "vikram@example.com",
    phone: "+91 91234 20202",
    requestType: "Recruiter Monthly Subscription",
    status: "Contacted",
    notes: "Hiring customer support executives in Pune."
  },
  {
    id: "req-103",
    name: "Rohit Nair",
    email: "rohit@example.com",
    phone: "+91 99887 30303",
    requestType: "Complete Job Visibility Pack",
    status: "New",
    notes: "Wants LinkedIn and portfolio improvement."
  }
];

const statuses: RequestStatus[] = ["New", "Contacted", "Converted", "Closed"];

export function AdminRequestsPanel() {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const filtered = requests.filter((request) =>
    [request.name, request.email, request.phone, request.requestType, request.status]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function updateRequest(id: string, patch: Partial<ServiceRequest>) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, ...patch } : request)));
    setMessage("Service request updated.");
  }

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h2 className="text-2xl font-black text-navy">Service and Access Requests</h2>
        <p className="mt-2 text-sm text-slate-600">
          Track candidate service requests and recruiter access requests from payment verification and sales workflows.
        </p>
        <input className="mt-5" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, request type, status" />
      </div>
      <div className="grid gap-4">
        {filtered.map((request) => (
          <div key={request.id} className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-black text-navy">{request.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{request.email} / {request.phone}</p>
                <p className="mt-3 font-bold text-trust">{request.requestType}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={request.status === status ? "btn-primary px-3 py-2" : "btn-secondary px-3 py-2"}
                    type="button"
                    onClick={() => updateRequest(request.id, { status })}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="mt-4"
              rows={3}
              value={request.notes}
              onChange={(event) => updateRequest(request.id, { notes: event.target.value })}
              placeholder="Admin notes..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}
