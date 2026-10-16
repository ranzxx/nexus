"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import type { ComponentPropsWithoutRef } from "react";

interface MarkdownRendererProps {
  content: string;
}

type CodeProps = ComponentPropsWithoutRef<"code">;

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className, ...rest }: CodeProps) {
            const text = String(children);
            const match = /language-(\w+)/.exec(className || "");
            const isBlock = Boolean(match) || text.includes("\n");

            if (!isBlock) {
              return (
                <code
                  className="border border-border dark:border-[#27272A] bg-muted dark:bg-[#18181B] px-1.5 py-0.5 font-mono text-[13px] text-foreground dark:text-[#E5E1E4]"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match?.[1] ?? "text"}
                value={text.replace(/\n$/, "")}
              />
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto border border-border dark:border-[#27272A]">
                <table className="min-w-full divide-y divide-border dark:divide-[#27272A] text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-muted dark:bg-[#18181B]">{children}</thead>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left font-semibold text-foreground dark:text-[#E5E1E4]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-t border-border dark:border-[#27272A] px-4 py-3 text-muted-foreground dark:text-[#C2C6D6]">
                {children}
              </td>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-foreground dark:text-[#FAFAFA] underline underline-offset-4 hover:no-underline"
                target="_blank"
                rel="noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
