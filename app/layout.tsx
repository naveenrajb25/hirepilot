import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const description = "AI-powered employability verification and hiring platform helping candidates improve visibility and recruiters discover qualified talent faster.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://hirepilot.in"),
  title: "HirePilot",
  description,
  openGraph: {
    title: "HirePilot",
    description,
    url: "/",
    siteName: "HirePilot",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "HirePilot",
    description
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
