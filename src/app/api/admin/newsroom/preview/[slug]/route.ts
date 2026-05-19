import { NextResponse } from "next/server";

import { getSourceIngestionLabel, officialSourceCatalog } from "@/lib/source-catalog";
import { scrapeSourceForDailyNews } from "@/lib/scrape";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, context: RouteContext<"/api/admin/newsroom/preview/[slug]">) {
  const { slug } = await context.params;
  const source = officialSourceCatalog.find((item) => item.slug === slug);

  if (!source) {
    return NextResponse.json({ message: "未找到这个官方来源" }, { status: 404 });
  }

  if (source.active === false) {
    return NextResponse.json({ message: "这个来源当前已停用，不能试抓" }, { status: 409 });
  }

  try {
    const scraped = await scrapeSourceForDailyNews(source);
    const supabase = createSupabaseAdminClient();
    let recentCandidate:
      | {
          slug: string;
          title: string;
          reviewStatus: string | null;
          publishedAt: string | null;
          createdAt: string;
        }
      | null = null;

    if (supabase) {
      const { data } = await supabase
        .from("news_posts")
        .select("slug,title,review_status,published_at,created_at")
        .eq("source_url", scraped.url)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        recentCandidate = {
          slug: data.slug,
          title: data.title,
          reviewStatus: data.review_status,
          publishedAt: data.published_at,
          createdAt: data.created_at,
        };
      }
    }

    return NextResponse.json({
      ok: true,
      slug: source.slug,
      label: source.label,
      ingestionLabel: getSourceIngestionLabel(source),
      feedUrl: source.ingestion?.feedUrl ?? source.profileUrl,
      latest: {
        title: scraped.title,
        url: scraped.url,
        excerpt: scraped.excerpt,
        sourceCompany: scraped.sourceCompany ?? source.company,
        sourceHandle: scraped.sourceHandle ?? source.handle,
        sourceLabel: scraped.sourceLabel ?? source.label,
      },
      recentCandidate,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "试抓失败" },
      { status: 500 },
    );
  }
}
