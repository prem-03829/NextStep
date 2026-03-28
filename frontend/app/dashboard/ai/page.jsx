export default function AiPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          AI Decision Summary
        </p>
        <h2 className="mt-3 font-display text-4xl text-white">
          A clear path with practical upside
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
          Based on your profile, the strongest direction combines creative
          decision-making with structured execution. That is why design,
          analytics, and growth-oriented roles surfaced first. The next step is
          choosing an institution and funding route that keeps your momentum high
          while closing the most important skill gaps.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Chat With AI
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <div className="rounded-[1.25rem] bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
            Ask about colleges, scholarships, or whether a career path matches
            your interests.
          </div>
          <textarea
            rows={5}
            placeholder="Type your question here..."
            className="mt-4 w-full resize-none rounded-[1.25rem] border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            className="mt-4 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
