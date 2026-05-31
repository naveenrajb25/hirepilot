"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, FileText, Plus, Save, Search, X } from "lucide-react";
import type { AdminActivityLog, Candidate, CandidateService, InterviewSession, PricingPlan, RecruiterProfile, RecruiterStatus } from "@/lib/types";
import { StatusBadge } from "./AdminControls";
import { RoleCombobox } from "../RoleCombobox";
import {
  deleteCandidateService,
  deleteRecruiterPlan,
  getCandidateServices,
  getRecruiterPlans,
  updateCandidateService,
  updateRecruiterPlan
} from "@/lib/storage/adminConfigStore";
import {
  getCandidateAdminRows,
  getRecruiterAdminRows,
  deleteCandidateAccountFromAdmin,
  deleteRecruiterAccountFromAdmin,
  updateCandidateAccountFromAdmin,
  updateRecruiterAccountFromAdmin
} from "@/lib/storage/authProfileStore";

type CandidateStatus = NonNullable<Candidate["candidateStatus"]>;

function nowStamp() {
  return new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function makeLog(actionType: string, entityType: string, entityId: string, details: string): AdminActivityLog {
  return {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    adminUsername: "bnradmin",
    actionType,
    entityType,
    entityId,
    details,
    createdAt: nowStamp()
  };
}

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed right-4 top-4 z-[70] rounded-md bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-soft">
      {message}
    </div>
  );
}

