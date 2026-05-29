import { PublicChoiceCards } from "@/components/PublicChoiceCards";

export default function SignupPage() {
  return (
    <PublicChoiceCards
      title="Sign Up"
      subtitle="Create a candidate or recruiter account."
      cards={[
        { title: "Candidate Signup", text: "Get verified and build a recruiter-ready profile.", href: "/candidate/signup" },
        { title: "Recruiter Signup", text: "Register your company and request access to verified talent.", href: "/recruiter/signup" }
      ]}
    />
  );
}
