"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutCandidate, logoutRecruiter } from "@/lib/storage/authProfileStore";

export function AppLogoutButton({ type }: { type: "candidate" | "recruiter" }) {
  const router = useRouter();

  return (
    <button
      className="btn-secondary py-2"
      type="button"
      onClick={() => {
        if (type === "candidate") {
          logoutCandidate();
          router.push("/candidate/login?message=Logged%20out%20successfully");
        } else {
          logoutRecruiter();
          router.push("/recruiter/login?message=Logged%20out%20successfully");
        }
      }}
    >
      <LogOut size={16} /> Logout
    </button>
  );
}