function ConfirmModal({
  title,
  body,
  onCancel,
  onConfirm
}: {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 pb-6 shadow-soft">
        <h2 className="text-xl font-black text-navy">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700" type="button" onClick={onConfirm}>
            Confirm delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityLogPanel({ logs }: { logs: AdminActivityLog[] }) {
  return (
    <div className="card">
      <h2 className="text-xl font-black text-navy">Admin activity logs</h2>
      <div className="mt-4 grid gap-3">
        {logs.slice(0, 8).map((log) => (
          <div key={log.id} className="rounded-md border border-slate-200 p-3">
            <p className="font-bold text-navy">{log.actionType}</p>
            <p className="text-sm text-slate-600">{log.details}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{log.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function useAdminFeedback(initialLogs: AdminActivityLog[] = []) {
  const [logs, setLogs] = useState(initialLogs);
  const [toast, setToast] = useState("");

  function record(actionType: string, entityType: string, entityId: string, details: string) {
    setLogs((current) => [makeLog(actionType, entityType, entityId, details), ...current]);
    setToast(details);
    window.setTimeout(() => setToast(""), 2200);
  }

  return { logs, toast, record };
}

export function CandidatesAdminPanel({ initialCandidates, initialLogs }: { initialCandidates: Candidate[]; initialLogs: AdminActivityLog[] }) {
  const [rows, setRows] = useState(initialCandidates);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [city, setCity] = useState("all");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);
  const { logs, toast, record } = useAdminFeedback(initialLogs);

  useEffect(() => {
    setRows(getCandidateAdminRows(initialCandidates));
  }, [initialCandidates]);

  const cities = Array.from(new Set(rows.map((candidate) => candidate.city)));
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return rows.filter((candidate) => {
      const haystack = [candidate.fullName, candidate.email, candidate.phone, candidate.city, candidate.preferredRole, ...candidate.skills].join(" ").toLowerCase();
      return (
        haystack.includes(needle) &&
        (status === "all" || candidate.candidateStatus === status) &&
        (role === "all" || candidate.preferredRole.toLowerCase().includes(role.toLowerCase())) &&
        (city === "all" || candidate.city === city)
      );
    });
  }, [rows, query, status, role, city]);

  function updateCandidate(id: string, patch: Partial<Candidate>, action: string) {
    const candidate = rows.find((item) => item.id === id);
    setRows((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    updateCandidateAccountFromAdmin(id, patch);
    if (candidate) record(action, "candidate", id, `${candidate.fullName}: ${action}`);
  }

  function deleteCandidate() {
    if (!deleteTarget) return;
    setRows((current) => current.filter((candidate) => candidate.id !== deleteTarget.id));
    deleteCandidateAccountFromAdmin(deleteTarget.id);
    record("candidate deleted", "candidate", deleteTarget.id, `${deleteTarget.fullName} deleted from admin table`);
    setDeleteTarget(null);
  }

  return (
    <div className="grid gap-6">
      <Toast message={toast} />
      <div className="card grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_180px]">
        <div className="flex items-center gap-2">
          <Search className="text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, city, role, or skill" />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          {["pending", "verified", "featured", "hidden", "suspended"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <RoleCombobox value={role === "all" ? "" : role} onChange={(nextRole) => setRole(nextRole || "all")} label="Role" />
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="all">All cities</option>
          {cities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
            <tr><th className="py-3">Candidate</th><th>Role</th><th>City</th><th>Score</th><th>Email</th><th>Account</th><th>Status</th><th>Visibility</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((candidate) => (
              <tr key={candidate.id} className="align-top">
                <td className="py-4">
                  <p className="font-black text-navy">{candidate.fullName}</p>
                  <p className="text-slate-600">{candidate.email}</p>
                  <p className="text-slate-500">{candidate.phone}</p>
                </td>
                <td>{candidate.preferredRole}</td>
                <td>{candidate.city}</td>
                <td className="font-black text-trust">{candidate.employabilityScore}</td>
                <td><StatusBadge status={candidate.emailVerified ? "verified" : "unverified"} /></td>
                <td><StatusBadge status={candidate.candidateAccountStatus ?? "pending_verification"} /></td>
                <td><StatusBadge status={candidate.candidateStatus ?? "pending"} /></td>
                <td>{candidate.isVisibleToRecruiters ? "Visible" : "Hidden"}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => setSelected(candidate)}><Eye size={15} /> View</button>
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateCandidate(candidate.id, { isVerified: !candidate.isVerified, candidateStatus: candidate.isVerified ? "pending" : "verified" }, candidate.isVerified ? "candidate unverified" : "candidate verified")}>{candidate.isVerified ? "Unverify" : "Verify"}</button>
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateCandidate(candidate.id, { isFeatured: !candidate.isFeatured, candidateStatus: candidate.isFeatured ? "verified" : "featured" }, candidate.isFeatured ? "candidate unfeatured" : "candidate featured")}>{candidate.isFeatured ? "Unfeature" : "Feature"}</button>
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateCandidate(candidate.id, { candidateStatus: "hidden", isVisibleToRecruiters: false }, "candidate hidden")}>Hide</button>
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateCandidate(candidate.id, { candidateStatus: "suspended", candidateAccountStatus: "suspended", isVisibleToRecruiters: false }, "candidate suspended")}>Suspend</button>
                    <button className="btn-secondary px-3 py-2" type="button" onClick={() => updateCandidate(candidate.id, { candidateStatus: "verified", candidateAccountStatus: "active", isVisibleToRecruiters: true }, "candidate reactivated")}>Reactivate</button>
                    <button className="rounded-md bg-red-600 px-3 py-2 font-bold text-white" type="button" onClick={() => setDeleteTarget(candidate)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActivityLogPanel logs={logs} />
      {selected && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 pb-6 shadow-soft">
            <div className="flex justify-between gap-4"><h2 className="text-2xl font-black text-navy">{selected.fullName}</h2><button onClick={() => setSelected(null)}><X /></button></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-700">
              <p>Email: {selected.email}</p><p>Phone: {selected.phone}</p><p>City: {selected.city}</p><p>Education: {selected.education}</p>
              <p>Experience: {selected.experienceLevel}</p><p>Role: {selected.preferredRole}</p><p>AI score: {selected.aiInterviewScore}</p><p>Employability: {selected.employabilityScore}</p>
            </div>
            <p className="mt-4 text-sm text-slate-600">{selected.summary}</p>
            <a className="btn-primary mt-4" href={selected.resumeUrl}><FileText size={16} /> View resume</a>
          </div>
        </div>
      )}
      {deleteTarget && <ConfirmModal title="Delete candidate" body={`Delete ${deleteTarget.fullName} from this admin table?`} onCancel={() => setDeleteTarget(null)} onConfirm={deleteCandidate} />}
    </div>
  );
}

export function RecruitersAdminPanel({ initialRecruiters, initialLogs }: { initialRecruiters: RecruiterProfile[]; initialLogs: AdminActivityLog[] }) {
  const [rows, setRows] = useState(initialRecruiters);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [subscription, setSubscription] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<RecruiterProfile | null>(null);
  const { logs, toast, record } = useAdminFeedback(initialLogs);
  useEffect(() => {
    setRows(getRecruiterAdminRows(initialRecruiters));
  }, [initialRecruiters]);
  const industries = Array.from(new Set(rows.map((recruiter) => recruiter.industry)));
  const filtered = rows.filter((recruiter) => {
    const needle = query.toLowerCase();
    const haystack = [recruiter.recruiterName, recruiter.email, recruiter.phone, recruiter.companyName, recruiter.industry].join(" ").toLowerCase();
    return haystack.includes(needle) && (status === "all" || recruiter.recruiterStatus === status) && (industry === "all" || recruiter.industry === industry) && (subscription === "all" || recruiter.subscriptionStatus === subscription);
  });

  function patchRecruiter(id: string, patch: Partial<RecruiterProfile>, action: string) {
    const recruiter = rows.find((item) => item.id === id);
    setRows((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    updateRecruiterAccountFromAdmin(id, patch);
    if (recruiter) record(action, "recruiter", id, `${recruiter.companyName}: ${action}`);
  }

  function statusPatch(nextStatus: RecruiterStatus): Partial<RecruiterProfile> {
    return {
      recruiterStatus: nextStatus,
      isApproved: ["approved", "active"].includes(nextStatus),
      canViewContacts: nextStatus === "active",
      canDownloadResumes: nextStatus === "active",
      recruiterAccountStatus: nextStatus === "rejected" ? "rejected" : ["approved", "active"].includes(nextStatus) ? "active" : "pending_admin_approval"
    };
  }

  function deleteRecruiter() {
    if (!deleteTarget) return;
    setRows((current) => current.filter((recruiter) => recruiter.id !== deleteTarget.id));
    deleteRecruiterAccountFromAdmin(deleteTarget.id);
    record("recruiter deleted", "recruiter", deleteTarget.id, `${deleteTarget.companyName} deleted from admin table`);
    setDeleteTarget(null);
  }

  return (
    <div className="grid gap-6">
      <Toast message={toast} />
      <div className="card grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_180px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, or company" />
        <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{["pending", "approved", "rejected", "active", "inactive", "suspended"].map((item) => <option key={item}>{item}</option>)}</select>
        <select value={industry} onChange={(event) => setIndustry(event.target.value)}><option value="all">All industries</option>{industries.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={subscription} onChange={(event) => setSubscription(event.target.value)}><option value="all">All subscriptions</option>{["trial", "active", "expired", "none"].map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><tr><th className="py-3">Recruiter</th><th>Company</th><th>Email</th><th>Account</th><th>Status</th><th>Subscription</th><th>Permissions</th><th>Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((recruiter) => (
              <tr key={recruiter.id} className="align-top">
                <td className="py-4"><p className="font-black text-navy">{recruiter.recruiterName}</p><p className="text-slate-600">{recruiter.email}</p><p className="text-slate-500">{recruiter.phone}</p></td>
                <td><p className="font-bold text-navy">{recruiter.companyName}</p><p className="text-slate-600">{recruiter.industry} · {recruiter.companyLocation}</p><p className="text-slate-500">{recruiter.companyWebsite}</p></td>
                <td><StatusBadge status={recruiter.emailVerified ? "verified" : "unverified"} /></td>
                <td><StatusBadge status={recruiter.recruiterAccountStatus ?? "pending_verification"} /></td>
                <td><StatusBadge status={recruiter.recruiterStatus} /></td>
                <td><StatusBadge status={recruiter.subscriptionStatus} /></td>
                <td><p>Contacts: {recruiter.canViewContacts ? "Yes" : "No"}</p><p>Resumes: {recruiter.canDownloadResumes ? "Yes" : "No"}</p><p>Shortlists: {recruiter.shortlistedCandidateIds.length}</p></td>
                <td><div className="flex flex-wrap gap-2">
                  <button className="btn-secondary px-3 py-2" onClick={() => patchRecruiter(recruiter.id, statusPatch("approved"), "recruiter approved")}>Approve</button>
                  <button className="btn-secondary px-3 py-2" onClick={() => patchRecruiter(recruiter.id, statusPatch("rejected"), "recruiter rejected")}>Reject</button>
                  <button className="btn-secondary px-3 py-2" onClick={() => patchRecruiter(recruiter.id, statusPatch(recruiter.recruiterStatus === "active" ? "inactive" : "active"), recruiter.recruiterStatus === "active" ? "recruiter deactivated" : "recruiter activated")}>{recruiter.recruiterStatus === "active" ? "Deactivate" : "Activate"}</button>
                  <button className="btn-secondary px-3 py-2" onClick={() => patchRecruiter(recruiter.id, statusPatch("suspended"), "recruiter suspended")}>Suspend</button>
                  <button className="rounded-md bg-red-600 px-3 py-2 font-bold text-white" onClick={() => setDeleteTarget(recruiter)}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActivityLogPanel logs={logs} />
      {deleteTarget && <ConfirmModal title="Delete recruiter" body={`Delete ${deleteTarget.companyName} from this admin table?`} onCancel={() => setDeleteTarget(null)} onConfirm={deleteRecruiter} />}
    </div>
  );
}

export function PricingAdminPanel({ initialPlans, initialLogs }: { initialPlans: PricingPlan[]; initialLogs: AdminActivityLog[] }) {
  const blank = { id: "", planName: "", planType: "one-time" as const, price: "", paymentLink: "", razorpayPaymentLink: "", profileViewLimit: 2, validityDays: 30, contactViewLimit: 25, resumeDownloadLimit: 10, featuredCandidateAccess: false, isActive: true, createdAt: "", updatedAt: "", description: "", displayOrder: 1 };
  const [plans, setPlans] = useState(initialPlans);
  const [draft, setDraft] = useState<PricingPlan>(blank);
  const [deleteTarget, setDeleteTarget] = useState<PricingPlan | null>(null);
  const { logs, toast, record } = useAdminFeedback(initialLogs);

  useEffect(() => {
    setPlans(getRecruiterPlans());
  }, []);

  function savePlan() {
    const isEdit = plans.some((plan) => plan.id === draft.id);
    const plan = { ...draft, razorpayPaymentLink: draft.paymentLink || draft.razorpayPaymentLink || "", id: draft.id || `plan-${Date.now()}`, createdAt: draft.createdAt || nowStamp(), updatedAt: nowStamp() };
    updateRecruiterPlan(plan);
    setPlans(getRecruiterPlans());
    record(isEdit ? "pricing plan updated" : "pricing plan created", "pricing_plan", plan.id, `${plan.planName} saved`);
    setDraft(blank);
  }

  function deletePlan() {
    if (!deleteTarget) return;
    deleteRecruiterPlan(deleteTarget.id);
    setPlans(getRecruiterPlans());
    record("pricing plan deleted", "pricing_plan", deleteTarget.id, `${deleteTarget.planName} deleted`);
    setDeleteTarget(null);
  }

  function togglePlan(plan: PricingPlan) {
    const updated = { ...plan, isActive: !plan.isActive, updatedAt: nowStamp() };
    updateRecruiterPlan(updated);
    setPlans(getRecruiterPlans());
    record(plan.isActive ? "pricing plan disabled" : "pricing plan enabled", "pricing_plan", plan.id, `${plan.planName} ${plan.isActive ? "disabled" : "enabled"}`);
  }

  return (
    <div className="grid gap-6">
      <Toast message={toast} />
      <PlanForm draft={draft} setDraft={setDraft} onSave={savePlan} />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div key={plan.id} className="card">
            <div className="flex items-start justify-between gap-2"><h2 className="text-xl font-black text-navy">{plan.planName}</h2><StatusBadge status={plan.isActive ? "active" : "disabled"} /></div>
            <p className="mt-3 text-3xl font-black text-trust">{plan.price}</p><p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-700"><p>Type: {plan.planType}</p><p>Validity: {plan.validityDays ?? "Custom"} days</p><p>Contacts: {plan.contactViewLimit ?? "Unlimited"}</p><p>Downloads: {plan.resumeDownloadLimit ?? "Unlimited"}</p></div>
            {(plan.paymentLink || plan.razorpayPaymentLink) && <p className="mt-2 break-all text-xs font-semibold text-slate-500">Razorpay: {plan.paymentLink || plan.razorpayPaymentLink}</p>}
            <div className="mt-5 flex flex-wrap gap-2"><button className="btn-secondary px-3 py-2" onClick={() => setDraft(plan)}>Edit</button><button className="btn-secondary px-3 py-2" onClick={() => togglePlan(plan)}>{plan.isActive ? "Disable" : "Enable"}</button><button className="rounded-md bg-red-600 px-3 py-2 font-bold text-white" onClick={() => setDeleteTarget(plan)}>Delete</button></div>
          </div>
        ))}
      </div>
      <ActivityLogPanel logs={logs} />
      {deleteTarget && <ConfirmModal title="Delete pricing plan" body={`Delete ${deleteTarget.planName}?`} onCancel={() => setDeleteTarget(null)} onConfirm={deletePlan} />}
    </div>
  );
}

function PlanForm({ draft, setDraft, onSave }: { draft: PricingPlan; setDraft: (plan: PricingPlan) => void; onSave: () => void }) {
  return (
    <div className="card">
      <h2 className="text-xl font-black text-navy">{draft.id ? "Edit pricing plan" : "Create pricing plan"}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <input value={draft.planName} onChange={(event) => setDraft({ ...draft, planName: event.target.value })} placeholder="Plan name" />
        <select value={draft.planType} onChange={(event) => setDraft({ ...draft, planType: event.target.value as PricingPlan["planType"] })}><option value="one-time">one-time</option><option value="monthly">monthly</option><option value="enterprise">enterprise</option></select>
        <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="Price" />
        <input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Description" />
        <input type="number" value={draft.validityDays ?? ""} onChange={(event) => setDraft({ ...draft, validityDays: Number(event.target.value) || null })} placeholder="Validity days" />
        <input type="number" value={draft.profileViewLimit ?? ""} onChange={(event) => setDraft({ ...draft, profileViewLimit: Number(event.target.value) || null })} placeholder="Profile views" />
        <input type="number" value={draft.contactViewLimit ?? ""} onChange={(event) => setDraft({ ...draft, contactViewLimit: Number(event.target.value) || null })} placeholder="Contact views" />
        <input type="number" value={draft.resumeDownloadLimit ?? ""} onChange={(event) => setDraft({ ...draft, resumeDownloadLimit: Number(event.target.value) || null })} placeholder="Downloads" />
        <input name="paymentLink" value={draft.paymentLink || draft.razorpayPaymentLink || ""} onChange={(event) => setDraft({ ...draft, paymentLink: event.target.value, razorpayPaymentLink: event.target.value })} placeholder="Razorpay Payment Link" />
        <input type="number" value={draft.displayOrder ?? ""} onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) || 1 })} placeholder="Display order" />
        <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3"><input className="w-auto" type="checkbox" checked={draft.featuredCandidateAccess} onChange={(event) => setDraft({ ...draft, featuredCandidateAccess: event.target.checked })} /> Featured access</label>
      </div>
      <button className="btn-primary mt-4" type="button" onClick={onSave}><Save size={16} /> Save plan</button>
    </div>
  );
}

export function ServicesAdminPanel({ initialServices, initialLogs }: { initialServices: CandidateService[]; initialLogs: AdminActivityLog[] }) {
  const blank = { id: "", serviceName: "", description: "", price: "", paymentLink: "", razorpayPaymentLink: "", isActive: true, createdAt: "", updatedAt: "", displayOrder: 1 };
  const [services, setServices] = useState(initialServices);
  const [draft, setDraft] = useState<CandidateService>(blank);
  const [deleteTarget, setDeleteTarget] = useState<CandidateService | null>(null);
  const { logs, toast, record } = useAdminFeedback(initialLogs);

  useEffect(() => {
    setServices(getCandidateServices());
  }, []);

  function saveService() {
    const isEdit = services.some((service) => service.id === draft.id);
    const service = { ...draft, razorpayPaymentLink: draft.paymentLink || draft.razorpayPaymentLink || "", id: draft.id || `service-${Date.now()}`, createdAt: draft.createdAt || nowStamp(), updatedAt: nowStamp() };
    updateCandidateService(service);
    setServices(getCandidateServices());
    record(isEdit ? "candidate service updated" : "candidate service created", "candidate_service", service.id, `${service.serviceName} saved`);
    setDraft(blank);
  }

  function deleteService() {
    if (!deleteTarget) return;
    deleteCandidateService(deleteTarget.id);
    setServices(getCandidateServices());
    record("candidate service deleted", "candidate_service", deleteTarget.id, `${deleteTarget.serviceName} deleted`);
    setDeleteTarget(null);
  }

  function toggleService(service: CandidateService) {
    const updated = { ...service, isActive: !service.isActive, updatedAt: nowStamp() };
    updateCandidateService(updated);
    setServices(getCandidateServices());
    record(service.isActive ? "candidate service disabled" : "candidate service enabled", "candidate_service", service.id, `${service.serviceName} ${service.isActive ? "disabled" : "enabled"}`);
  }

  return (
    <div className="grid gap-6">
      <Toast message={toast} />
      <div className="card">
        <h2 className="text-xl font-black text-navy">{draft.id ? "Edit candidate service" : "Create candidate service"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input value={draft.serviceName} onChange={(event) => setDraft({ ...draft, serviceName: event.target.value })} placeholder="Service name" />
          <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="Price" />
          <input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Description" />
          <input name="paymentLink" value={draft.paymentLink || draft.razorpayPaymentLink || ""} onChange={(event) => setDraft({ ...draft, paymentLink: event.target.value, razorpayPaymentLink: event.target.value })} placeholder="Razorpay Payment Link" />
          <input type="number" value={draft.displayOrder ?? ""} onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) || 1 })} placeholder="Display order" />
        </div>
        <button className="btn-primary mt-4" onClick={saveService}><Plus size={16} /> Save service</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex items-start justify-between gap-2"><h2 className="text-xl font-black text-navy">{service.serviceName}</h2><StatusBadge status={service.isActive ? "active" : "disabled"} /></div>
            <p className="mt-3 text-2xl font-black text-trust">{service.price}</p><p className="mt-2 text-sm text-slate-600">{service.description}</p>
            {(service.paymentLink || service.razorpayPaymentLink) && <p className="mt-2 break-all text-xs font-semibold text-slate-500">Razorpay: {service.paymentLink || service.razorpayPaymentLink}</p>}
            <div className="mt-5 flex flex-wrap gap-2"><button className="btn-secondary px-3 py-2" onClick={() => setDraft(service)}>Edit</button><button className="btn-secondary px-3 py-2" onClick={() => toggleService(service)}>{service.isActive ? "Disable" : "Enable"}</button><button className="rounded-md bg-red-600 px-3 py-2 font-bold text-white" onClick={() => setDeleteTarget(service)}>Delete</button></div>
          </div>
        ))}
      </div>
      <ActivityLogPanel logs={logs} />
      {deleteTarget && <ConfirmModal title="Delete candidate service" body={`Delete ${deleteTarget.serviceName}?`} onCancel={() => setDeleteTarget(null)} onConfirm={deleteService} />}
    </div>
  );
}

