import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";

const siteUrl = new URL(siteConfig.siteUrl);
const defaultOgImage = "/og/default.svg";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

function toAbsoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

function toImageUrl(image?: string) {
  const resolved = image ?? defaultOgImage;

  try {
    return new URL(resolved).toString();
  } catch {
    return toAbsoluteUrl(resolved);
  }
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
}: BuildMetadataOptions): Metadata {
  const url = siteConfig.hasPublicSiteUrl ? toAbsoluteUrl(path) : undefined;
  const imageUrl = toImageUrl(image);

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    ...(url
      ? {
          alternates: {
            canonical: url,
          },
        }
      : {}),
    openGraph: {
      type: "website",
      locale: "zh_CN",
      ...(url ? { url } : {}),
      title,
      description,
      siteName: siteConfig.siteName,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
