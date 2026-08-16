--- src/components/Sections2.tsx (原始)


+++ src/components/Sections2.tsx (修改后)
import { useState } from "react";
import { COMPARE, GALLERY, GALLERY_TAGS, STATS } from "../data";
import { useCountUp, useInView, usePrefersReducedMotion } from "../hooks";
import { CodeBlock } from "../highlight";
import { CopyButton, Reveal, SectionHeading } from "../ui";
import { InfinityZero, MarkCell } from "../icons";

/* ============================ GALLERY ============================ */

export function Gallery() {
  const [tag, setTag] = useState<(typeof GALLERY_TAGS)[number]>("All");
  const items = tag === "All" ? GALLERY : GALLERY.filter((g) => g.tag === tag);

  return (
    <section id="library" className="scroll-mt-24 border-t border-line-soft py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The prompt library"
            lines={["Real prompts.", <span key="a" className="text-amber">Real output.</span>]}
          />
          <div className="flex flex-wrap gap-1.5">
            {GALLERY_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  tag === t
                    ? "border-amber/60 bg-amber/15 text-amber"
                    : "border-line text-dim hover:border-amber/40 hover:text-mute"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-[58ch] text-[14.5px] text-mute">
          A live slice of what builders asked for this week — every card is genuine generated output, unedited.
          <span className="text-dim"> {items.length} of {GALLERY.length} shown.</span>
        </p>

        <div key={tag} className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={g.prompt} delay={(i % 3) * 80}>
              <article className="group flex h-full flex-col rounded-lg border border-line-soft bg-ink-800/70 transition-all duration-300 hover:-translate-y-1 hover:border-aqua/40 hover:shadow-[0_18px_50px_-18px_rgba(69,196,216,0.22)]">
                <div className="flex items-center justify-between gap-3 px-5 pt-5">
                  <span className="rounded border border-aqua/25 bg-aqua/10 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-aqua">
                    {g.tag}
                  </span>
                  <span className="font-mono text-[10px] text-dim">{g.ms} ms · 0 tokens</span>
                </div>
                <h3 className="px-5 pt-3 font-mono text-[13.5px] font-semibold leading-snug text-fog">
                  <span className="mr-1.5 text-amber">›</span>
                  “{g.prompt}”
                </h3>
                <div className="relative mt-4 flex-1 overflow-hidden rounded-b-none border-t border-line-soft bg-ink-950">
                  <div className="pointer-events-none max-h-[168px] overflow-hidden">
                    <CodeBlock code={g.code} lineNumbers={false} textClass="text-[10.5px]" className="p-3.5" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-950 to-transparent" />
                </div>
                <div className="flex items-center justify-between border-t border-line-soft bg-ink-850 px-5 py-3">
                  <span className="font-mono text-[10.5px] text-dim">
                    {g.lines} lines · --!strict · compiles ✓
                  </span>
                  <CopyButton text={g.code} className="!px-2.5 !py-1.5" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= STATS ============================= */

function StatTile({
  value,
  label,
  format,
  note,
  start,
}: {
  value: number;
  label: string;
  format: "int" | "pct" | "money";
  note: string;
  start: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const v = useCountUp(value, start, 2100, reduced);
  const display =
    format === "int"
      ? Math.round(v).toLocaleString("en-US")
      : format === "pct"
        ? v.toFixed(1) + "%"
        : "$" + v.toFixed(2);
  return (
    <div className="group border border-line-soft bg-ink-800/60 p-6 transition-colors duration-300 hover:border-amber/40 md:p-7">
      <p className="font-display text-[26px] font-extrabold tabular-nums tracking-tight text-fog transition-colors duration-300 group-hover:text-amber md:text-[32px]">
        {display}
      </p>
      <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-mute">{label}</p>
      <p className="mt-1.5 font-mono text-[11px] text-dim">{note}</p>
    </div>
  );
}

export function StatsBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <section className="border-t border-line-soft bg-ink-850/40 py-20 lg:py-24">
      <div className="wrap" ref={ref}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatTile key={s.label} {...s} start={inView} />
          ))}
        </div>
        <Reveal className="mt-10">
          <div className="flex flex-col items-center gap-4 border border-dashed border-amber/25 bg-amber/[0.04] px-6 py-7 text-center md:flex-row md:text-left">
            <span className="text-amber">
              <InfinityZero size={40} />
            </span>
            <p className="text-[15px] leading-relaxed text-mute">
              <span className="font-display font-bold text-fog">$0.00 charged since launch.</span> The token meter was never
              built — there is nothing to run out, nothing to top up, nothing to cancel. Generate your ten-thousandth script
              and the invoice is still a blank page.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================== COMPARISON =========================== */

export function Comparison() {
  return (
    <section id="compare" className="scroll-mt-24 border-t border-line-soft py-24 lg:py-32">
      <div className="wrap">
        <SectionHeading
          eyebrow="The honest math"
          lines={["Stacked against", "the alternatives."]}
        />
        <p className="mt-5 max-w-[56ch] text-[14.5px] text-mute">
          General-purpose chatbots don't know Luau from Lua. Paid copilots meter every keystroke. Here's the full ledger.
        </p>

        <Reveal className="mt-12">
          <div className="code-scroll overflow-x-auto rounded-lg border border-line-soft">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-ink-800">
                  <th className="px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-dim">Capability</th>
                  <th className="border-x border-amber/25 bg-amber/[0.07] px-5 py-4">
                    <span className="flex items-center gap-2.5 font-display text-[14px] font-bold text-amber">
                      LuauForge
                      <span className="rounded border border-mint/40 bg-mint/10 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em] text-mint">
                        FREE
                      </span>
                    </span>
                  </th>
                  <th className="px-5 py-4 text-[13.5px] font-semibold text-mute">Big-chat AI</th>
                  <th className="px-5 py-4 text-[13.5px] font-semibold text-mute">Paid copilots</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.label} className={`transition-colors hover:bg-ink-800/70 ${i % 2 === 1 ? "bg-ink-850/50" : ""}`}>
                    <td className="px-5 py-3.5 text-[13.5px] font-semibold text-fog">{row.label}</td>
                    <td className="border-x border-amber/25 bg-amber/[0.04] px-5 py-3.5">
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0"><MarkCell mark={row.forge[0]} /></span>
                        <span className="text-[12.5px] leading-snug text-fog">{row.forge[1]}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0"><MarkCell mark={row.chat[0]} /></span>
                        <span className="text-[12.5px] leading-snug text-dim">{row.chat[1]}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0"><MarkCell mark={row.paid[0]} /></span>
                        <span className="text-[12.5px] leading-snug text-dim">{row.paid[1]}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
