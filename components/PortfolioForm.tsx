import { RoleCombobox } from "./RoleCombobox";

export function PortfolioForm() {
  return (
    <form className="grid gap-4 md:grid-cols-2">
      {["Full name", "Email", "Phone", "City", "Education", "Experience level"].map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input className="mt-2" placeholder={field} />
        </div>
      ))}
      <div className="md:col-span-2">
        <RoleCombobox name="preferredRole" label="Preferred job role" />
      </div>
      <div>
        <label>Resume upload</label>
        <input className="mt-2" type="file" accept=".pdf,.doc,.docx" />
      </div>
      <div>
        <label>LinkedIn profile</label>
        <input className="mt-2" placeholder="https://linkedin.com/in/..." />
      </div>
      <div>
        <label>GitHub link optional</label>
        <input className="mt-2" placeholder="https://github.com/..." />
      </div>
      <div className="md:col-span-2">
        <label>Project links optional</label>
        <textarea className="mt-2" rows={3} placeholder="Add project links or proof-of-work summaries" />
      </div>
      <div>
        <label>Tech/non-tech skills</label>
        <textarea className="mt-2" rows={4} placeholder="Python, Sales, Excel, Customer support..." />
      </div>
      <div>
        <label>Languages known</label>
        <textarea className="mt-2" rows={4} placeholder="English, Hindi, Tamil..." />
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary" type="button">
          Save portfolio
        </button>
      </div>
    </form>
  );
}
