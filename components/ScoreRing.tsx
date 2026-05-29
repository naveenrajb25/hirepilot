type Props = {
  score: number;
  label?: string;
};

export function ScoreRing({ score, label = "Employability Score" }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-trust text-3xl font-black text-white shadow-soft">
        {score}
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-600">
          {score >= 80 ? "Priority recruiter visibility" : "Optimization recommended"}
        </p>
      </div>
    </div>
  );
}
