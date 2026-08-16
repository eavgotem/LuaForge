--- src/components/Sections3.tsx (原始)


+++ src/components/Sections3.tsx (修改后)
import { useState } from "react";
import { CHANGELOG, FAQS } from "../data";
import { PLUGIN_FILE_NAME, PLUGIN_SHA, PLUGIN_SIZE, PLUGIN_SOURCE, PLUGIN_VERSION } from "../pluginSource";
import { CodeBlock } from "../highlight";
import { Chip, CopyButton, Reveal, SectionHeading } from "../ui";
import { ChevronDown, CheckCircle, DownloadIcon, LogoMark } from "../icons";

/* ============================== FAQ ============================== */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 border-t border-line-soft bg-ink-850/40 py-24 lg:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Straight answers"
            lines={["Every question we", <span key="a" className="text-amber">get asked.</span>]}
          />
          <p className="mt-6 max-w-[42ch] text-[14.5px] leading-relaxed text-mute">
            “Free forever” deserves scrutiny. Here's exactly how it works, what touches your code, and where the lines are drawn.
          </p>
          <div className="mt-8 rounded-lg border border-line-soft bg-ink-800/70 p-6">
            <p className="font-display text-[15px] font-bold text-fog">Still stuck?</p>
            <p className="mt-2 text-[13.5px] text-mute">
              The maintainers answer everything within a day — usually faster than a DataStore retry.
            </p>
            <a
              href="mailto:hello@luauforge.dev"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-4 py-2 font-mono text-[12px] font-bold text-amber transition-all duration-200 hover:bg-amber hover:text-ink-950 active:scale-[0.97]"
            >
              hello@luauforge.dev
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div
                  className={`rounded-lg border transition-colors duration-300 ${
                    isOpen ? "border-amber/40 bg-ink-800" : "border-line-soft bg-ink-800/50 hover:border-line"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className={`text-[15px] font-semibold leading-snug transition-colors ${isOpen ? "text-amber" : "text-fog"}`}>
                      {f.q}
                    </span>
                    <span className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber" : "text-dim"}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  <div className={`acc-panel ${isOpen ? "open" : ""}`}>
                    <div>
                      <p className="px-6 pb-6 text-[14px] leading-relaxed text-mute">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ INSTALL ============================ */

const INSTALL_STEPS = [
  { t: "Creator Store or one file", d: "Search “LuauForge” in the Creator Store — or save the raw .lua below into your plugins folder. Both paths take under a minute." },
  { t: "Enable HTTP requests", d: "File → Studio Settings → Studio → tick “Enable HTTP Requests”. That's the only switch; there's no key to paste anywhere." },
  { t: "Restart and prompt", d: "Plugins tab → LuauForge. The panel docks beside Properties and starts reading your selection immediately." },
];

export function Install() {
  const [saved, setSaved] = useState(false);

  const download = () => {
    const blob = new Blob([PLUGIN_SOURCE], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = PLUGIN_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <section id="install" className="scroll-mt-24 border-t border-line-soft py-24 lg:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Get the plugin"
            lines={["Ship it inside", <span key="a" className="text-amber">Studio tonight.</span>]}
          />
          <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-mute">
            The entire plugin is the file on the right — readable, auditable, yours. Drop it in, flip one setting, and your
            next script writes itself.
          </p>

          <ol className="mt-9 space-y-6">
            {INSTALL_STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber/30 bg-amber/10 font-display text-[13px] font-bold text-amber">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-fog">{s.t}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-mute">{s.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-2">
            <Chip>Studio 0.645+</Chip>
            <Chip tone="aqua">14.2 KB on disk</Chip>
            <Chip tone="dim">Win · macOS</Chip>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={download}
              className={`group inline-flex items-center gap-2.5 rounded-md px-6 py-3.5 text-[14.5px] font-bold transition-all duration-200 active:scale-[0.97] ${
                saved
                  ? "bg-mint text-ink-950"
                  : "bg-amber text-ink-950 hover:bg-fog hover:shadow-[0_0_36px_rgba(255,180,84,0.4)]"
              }`}
            >
              {saved ? <CheckCircle size={17} /> : <DownloadIcon size={17} />}
              {saved ? "Saved to downloads" : `Download ${PLUGIN_FILE_NAME}`}
            </button>
            <CopyButton text={PLUGIN_SOURCE} label="Copy source" className="!px-5 !py-3 !text-[12px]" />
            <a href="#faq" className="font-mono text-[12px] font-semibold text-dim underline decoration-line underline-offset-4 transition-colors hover:text-amber">
              read the privacy notes
            </a>
          </div>

          <div className="mt-10 border-l-2 border-line pl-5">
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-dim">Changelog</p>
            <ul className="mt-3 space-y-3">
              {CHANGELOG.map((c) => (
                <li key={c.v} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-mono text-[12px] font-bold text-amber">{c.v}</span>
                  <span className="font-mono text-[10.5px] text-dim">{c.date}</span>
                  <span className="text-[13px] text-mute">{c.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* source viewer */}
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-lg border border-line bg-ink-850 shadow-[0_30px_80px_-20px_rgba(4,6,12,0.9)]">
            <div className="flex flex-wrap items-center gap-3 border-b border-line-soft bg-ink-800 px-4 py-3">
              <span className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-rose/80" />
                <i className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                <i className="h-2.5 w-2.5 rounded-full bg-mint/80" />
              </span>
              <span className="font-mono text-[12px] font-semibold text-fog">{PLUGIN_FILE_NAME}</span>
              <span className="font-mono text-[10.5px] text-dim">
                {PLUGIN_VERSION} · {PLUGIN_SIZE} · sha {PLUGIN_SHA}
              </span>
              <span className="ml-auto">
                <CopyButton text={PLUGIN_SOURCE} className="!py-1.5" />
              </span>
            </div>
            <CodeBlock code={PLUGIN_SOURCE} textClass="text-[10.5px]" className="max-h-[560px] bg-ink-950 p-4" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft bg-ink-850 px-4 py-2 font-mono text-[10px] text-dim">
              <span className="text-mint">● verified open source</span>
              <span>plugin API only — no runtime hooks</span>
              <span className="ml-auto">Lua 5.1 + Luau extensions</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================= FOOTER ============================= */

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-ink-950">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:py-16">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="font-display text-[16px] font-bold text-fog">
              Luau<span className="text-amber">Forge</span>
            </span>
          </a>
          <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-dim">
            The AI that speaks fluent Luau — living inside Roblox Studio, free forever, with a token meter that was never built.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.07] px-3 py-1.5 font-mono text-[10.5px] font-semibold text-mint">
            <i className="pulseglow h-1.5 w-1.5 rounded-full bg-mint" />
            All inference pools operational · 41 ms median
          </p>
        </div>

        <div>
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-mute">Product</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {[
              ["Features", "#features"],
              ["Workflow", "#workflow"],
              ["Prompt library", "#library"],
              ["Comparison", "#compare"],
              ["Install the plugin", "#install"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-dim transition-colors hover:text-amber">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-mute">Resources</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            <li><a href="#install" className="text-dim transition-colors hover:text-amber">Plugin source &amp; changelog</a></li>
            <li><a href="#faq" className="text-dim transition-colors hover:text-amber">FAQ &amp; privacy notes</a></li>
            <li><a href="#top" className="text-dim transition-colors hover:text-amber">Live demo</a></li>
            <li><a href="mailto:hello@luauforge.dev" className="text-dim transition-colors hover:text-amber">hello@luauforge.dev</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="wrap flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-dim">© 2026 LuauForge Collective — built by builders, for builders.</p>
          <p className="max-w-[52ch] text-right font-mono text-[10px] leading-relaxed text-dim/70 md:max-w-none">
            Not affiliated with or endorsed by Roblox Corporation. Roblox and Roblox Studio are trademarks of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