export function InterviewsAdminPanel({ initialSessions, initialLogs }: { initialSessions: InterviewSession[]; initialLogs: AdminActivityLog[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [query, setQuery] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [view, setView] = useState<{ type: "answers" | "scorecard"; session: InterviewSession } | null>(null);
  const { logs, toast, record } = useAdminFeedback(initialLogs);
  const filtered = sessions.filter((session) => [session.candidateName, session.role, String(session.score)].join(" ").toLowerCase().includes(query.toLowerCase()));

  function toggleFlag(session: InterviewSession) {
    const nextFlagged = !session.isFlagged;
    setSessions((current) => current.map((item) => item.id === session.id ? { ...item, isFlagged: nextFlagged, flagReason: nextFlagged ? flagReason || "Flagged for manual review" : undefined } : item));
    record(nextFlagged ? "interview flagged" : "interview unflagged", "interview", session.id, `${session.candidateName} ${nextFlagged ? "flagged" : "unflagged"}`);
    setFlagReason("");
  }

  return (
    <div className="grid gap-6">
      <Toast message={toast} />
      <div className="card grid gap-3 md:grid-cols-[1fr_1fr]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidate name, role, or score" /><input value={flagReason} onChange={(event) => setFlagReason(event.target.value)} placeholder="Flag reason for next flag action" /></div>
      <div className="grid gap-4">
        {filtered.map((session) => (
          <article key={session.id} className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-black text-navy">{session.candidateName}</h2><StatusBadge status={session.isFlagged ? "flagged" : "clear"} /></div><p className="mt-1 text-sm text-slate-600">{session.role} · Completed {session.completedAt}</p><p className="mt-3 text-3xl font-black text-trust">{session.score}/100</p>{session.flagReason && <p className="mt-2 text-sm font-semibold text-red-700">{session.flagReason}</p>}</div>
              <div className="flex flex-wrap gap-2"><button className="btn-secondary px-3 py-2" onClick={() => setView({ type: "answers", session })}>View answers</button><button className="btn-secondary px-3 py-2" onClick={() => setView({ type: "scorecard", session })}>View scorecard</button><button className="btn-secondary px-3 py-2" onClick={() => record("scorecard regenerated", "interview", session.id, `${session.candidateName} scorecard regeneration queued`)}>Regenerate scorecard</button><button className="btn-primary px-3 py-2" onClick={() => toggleFlag(session)}>{session.isFlagged ? "Unflag" : "Flag"}</button></div>
            </div>
          </article>
        ))}
      </div>
      <ActivityLogPanel logs={logs} />
      {view && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 pb-6 shadow-soft">
            <div className="flex justify-between gap-4"><h2 className="text-2xl font-black text-navy">{view.type === "answers" ? "Candidate answers" : "AI scorecard"}</h2><button onClick={() => setView(null)}><X /></button></div>
            {view.type === "answers" ? (
              <ul className="mt-4 space-y-3 text-sm text-slate-700">{view.session.answers.map((answer) => <li key={answer} className="rounded-md border border-slate-200 p-3">{answer}</li>)}</ul>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-700"><p>Overall: {view.session.scorecard.overall}</p><p>Communication: {view.session.scorecard.communication}</p><p>Domain: {view.session.scorecard.domain}</p><p>Confidence: {view.session.scorecard.confidence}</p><p>Problem-solving: {view.session.scorecard.problemSolving}</p><p>Resume: {view.session.scorecard.resumeStrength}</p><p className="md:col-span-2">Recommendation: {view.session.scorecard.recommendation}</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
