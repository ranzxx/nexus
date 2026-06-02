'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import type { ComponentPropsWithoutRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  node?: unknown;
  inline?: boolean;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className, node, inline, ...rest }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');

            if (!match) {
              return (
                <code className="bg-[#18181b] text-[#c6c6cf] px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-[#27272a]" {...rest}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
              />
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 border border-[#27272a] rounded-lg">
                <table className="min-w-full divide-y divide-[#27272a] text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[#18181b]">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-3 text-left font-semibold text-[#e5e1e4]">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 text-[#c2c6d6] border-t border-[#27272a]">{children}</td>;
          },
          a({ href, children }) {
            return <a href={href} className="text-[#3b82f6] hover:underline" target="_blank" rel="noreferrer">{children}</a>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
