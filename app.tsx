--- src/App.tsx (原始)
export default function App() {
  return (
    <div/>
  );
}


+++ src/App.tsx (修改后)
import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import { Ticker, Features, Steps } from "./components/Sections";
import { Gallery, StatsBand, Comparison } from "./components/Sections2";
import { Faq, Install, Footer } from "./components/Sections3";
import { usePrefersReducedMotion } from "./hooks";

/* Ambient layered background */
function Ambient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-44 -top-44 h-[620px] w-[620px] rounded-full bg-amber/[0.07] blur-[130px]" />
      <div className="absolute -right-40 top-[26%] h-[540px] w-[540px] rounded-full bg-aqua/[0.06] blur-[130px]" />
      <div className="absolute -bottom-52 left-[22%] h-[560px] w-[560px] rounded-full bg-rose/[0.05] blur-[140px]" />
      <div className="absolute right-[18%] top-[64%] h-[300px] w-[300px] rounded-full bg-mint/[0.04] blur-[110px]" />
    </div>
  );
}

/* Back-to-top rocket */
function BackToTop() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-ink-800/90 text-mute shadow-lg backdrop-blur transition-all duration-300 hover:border-amber/50 hover:text-amber active:scale-90 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V5m0 0-5.5 5.5M12 5l5.5 5.5" />
      </svg>
    </button>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Ambient />
      <div className="noise-overlay" />
      <main className="relative z-10">
        <Hero />
        <Ticker />
        <Features />
        <Steps />
        <Gallery />
        <StatsBand />
        <Comparison />
        <Faq />
        <Install />
        <Footer />
      </main>
      <BackToTop />
    </div>
  );
}
