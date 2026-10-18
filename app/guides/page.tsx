import Link from 'next/link';
import type { Metadata } from 'next';
import { ARTICLES } from '@/lib/guides/articles';

export const metadata: Metadata = {
  title: 'SPC Guides — Making Data Count',
  description:
    'Free guides to statistical process control for healthcare and improvement teams — XmR charts, run charts, attribute charts, the four variation rules, and more.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'SPC Guides — Making Data Count',
    description:
      'Free guides to statistical process control for healthcare and improvement teams — XmR charts, run charts, attribute charts, the four variation rules, and more.',
    type: 'website',
    url: '/guides',
  },
};

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            ← Back to SPC tool
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SPC Guides</h1>
        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Practical guides to statistical process control following Making Data Count methodology.
          Learn how to build and interpret SPC charts for healthcare and improvement work.
        </p>

        <ul className="space-y-4">
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/guides/${article.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <h2 className="text-base font-semibold text-indigo-700 mb-1">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
