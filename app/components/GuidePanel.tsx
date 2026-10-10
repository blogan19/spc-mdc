'use client';

import { useState } from 'react';
import { ARTICLES, type GuideArticle } from '@/lib/guides/articles';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GuidePanel({ open, onClose }: Props) {
  const [selected, setSelected] = useState<GuideArticle | null>(null);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Drawer */}
      <aside
        className={`absolute top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 shrink-0">
          {selected ? (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All guides
            </button>
          ) : (
            <h2 className="text-sm font-semibold text-white">SPC Guides</h2>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {selected ? (
          /* Article detail */
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-5">
              <h1 className="text-base font-bold text-white leading-snug mb-2">
                {selected.title}
              </h1>
              <p className="text-xs text-indigo-300 mb-5 leading-relaxed border-l-2 border-indigo-500 pl-3">
                {selected.description}
              </p>
              <div
                className="text-sm text-slate-300 leading-relaxed
                  [&_h2]:text-white [&_h2]:font-semibold [&_h2]:text-sm [&_h2]:mt-5 [&_h2]:mb-2
                  [&_p]:mb-3
                  [&_ul]:mb-3 [&_ul]:pl-4 [&_li]:mb-1 [&_li]:list-disc
                  [&_ol]:mb-3 [&_ol]:pl-4 [&_ol_li]:list-decimal
                  [&_strong]:text-white [&_strong]:font-medium
                  [&_em]:italic [&_em]:text-slate-400
                  [&_a]:text-indigo-400 [&_a:hover]:text-indigo-300
                  [&_table]:text-xs [&_table]:w-full [&_table]:mb-3
                  [&_th]:text-left [&_th]:text-slate-400 [&_th]:pb-1 [&_th]:font-medium [&_th]:border-b [&_th]:border-slate-700
                  [&_td]:py-1 [&_td]:pr-4 [&_td]:text-slate-300 [&_td]:border-b [&_td]:border-slate-800"
                dangerouslySetInnerHTML={{ __html: selected.body }}
              />
            </div>
          </div>
        ) : (
          /* Article list */
          <>
            <p className="px-5 py-3 text-xs text-slate-500 border-b border-slate-800 shrink-0">
              Following NHS Making Data Count methodology.
            </p>
            <nav className="flex-1 overflow-y-auto py-1">
              <ul>
                {ARTICLES.map((article) => (
                  <li key={article.slug}>
                    <button
                      type="button"
                      onClick={() => setSelected(article)}
                      className="w-full text-left px-5 py-3.5 hover:bg-slate-800 transition-colors group border-b border-slate-800/50"
                    >
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug block">
                        {article.title}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block leading-snug line-clamp-2">
                        {article.description}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </aside>
    </div>
  );
}
