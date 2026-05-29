"use client";

import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { addPayment } from "@/lib/storage/adminConfigStore";

export function PaymentRequestButton({
  label,
  requestType,
  amount,
  paymentLink
}: {
  label: string;
  requestType: string;
  amount?: string;
  paymentLink?: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);
  const hasPaymentLink = Boolean(paymentLink);

  return (
    <>
      <button
        className={hasPaymentLink ? "btn-primary" : "btn-secondary"}
        type="button"
        onClick={() => {
          setConfirmed(!hasPaymentLink);
          setOpen(true);
          setSuccess(false);
        }}
      >
        {hasPaymentLink ? label : "Request Access"}
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
          <form
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              if (hasPaymentLink) {
                const formData = new FormData(event.currentTarget);
                addPayment({
                  id: `pay-${Date.now()}`,
                  payerName: String(formData.get("payerName") || "HirePilot user"),
                  email: String(formData.get("email") || ""),
                  phone: String(formData.get("phone") || ""),
                  paymentFor: requestType,
                  referenceId: String(formData.get("referenceId") || ""),
                  amount: amount || "",
                  status: "pending_verification",
                  notes: String(formData.get("notes") || ""),
                  createdAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                });
              }
              setSuccess(true);
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-trust">{hasPaymentLink && !confirmed ? "Secure payment" : "Payment verification"}</p>
                <h2 className="text-2xl font-black text-navy">{hasPaymentLink && !confirmed ? "Confirm Your HirePilot Purchase" : requestType}</h2>
                {amount && <p className="mt-1 text-sm font-black text-slate-600">Amount: {amount}</p>}
              </div>
              <button className="rounded-md p-1 text-slate-500 hover:bg-slate-100" type="button" onClick={() => setOpen(false)} aria-label="Close payment form"><X /></button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              {success ? (
                <div className="rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  {hasPaymentLink ? "Payment confirmation submitted. Access will be activated after admin verification." : "Request submitted. HirePilot will contact you shortly."}
                </div>
              ) : hasPaymentLink && !confirmed ? (
                <div className="grid gap-4">
                  <p className="text-sm leading-6 text-slate-700">
                    You are purchasing a HirePilot service/subscription.
                  </p>
                  <p className="rounded-md bg-skysoft p-3 text-sm font-semibold text-navy">
                    Payments are securely processed through our registered merchant account: BNR QA Academy.
                  </p>
                  <p className="text-sm leading-6 text-slate-700">
                    After successful payment, your HirePilot service or recruiter access will be activated after payment verification.
                  </p>
                  <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                    <p><strong>Selected item:</strong> {requestType}</p>
                    {amount && <p><strong>Amount:</strong> {amount}</p>}
                    <p><strong>Merchant account:</strong> BNR QA Academy</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {hasPaymentLink && (
                    <a className="btn-secondary justify-center" href={paymentLink} target="_blank" rel="noreferrer">
                      <ExternalLink size={16} /> Open Razorpay link again
                    </a>
                  )}
                  <p className="rounded-md bg-skysoft p-3 text-sm font-semibold text-navy">
                    {hasPaymentLink ? "Please submit your Razorpay payment reference ID/UTR. Our admin team will verify the payment and activate your HirePilot service/subscription." : "This item does not have an online payment link yet. Submit your details and HirePilot will contact you."}
                  </p>
                  <input value={requestType} readOnly aria-label="Selected plan or service" />
                  {amount && <input value={amount} readOnly aria-label="Payment amount" />}
                  <input name="payerName" placeholder="Name" required />
                  {hasPaymentLink && <input name="referenceId" placeholder="Payment Reference ID / UTR" required />}
                  <input name="email" type="email" placeholder="Email used for payment" required />
                  <input name="phone" placeholder="Phone used for payment" required />
                  <input type="file" aria-label="Upload payment screenshot" />
                  <textarea name="notes" rows={4} placeholder="Message or payment notes" />
                </div>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white p-5 sm:flex-row sm:justify-end">
              <button className="btn-secondary justify-center" type="button" onClick={() => setOpen(false)}>Cancel</button>
              {!success && hasPaymentLink && !confirmed && (
                <button
                  className="btn-primary justify-center"
                  type="button"
                  onClick={() => {
                    window.open(paymentLink, "_blank", "noopener,noreferrer");
                    setConfirmed(true);
                  }}
                >
                  Continue to Payment
                </button>
              )}
              {!success && (!hasPaymentLink || confirmed) && <button className="btn-primary justify-center" type="submit">{hasPaymentLink ? "Submit Payment Confirmation" : "Submit Request"}</button>}
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export const BetaRequestButton = PaymentRequestButton;
