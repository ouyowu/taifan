import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { listEvents, listNews, listStars } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stars, events, newsItems] = await Promise.all([listStars(), listEvents(), listNews()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteConfig.siteUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${siteConfig.siteUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => {
    const leadStar = stars.find((star) => item.relatedStars.includes(star.slug));
    return {
      url: `${siteConfig.siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "daily",
      priority: 0.88,
      ...(leadStar?.coverUrl ? { images: [leadStar.coverUrl] } : {}),
    };
  });

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => {
    const leadStar = stars.find((star) => event.starSlugs.includes(star.slug));
    return {
      url: `${siteConfig.siteUrl}/events/${event.slug}`,
      lastModified: new Date(event.startsAt),
      changeFrequency: "weekly",
      priority: 0.84,
      ...(leadStar?.coverUrl ? { images: [leadStar.coverUrl] } : {}),
    };
  });

  const starRoutes: MetadataRoute.Sitemap = stars.map((star) => ({
    url: `${siteConfig.siteUrl}/stars/${star.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    ...(star.coverUrl ? { images: [star.coverUrl] } : {}),
  }));

  return [...staticRoutes, ...newsRoutes, ...eventRoutes, ...starRoutes];
}
