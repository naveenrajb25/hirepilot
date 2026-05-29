export function AuthNotice({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;
  return (
    <div className={`rounded-md border px-3 py-2 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      {error || message}
    </div>
  );
}
