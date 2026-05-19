import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import * as cheerio from "cheerio";

import type { SourceCatalogItem } from "@/lib/source-catalog";
import { deriveSourceMetadata } from "@/lib/source-metadata";

const execFileAsync = promisify(execFile);

export type ScrapedContent = {
  url: string;
  title: string;
  text: string;
  excerpt: string;
  sourceCompany?: string | null;
  sourceHandle?: string | null;
  sourceLabel?: string | null;
};

export async function scrapeSourceForDailyNews(source: SourceCatalogItem): Promise<ScrapedContent> {
  if (source.ingestion?.mode === "gmmtv-news" && source.ingestion.feedUrl) {
    return scrapeGmmtvNewsFeed(source);
  }
  if (source.ingestion?.mode === "change2561-activity" && source.ingestion.feedUrl) {
    return scrapeChange2561ActivityFeed(source);
  }
  if (source.ingestion?.mode === "youtube-videos" && source.ingestion.feedUrl) {
    return scrapeYoutubeVideosFeed(source);
  }
  if (source.ingestion?.mode === "facebook-posts" && source.ingestion.feedUrl) {
    return scrapeFacebookPostsFeed(source);
  }

  return scrapeWebPage(source.profileUrl);
}

export async function scrapeWebPage(url: string): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe").remove();

  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    "Untitled";

  const mainText =
    $("main").text().trim() ||
    $("article").text().trim() ||
    $("body").text().trim();

  const normalized = mainText.replace(/\s+/g, " ").trim();
  const sourceMeta = deriveSourceMetadata(url, `${title}\n${normalized}`);

  return {
    url,
    title,
    text: normalized.slice(0, 12000),
    excerpt: normalized.slice(0, 280),
    sourceCompany: sourceMeta.sourceCompany,
    sourceHandle: sourceMeta.sourceHandle,
    sourceLabel: sourceMeta.sourceLabel,
  };
}

async function scrapeGmmtvNewsFeed(source: SourceCatalogItem): Promise<ScrapedContent> {
  const feedUrl = source.ingestion?.feedUrl;
  if (!feedUrl) {
    throw new Error("GMMTV 来源未配置官网 news feed");
  }

  const feedMarkdown = await scrapeWithScrapling(feedUrl);
  const latestRelativeLink = extractLatestGmmtvNewsLink(feedMarkdown);

  if (!latestRelativeLink) {
    throw new Error("未能从 GMMTV news 列表中找到最新详情链接");
  }

  const detailUrl = resolveGmmtvNewsUrl(feedUrl, latestRelativeLink);
  const detailMarkdown = await scrapeWithScrapling(detailUrl);
  return parseGmmtvNewsDetail(detailUrl, detailMarkdown);
}

async function scrapeChange2561ActivityFeed(source: SourceCatalogItem): Promise<ScrapedContent> {
  const feedUrl = source.ingestion?.feedUrl;
  if (!feedUrl) {
    throw new Error("CHANGE2561 来源未配置活动 feed");
  }

  const feedMarkdown = await scrapeWithScrapling(feedUrl);
  const detailUrl = extractChange2561ActivityLink(feedMarkdown);

  if (!detailUrl) {
    throw new Error("未能从 CHANGE2561 活动列表中找到最新详情链接");
  }

  const detailMarkdown = await scrapeWithScrapling(detailUrl);
  return parseChange2561ActivityDetail(detailUrl, detailMarkdown);
}

async function scrapeYoutubeVideosFeed(source: SourceCatalogItem): Promise<ScrapedContent> {
  const feedUrl = source.ingestion?.feedUrl;
  if (!feedUrl) {
    throw new Error("YouTube 来源未配置视频 feed");
  }

  const feedMarkdown = await scrapeWithScrapling(feedUrl);
  return parseYoutubeVideosFeed(feedUrl, feedMarkdown);
}

async function scrapeFacebookPostsFeed(source: SourceCatalogItem): Promise<ScrapedContent> {
  const feedUrl = source.ingestion?.feedUrl;
  if (!feedUrl) {
    throw new Error("Facebook 来源未配置页面入口");
  }

  const feedMarkdown = await scrapeWithScrapling(feedUrl);
  return parseFacebookPostsFeed(feedUrl, feedMarkdown);
}

