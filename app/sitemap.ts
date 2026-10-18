import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/guides/articles';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spcmdc.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${siteUrl}/guides/${article.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...guideRoutes];
}
