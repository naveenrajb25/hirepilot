import Link from "next/link";

function HirePilotMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const svgSize = size === "lg" ? 32 : size === "sm" ? 22 : 24;

  return (
    <span className={`grid ${box} place-items-center rounded-lg bg-navy text-white shadow-soft`}>
      <svg width={svgSize} height={svgSize} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 24V7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M8.5 16H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M18 24V8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 8.5L25 5L21.5 15" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 5L16.5 14" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function BrandLogo({
  href = "/",
  compact = false,
  size = "md",
  label = "HirePilot"
}: {
  href?: string;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const content = (
    <>
      <HirePilotMark size={size} />
      {!compact && <span className="font-black text-navy">{label}</span>}
    </>
  );

  if (!href) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return (
    <Link href={href} className="flex items-center gap-2">
      {content}
    </Link>
  );
}
