import { adminSettings, candidateServices as defaultCandidateServices, paymentRecords as defaultPayments, pricingPlans as defaultRecruiterPlans } from "@/lib/admin-data";
import type { CandidateService, PaymentRecord, PricingPlan } from "@/lib/types";

export const ADMIN_CONFIG_UPDATED_EVENT = "hirepilot-admin-config-updated";

const keys = {
  candidateServices: "hirepilot.adminConfig.candidateServices",
  recruiterPlans: "hirepilot.adminConfig.recruiterPlans",
  payments: "hirepilot.adminConfig.payments",
  platformSettings: "hirepilot.adminConfig.platformSettings"
};

type PlatformSettings = typeof adminSettings;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function withOrder<T extends { displayOrder?: number }>(items: T[]) {
  return items
    .map((item, index) => ({ ...item, displayOrder: item.displayOrder ?? index + 1 }))
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
}

function normalizeService(service: CandidateService): CandidateService {
  return {
    ...service,
    paymentLink: service.paymentLink || service.razorpayPaymentLink || "",
    razorpayPaymentLink: service.paymentLink || service.razorpayPaymentLink || ""
  };
}

function normalizePlan(plan: PricingPlan): PricingPlan {
  return {
    ...plan,
    paymentLink: plan.paymentLink || plan.razorpayPaymentLink || "",
    razorpayPaymentLink: plan.paymentLink || plan.razorpayPaymentLink || ""
  };
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(ADMIN_CONFIG_UPDATED_EVENT));
}

export function getCandidateServices() {
  return withOrder(readJson<CandidateService[]>(keys.candidateServices, withOrder(defaultCandidateServices.map(normalizeService)))).map(normalizeService);
}

export function saveCandidateServices(services: CandidateService[]) {
  writeJson(keys.candidateServices, withOrder(services.map(normalizeService)));
}

export function updateCandidateService(service: CandidateService) {
  const services = getCandidateServices();
  const exists = services.some((item) => item.id === service.id);
  saveCandidateServices(exists ? services.map((item) => (item.id === service.id ? service : item)) : [service, ...services]);
}

export function deleteCandidateService(id: string) {
  saveCandidateServices(getCandidateServices().filter((service) => service.id !== id));
}

export function getRecruiterPlans() {
  return withOrder(readJson<PricingPlan[]>(keys.recruiterPlans, withOrder(defaultRecruiterPlans.map(normalizePlan)))).map(normalizePlan);
}

export function saveRecruiterPlans(plans: PricingPlan[]) {
  writeJson(keys.recruiterPlans, withOrder(plans.map(normalizePlan)));
}

export function updateRecruiterPlan(plan: PricingPlan) {
  const plans = getRecruiterPlans();
  const exists = plans.some((item) => item.id === plan.id);
  saveRecruiterPlans(exists ? plans.map((item) => (item.id === plan.id ? plan : item)) : [plan, ...plans]);
}

export function deleteRecruiterPlan(id: string) {
  saveRecruiterPlans(getRecruiterPlans().filter((plan) => plan.id !== id));
}

export function getPayments() {
  return readJson<PaymentRecord[]>(keys.payments, defaultPayments);
}

export function savePayments(payments: PaymentRecord[]) {
  writeJson(keys.payments, payments);
}

export function addPayment(payment: PaymentRecord) {
  savePayments([payment, ...getPayments()]);
}

export function getPlatformSettings() {
  return readJson<PlatformSettings>(keys.platformSettings, adminSettings);
}

export function savePlatformSettings(settings: PlatformSettings) {
  writeJson(keys.platformSettings, settings);
}

export function getActiveCandidateServices() {
  return getCandidateServices().filter((service) => service.isActive);
}

export function getActiveRecruiterPlans() {
  return getRecruiterPlans().filter((plan) => plan.isActive);
}
