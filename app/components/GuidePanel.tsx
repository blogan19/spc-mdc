'use client';

import Link from 'next/link';
import { ARTICLES } from '@/lib/guides/articles';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GuidePanel({ open, onClose }: Props) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close guide panel"
      />

      {/* Drawer */}
      <aside
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="SPC guides"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">SPC Guides</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="px-5 py-3 text-xs text-gray-500 border-b border-gray-100">
          Learn about SPC methodology, chart types, and how to interpret variation.
        </p>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {ARTICLES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/guides/${article.slug}`}
                  onClick={onClose}
                  className="block px-5 py-3 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 leading-snug block">
                    {article.title}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5 block leading-snug line-clamp-2">
                    {article.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Following NHS Making Data Count methodology.
          </p>
        </div>
      </aside>
    </div>
  );
}
