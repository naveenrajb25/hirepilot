"use client";

import { useEffect, useState } from "react";
import { PaymentRequestButton } from "@/components/BetaRequestModal";
import type { CandidateService, PaymentRecord, PricingPlan } from "@/lib/types";
import { ADMIN_CONFIG_UPDATED_EVENT, getActiveCandidateServices, getActiveRecruiterPlans, getPayments } from "@/lib/storage/adminConfigStore";

function useAdminPricing() {
  const [services, setServices] = useState<CandidateService[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const load = () => {
      setServices(getActiveCandidateServices());
      setPlans(getActiveRecruiterPlans());
      setPayments(getPayments());
    };
    load();
    window.addEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(ADMIN_CONFIG_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return { services, plans, payments };
}

export function PublicPricingCatalog() {
  const { services, plans, payments } = useAdminPricing();

  return (
    <>
      <h2 className="mt-10 text-2xl font-black text-navy">Candidate Services</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="card border-trust/30 bg-skysoft">
          <h3 className="text-xl font-black text-navy">Free profile creation</h3>
          <p className="mt-2 text-sm text-slate-600">Build your HirePilot profile, add resume, LinkedIn, skills, projects, and complete an AI interview readiness check.</p>
          <p className="mt-4 text-2xl font-black text-trust">Free</p>
        </div>
        {services.map((service) => (
          <div key={service.id} className="card">
            <h3 className="text-xl font-black text-navy">{service.serviceName}</h3>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-4 text-2xl font-black text-trust">{service.price}</p>
            <div className="mt-4"><PaymentRequestButton label="Pay Now" requestType={service.serviceName} amount={service.price} paymentLink={service.paymentLink || service.razorpayPaymentLink} /></div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-black text-navy">Recruiter Plans</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="card border-trust/30 bg-skysoft">
          <h3 className="text-xl font-black text-navy">Free company registration</h3>
          <p className="mt-2 text-sm text-slate-600">Create a recruiter profile and request approval before unlocking candidate contact and resume access.</p>
          <p className="mt-4 text-2xl font-black text-trust">Free</p>
        </div>
        {plans.map((plan) => (
          <RecruiterPlanCard key={plan.id} plan={plan} isActive={payments.some((payment) => payment.paymentFor === plan.planName && payment.status === "paid")} />
        ))}
      </div>
    </>
  );
}

export function RecruiterPricingCatalog() {
  const { plans, payments } = useAdminPricing();

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <RecruiterPlanCard key={plan.id} plan={plan} isActive={payments.some((payment) => payment.paymentFor === plan.planName && payment.status === "paid")} />
      ))}
    </div>
  );
}

function RecruiterPlanCard({ plan, isActive = false }: { plan: PricingPlan; isActive?: boolean }) {
  return (
    <div className="card">
      <h3 className="text-xl font-black text-navy">{plan.planName}</h3>
      <p className="mt-4 text-2xl font-black text-trust">{plan.price}</p>
      <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>Profile views: {plan.profileViewLimit ?? "Unlimited"}</p>
        <p>Contact views: {plan.contactViewLimit ?? "Unlimited"}</p>
        <p>Resume downloads: {plan.resumeDownloadLimit ?? "Unlimited"}</p>
        <p>Featured access: {plan.featuredCandidateAccess ? "Included" : "Standard only"}</p>
      </div>
      {isActive ? (
        <p className="mt-6 rounded-md bg-emerald-50 p-3 text-sm font-black text-emerald-700">Subscription active after admin verification.</p>
      ) : (
        <div className="mt-6"><PaymentRequestButton label="Pay Now" requestType={plan.planName} amount={plan.price} paymentLink={plan.paymentLink || plan.razorpayPaymentLink} /></div>
      )}
    </div>
  );
}
