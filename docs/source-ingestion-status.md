# Source Ingestion Status

Last updated: 2026-05-18

This document tracks which official sources already have a real ingestion adapter, what public entry they use, and what the latest successful probe returned.

## Live adapters

### GMMTV
- Source slug: `gmmtv-instagram`
- Current mode: `官网新闻`
- Feed: `https://www.gmm-tv.com/news/`
- Latest verified item:
  - URL: `https://www.gmm-tv.com/news/4251/`
  - Title: `“แจน-จิงจิง” กล้าๆ กลัวๆ แอบแซ่บ เป็น Friends With Benefits`
- Notes:
  - This source should not use Instagram as the main正文入口.
  - The website news list and detail pages are stable and already return full article content.

### CHANGE ARTIST / CHANGE2561
- Source slug: `change-artist-instagram`
- Current mode: `官网活动`
- Feed: `https://www.change2561.com/activity`
- Latest verified item:
  - URL: `https://www.change2561.com/activity/title/21`
  - Title: `ธนาคารออมสิน presents พี่อ้อย พี่ฉอด ออมทัวร์ ออมใจ Seasons 2`
- Notes:
  - This source is more of an activity / campaign feed than a newsroom.
  - Detail pages already provide enough text for a daily news candidate.

### DOMUNDI TV
- Source slug: `domundi-instagram`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@domunditv/videos`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=c0-IbET0aZE`
  - Title: `ใจฉันตามเธอไป | Latte Kim | DMD COVER`
- Notes:
  - The videos list is stable.
  - Single video pages do not expose enough正文, so the current adapter uses the latest public video title + recency + URL as the candidate base.

### OPEN LABEL
- Source slug: `open-label-instagram`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@OPENLABEL-TH`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=pyYKZ3kra9w&pp=0gcJCQQLAYcqIYzv`
  - Title: `[ENGSUB] UNPRODUCTIVE DAY ใช้ชีวิต (เปื่อยๆ) ด้วยกัน 1 วัน! | OUROAD CLOSEFRiEND SS2 EP.9`
- Notes:
  - The channel home page already exposes recent videos clearly.
  - This is currently the best public source for OPEN LABEL.

### BeOnCloud
- Source slug: `beoncloud-instagram`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@beoncloudofficial/videos`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=_hOXJSMUx_E`
  - Title: `Jet lag เจ๊ทแหลก 2 | Press Conference 🛩️✨`
- Notes:
  - The public video stream is active and suitable for frequent daily candidates.
  - We intentionally removed the old wrong default star association.

### MEMINDY
- Source slug: `memindy-instagram`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@memindyofficial/videos`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=97abg9NLtA8`
  - Title: `Hot and cold, kissing one minute and pushing away the next—what kind of relationship is this? | H...`
- Notes:
  - This source updates very frequently and is a strong candidate for daily news.
  - The YouTube videos stream is better than the Instagram profile as an automated source.

### Studio Wabi Sabi
- Source slug: `wabi-sabi-instagram`
- Current mode: `Facebook 动态`
- Feed: `https://www.facebook.com/StudiowabisabiTH`
- Latest verified item:
  - URL: `https://www.facebook.com/photo/?fbid=1014268377600195&set=pcb.1014268447600188`
  - Title: `[PRE-ORDER] ROYAL MIRAGE…`
- Notes:
  - The real public official entry is the Facebook page, not the unstable YouTube handles we checked earlier.
  - The page exposes company identity, contact information, and the latest public post content in a way that is usable for candidate generation.

### Billkin Entertainment
- Source slug: `billkin-entertainment-youtube`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@BillkinEntertainment/videos`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=kJQ8AHl0UkE`
  - Title: `BILLKIN Vlog 🎬 - WiEA 2026`
- Notes:
  - The official YouTube channel is a more stable public entry than the Facebook page for automated daily candidates.
  - The adapter uses the latest public video title, recency, and URL as the candidate base, consistent with other video-driven sources.

### PP Krit Entertainment
- Source slug: `pp-krit-entertainment-youtube`
- Current mode: `YouTube 视频`
- Feed: `https://www.youtube.com/@PPKritEntertainment/videos`
- Latest verified item:
  - URL: `https://www.youtube.com/watch?v=nhiCWoGjYas&pp=0gcJCQQLAYcqIYzv`
  - Title: `PP KRIT Vlog ⭐️ - WiEA 2026`
- Notes:
  - The official YouTube channel is the cleanest stable public source for automated daily candidates.
  - This source complements Billkin Entertainment and keeps the same adapter shape for artist-led video updates.

## Sources still not adapted

- No additional source is pending in the current priority set.

## Recommended next work

1. Add a source-specific activity / news summary template so website-activity and youtube-videos do not share exactly the same editorial body shape.
2. Add a lightweight admin preview or probe endpoint that shows the latest fetched title before writing a candidate.
3. Start checking the next company batch only after its official public entry is confirmed as stable.
