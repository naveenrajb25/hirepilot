import { Header } from "@/components/Header";
import { PublicPricingCatalog } from "@/components/PricingCatalog";
import { PaymentTrustNote } from "@/components/PaymentTrustNote";

export default function PublicPricingPage() {
  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black text-navy sm:text-5xl">Pricing</h1>
        <p className="mt-3 text-lg text-slate-600">Candidate optimization services and recruiter access plans controlled by HirePilot admin.</p>
        <PaymentTrustNote context="public" />
        <PublicPricingCatalog />
        <PaymentTrustNote context="footer" />
      </main>
    </>
  );
}
