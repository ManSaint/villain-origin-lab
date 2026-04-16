"use client";

import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase cursor-pointer hover:opacity-70 transition-opacity"
    >
      {copied ? "✓ Copied" : "Share"}
    </button>
  );
}
