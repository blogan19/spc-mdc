import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ARTICLES, getArticle } from '@/lib/guides/articles';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | SPC MDC`,
    description: article.description,
  };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default function GuidePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            ← Back to SPC tool
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">SPC Guides</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <article>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </h1>
          <p className="text-base text-gray-600 mb-8 leading-relaxed border-l-4 border-indigo-200 pl-4">
            {article.description}
          </p>

          <div
            className="prose prose-gray max-w-none
              prose-headings:font-semibold prose-headings:text-gray-900
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-gray-700 prose-ul:mb-4 prose-li:mb-1
              prose-ol:text-gray-700 prose-ol:mb-4
              prose-strong:text-gray-900
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:pb-2 prose-td:py-1 prose-td:pr-4"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </article>

        <nav className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-4">More SPC guides</p>
          <ul className="space-y-2">
            {ARTICLES.filter((a) => a.slug !== params.slug).map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/guides/${a.slug}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
