--- src/icons.tsx (原始)


+++ src/icons.tsx (修改后)
import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: P, children: ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* Brand mark: a studded brick being struck by a spark */
export function LogoMark({ size = 28, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" {...rest}>
      <rect x="3.5" y="9" width="25" height="19" rx="3" stroke="#FFB454" strokeWidth="2.2" />
      <rect x="8" y="4.5" width="6" height="5" rx="1.5" stroke="#FFB454" strokeWidth="2.2" />
      <rect x="18" y="4.5" width="6" height="5" rx="1.5" stroke="#FFB454" strokeWidth="2.2" />
      <path d="M18.5 12.5 13 20h4l-2.5 6L21 17.5h-4.5l2-5Z" fill="#48D597" stroke="#48D597" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export const Spark = (p: P) =>
  base(p, <path d="M12 3.5 13.8 10 20.5 12 13.8 14 12 20.5 10.2 14 3.5 12 10.2 10 12 3.5Z" fill="currentColor" stroke="none" />);

export const Bolt = (p: P) => base(p, <path d="M13 2.5 5 13.5h5.5L11 21.5l8-11h-5.5L13 2.5Z" />);

export const CheckCircle = (p: P) =>
  base(p, <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.4 2.4 4.8-5" /></>);

export const CrossCircle = (p: P) =>
  base(p, <><circle cx="12" cy="12" r="8.5" /><path d="m9 9 6 6M15 9l-6 6" /></>);

export const HalfCircle = (p: P) =>
  base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M7.5 12h9" /></>);

export const ArrowRight = (p: P) => base(p, <path d="M4 12h15m-6-6.5L19.5 12 13 18.5" />);

export const CopyIcon = (p: P) =>
  base(p, <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1" transform="translate(1,1)" /></>);

export const DownloadIcon = (p: P) =>
  base(p, <><path d="M12 3.5v11m0 0 4.2-4.2M12 14.5 7.8 10.3" /><path d="M4 16.5v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>);

export const ChevronDown = (p: P) => base(p, <path d="m5.5 9 6.5 6.5L18.5 9" />);

export const Terminal = (p: P) =>
  base(p, <><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="m7 9.5 3.5 3L7 15.5M12.5 15.5H17" /></>);

export const GlobeOff = (p: P) =>
  base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c-2.8 2.6-4 5.4-4 8.5s1.2 5.9 4 8.5c2.8-2.6 4-5.4 4-8.5s-1.2-5.9-4-8.5Z" /><path d="m4.5 4.5 15 15" /></>);

export const KeyX = (p: P) =>
  base(p, <><circle cx="8" cy="14.5" r="4.5" /><path d="m11.5 11 8-8M17 6l2.5 2.5M14.5 8.5 17 11" /></>);

export const ClockFast = (p: P) =>
  base(p, <><circle cx="13" cy="12" r="8" /><path d="M13 7.5V12l3 2M2.5 8.5h4M2.5 12h3" /></>);

export const PinDock = (p: P) =>
  base(p, <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 9h18M15 9v11" /></>);

export const InfinityZero = (p: P) =>
  base(p, <><path d="M8 15.5c-2 0-3.5-1.6-3.5-3.5S6 8.5 8 8.5c3.5 0 4.5 7 8 7 2 0 3.5-1.6 3.5-3.5S18 8.5 16 8.5c-1.6 0-2.8 1.3-3.5 2.6" /><path d="m4 4 16 16" /></>);

/* ------- feature icons ------- */
const FeaturePaths: Record<string, ReactNode> = {
  datamodel: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1.2" />
      <rect x="3" y="15.5" width="6" height="5" rx="1.2" />
      <rect x="15" y="15.5" width="6" height="5" rx="1.2" />
      <path d="M12 8v4m0 0H6v3.5m6-3.5h6v3.5" />
    </>
  ),
  insert: (
    <>
      <path d="M4 13.5v4a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 17.5v-4" />
      <path d="M12 3.5v10m0 0 3.8-3.8M12 13.5 8.2 9.7" />
    </>
  ),
  fix: (
    <>
      <path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 1 0 2.8 2.9l5.6-5.5a4.5 4.5 0 0 0 5.6-6L14 12l-2-2 2.5-3.5Z" />
      <path d="M19 3v3m1.5-1.5h-3" />
    </>
  ),
  strict: (
    <>
      <path d="M12 3 5 5.8v5.4c0 4.4 3 7.9 7 9.3 4-1.4 7-4.9 7-9.3V5.8L12 3Z" />
      <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
    </>
  ),
  idioms: (
    <>
      <path d="m12 3.5 8 4-8 4-8-4 8-4Z" />
      <path d="m4.5 12 7.5 3.7 7.5-3.7" />
      <path d="m4.5 16 7.5 3.7L19.5 16" />
    </>
  ),
  convert: (
    <>
      <path d="M4 8.5h13m0 0-3.2-3.2M17 8.5l-3.2 3.2" />
      <path d="M20 15.5H7m0 0 3.2-3.2M7 15.5l3.2 3.2" />
    </>
  ),
  zero: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.2 15.5c-1.7-3.6.4-7 2.8-7s4.5 3.4 2.8 7c-1 2.1-4.6 2.1-5.6 0Z" />
      <path d="m5 5 14 14" />
    </>
  ),
};

export function FeatureIcon({ name, size = 22, ...rest }: P & { name: string }) {
  return base({ size, ...rest }, FeaturePaths[name] ?? FeaturePaths.zero);
}

export function MarkCell({ mark, size = 18 }: { mark: "yes" | "no" | "part"; size?: number }) {
  if (mark === "yes") return <span className="text-mint"><CheckCircle size={size} /></span>;
  if (mark === "no") return <span className="text-rose/80"><CrossCircle size={size} /></span>;
  return <span className="text-amber/80"><HalfCircle size={size} /></span>;
}
