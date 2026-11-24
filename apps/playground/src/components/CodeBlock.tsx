import { useEffect, useRef, useState } from "react";

interface CodeBlockProps {
  code: string;
  label?: string;
  className?: string;
}

export function CodeBlock({ code, label = "tsx", className }: CodeBlockProps) {
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
        <span className="pg-code-lang">{label}</span>
        <button className="pg-code-copy" type="button" onClick={copy}>
          {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
