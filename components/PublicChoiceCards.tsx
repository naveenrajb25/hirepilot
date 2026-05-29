import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "./Header";

export function PublicChoiceCards({
  title,
  subtitle,
  cards
}: {
  title: string;
  subtitle: string;
  cards: { title: string; text: string; href: string }[];
}) {
  return (
    <>
      <Header />
      <main className="section min-h-[calc(100vh-72px)]">
        <h1 className="text-4xl font-black text-navy sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">{subtitle}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="card hover:border-trust">
              <h2 className="text-2xl font-black text-navy">{card.title}</h2>
              <p className="mt-2 text-slate-600">{card.text}</p>
              <span className="btn-primary mt-5">Continue <ArrowRight size={18} /></span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
