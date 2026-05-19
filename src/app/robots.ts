import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    ...(siteConfig.hasPublicSiteUrl
      ? {
          sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
          host: siteConfig.siteUrl,
        }
      : {}),
  };
}
