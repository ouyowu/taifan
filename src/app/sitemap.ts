import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { listEvents, listNews, listStars } from "@/lib/data";

function toAbsoluteImageUrl(imageUrl?: string) {
  if (!imageUrl) return undefined;

  try {
    return new URL(imageUrl).toString();
  } catch {
    return new URL(imageUrl, siteConfig.siteUrl).toString();
  }
}

function toSafeLastModified(value?: string | Date) {
  const now = new Date();
  if (!value) return now;

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return now;

  return parsed.getTime() > now.getTime() ? now : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stars, events, newsItems] = await Promise.all([listStars(), listEvents(), listNews()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified: toSafeLastModified(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/news`,
      lastModified: toSafeLastModified(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteConfig.siteUrl}/calendar`,
      lastModified: toSafeLastModified(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/services`,
      lastModified: toSafeLastModified(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${siteConfig.siteUrl}/guides`,
      lastModified: toSafeLastModified(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => {
    const leadStar = stars.find((star) => item.relatedStars.includes(star.slug));
    const imageUrl = toAbsoluteImageUrl(leadStar?.coverUrl);
    return {
      url: `${siteConfig.siteUrl}/news/${item.slug}`,
      lastModified: toSafeLastModified(item.publishedAt),
      changeFrequency: "daily",
      priority: 0.88,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    };
  });

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => {
    const leadStar = stars.find((star) => event.starSlugs.includes(star.slug));
    const imageUrl = toAbsoluteImageUrl(leadStar?.coverUrl);
    return {
      url: `${siteConfig.siteUrl}/events/${event.slug}`,
      lastModified: toSafeLastModified(event.startsAt),
      changeFrequency: "weekly",
      priority: 0.84,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    };
  });

  const starRoutes: MetadataRoute.Sitemap = stars.map((star) => {
    const imageUrl = toAbsoluteImageUrl(star.coverUrl);

    return {
      url: `${siteConfig.siteUrl}/stars/${star.slug}`,
      lastModified: toSafeLastModified(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    };
  });

  return [...staticRoutes, ...newsRoutes, ...eventRoutes, ...starRoutes];
}
