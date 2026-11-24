import { useEffect, useRef, useState } from "react";
import type { Locale } from "afghanistan-province-chart";
import { SHOWCASE_MESSAGES } from "../i18n.js";

interface CodeBlockProps {
  code: string;
  label?: string;
  className?: string;
  locale: Locale;
}

export function CodeBlock({ code, label = "tsx", className, locale }: CodeBlockProps) {
  const t = SHOWCASE_MESSAGES[locale].code;
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <div className={["pg-code", className].filter(Boolean).join(" ")}>
      <div className="pg-code-bar">
        <span className="pg-code-lang" dir="ltr">
          {label}
        </span>
        <button className="pg-code-copy" type="button" onClick={copy}>
          {status === "copied" ? t.copied : status === "failed" ? t.failed : t.copy}
        </button>
      </div>
      <pre dir="ltr" lang="en">
        <code>{code}</code>
      </pre>
    </div>
  );
}
