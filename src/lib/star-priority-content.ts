import type { Event, NewsItem, Star } from "@/types/domain";

type StarPriorityContext = {
  stars: Star[];
  events: Event[];
  newsItems: NewsItem[];
};

function getTopStar(stars: Star[]) {
  return stars[0] ?? null;
}

function getTopThree(stars: Star[]) {
  return stars.slice(0, 3);
}

function getEventCount(events: Event[], slug: string) {
  return events.filter((event) => event.starSlugs.includes(slug)).length;
}

function getNewsCount(newsItems: NewsItem[], slug: string) {
  return newsItems.filter((item) => item.relatedStars.includes(slug)).length;
}

function getFocus(star: Star) {
  return star.tags.slice(0, 2).join("、") || "持续追踪";
}

export function buildStarPriorityListJson(stars: Star[]) {
  return JSON.stringify(
    stars.map((star, index) => ({
      rank: star.chinaFanPriority ?? index + 1,
      nameCn: star.nameCn,
      nameEn: star.nameEn,
      agency: star.agency,
      tags: star.tags,
      slug: star.slug,
    })),
    null,
    2,
  );
}

export function buildStarPriorityPlainText(stars: Star[]) {
  return stars
    .map(
      (star, index) =>
        `TOP ${star.chinaFanPriority ?? index + 1}\t${star.nameCn}\t${star.nameEn}\t${star.agency}\t${star.slug}`,
    )
    .join("\n");
}

export function buildTopThreeBrief({ stars, events, newsItems }: StarPriorityContext) {
  const topThree = getTopThree(stars);
  if (!topThree.length) return null;
  return topThree
    .map((star, index) => {
      const eventCount = getEventCount(events, star.slug);
      const newsCount = getNewsCount(newsItems, star.slug);
      const tags = star.tags.slice(0, 2).join(" / ") || "持续追踪";
      return `TOP ${star.chinaFanPriority ?? index + 1} ${star.nameCn} (${star.nameEn}) - ${tags} / 活动 ${eventCount} 条 / 动态 ${newsCount} 条`;
    })
    .join("\n");
}

export function buildTopThreeChatBrief({ stars, events, newsItems }: StarPriorityContext) {
  const topThree = getTopThree(stars);
  if (!topThree.length) return null;
  return [
    "今天先盯这 3 位：",
    ...topThree.map((star, index) => {
      const eventCount = getEventCount(events, star.slug);
      const newsCount = getNewsCount(newsItems, star.slug);
      const focus = getFocus(star);
      return `${index + 1}. ${star.nameCn}：${focus}，现在有活动 ${eventCount} 条、动态 ${newsCount} 条。`;
    }),
  ].join("\n");
}

export function buildTopOneRecommendation({ stars, events, newsItems }: StarPriorityContext) {
  const topStar = getTopStar(stars);
  if (!topStar) return null;
  const eventCount = getEventCount(events, topStar.slug);
  const newsCount = getNewsCount(newsItems, topStar.slug);
  const focus = getFocus(topStar);
  return `如果新粉今天只先追一位，我会先推荐 ${topStar.nameCn}。这位目前在中文粉丝里关注度更高，内容也更集中，现在站内能看到活动 ${eventCount} 条、动态 ${newsCount} 条，重点方向是 ${focus}。先从他开始，更容易快速进入泰娱追踪节奏。`;
}

export function buildTopThreeNewFanPitch({ stars, events, newsItems }: StarPriorityContext) {
  const topThree = getTopThree(stars);
  if (!topThree.length) return null;
  const lines = topThree.map((star, index) => {
    const eventCount = getEventCount(events, star.slug);
    const newsCount = getNewsCount(newsItems, star.slug);
    const focus = getFocus(star);
    if (index === 0) {
      return `如果新粉想最快进入状态，我会先推荐 ${star.nameCn}。这位现在内容最集中，站内已经能看到活动 ${eventCount} 条、动态 ${newsCount} 条，重点方向是 ${focus}。先从这位开始，最容易建立对泰娱节奏的感觉。`;
    }
    return `${star.nameCn} 也很值得补追，目前有活动 ${eventCount} 条、动态 ${newsCount} 条，适合继续往 ${focus} 这个方向扩展。`;
  });
  return ["给新粉的推荐顺序：", ...lines].join("\n");
}

export function buildTopOneShortPitch(stars: Star[]) {
  const topStar = getTopStar(stars);
  if (!topStar) return null;
  return `先看 ${topStar.nameCn}，这位现在最适合新粉入门，重点可以从 ${getFocus(topStar)} 开始补。`;
}

