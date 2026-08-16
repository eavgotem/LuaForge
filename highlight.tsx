--- src/highlight.tsx (原始)


+++ src/highlight.tsx (修改后)
import { memo, useMemo } from "react";

type TokType = "cm" | "st" | "nu" | "kw" | "bi" | "fn" | "pn" | "tx";
interface Tok {
  t: TokType;
  s: string;
}

const KEYWORDS = new Set([
  "local", "function", "end", "if", "then", "else", "elseif", "for", "in", "do",
  "while", "repeat", "until", "return", "break", "continue", "and", "or", "not",
  "true", "false", "nil", "export", "type",
]);

const BUILTINS = new Set([
  "game", "workspace", "script", "plugin", "Instance", "Enum", "task", "math",
  "table", "string", "os", "typeof", "pairs", "ipairs", "next", "tostring",
  "tonumber", "require", "pcall", "print", "warn", "error", "select",
  "Vector3", "Vector2", "CFrame", "Color3", "UDim2", "UDim", "TweenInfo",
  "NumberRange", "NumberSequence", "ColorSequence", "Ray", "RaycastParams",
  "Players", "ReplicatedStorage", "ServerScriptService", "StarterPlayer",
  "StarterGui", "StarterPlayerScripts", "Lighting", "RunService",
  "UserInputService", "TweenService", "DataStoreService", "HttpService",
  "Selection", "ChangeHistoryService", "DockWidgetPluginGuiInfo", "TextButton",
  "TextBox", "TextLabel", "ScrollingFrame", "Frame",
]);

const RE =
  /(--\[\[[\s\S]*?\]\]|--[^\n]*)|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+)/g;

function prevNonWs(src: string, index: number): string {
  for (let i = index - 1; i >= 0; i--) {
    const c = src[i];
    if (c !== " " && c !== "\t" && c !== "\n") return c;
  }
  return "";
}

export function tokenize(code: string): Tok[] {
  const toks: Tok[] = [];
  RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(code))) {
    if (m[1]) toks.push({ t: "cm", s: m[1] });
    else if (m[2]) toks.push({ t: "st", s: m[2] });
    else if (m[3]) toks.push({ t: "nu", s: m[3] });
    else if (m[4]) {
      const w = m[4];
      const next = code[RE.lastIndex];
      const prev = prevNonWs(code, m.index);
      if (KEYWORDS.has(w)) toks.push({ t: "kw", s: w });
      else if (BUILTINS.has(w)) toks.push({ t: "bi", s: w });
      else if (next === "(" || prev === ":" || prev === ".") toks.push({ t: "fn", s: w });
      else toks.push({ t: "tx", s: w });
    } else if (m[5]) toks.push({ t: "tx", s: m[5] });
    else if (m[6]) toks.push({ t: "pn", s: m[6] });
  }
  return toks;
}

const COLOR: Record<TokType, string> = {
  cm: "text-scm italic",
  st: "text-sstr",
  nu: "text-snum",
  kw: "text-skw",
  bi: "text-sbi",
  fn: "text-sfn",
  pn: "text-spn",
  tx: "text-stx",
};

interface CodeBlockProps {
  code: string;
  lineNumbers?: boolean;
  className?: string;
  cursor?: boolean;
  textClass?: string;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  lineNumbers = true,
  className = "",
  cursor = false,
  textClass = "text-[12px]",
}: CodeBlockProps) {
  const lines = useMemo(() => {
    const toks = tokenize(code);
    const out: Tok[][] = [[]];
    for (const tok of toks) {
      const parts = tok.s.split("\n");
      parts.forEach((p, i) => {
        if (i > 0) out.push([]);
        if (p.length) out[out.length - 1].push({ t: tok.t, s: p });
      });
    }
    return out;
  }, [code]);

  return (
    <div className={`code-scroll overflow-auto ${className}`}>
      <pre className={`font-mono ${textClass} leading-[1.75]`}>
        {lines.map((toks, i) => (
          <div key={i} className="flex min-w-max md:min-w-0">
            {lineNumbers && (
              <span className="w-9 shrink-0 select-none pr-4 text-right text-[10px] leading-[1.75] text-dim/70 pt-[2px]">
                {i + 1}
              </span>
            )}
            <code className="whitespace-pre pr-4">
              {toks.map((tok, j) => (
                <span key={j} className={COLOR[tok.t]}>
                  {tok.s}
                </span>
              ))}
              {cursor && i === lines.length - 1 && (
                <span className="cursor-block -ml-0.5 text-amber">▍</span>
              )}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
});
