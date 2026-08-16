--- src/ui.tsx (原始)


+++ src/ui.tsx (修改后)
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { useInView } from "./hooks";
import { CopyIcon, CheckCircle } from "./icons";

/* Scroll-reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* Eyebrow + display heading with line-mask reveal */
export function SectionHeading({
  eyebrow,
  lines,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  lines: ReactNode[];
  align?: "left" | "center";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${align === "center" ? "text-center" : ""} ${className}`}
    >
      <p className={`mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-amber ${align === "center" ? "justify-center" : ""}`}>
        <span className="inline-block h-[7px] w-[7px] rotate-45 bg-amber" />
        {eyebrow}
      </p>
      <h2 className="font-display text-[26px] font-bold leading-[1.12] text-fog sm:text-[34px] lg:text-[40px]">
        {lines.map((line, i) => (
          <span key={i} className="mask-line">
            <span className="mask-inner" style={{ "--rd": `${i * 90}ms` } as CSSProperties}>
              {line}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}

/* Copy-to-clipboard button with feedback */
export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`group inline-flex items-center gap-2 rounded-md border border-line bg-ink-750 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mute transition-all duration-200 hover:border-amber/50 hover:text-amber active:scale-[0.97] ${className}`}
    >
      {copied ? <CheckCircle size={14} className="text-mint" /> : <CopyIcon size={14} />}
      <span className="min-w-[52px] text-left">{copied ? "Copied" : label}</span>
    </button>
  );
}

/* Pill chip */
export function Chip({ children, tone = "amber" }: { children: ReactNode; tone?: "amber" | "mint" | "aqua" | "dim" }) {
  const tones: Record<string, string> = {
    amber: "border-amber/30 bg-amber/10 text-amber",
    mint: "border-mint/30 bg-mint/10 text-mint",
    aqua: "border-aqua/30 bg-aqua/10 text-aqua",
    dim: "border-line bg-ink-750 text-mute",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  );
}
