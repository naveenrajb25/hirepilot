export function PaymentTrustNote({ context = "services" }: { context?: "services" | "recruiter" | "public" | "footer" }) {
  const copy = {
    services: "Payment will be processed through BNR QA Academy, the registered merchant account for HirePilot services.",
    recruiter: "Payment will be processed through BNR QA Academy, the registered merchant account for HirePilot recruiter plans.",
    public: "HirePilot services are processed through the registered merchant account BNR QA Academy.",
    footer: "HirePilot is a career and hiring platform by BNR QA Academy."
  }[context];

  return (
    <p className="mt-4 rounded-md bg-skysoft px-3 py-2 text-xs font-semibold text-navy">
      {copy}
    </p>
  );
}
