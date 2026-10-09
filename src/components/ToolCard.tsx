import Link from "next/link";
import type { ToolDefinition } from "@/lib/site-config";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={tool.path}
      className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <h2 className="font-mono text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
        {tool.name}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{tool.shortDescription}</p>
    </Link>
  );
}
