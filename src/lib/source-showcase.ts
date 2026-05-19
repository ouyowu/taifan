import { officialSourceCatalog } from "@/lib/source-catalog";

type SourceSnapshot = {
  slug: string;
  title: string;
  url: string;
  summary: string;
  meta: string;
  primary?: boolean;
};

const sourceSnapshots: SourceSnapshot[] = [
  {
    slug: "gmmtv-instagram",
    title: "“แจน-จิงจิง” กล้าๆ กลัวๆ แอบแซ่บ เป็น Friends With Benefits",
    url: "https://www.gmm-tv.com/news/4251/",
    summary: "官网新闻型来源，适合沉淀为更完整的中文快读，通常信息量也最足。",
    meta: "官网新闻 · 最新已验证",
    primary: true,
  },
  {
    slug: "change-artist-instagram",
    title: "ธนาคารออมสิน presents พี่อ้อย พี่ฉอด ออมทัวร์ ออมใจ Seasons 2",
    url: "https://www.change2561.com/activity/title/21",
    summary: "偏活动发现型来源，特别适合补活动页、票务页和围观攻略。",
    meta: "官网活动 · 最新已验证",
    primary: true,
  },
  {
    slug: "domundi-instagram",
    title: "ใจฉันตามเธอไป | Latte Kim | DMD COVER",
    url: "https://www.youtube.com/watch?v=c0-IbET0aZE",
    summary: "公开视频更新密度高，适合做当天先看的候选和视频型快读。",
    meta: "YouTube 视频 · 3 days ago",
    primary: true,
  },
  {
    slug: "open-label-instagram",
    title: "[ENGSUB] UNPRODUCTIVE DAY ใช้ชีวิต (เปื่อยๆ) ด้วยกัน 1 วัน!",
    url: "https://www.youtube.com/watch?v=pyYKZ3kra9w&pp=0gcJCQQLAYcqIYzv",
    summary: "更像生活向或幕后更新，适合补成艺人近况和品牌外的内容线。",
    meta: "YouTube 视频 · 最新已验证",
    primary: true,
  },
  {
    slug: "beoncloud-instagram",
    title: "Jet lag เจ๊ทแหลก 2 | Press Conference 🛩️✨",
    url: "https://www.youtube.com/watch?v=_hOXJSMUx_E",
    summary: "适合舞台、活动和发布会快读，也适合串回相关艺人的演出活动。",
    meta: "YouTube 视频 · 8 days ago",
    primary: true,
  },
  {
    slug: "memindy-instagram",
    title: "Hot and cold, kissing one minute and pushing away the next…",
    url: "https://www.youtube.com/watch?v=97abg9NLtA8",
    summary: "短视频标题很强，但需要中文补全背景；很适合做主 daily lane。",
    meta: "YouTube 视频 · 2 hours ago",
    primary: true,
  },
  {
    slug: "wabi-sabi-instagram",
    title: "[PRE-ORDER] ROYAL MIRAGE…",
    url: "https://www.facebook.com/photo/?fbid=670886471938389&set=a.262473582779682",
    summary: "这一类更像预售、上新和宣传图动态，适合做商品和周边导流。",
    meta: "Facebook 动态 · 预售帖",
    primary: true,
  },
  {
    slug: "billkin-entertainment-youtube",
    title: "BILLKIN Vlog 🎬 - WiEA 2026",
    url: "https://www.youtube.com/watch?v=kJQ8AHl0UkE",
    summary: "个人公司来源更聚焦艺人本人，适合做重点艺人专属动态入口。",
    meta: "YouTube 视频 · 个人公司",
  },
  {
    slug: "pp-krit-entertainment-youtube",
    title: "PP KRIT Vlog ⭐️ - WiEA 2026",
    url: "https://www.youtube.com/watch?v=nhiCWoGjYas",
    summary: "适合补艺人个人近况、幕后花絮和站内人物页的内容厚度。",
    meta: "YouTube 视频 · 个人公司",
  },
];

export const sourceShowcaseEntries = sourceSnapshots
  .map((snapshot) => {
    const source = officialSourceCatalog.find((item) => item.slug === snapshot.slug);
    if (!source) return null;
    return {
      ...snapshot,
      ...source,
    };
  })
  .filter(
    (item): item is SourceSnapshot & (typeof officialSourceCatalog)[number] =>
      item !== null,
  );

export const primarySourceShowcaseEntries = sourceShowcaseEntries.filter((item) => item.primary);
