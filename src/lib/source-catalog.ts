export type SourceCatalogItem = {
  slug: string;
  label: string;
  company: string;
  logoPath: string;
  platform: "instagram" | "facebook";
  handle: string;
  profileUrl: string;
  keywords: string[];
  commonStarSlugs?: string[];
  active?: boolean;
  ingestion?: {
    mode: "profile" | "gmmtv-news" | "change2561-activity" | "youtube-videos" | "facebook-posts";
    feedUrl?: string;
  };
};

const baseOfficialSourceCatalog: SourceCatalogItem[] = [
  {
    slug: "change-artist-instagram",
    label: "CHANGE ARTIST",
    company: "CHANGE ARTIST",
    logoPath: "/logos/change-artist.svg",
    platform: "instagram",
    handle: "@changeartist_",
    profileUrl: "https://www.instagram.com/changeartist_/",
    keywords: [
      "instagram.com/changeartist_",
      "@changeartist_",
      "change artist",
      "change2561.com/activity",
      "change2561.com/changeartist",
      "change2561",
    ],
    commonStarSlugs: ["bright-vaid"],
    ingestion: {
      mode: "change2561-activity",
      feedUrl: "https://www.change2561.com/activity",
    },
  },
  {
    slug: "open-label-instagram",
    label: "OPEN LABEL",
    company: "OPEN LABEL",
    logoPath: "/logos/open-label.svg",
    platform: "instagram",
    handle: "@openlabel_th",
    profileUrl: "https://www.instagram.com/openlabel_th/",
    keywords: [
      "instagram.com/openlabel_th",
      "@openlabel_th",
      "open label",
      "youtube.com/@openlabel-th",
      "@openlabel-th",
      "youtube.com/@openlabel_th",
    ],
    commonStarSlugs: ["win-metawin"],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@OPENLABEL-TH",
    },
  },
  {
    slug: "domundi-instagram",
    label: "DOMUNDI TV",
    company: "DOMUNDI TV",
    logoPath: "/logos/domundi-tv.svg",
    platform: "instagram",
    handle: "@domunditv",
    profileUrl: "https://www.instagram.com/domunditv/",
    keywords: ["instagram.com/domunditv", "@domunditv", "domundi tv", "domundi"],
    commonStarSlugs: ["pp-krit"],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@domunditv/videos",
    },
  },
  {
    slug: "memindy-instagram",
    label: "MEMINDY",
    company: "MEMINDY",
    logoPath: "/logos/memindy.svg",
    platform: "instagram",
    handle: "@memindyofficial",
    profileUrl: "https://www.instagram.com/memindyofficial/",
    keywords: [
      "instagram.com/memindyofficial",
      "@memindyofficial",
      "memindy",
      "youtube.com/@memindyofficial",
      "@memindyofficial",
      "memindy.com",
    ],
    commonStarSlugs: ["lingorm"],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@memindyofficial/videos",
    },
  },
  {
    slug: "wabi-sabi-instagram",
    label: "Studio Wabi Sabi",
    company: "Studio Wabi Sabi",
    logoPath: "/logos/studio-wabi-sabi.svg",
    platform: "facebook",
    handle: "StudiowabisabiTH",
    profileUrl: "https://www.facebook.com/StudiowabisabiTH",
    keywords: [
      "facebook.com/studiowabisabith",
      "studiowabisabith",
      "studio wabi sabi",
      "wabi sabi",
      "studiowabisabi.co.th",
      "wabisabith",
    ],
    commonStarSlugs: ["lingorm"],
    ingestion: {
      mode: "facebook-posts",
      feedUrl: "https://www.facebook.com/StudiowabisabiTH",
    },
  },
  {
    slug: "gmmtv-instagram",
    label: "GMMTV",
    company: "GMMTV",
    logoPath: "/logos/gmmtv.svg",
    platform: "instagram",
    handle: "@gmmtv",
    profileUrl: "https://www.instagram.com/gmmtv/",
    keywords: ["instagram.com/gmmtv", "@gmmtv", "gmmtv", "gmm-tv.com/news", "gmm-tv.com"],
    commonStarSlugs: ["gemini-norawit", "fourth-nattawat"],
    ingestion: {
      mode: "gmmtv-news",
      feedUrl: "https://www.gmm-tv.com/news/",
    },
  },
  {
    slug: "beoncloud-instagram",
    label: "BeOnCloud",
    company: "BeOnCloud",
    logoPath: "/logos/beoncloud.svg",
    platform: "instagram",
    handle: "@beoncloud_th",
    profileUrl: "https://www.instagram.com/beoncloud_th/",
    keywords: [
      "instagram.com/beoncloud_th",
      "@beoncloud_th",
      "beoncloud",
      "youtube.com/@beoncloudofficial",
      "@beoncloudofficial",
    ],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@beoncloudofficial/videos",
    },
  },
  {
    slug: "billkin-entertainment-youtube",
    label: "Billkin Entertainment",
    company: "Billkin Entertainment",
    logoPath: "/logos/billkin-entertainment.svg",
    platform: "instagram",
    handle: "@BillkinEntertainment",
    profileUrl: "https://www.youtube.com/@BillkinEntertainment",
    keywords: [
      "youtube.com/@billkinentertainment",
      "@billkinentertainment",
      "billkin entertainment",
      "billkin",
      "facebook.com/billkinentertainment",
    ],
    commonStarSlugs: ["billkin"],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@BillkinEntertainment/videos",
    },
  },
  {
    slug: "pp-krit-entertainment-youtube",
    label: "PP Krit Entertainment",
    company: "PP Krit Entertainment",
    logoPath: "/logos/pp-krit-entertainment.svg",
    platform: "instagram",
    handle: "@PPKritEntertainment",
    profileUrl: "https://www.youtube.com/@PPKritEntertainment",
    keywords: [
      "youtube.com/@ppkritentertainment",
      "@ppkritentertainment",
      "pp krit entertainment",
      "pp krit",
      "facebook.com/ppkritentertainment",
    ],
    commonStarSlugs: ["pp-krit"],
    ingestion: {
      mode: "youtube-videos",
      feedUrl: "https://www.youtube.com/@PPKritEntertainment/videos",
    },
  },
];

const disabledSourceSlugs = new Set(
  (process.env.DAILY_NEWS_DISABLED_SOURCES ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
);

export const officialSourceCatalog: SourceCatalogItem[] = baseOfficialSourceCatalog.map((item) => ({
  ...item,
  active: !disabledSourceSlugs.has(item.slug),
}));

export function getSourceIngestionLabel(source: SourceCatalogItem) {
  switch (source.ingestion?.mode) {
    case "gmmtv-news":
      return "官网新闻";
    case "change2561-activity":
      return "官网活动";
    case "youtube-videos":
      return "YouTube 视频";
    case "facebook-posts":
      return "Facebook 动态";
    case "profile":
    default:
      return "主页抓取";
  }
}

export function detectOfficialSource(input: string) {
  const haystack = input.toLowerCase();
  return officialSourceCatalog.find((item) =>
    item.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );
}
