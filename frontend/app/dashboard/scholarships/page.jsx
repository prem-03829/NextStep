const scholarships = [
  {
    name: "Future Builders Grant",
    amount: "$6,000",
    eligibility: "Strong academic consistency and a project portfolio.",
    deadline: "May 18",
  },
  {
    name: "NextGen Skill Scholarship",
    amount: "$4,500",
    eligibility: "Students pursuing design, analytics, or product roles.",
    deadline: "June 02",
  },
  {
    name: "Merit Access Award",
    amount: "$3,200",
    eligibility: "Need-based support with verified motivation and attendance.",
    deadline: "June 21",
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <article
          key={scholarship.name}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-sky-200/80">
                Scholarship
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">
                {scholarship.name}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                {scholarship.eligibility}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-200 lg:min-w-[240px]">
              <div className="rounded-2xl bg-black/20 px-4 py-3">
                Amount: {scholarship.amount}
              </div>
              <div className="rounded-2xl bg-black/20 px-4 py-3">
                Deadline: {scholarship.deadline}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
