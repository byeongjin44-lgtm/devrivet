"use client";

import { useState } from "react";

type CopyButtonProps = {
  getText: () => string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function CopyButton({ getText, label = "Copy", className = "", disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={copied ? "Copied to clipboard" : label}
      className={`inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${className}`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
