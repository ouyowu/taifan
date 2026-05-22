const envSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const EVENT_TYPE_LABELS: Record<string, string> = {
  fanmeeting: "见面会",
  concert: "演唱会",
  brand: "品牌活动",
  broadcast: "直播",
  variety: "综艺",
  airport: "机场行程",
  event: "活动",
};

export const siteConfig = {
  name: "泰饭网",
  shortName: "泰饭网",
  siteName: "泰饭网 taifan.club",
  siteUrl: envSiteUrl,
  hasPublicSiteUrl: !envSiteUrl.includes("localhost"),
  description: "泰国顶级艺人一站式追星平台，官方来源优先，内容经过人工审核。",
  keywords: [
    "泰饭网",
    "taifan.club",
    "泰国明星活动",
    "泰娱中文日历",
    "泰国艺人动态",
    "泰娱票务",
    "粉丝应援",
  ],
  nav: [
    { href: "/", label: "首页" },
    { href: "/artists", label: "艺人" },
    { href: "/news", label: "动态" },
    { href: "/calendar", label: "活动日历" },
    { href: "/guides", label: "新粉攻略" },
    { href: "/services", label: "代办服务" },
    { href: "/shop", label: "周边商城" },
  ],
};
