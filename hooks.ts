--- src/hooks.ts (原始)


+++ src/hooks.ts (修改后)
import { useEffect, useRef, useState } from "react";

/* ---------------- prefers-reduced-motion ---------------- */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* ---------------- intersection observer ---------------- */
export function useInView<T extends HTMLElement>(threshold = 0.18, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

/* ---------------- count-up ---------------- */
export function useCountUp(target: number, start: boolean, duration = 2000, reduced = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, reduced]);
  return val;
}

/* ---------------- scramble decode ---------------- */
const GLYPHS = "▓▒█<>/{}[]=+*#%&$@";

export function useScramble(text: string, active: boolean, reduced: boolean) {
  const [out, setOut] = useState(() => (reduced ? text : text.replace(/[^ ]/g, " ")));
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    const total = Math.max(16, Math.round(text.length * 1.6));
    const tick = () => {
      frame += 1;
      const progress = frame / total;
      const settled = Math.floor(text.length * progress);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          s += " ";
          continue;
        }
        s += i < settled ? ch : GLYPHS[(i * 7 + frame * 3) % GLYPHS.length];
      }
      setOut(s);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, active, reduced]);
  return out;
}

/* ---------------- typewriter ---------------- */
export function useTyped(full: string, speed = 2, reduced = false) {
  const [state, setState] = useState({ full, count: reduced ? full.length : 0 });
  // render-phase reset so switching texts never flashes the old one
  if (state.full !== full) {
    setState({ full, count: reduced ? full.length : 0 });
  }
  const { count } = state;
  useEffect(() => {
    if (reduced) {
      setState((s) => ({ ...s, count: full.length }));
      return;
    }
    const id = window.setInterval(() => {
      setState((s) => {
        if (s.count >= full.length) {
          window.clearInterval(id);
          return s;
        }
        return { ...s, count: s.count + speed };
      });
    }, 14);
    return () => window.clearInterval(id);
  }, [full, speed, reduced]);
  return { typed: full.slice(0, Math.min(count, full.length)), done: count >= full.length };
}
