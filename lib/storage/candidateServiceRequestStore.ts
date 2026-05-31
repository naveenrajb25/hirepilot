"use client";

import { getCurrentCandidate } from "@/lib/storage/authProfileStore";

export type CandidateServiceRequestStatus = "payment_pending" | "payment_submitted" | "payment_verified" | "processing" | "completed";

export type CandidateServiceRequest = {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  phone: string;
  serviceName: string;
  amount: string;
  paymentId?: string;
  paymentReference?: string;
  paymentContact?: string;
  paymentStatus: "pending_verification" | "paid" | "failed" | "refunded";
  requestStatus: CandidateServiceRequestStatus;
  originalResumeName?: string;
  originalResumeUrl?: string;
  linkedinUrl?: string;
  improvedResumeDocxUrl?: string;
  improvedResumePdfUrl?: string;
  atsReportPdfUrl?: string;
  linkedinReportPdfUrl?: string;
  visibilityReportPdfUrl?: string;
  atsScore?: number;
  keywordScore?: number;
  formattingScore?: number;
  visibilityScore?: number;
  linkedinScore?: number;
  headlineQualityScore?: number;
  overallEmployabilityScore?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

const requestKey = "hirepilot.candidateServiceRequests";
export const SERVICE_REQUESTS_UPDATED_EVENT = "hirepilot-service-requests-updated";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readRequests() {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(requestKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CandidateServiceRequest[];
  } catch {
    return [];
  }
}

function writeRequests(requests: CandidateServiceRequest[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(requestKey, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent(SERVICE_REQUESTS_UPDATED_EVENT));
}

function nowStamp() {
  return new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function getCandidateServiceRequests() {
  return readRequests();
}

export function getCurrentCandidateServiceRequests() {
  const candidate = getCurrentCandidate();
  if (!candidate) return [];
  return getCandidateServiceRequests().filter((request) => request.candidateId === candidate.id || request.email.toLowerCase() === candidate.email.toLowerCase());
}

export function createCandidateServiceRequest(input: {
  serviceName: string;
  amount: string;
  paymentId?: string;
  paymentReference?: string;
  paymentContact?: string;
}) {
  const candidate = getCurrentCandidate();
  const id = `req-${Date.now()}`;
  const request: CandidateServiceRequest = {
    id,
    candidateId: candidate?.id || "guest",
    candidateName: candidate?.fullName || "HirePilot candidate",
    email: candidate?.email || "",
    phone: candidate?.mobile || "",
    serviceName: input.serviceName,
    amount: input.amount,
    paymentId: input.paymentId,
    paymentReference: input.paymentReference,
    paymentContact: input.paymentContact,
    paymentStatus: "pending_verification",
    requestStatus: "payment_submitted",
    originalResumeName: candidate?.resumeFileName,
    originalResumeUrl: candidate?.originalResumeUrl,
    linkedinUrl: candidate?.linkedin,
    createdAt: nowStamp(),
    updatedAt: nowStamp()
  };
  writeRequests([request, ...getCandidateServiceRequests()]);
  return request;
}

export function updateCandidateServiceRequest(id: string, patch: Partial<CandidateServiceRequest>) {
  writeRequests(getCandidateServiceRequests().map((request) => request.id === id ? { ...request, ...patch, updatedAt: nowStamp() } : request));
}

export function updateRequestsForPayment(paymentFor: string, email: string, patch: Partial<CandidateServiceRequest>) {
  writeRequests(getCandidateServiceRequests().map((request) => {
    const isMatch = request.serviceName === paymentFor && request.email.toLowerCase() === email.toLowerCase();
    return isMatch ? { ...request, ...patch, updatedAt: nowStamp() } : request;
  }));
}
