import { PublicChoiceCards } from "@/components/PublicChoiceCards";

export default function LoginPage() {
  return (
    <PublicChoiceCards
      title="Login"
      subtitle="Choose the right account type to continue."
      cards={[
        { title: "Candidate Login", text: "Access your portfolio, interview, scorecard, and services.", href: "/candidate/login" },
        { title: "Recruiter Login", text: "Access approved recruiter search and hiring workflows.", href: "/recruiter/login" }
      ]}
    />
  );
}
