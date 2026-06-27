import type { ReactNode } from "react";

function inlineMarkdown(value: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) parts.push(value.slice(cursor, match.index));
    const token = match[0];
    const key = `${match.index}-${token}`;
    if (token.startsWith("**")) {
      parts.push(<strong key={key} className="font-semibold text-ink-900 dark:text-white">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(<code key={key} className="rounded-md bg-slate-900/[0.05] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[0.07]">{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)]\(([^)]+)\)$/);
      const safeHref = link?.[2].match(/^(https?:\/\/|mailto:)/i) ? link[2] : undefined;
      parts.push(safeHref
        ? <a key={key} href={safeHref} target="_blank" rel="noreferrer" className="underline decoration-ink-300 underline-offset-4 hover:text-ink-950 dark:hover:text-white">{link?.[1]}</a>
        : token);
    } else {
      parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    cursor = match.index + token.length;
  }
  if (cursor < value.length) parts.push(value.slice(cursor));
  return parts;
}

function isBlockStart(line: string) {
  return /^(#{1,6})\s+/.test(line)
    || /^\s*([-*+]\s+|\d+\.\s+|>\s*)/.test(line)
    || /^\s*[-=_]{3,}\s*$/.test(line);
}

export function MarkdownReport({ children }: { children: string }) {
  const lines = children.replace(/\r/g, "").split("\n");
  const output: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const classes = level === 1
        ? "mt-10 text-2xl font-semibold tracking-[-0.025em] first:mt-0"
        : level === 2
          ? "mt-8 text-lg font-semibold"
          : "mt-6 text-base font-semibold";
      const content = inlineMarkdown(heading[2]);
      if (level === 1) output.push(<h2 key={index} className={classes}>{content}</h2>);
      else if (level === 2) output.push(<h3 key={index} className={classes}>{content}</h3>);
      else output.push(<h4 key={index} className={classes}>{content}</h4>);
      index += 1;
      continue;
    }

    if (/^[-=_]{3,}$/.test(line)) {
      output.push(<hr key={index} className="my-8 border-slate-900/[0.07] dark:border-white/[0.08]" />);
      index += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*+]\s+/, ""));
        index += 1;
      }
      output.push(<ul key={`ul-${index}`} className="my-4 space-y-2 pl-5 text-ink-600 marker:text-ink-400 dark:text-ink-300">{items.map((item, itemIndex) => <li key={`${itemIndex}-${item}`} className="list-disc pl-1">{inlineMarkdown(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }
      output.push(<ol key={`ol-${index}`} className="my-4 space-y-2 pl-5 text-ink-600 marker:font-medium marker:text-ink-500 dark:text-ink-300">{items.map((item, itemIndex) => <li key={`${itemIndex}-${item}`} className="list-decimal pl-1">{inlineMarkdown(item)}</li>)}</ol>);
      continue;
    }

    if (line.startsWith(">")) {
      output.push(<blockquote key={index} className="my-5 border-l-2 border-ink-300 pl-4 italic text-ink-500 dark:border-ink-700 dark:text-ink-400">{inlineMarkdown(line.replace(/^>\s*/, ""))}</blockquote>);
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    output.push(<p key={`p-${index}`} className="my-3 leading-7 text-ink-600 dark:text-ink-300">{inlineMarkdown(paragraph.join(" "))}</p>);
  }

  return <div className="text-sm">{output}</div>;
}