export function buildTopOneEventPitch({ stars, events }: Pick<StarPriorityContext, "stars" | "events">) {
  const topStar = getTopStar(stars);
  if (!topStar) return null;
  return `如果你更关注线下行程和公开活动，建议先看 ${topStar.nameCn}。这位现在活动信息更集中，站内已经整理了 ${getEventCount(events, topStar.slug)} 条相关活动，比较适合先从活动线追起。`;
}

export function buildTopOneCpPitch({ stars, newsItems }: Pick<StarPriorityContext, "stars" | "newsItems">) {
  const cpStar = stars.find((star) => star.tags.some((tag) => tag.includes("BKPP") || tag.includes("CP"))) ?? getTopStar(stars);
  if (!cpStar) return null;
  return `如果你更爱看 CP 线和同框内容，建议先补 ${cpStar.nameCn}。这位现在站内已经整理了 ${getNewsCount(newsItems, cpStar.slug)} 条相关动态，会更容易快速进入讨论节奏。`;
}

export function buildTopOneBrandPitch({ stars, events }: Pick<StarPriorityContext, "stars" | "events">) {
  const brandStar = stars.find((star) => star.tags.some((tag) => tag.includes("高热度") || tag.includes("时尚"))) ?? getTopStar(stars);
  if (!brandStar) return null;
  return `如果你更看重品牌合作、商务露出和时尚资源，建议先追 ${brandStar.nameCn}。这位现在公开内容更集中，站内也已经整理了 ${getEventCount(events, brandStar.slug)} 条相关活动，会更适合从品牌线开始看。`;
}

export function buildTopOneFashionPitch({ stars, newsItems }: Pick<StarPriorityContext, "stars" | "newsItems">) {
  const fashionStar =
    stars.find((star) => star.tags.some((tag) => tag.includes("时尚"))) ??
    stars.find((star) => star.tags.some((tag) => tag.includes("高热度"))) ??
    getTopStar(stars);
  if (!fashionStar) return null;
  return `如果你更喜欢看造型、红毯、杂志和品牌视觉内容，建议先补 ${fashionStar.nameCn}。这位在时尚向内容里更容易出圈，站内现在也已经整理了 ${getNewsCount(newsItems, fashionStar.slug)} 条相关动态，比较适合从视觉内容开始追。`;
}

export function buildNewFanThreeLinePitch(stars: Star[]) {
  const topThree = getTopThree(stars);
  if (!topThree.length) return null;
  return topThree
    .map((star, index) => `${index + 1}. ${star.nameCn}：先从 ${getFocus(star)} 开始补，会更容易进入状态。`)
    .join("\n");
}

export function buildNewFanSingleParagraphPitch(stars: Star[]) {
  const topThree = getTopThree(stars);
  if (!topThree.length) return null;
  return topThree
    .map((star, index) => (index === 0 ? `${star.nameCn} 最适合先入门，可以先从 ${getFocus(star)} 开始补。` : `${star.nameCn} 适合后面继续扩展，重点看 ${getFocus(star)}。`))
    .join(" ");
}

export function buildActivityOrNewsChoicePitch(stars: Star[]) {
  const topStar = getTopStar(stars);
  if (!topStar) return null;
  return `如果你时间不多，先看 ${topStar.nameCn} 的最新动态；如果你已经准备跟活动和公开行程，就先看活动日历。这样会比一开始什么都看更容易进入状态。`;
}

function buildTopStarShortTemplate(stars: Star[], template: (name: string) => string) {
  const topStar = getTopStar(stars);
  if (!topStar) return null;
  return template(topStar.nameCn);
}

export const buildUltraShortPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `先看 ${name}，最容易入门。`);
export const buildUltraShortActivityPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `想追活动，先看 ${name}。`);
export const buildUltraShortNewsPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `想先补动态，先看 ${name}。`);
export const buildThreeMinutePitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `如果你只有 3 分钟，先看 ${name} 的最新动态，先知道最近发生了什么，再决定要不要继续补活动。`);
export const buildSingleUpdatePitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `如果今天只看 1 条更新，就先看 ${name} 的最新动态。`);
export const buildHeadlineOnlyPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `今天只看标题的话，先看 ${name} 的最新动态。`);
export const buildNoTimePitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `今天没时间的话，至少看一眼 ${name} 的最新动态标题。`);
export const buildOneNamePitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `今天先记住一个名字：${name}。`);
export const buildOneClickPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `如果今天只点 1 次，就点 ${name} 的最新动态。`);
export const buildOneGlancePitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `如果今天只刷一眼，就看 ${name} 的最新动态标题。`);
export const buildMinimumEffortPitch = (stars: Star[]) => buildTopStarShortTemplate(stars, (name) => `今天最低限度也要看一眼 ${name} 的最新动态标题。`);