async function scrapeWithScrapling(url: string) {
  const tempDir = await mkdtemp(join(tmpdir(), "taifan-scrapling-"));
  const outputPath = join(tempDir, "page.md");

  try {
    await execFileAsync(resolveScraplingBinary(), [
      "extract",
      "stealthy-fetch",
      url,
      outputPath,
      "--ai-targeted",
      "--timeout",
      "45000",
      "--wait",
      "3000",
      "--solve-cloudflare",
    ]);

    return await readFile(outputPath, "utf8");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function resolveScraplingBinary() {
  return process.env.SCRAPLING_BIN || join(process.cwd(), ".venv-scrapling/bin/scrapling");
}

function extractLatestGmmtvNewsLink(markdown: string) {
  const lines = markdown.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]?.match(/\]\((\.\/news\/\d+\/)\)/);
    if (!match) continue;

    return match[1];
  }

  return null;
}

function extractChange2561ActivityLink(markdown: string) {
  const match = markdown.match(/\]\((https:\/\/www\.change2561\.com\/activity\/title\/\d+)\)\s*\n\[VIEW\]\(\1\)/);
  return match?.[1] ?? null;
}

function resolveGmmtvNewsUrl(feedUrl: string, relativeLink: string) {
  const feedRoot = new URL(feedUrl).origin;
  const normalizedPath = relativeLink.replace(/^\.\//, "/");
  return new URL(normalizedPath, feedRoot).toString();
}

function parseYoutubeVideosFeed(url: string, markdown: string): ScrapedContent {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const latestIndex = lines.findIndex((line) => line === "Latest");
  const videoLineStart = latestIndex >= 0 ? latestIndex + 3 : 0;
  const titleLine = lines
    .slice(videoLineStart)
    .find((line) => line.startsWith("### [") && line.includes("](/watch?v="));

  if (!titleLine) {
    throw new Error("未能从 YouTube 视频列表中找到最新公开视频");
  }

  const match = titleLine.match(/^### \[(.+?)\]\((\/watch\?v=[^)]+)\)/);
  if (!match) {
    throw new Error("YouTube 最新视频标题解析失败");
  }

  const [, rawTitle, relativeUrl] = match;
  const title = rawTitle.trim();
  const detailUrl = new URL(relativeUrl, "https://www.youtube.com").toString();
  const titleIndex = lines.indexOf(titleLine);
  const metaLine = lines[titleIndex + 1] ?? "";
  const bodyText = [
    `${title}`,
    metaLine,
    `This candidate is based on the latest official public video from ${detailUrl}.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const sourceMeta = deriveSourceMetadata(url, `${title}\n${bodyText}`);

  return {
    url: detailUrl,
    title,
    text: bodyText,
    excerpt: bodyText.slice(0, 280),
    sourceCompany: sourceMeta.sourceCompany,
    sourceHandle: sourceMeta.sourceHandle,
    sourceLabel: sourceMeta.sourceLabel,
  };
}

function parseGmmtvNewsDetail(url: string, markdown: string): ScrapedContent {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const headingLine = lines.find((line) => line.startsWith("### "));
  const title = headingLine?.replace(/^###\s+/, "").trim() || "GMMTV Official Update";
  const headingIndex = headingLine ? lines.indexOf(headingLine) : -1;

  const textLines = lines
    .slice(Math.max(headingIndex, 0) + 1)
    .filter(
      (line) =>
        !line.startsWith("![](") &&
        !line.startsWith("[![](") &&
        !line.startsWith("* [") &&
        !line.startsWith("‹›") &&
        !line.startsWith("@2020 GMMTV") &&
        !line.includes("COOKIE POLICY") &&
        !line.includes("PRIVACY POLICY") &&
        !line.includes("TERMS OF SERVICE"),
    );

  const text = textLines.join("\n\n").replace(/\s+\n/g, "\n").trim();
  const sourceMeta = deriveSourceMetadata(url, `${title}\n${text}`);

  return {
    url,
    title,
    text: text.slice(0, 12000),
    excerpt: text.slice(0, 280),
    sourceCompany: sourceMeta.sourceCompany,
    sourceHandle: sourceMeta.sourceHandle,
    sourceLabel: sourceMeta.sourceLabel,
  };
}

function parseFacebookPostsFeed(url: string, markdown: string): ScrapedContent {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const introIndex = lines.findIndex((line) => line === "Intro");
  const postsIndex = lines.findIndex((line) => line === "Posts");
  const searchStart = postsIndex >= 0 ? postsIndex : Math.max(introIndex, 0);

  const timeIndex = lines.findIndex(
    (line, index) => index > searchStart && /^\[(\d+[hdw]|\d+\s*hr|\d+\s*day|\d+\s*days)\]/i.test(line),
  );

  if (timeIndex < 0) {
    throw new Error("未能从 Facebook 页面中找到最新公开贴文");
  }

  const contentLines = lines
    .slice(timeIndex + 1)
    .filter(
      (line) =>
        !line.startsWith("![](") &&
        !line.startsWith("[![](") &&
        !line.startsWith("* ") &&
        line !== "See more" &&
        !line.startsWith("Privacy") &&
        !line.startsWith("Terms") &&
        !line.startsWith("Advertising") &&
        !line.startsWith("Cookies") &&
        !line.startsWith("Like") &&
        !line.startsWith("Comment") &&
        !line.startsWith("View more comments"),
    );

  const cutIndex = contentLines.findIndex(
    (line) =>
      line.startsWith("All reactions") ||
      line.startsWith("Like") ||
      line.startsWith("Comment") ||
      line.startsWith("View more comments"),
  );
  const editorialLines = (cutIndex >= 0 ? contentLines.slice(0, cutIndex) : contentLines).filter(
    (line) => !/^\d+$/.test(line),
  );

  const title = editorialLines.slice(0, 3).join(" ").replace(/\s+/g, " ").trim() || "Studio Wabi Sabi Official Update";
  const postUrlMatch = markdown.match(/\]\((https:\/\/www\.facebook\.com\/photo\/\?fbid=[^)]+)\)/);
  const postUrl = postUrlMatch?.[1] ?? url;
  const excerpt = editorialLines.slice(0, 8).join(" ").replace(/\s+/g, " ").trim();
  const text = editorialLines.join("\n\n").trim();
  const sourceMeta = deriveSourceMetadata(url, `${title}\n${text}`);

  return {
    url: postUrl,
    title,
    text: text.slice(0, 12000),
    excerpt: excerpt.slice(0, 280),
    sourceCompany: sourceMeta.sourceCompany,
    sourceHandle: sourceMeta.sourceHandle,
    sourceLabel: sourceMeta.sourceLabel,
  };
}

function parseChange2561ActivityDetail(url: string, markdown: string): ScrapedContent {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const titleIndex = lines.findIndex((line, index) => {
    const nextLine = lines[index + 1];
    return !!line && nextLine?.match(/^=+$/);
  });
  const title = (titleIndex >= 0 ? lines[titleIndex] : "").trim() || "CHANGE ARTIST Official Update";
  const contentStartIndex = titleIndex >= 0 ? titleIndex + 2 : 0;

  const textLines = lines
    .slice(contentStartIndex)
    .filter(
      (line) =>
        !line.startsWith("![](") &&
        !line.startsWith("[![](") &&
        !line.startsWith("* [") &&
        !line.startsWith("[ละคร และ ซีรีส์]") &&
        !line.startsWith("[พอดแคสต์]") &&
        !line.startsWith("[เกี่ยวกับเรา]") &&
        !line.startsWith("**ติดต่อมาร์เก็ตติ้ง**") &&
        !line.startsWith("**ติดต่อฝ่ายขาย**") &&
        !line.startsWith("02-") &&
        !line.startsWith("081-") &&
        !line.startsWith("Share this page") &&
        !line.startsWith("#### Photos") &&
        !line.match(/^\d+\/\d+$/) &&
        !line.startsWith("❮ ❯") &&
        !line.startsWith("FOLLOW ME") &&
        !line.startsWith("FOLLOW ME") &&
        !line.startsWith("เว็บไซต์นี้ใช้คุกกี้") &&
        !line.startsWith("Change2561 ใช้คุกกี้") &&
        !line.includes("COOKIE POLICY") &&
        !line.includes("PRIVACY POLICY") &&
        !line.includes("ยอมรับทั้งหมด") &&
        !line.includes("การตั้งค่าความเป็นส่วนตัว") &&
        !line.includes("คุกกี้ประเภทที่มีความจำเป็นอย่างยิ่ง") &&
        !line.includes("คุกกี้เพื่อการวิเคราะห์") &&
        !line.includes("คุกกี้เพื่อการทำงานของเว็บไซต์") &&
        !line.includes("คุกกี้เพื่อปรับเนื้อหาเข้ากับกลุ่มเป้าหมาย") &&
        !line.includes("คุกกี้เพื่อการโฆษณา"),
    );

  const text = textLines.join("\n\n").replace(/\s+\n/g, "\n").trim();
  const sourceMeta = deriveSourceMetadata(url, `${title}\n${text}`);

  return {
    url,
    title,
    text: text.slice(0, 12000),
    excerpt: text.slice(0, 280),
    sourceCompany: sourceMeta.sourceCompany,
    sourceHandle: sourceMeta.sourceHandle,
    sourceLabel: sourceMeta.sourceLabel,
  };
}
