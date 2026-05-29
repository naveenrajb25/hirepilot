export const jobRoleCategories = [
  {
    category: "Freshers / Entry Level",
    roles: [
      "Fresher",
      "Graduate Trainee",
      "Management Trainee",
      "Intern",
      "Fresher Software Developer",
      "Fresher QA Tester",
      "Fresher Sales Executive",
      "Fresher Customer Support Executive",
      "Fresher Digital Marketing Executive"
    ]
  },
  {
    category: "IT & Software",
    roles: [
      "Software Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Java Developer",
      "Python Developer",
      ".NET Developer",
      "PHP Developer",
      "React Developer",
      "Angular Developer",
      "Node.js Developer",
      "Mobile App Developer",
      "Android Developer",
      "iOS Developer",
      "Web Developer",
      "DevOps Engineer",
      "Cloud Engineer",
      "AWS Engineer",
      "Azure Engineer",
      "System Administrator",
      "IT Support Engineer",
      "Network Engineer",
      "Technical Support Engineer",
      "Cyber Security Analyst",
      "UI Developer",
      "UX Designer"
    ]
  },
  {
    category: "Testing & QA",
    roles: ["Manual Tester", "QA Engineer", "Software Tester", "Automation Tester", "Selenium Tester", "API Tester", "Performance Tester", "Mobile App Tester", "Test Engineer", "QA Analyst"]
  },
  {
    category: "Data & AI",
    roles: ["Data Analyst", "Business Analyst", "Data Engineer", "Data Scientist", "Machine Learning Engineer", "AI Engineer", "AI Automation Specialist", "Prompt Engineer", "Power BI Developer", "Tableau Developer", "MIS Executive"]
  },
  {
    category: "Sales & Business Development",
    roles: ["Sales Executive", "Business Development Executive", "Business Development Manager", "Inside Sales Executive", "Field Sales Executive", "Tele Sales Executive", "Sales Manager", "Account Manager", "Client Relationship Executive"]
  },
  {
    category: "Marketing & Digital Marketing",
    roles: ["Digital Marketing Executive", "SEO Executive", "Social Media Executive", "Content Writer", "Copywriter", "Performance Marketing Executive", "Email Marketing Executive", "Marketing Executive", "Brand Executive", "Influencer Marketing Executive"]
  },
  {
    category: "Customer Support / BPO",
    roles: ["Customer Support Executive", "Customer Care Executive", "Voice Process Executive", "Non-Voice Process Executive", "Chat Support Executive", "Email Support Executive", "BPO Executive", "International Voice Process", "Technical Support Executive"]
  },
  {
    category: "HR & Recruitment",
    roles: ["HR Executive", "HR Recruiter", "IT Recruiter", "Talent Acquisition Executive", "Payroll Executive", "HR Generalist", "Training Coordinator"]
  },
  {
    category: "Finance & Accounting",
    roles: ["Accountant", "Accounts Executive", "Finance Executive", "Audit Assistant", "Tax Associate", "GST Executive", "Billing Executive", "Financial Analyst"]
  },
  {
    category: "Operations & Admin",
    roles: ["Operations Executive", "Admin Executive", "Back Office Executive", "Data Entry Operator", "Office Coordinator", "MIS Executive", "Logistics Executive", "Procurement Executive"]
  },
  {
    category: "Education & Training",
    roles: ["Teacher", "Trainer", "Academic Counsellor", "Admission Counsellor", "Subject Matter Expert", "Online Tutor"]
  },
  {
    category: "Healthcare",
    roles: ["Medical Coder", "Pharmacist", "Lab Technician", "Hospital Admin Executive", "Healthcare Support Executive", "Medical Billing Executive"]
  },
  {
    category: "Retail & Hospitality",
    roles: ["Retail Sales Executive", "Store Executive", "Store Manager", "Hospitality Executive", "Front Office Executive", "Receptionist", "Travel Consultant"]
  },
  {
    category: "Others",
    roles: ["Others"]
  }
] as const;

export const allJobRoles = jobRoleCategories.flatMap((group) => group.roles);

export function getInterviewQuestionForRole(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes("fresher") || normalized.includes("trainee") || normalized.includes("intern")) return "Tell me about yourself and one example that shows your learning ability.";
  if (normalized.includes("test") || normalized.includes("qa") || normalized.includes("selenium")) return "How would you test a login page and report defects clearly?";
  if (normalized.includes("developer") || normalized.includes("engineer") || normalized.includes("react") || normalized.includes("java") || normalized.includes("python") || normalized.includes("node")) return "Explain a software project you built and the technical decisions you made.";
  if (normalized.includes("sales") || normalized.includes("business development") || normalized.includes("account manager")) return "How would you qualify a lead and handle a price objection?";
  if (normalized.includes("hr") || normalized.includes("recruiter") || normalized.includes("talent")) return "How would you screen a candidate and assess communication quality?";
  if (normalized.includes("support") || normalized.includes("bpo") || normalized.includes("voice") || normalized.includes("chat")) return "How would you handle an upset customer while maintaining service quality?";
  if (normalized.includes("data") || normalized.includes("analyst") || normalized.includes("power bi") || normalized.includes("tableau") || normalized.includes("mis")) return "How would you clean messy data and explain insights to a business team?";
  if (normalized.includes("marketing") || normalized.includes("seo") || normalized.includes("content")) return "How would you plan and measure a digital campaign?";
  if (normalized.includes("account") || normalized.includes("finance") || normalized.includes("tax") || normalized.includes("gst")) return "Explain how you would handle reconciliation and avoid accounting errors.";
  return "Tell me about your experience, strengths, and how you would succeed in this role.";
}
