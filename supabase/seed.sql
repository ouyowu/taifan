insert into stars (slug, name_cn, name_en, fandom_name, agency, base_city, bio, tags, popularity_score, china_fan_priority)
values
  (
    'bright-vaid',
    'Bright',
    'Bright Vachirawit',
    'Brights',
    'Cloud 9 Entertainment',
    '曼谷',
    '跨影视、时尚与品牌活动的头部泰国艺人，适合做品牌行程与公开活动聚合。',
    array['演员', '歌手', '品牌代言', '高热度'],
    95,
    1
  ),
  (
    'win-metawin',
    'Win',
    'Win Metawin',
    'Snowball Power',
    'One31 / independent brand work',
    '曼谷',
    '在中国粉丝圈长期保持高讨论度，品牌合作与公开活动的关注度都很强。',
    array['演员', '品牌代言', '高热度', '中国粉丝基础强'],
    93,
    2
  ),
  (
    'billkin',
    'Billkin',
    'Billkin',
    'Beside',
    'Billkin Entertainment',
    '曼谷',
    '在中国粉丝侧和 PP Krit 一起有很强的 CP 与个人热度，适合放在首页靠前入口。',
    array['演员', '歌手', '高热度', 'BKPP'],
    91,
    3
  ),
  (
    'pp-krit',
    'PP Krit',
    'PP Krit',
    'PP Baobei',
    'PP Krit Entertainment',
    '曼谷',
    '兼具时尚影响力与舞台表现力，适合承接演出、杂志和品牌资讯。',
    array['演员', '歌手', '时尚', '舞台'],
    88,
    4
  ),
  (
    'gemini-norawit',
    'Gemini',
    'Gemini Norawit',
    'Nong',
    'GMMTV',
    '曼谷',
    '新一代中国粉丝关注度很高的 GMMTV 艺人，品牌和活动讨论量上升很快。',
    array['演员', '歌手', '新生代', '高增长'],
    84,
    5
  ),
  (
    'fourth-nattawat',
    'Fourth',
    'Fourth Nattawat',
    'Fourthnatic',
    'GMMTV',
    '曼谷',
    '和 Gemini 一样在中国粉丝圈讨论度很高，适合放在次优先入口中持续追踪。',
    array['演员', '新生代', '高增长', 'GMMTV'],
    83,
    6
  ),
  (
    'lingorm',
    'LingOrm',
    'LingOrm',
    'Lings',
    'Channel 3',
    '曼谷',
    '以双人 CP 活动和粉丝互动活动见长，适合做日历提醒和新手向说明。',
    array['CP', '粉丝见面会', '剧宣'],
    76,
    20
  )
on conflict (slug) do nothing;

insert into events (slug, title, type, status, city, venue, starts_at, ends_at, source_url, summary, ai_extracted)
values
  (
    'bright-shanghai-fanmeeting-2026',
    'Bright 上海粉丝见面会 2026',
    'fanmeeting',
    'selling',
    '上海',
    '静安体育中心',
    '2026-06-08T11:30:00Z',
    '2026-06-08T13:30:00Z',
    null,
    '面向中国粉丝的见面互动场，包含采访、问答与小型舞台表演。',
    '{"highlights":["现场福利抽选","中文主持","应援物说明"]}'::jsonb
  ),
  (
    'pp-krit-beijing-brand-night',
    'PP Krit 北京品牌之夜',
    'brand',
    'scheduled',
    '北京',
    '国贸商圈秀场',
    '2026-06-14T10:00:00Z',
    null,
    null,
    '品牌晚宴活动，适合做围观攻略、到场路线和拍摄提醒。',
    '{"highlights":["红毯时间段","媒体区入口","周边住宿建议"]}'::jsonb
  ),
  (
    'lingorm-guangzhou-live',
    'LingOrm 广州连线直播日',
    'broadcast',
    'scheduled',
    '广州',
    '线上直播 + 品牌门店',
    '2026-06-20T08:00:00Z',
    null,
    null,
    '门店打卡和直播连线组合活动，适合新粉丝低门槛参与。',
    '{"highlights":["线上预约链接","门店签到提醒","直播切片摘要"]}'::jsonb
  )
on conflict (slug) do nothing;

insert into news_posts (slug, title, excerpt, category, published_at, related_star_slugs)
values
  (
    'bright-shanghai-ticket-guide',
    'Bright 上海见面会抢票与座位区速读',
    '整理主办公告、票档、实名规则和交通信息，帮助新粉快速上手。',
    '活动速递',
    '2026-05-16T02:00:00Z',
    array['bright-vaid']
  ),
  (
    'pp-krit-brand-appearance',
    'PP Krit 确认出席北京品牌之夜',
    '汇总品牌官宣、媒体区安排与粉丝围观注意事项。',
    '官宣',
    '2026-05-15T06:00:00Z',
    array['pp-krit']
  ),
  (
    'lingorm-live-booking',
    'LingOrm 广州直播预约开放',
    '附预约入口、直播时间、门店活动和应援建议。',
    '直播',
    '2026-05-14T10:20:00Z',
    array['lingorm']
  )
on conflict (slug) do nothing;
