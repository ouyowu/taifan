export type Star = {
  slug: string;
  nameCn: string;
  nameEn: string;
  fandomName: string;
  agency: string;
  baseCity: string;
  bio: string;
  tags: string[];
  avatarUrl: string;
  coverUrl: string;
  galleryUrls?: string[];
  profileFacts?: string[];
  spotlight: string[];
  profileNotes?: string[];
  followTracks?: string[];
  milestones?: string[];
  chinaFanPriority?: number;
};

export type Event = {
  slug: string;
  title: string;
  type: "fanmeeting" | "concert" | "brand" | "broadcast" | "airport";
  status: "scheduled" | "rumor" | "selling" | "done";
  city: string;
  venue: string;
  startsAt: string;
  endsAt?: string;
  starSlugs: string[];
  ticketStatus: string;
  summary: string;
  highlights: string[];
  sourceLabel: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  bodyMd?: string;
  publishedAt: string;
  category: string;
  editorialMode?: "daily-auto" | "manual";
  reviewStatus?: "draft" | "reviewed" | "published" | "rejected";
  relatedStars: string[];
  sourceUrl?: string;
  sourceLabel?: string;
};

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  deliverables: string[];
  turnaround: string;
};

export type GuideSection = {
  title: string;
  points: string[];
};
