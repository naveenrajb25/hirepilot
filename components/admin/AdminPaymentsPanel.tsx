"use client";

import { useEffect, useState } from "react";
import type { PaymentRecord, PaymentStatus } from "@/lib/types";
import { StatusBadge } from "./AdminControls";
import { getPayments, savePayments } from "@/lib/storage/adminConfigStore";

const statuses: PaymentStatus[] = ["pending_verification", "paid", "failed", "refunded"];

export function AdminPaymentsPanel({ initialPayments }: { initialPayments: PaymentRecord[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  function updatePayment(id: string, status: PaymentStatus) {
    const updated = payments.map((payment) => (payment.id === id ? { ...payment, status } : payment));
    savePayments(updated);
    setPayments(getPayments());
    setMessage(status === "paid" ? "Payment marked paid. Access can now be activated for the related service or plan." : "Payment status updated.");
  }

  function updateNotes(id: string, notes: string) {
    const updated = payments.map((payment) => (payment.id === id ? { ...payment, notes } : payment));
    savePayments(updated);
    setPayments(updated);
  }

  return (
    <div className="grid gap-6">
      {message && <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
      <div className="card">
        <h2 className="text-2xl font-black text-navy">Payment Verification</h2>
        <p className="mt-2 text-sm text-slate-600">Verify Razorpay payment references, unlock candidate services, activate recruiter subscriptions, and record payment outcomes.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
            <tr><th className="py-3">Payer</th><th>Payment for</th><th>Reference</th><th>Amount</th><th>Status</th><th>Admin notes</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr key={payment.id} className="align-top">
                <td className="py-4"><p className="font-black text-navy">{payment.payerName}</p><p>{payment.email}</p><p>{payment.phone}</p></td>
                <td>{payment.paymentFor}</td>
                <td>{payment.referenceId}</td>
                <td className="font-black text-trust">{payment.amount}</td>
                <td><StatusBadge status={payment.status} /></td>
                <td><textarea className="min-h-20" value={payment.notes || ""} onChange={(event) => updateNotes(payment.id, event.target.value)} placeholder="Add notes..." /></td>
                <td><div className="flex flex-wrap gap-2">{statuses.map((status) => <button key={status} className="btn-secondary px-3 py-2" type="button" onClick={() => updatePayment(payment.id, status)}>{status}</button>)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
