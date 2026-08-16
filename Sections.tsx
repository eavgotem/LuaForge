--- src/components/Sections.tsx (原始)


+++ src/components/Sections.tsx (修改后)
import type { CSSProperties } from "react";
import { FEATURES, STEPS, TICKER_ITEMS } from "../data";
import { Reveal, SectionHeading } from "../ui";
import { FeatureIcon, Spark } from "../icons";

/* ============================= TICKER ============================= */

export function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {TICKER_ITEMS.map((item) => (
        <span key={item + (hidden ? "-b" : "-a")} className="flex items-center">
          <span className="px-6 font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-mute md:px-9">{item}</span>
          <Spark size={11} className="text-amber/70" />
        </span>
      ))}
    </div>
  );
  return (
    <section className="marquee border-y border-line-soft bg-ink-850/70 py-3.5" style={{ "--speed": "38s" } as CSSProperties}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ============================ FEATURES ============================ */

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 lg:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* sticky rail */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="What it actually does"
            lines={["Built inside the", "engine — not", <span key="a" className="text-amber">beside it.</span>]}
          />
          <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-mute">
            Chat bots guess at your game. LuauForge <span className="text-fog">looks at it</span>: your services, your
            Remotes, your naming conventions — then writes code that drops in without a fight.
          </p>
          <ol className="mt-9 hidden space-y-1 lg:block">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <a
                  href={`#feat-${i}`}
                  className="group flex items-baseline gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-ink-800"
                >
                  <span className="font-mono text-[11px] font-bold text-amber/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[13.5px] font-medium text-dim transition-colors group-hover:text-fog">{f.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* feature blocks */}
        <div className="flex flex-col gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i % 2 === 0 ? 0 : 90}>
              <article
                id={`feat-${i}`}
                className="group scroll-mt-28 rounded-lg border border-line-soft bg-ink-800/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_18px_50px_-18px_rgba(255,180,84,0.2)] md:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-amber/25 bg-amber/10 text-amber transition-all duration-300 group-hover:bg-amber group-hover:text-ink-950">
                    <FeatureIcon name={f.icon} size={23} />
                  </div>
                  <div>
                    <h3 className="font-display text-[16.5px] font-bold leading-snug text-fog md:text-[18px]">{f.title}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-mute">{f.body}</p>
                    <ul className="mt-4 space-y-1.5">
                      {f.points.map((pt) => (
                        <li key={pt} className="flex items-baseline gap-2.5 font-mono text-[12px] text-dim">
                          <span className="text-amber">▸</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= STEPS ============================= */

export function Steps() {
  return (
    <section id="workflow" className="scroll-mt-24 border-t border-line-soft bg-ink-850/40 py-24 lg:py-32">
      <div className="wrap">
        <SectionHeading
          eyebrow="From zero to shipping"
          lines={["Sixty seconds to setup.", <span key="a" className="text-amber">Forever to enjoy.</span>]}
          className="max-w-[640px]"
        />
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-mute">
          No accounts, no dashboards, no CLI. The whole onboarding fits inside Studio itself.
        </p>

        <div className="relative mt-14">
          {STEPS.map((s, i) => (
            <div key={s.num} className="sticky mb-7" style={{ top: `${92 + i * 58}px` }}>
              <article
                className={`grid items-center gap-6 rounded-lg border border-line p-7 shadow-[0_-16px_50px_rgba(7,10,18,0.65)] md:grid-cols-[110px_1fr_1fr] md:gap-10 md:p-10 ${
                  i % 2 === 0 ? "bg-ink-800" : "bg-ink-750"
                }`}
              >
                <div className="font-display text-[52px] font-extrabold leading-none text-ink-600 transition-colors duration-300 hover:text-amber/60 md:text-[68px]">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-display text-[19px] font-bold text-fog">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{s.body}</p>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-line-soft bg-ink-950 p-4 font-mono text-[11.5px] leading-[1.8] text-aqua code-scroll">
                  {s.snippet}
                </pre>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
