alter table if exists news_posts add column if not exists review_status text default 'published';

insert into stars (
  slug,
  name_cn,
  name_en,
  fandom_name,
  agency,
  base_city,
  bio,
  tags,
  avatar_url,
  cover_url,
  popularity_score,
  china_fan_priority
) values
  (
    'ou-chakrit',
    'Ou',
    'Ou Chakrit',
    'OuRoad Fans',
    'OPEN LABEL',
    '曼谷',
    '适合从双人公开视频、品牌露出和小型活动快读先认识，是 OPEN LABEL 这条公司线里很适合继续补厚的一位。',
    array['演员','OPEN LABEL','双人线','公开视频'],
    '/logos/open-label.svg',
    '/logos/open-label.svg',
    0,
    57
  ),
  (
    'road-yongyut',
    'Road',
    'Road Yongyut',
    'OuRoad Fans',
    'OPEN LABEL',
    '曼谷',
    '适合从双人露出、近距离小活动和公开视频开始认识，是 OPEN LABEL 里很适合和 Ou 一起补厚的内容线。',
    array['演员','OPEN LABEL','双人线','活动向'],
    '/logos/open-label.svg',
    '/logos/open-label.svg',
    0,
    58
  ),
  (
    'bow-maylada',
    'Bow',
    'Bow Maylada',
    'BowFans',
    'Channel 3',
    '曼谷',
    '适合从个人品牌、媒体露出和节庆型活动开始认识，是 Channel 3 线里很适合扩宽内容面的一个人物入口。',
    array['演员','Channel 3','品牌露出','媒体活动'],
    '/logos/channel-3.svg',
    '/logos/channel-3.svg',
    0,
    59
  ),
  (
    'prem-warut',
    'Prem',
    'Prem Warut',
    'PremFans',
    'Studio Wabi Sabi',
    '曼谷',
    '适合从双人活动、公开露出和海外粉丝活动先认识，是 Studio Wabi Sabi 里很适合继续补厚的一条人物线。',
    array['演员','Studio Wabi Sabi','双人线','海外活动'],
    '/logos/studio-wabi-sabi.svg',
    '/logos/studio-wabi-sabi.svg',
    0,
    60
  ),
  (
    'gulf-kanawut',
    'Gulf',
    'Gulf Kanawut',
    'GulfFans',
    'Channel 3',
    '曼谷',
    '适合从个人品牌、媒体沙龙和大型公开露出先认识，是 Channel 3 线里很适合继续扩宽内容面的个人入口。',
    array['演员','Channel 3','个人品牌','媒体活动'],
    '/logos/channel-3.svg',
    '/logos/channel-3.svg',
    0,
    61
  ),
  (
    'fluke-natouch',
    'Fluke',
    'Fluke Natouch',
    'FlukeFans',
    'Studio Wabi Sabi',
    '曼谷',
    '适合从人物档案、公开露出和小型海外活动先认识，是 Studio Wabi Sabi 这条线里很适合继续补厚的个人入口。',
    array['演员','Studio Wabi Sabi','人物档案','海外活动'],
    '/logos/studio-wabi-sabi.svg',
    '/logos/studio-wabi-sabi.svg',
    0,
    62
  )
on conflict (slug) do update set
  name_cn = excluded.name_cn,
  name_en = excluded.name_en,
  fandom_name = excluded.fandom_name,
  agency = excluded.agency,
  base_city = excluded.base_city,
  bio = excluded.bio,
  tags = excluded.tags,
  avatar_url = excluded.avatar_url,
  cover_url = excluded.cover_url,
  popularity_score = excluded.popularity_score,
  china_fan_priority = excluded.china_fan_priority,
  updated_at = now();

insert into events (
  slug,
  title,
  type,
  status,
  city,
  venue,
  starts_at,
  source_url,
  summary
) values
  (
    'ouroad-bangkok-open-label-studio-day',
    'OuRoad Bangkok Open Label Studio Day',
    'brand',
    'scheduled',
    '曼谷',
    'EMSPHERE Studio Floor',
    '2026-09-15T17:30:00+07:00',
    'https://www.instagram.com/openlabel_th/',
    '偏双人露出和近距离互动的一场 studio day，适合先看公开区和会后图像物料。'
  ),
  (
    'bow-shanghai-channel3-brand-talk',
    'Bow Shanghai Channel 3 Brand Talk',
    'brand',
    'scheduled',
    '上海',
    'TX 淮海品牌空间',
    '2026-09-21T15:30:00+08:00',
    'https://www.ch3plus.com/',
    '偏个人品牌对谈和媒体露出的一场上海活动，适合先判断公开区和品牌图像物料密度。'
  ),
  (
    'prem-taipei-wabisabi-weekend',
    'Prem Taipei Wabi Sabi Weekend',
    'fanmeeting',
    'scheduled',
    '台北',
    'Legacy Taipei Mini Hall',
    '2026-10-09T18:00:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏粉丝互动和会后福利的一场海外 weekend 活动，适合先看票区和互动规则。'
  ),
  (
    'fort-peat-bangkok-memindy-house-day',
    'FortPeat Bangkok MEMINDY House Day',
    'broadcast',
    'scheduled',
    '曼谷',
    '线上直播 + 门店联动空间',
    '2026-09-24T16:00:00+07:00',
    'https://www.instagram.com/memindyofficial/',
    '低门槛直播和门店联动的一场 house day，适合先看预约方式、门店规则和回看入口。'
  ),
  (
    'ouroad-taipei-open-label-night',
    'OuRoad Taipei Open Label Night',
    'fanmeeting',
    'scheduled',
    '台北',
    'Legacy Mini @ 華山',
    '2026-10-17T19:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏双人互动和近距离舞台的一场台北活动，适合先看票区、双人福利和会后互动。'
  ),
  (
    'win-singapore-open-label-press-day',
    'Win Singapore Open Label Press Day',
    'brand',
    'scheduled',
    '新加坡',
    'ION Orchard Atrium',
    '2026-10-22T16:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏媒体露出和品牌 press day 的一场新加坡活动，适合先看公开区和媒体物料密度。'
  ),
  (
    'gulf-bangkok-channel3-media-salon',
    'Gulf Bangkok Channel 3 Media Salon',
    'brand',
    'scheduled',
    '曼谷',
    'Siam Kempinski Media Room',
    '2026-10-24T15:00:00+07:00',
    'https://www.ch3plus.com/',
    '偏媒体与品牌图像露出的一场个人 salon，适合先判断公开区和图像物料密度。'
  ),
  (
    'fluke-seoul-wabisabi-archive-day',
    'Fluke Seoul Wabi Sabi Archive Day',
    'brand',
    'scheduled',
    '首尔',
    'Seongsu Archive Space',
    '2026-10-30T14:30:00+09:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏档案展陈和限定物料的一场 archive day，适合先看预约、签到和限定规则。'
  ),
  (
    'road-singapore-open-label-pop-up-day',
    'Road Singapore Open Label Pop-up Day',
    'brand',
    'scheduled',
    '新加坡',
    'Bugis+ Pop-up Floor',
    '2026-09-29T15:30:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏门店露出和粉丝打卡的一场新加坡 pop-up day，适合先看预约、签到和限定物料。'
  ),
  (
    'win-jakarta-open-label-style-night',
    'Win Jakarta Open Label Style Night',
    'brand',
    'scheduled',
    '雅加达',
    'Plaza Senayan Event Hall',
    '2026-10-12T18:30:00+07:00',
    'https://www.instagram.com/openlabel_th/',
    '偏媒体露出和品牌 style night 的一场雅加达活动，适合先看公开区和会后图像物料密度。'
  ),
  (
    'gulf-shenzhen-channel3-brand-forum',
    'Gulf Shenzhen Channel 3 Brand Forum',
    'brand',
    'scheduled',
    '深圳',
    'One Avenue Forum Hall',
    '2026-10-14T16:00:00+08:00',
    'https://www.ch3plus.com/',
    '偏公开论坛和品牌图像露出的一场深圳活动，适合先判断公开区和媒体物料密度。'
  ),
  (
    'bow-bangkok-channel3-cafe-day',
    'Bow Bangkok Channel 3 Cafe Day',
    'brand',
    'scheduled',
    '曼谷',
    'Emsphere Cafe Commons',
    '2026-10-18T14:30:00+07:00',
    'https://www.ch3plus.com/',
    '偏门店打卡和轻互动的一场 cafe day，适合先看预约方式、签到和限定物料。'
  ),
  (
    'prem-hong-kong-wabisabi-fan-circle',
    'Prem Hong Kong Wabi Sabi Fan Circle',
    'fanmeeting',
    'scheduled',
    '香港',
    'MacPherson Mini Stage',
    '2026-10-20T18:00:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏近距离互动和会后福利的一场香港 fan circle，适合先看票区和互动规则。'
  ),
  (
    'earth-kuala-lumpur-wabisabi-media-day',
    'Earth Kuala Lumpur Wabi Sabi Media Day',
    'brand',
    'scheduled',
    '吉隆坡',
    'Pavilion Media Room',
    '2026-10-26T15:00:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏媒体露出和品牌图像内容的一场吉隆坡活动，适合先看公开区和图像物料密度。'
  ),
  (
    'ouroad-kuala-lumpur-open-label-weekend',
    'OuRoad Kuala Lumpur Open Label Weekend',
    'fanmeeting',
    'scheduled',
    '吉隆坡',
    'Zepp Kuala Lumpur Mini Hall',
    '2026-10-31T18:30:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏双人互动和会后福利的一场吉隆坡 weekend 活动，适合先看票区和互动规则。'
  ),
  (
    'win-manila-open-label-press-room',
    'Win Manila Open Label Press Room',
    'brand',
    'scheduled',
    '马尼拉',
    'BGC Media Hall',
    '2026-10-27T16:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏媒体露出和品牌 press room 的一场马尼拉活动，适合先看公开区和图像物料密度。'
  ),
  (
    'gulf-chengdu-channel3-style-day',
    'Gulf Chengdu Channel 3 Style Day',
    'brand',
    'scheduled',
    '成都',
    'SKP Atrium',
    '2026-10-29T15:30:00+08:00',
    'https://www.ch3plus.com/',
    '偏公开露出和品牌图像内容的一场成都活动，适合先看公开区和媒体物料。'
  ),
  (
    'bow-hong-kong-channel3-beauty-talk',
    'Bow Hong Kong Channel 3 Beauty Talk',
    'brand',
    'scheduled',
    '香港',
    'Harbour City Beauty Lounge',
    '2026-10-30T14:00:00+08:00',
    'https://www.ch3plus.com/',
    '偏品牌对谈和门店露出的一场香港活动，适合先看预约、签到和现场互动节奏。'
  ),
  (
    'fluke-taipei-wabisabi-archive-night',
    'Fluke Taipei Wabi Sabi Archive Night',
    'brand',
    'scheduled',
    '台北',
    'Songshan Archive Loft',
    '2026-10-25T18:00:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏档案展陈和限定领取的一场台北 archive night，适合先看预约和签到规则。'
  ),
  (
    'prem-seoul-wabisabi-weekend-circle',
    'Prem Seoul Wabi Sabi Weekend Circle',
    'fanmeeting',
    'scheduled',
    '首尔',
    'Hongdae Fan Hall',
    '2026-11-02T17:00:00+09:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏近距离互动和会后福利的一场首尔 weekend circle，适合先看票区和互动规则。'
  ),
  (
    'ouroad-seoul-open-label-pair-day',
    'OuRoad Seoul Open Label Pair Day',
    'brand',
    'scheduled',
    '首尔',
    'Seongsu Pair Studio',
    '2026-11-06T15:00:00+09:00',
    'https://www.instagram.com/openlabel_th/',
    '偏双人露出和品牌影像物料的一场首尔活动，适合先看公开区和会后图像更新节奏。'
  ),
  (
    'road-bangkok-open-label-fan-studio',
    'Road Bangkok Open Label Fan Studio',
    'fanmeeting',
    'scheduled',
    '曼谷',
    'One Bangkok Fan Studio',
    '2026-11-09T18:30:00+07:00',
    'https://www.instagram.com/openlabel_th/',
    '偏近距离互动和会后福利的一场小型 fan studio，适合先看票区和互动规则。'
  ),
  (
    'fortpeat-manila-memindy-live-room',
    'FortPeat Manila MEMINDY Live Room',
    'broadcast',
    'scheduled',
    '马尼拉',
    '线上直播 + 线下媒体间',
    '2026-11-05T17:00:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    '偏直播互动和媒体连线的一场 live room，适合先看预约方式和回看入口。'
  ),
  (
    'bossnoeul-hong-kong-memindy-fan-night',
    'BossNoeul Hong Kong MEMINDY Fan Night',
    'fanmeeting',
    'scheduled',
    '香港',
    'Kitty Woo Stadium Hall',
    '2026-11-12T19:00:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    '偏双人互动和会后福利的一场香港 fan night，适合先看票区和互动规则。'
  ),
  (
    'earth-tokyo-wabisabi-reading-day',
    'Earth Tokyo Wabi Sabi Reading Day',
    'brand',
    'scheduled',
    '东京',
    'Shibuya Reading Loft',
    '2026-11-08T14:30:00+09:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏店访和静态阅读展陈的一场东京活动，适合先看预约方式和限定物料。'
  ),
  (
    'fluke-bangkok-wabisabi-capsule-night',
    'Fluke Bangkok Wabi Sabi Capsule Night',
    'brand',
    'scheduled',
    '曼谷',
    'Central Embassy Capsule Hall',
    '2026-11-15T18:00:00+07:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏媒体露出和门店胶囊展的一场 Bangkok capsule night，适合先看公开区和品牌物料密度。'
  )
on conflict (slug) do update set
  title = excluded.title,
  type = excluded.type,
  status = excluded.status,
  city = excluded.city,
  venue = excluded.venue,
  starts_at = excluded.starts_at,
  source_url = excluded.source_url,
  summary = excluded.summary,
  updated_at = now();

delete from event_stars
where event_id in (
  select id from events where slug in (
    'ouroad-bangkok-open-label-studio-day',
    'bow-shanghai-channel3-brand-talk',
    'prem-taipei-wabisabi-weekend',
    'fort-peat-bangkok-memindy-house-day',
    'ouroad-taipei-open-label-night',
    'win-singapore-open-label-press-day',
    'gulf-bangkok-channel3-media-salon',
    'fluke-seoul-wabisabi-archive-day',
    'ouroad-kuala-lumpur-open-label-weekend',
    'win-manila-open-label-press-room',
    'gulf-chengdu-channel3-style-day',
    'bow-hong-kong-channel3-beauty-talk',
    'fluke-taipei-wabisabi-archive-night',
    'prem-seoul-wabisabi-weekend-circle',
    'ouroad-seoul-open-label-pair-day',
    'road-bangkok-open-label-fan-studio',
    'fortpeat-manila-memindy-live-room',
    'bossnoeul-hong-kong-memindy-fan-night',
    'earth-tokyo-wabisabi-reading-day',
    'fluke-bangkok-wabisabi-capsule-night'
  )
);

insert into event_stars (event_id, star_id, role)
select e.id, s.id, 'guest'
from (
  values
    ('ouroad-bangkok-open-label-studio-day','ou-chakrit'),
    ('ouroad-bangkok-open-label-studio-day','road-yongyut'),
    ('bow-shanghai-channel3-brand-talk','bow-maylada'),
    ('prem-taipei-wabisabi-weekend','prem-warut'),
    ('fort-peat-bangkok-memindy-house-day','fort-thitipong'),
    ('fort-peat-bangkok-memindy-house-day','peat-wasuthorn'),
    ('ouroad-taipei-open-label-night','ou-chakrit'),
    ('ouroad-taipei-open-label-night','road-yongyut'),
    ('win-singapore-open-label-press-day','win-metawin'),
    ('gulf-bangkok-channel3-media-salon','gulf-kanawut'),
    ('fluke-seoul-wabisabi-archive-day','fluke-natouch'),
    ('road-singapore-open-label-pop-up-day','road-yongyut'),
    ('win-jakarta-open-label-style-night','win-metawin'),
    ('gulf-shenzhen-channel3-brand-forum','gulf-kanawut'),
    ('bow-bangkok-channel3-cafe-day','bow-maylada'),
    ('prem-hong-kong-wabisabi-fan-circle','prem-warut'),
    ('earth-kuala-lumpur-wabisabi-media-day','earth-katsamonnat'),
    ('ouroad-kuala-lumpur-open-label-weekend','ou-chakrit'),
    ('ouroad-kuala-lumpur-open-label-weekend','road-yongyut'),
    ('win-manila-open-label-press-room','win-metawin'),
    ('gulf-chengdu-channel3-style-day','gulf-kanawut'),
    ('bow-hong-kong-channel3-beauty-talk','bow-maylada'),
    ('fluke-taipei-wabisabi-archive-night','fluke-natouch'),
    ('prem-seoul-wabisabi-weekend-circle','prem-warut'),
    ('ouroad-seoul-open-label-pair-day','ou-chakrit'),
    ('ouroad-seoul-open-label-pair-day','road-yongyut'),
    ('road-bangkok-open-label-fan-studio','road-yongyut'),
    ('fortpeat-manila-memindy-live-room','fort-thitipong'),
    ('fortpeat-manila-memindy-live-room','peat-wasuthorn'),
    ('bossnoeul-hong-kong-memindy-fan-night','boss-chaikamon'),
    ('bossnoeul-hong-kong-memindy-fan-night','noeul-nuttarat'),
    ('earth-tokyo-wabisabi-reading-day','earth-katsamonnat'),
    ('fluke-bangkok-wabisabi-capsule-night','fluke-natouch')
) as links(event_slug, star_slug)
join events e on e.slug = links.event_slug
join stars s on s.slug = links.star_slug
on conflict (event_id, star_id) do nothing;

insert into news_posts (
  slug,
  title,
  excerpt,
  body_md,
  category,
  review_status,
  published_at,
  source_url,
  related_star_slugs
) values
  (
    'ouroad-bangkok-open-label-studio-day-watch',
    'OuRoad Bangkok Open Label Studio Day Watch',
    '整理公开区、双人露出和会后图像物料，帮助粉丝判断这类 studio day 值不值得继续追。',
    'OuRoad 这种 studio day 最值得先看的，不是标题看起来多轻，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续盯的，通常是双人露出强度、现场可见度，以及品牌会不会放出第二波内容。\n\n这条快读会优先说明公开区、双人露出和会后图像物料，帮助第一次补 OPEN LABEL 第二层人物线的粉丝快速判断这场活动更适合去现场，还是更适合等站内整理。比起只看活动标题，先看这一条会更容易做决定。\n\n如果后续补出正式时段、品牌图或延伸门店活动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-08-13T14:10:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['ou-chakrit','road-yongyut']
  ),
  (
    'bow-shanghai-channel3-brand-talk-note',
    'Bow Shanghai Channel 3 Brand Talk Note',
    '整理公开区、媒体露出和品牌图像物料，帮助粉丝判断这类个人品牌活动怎么玩更值。',
    'Bow 这种个人品牌对谈，最值得先看的不是活动看起来是不是高级，而是公开区有没有价值、媒体会不会产出足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、媒体露出和图像物料密度，帮助想补 Channel 3 个人线的粉丝快速判断这场上海活动值不值得继续盯。比起只看品牌标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、品牌图集或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-08-15T11:30:00+08:00',
    'https://www.ch3plus.com/',
    array['bow-maylada']
  ),
  (
    'prem-taipei-wabisabi-weekend-guide',
    'Prem Taipei Wabi Sabi Weekend Guide',
    '整理票区、互动福利和这类海外 weekend 活动值不值得专门安排行程的判断点。',
    'Prem 这种海外 weekend 活动，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、互动福利和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、互动福利和会后规则，帮助第一次补 Studio Wabi Sabi 第二层人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-08-17T15:20:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['prem-warut']
  ),
  (
    'fortpeat-bangkok-memindy-house-day-note',
    'FortPeat Bangkok MEMINDY House Day Note',
    '整理直播预约、门店规则和这类 house day 最值得先看的重点，帮助新粉低门槛补线。',
    'FortPeat 这种 house day 的价值，通常不在于活动有多大，而在于它是不是一条适合低门槛参与、顺手补双人线的入口。对新粉来说，预约方式、门店规则和回看入口往往比活动名字本身更重要。\n\n这条整理会优先说明直播预约、门店规则和回看入口，帮助第一次补 MEMINDY 双人线的粉丝快速理解这场活动怎么玩。比起只刷碎片内容，先看一条完整中文快读更省时间。\n\n如果后续补出正式直播页、门店地图或会后互动物料，站内会继续把这些更新并回这条稿里。',
    '直播',
    'published',
    '2026-08-19T12:40:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    array['fort-thitipong','peat-wasuthorn']
  ),
  (
    'ouroad-taipei-open-label-night-watch',
    'OuRoad Taipei Open Label Night Watch',
    '整理票区、双人互动和这类台北 night 活动值不值得专门安排行程的判断点。',
    'OuRoad 这种台北 night 活动，对粉丝来说最重要的从来不是活动标题，而是这场到底值不值得专门跨城去追。票区、双人互动和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、双人互动和会后规则，帮助第一次补 OPEN LABEL 第二层人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-08-21T15:10:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['ou-chakrit','road-yongyut']
  ),
  (
    'win-singapore-open-label-press-day-note',
    'Win Singapore Open Label Press Day Note',
    '整理媒体露出、公开区和会后图像物料，帮助粉丝判断这类 press day 值不值得继续盯。',
    'Win 这种 press day 最值得先看的，不是活动看起来是不是大，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明媒体露出、公开区和会后图像物料，帮助想继续补 OPEN LABEL 线的粉丝快速判断这场活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-08-23T11:50:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['win-metawin']
  ),
  (
    'gulf-bangkok-channel3-media-salon-note',
    'Gulf Bangkok Channel 3 Media Salon Note',
    '整理公开区、媒体图像物料和这类个人 salon 值不值得继续追的判断点。',
    'Gulf 这种个人媒体 salon，最值得先看的不是活动看起来多高级，而是公开区有没有价值、媒体会不会产出足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、媒体图像物料和品牌更新密度，帮助想补 Channel 3 个人线的粉丝快速判断这场曼谷活动值不值得继续盯。比起只看品牌标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、品牌图集或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-08-25T13:20:00+08:00',
    'https://www.ch3plus.com/',
    array['gulf-kanawut']
  ),
  (
    'fluke-seoul-wabisabi-archive-day-guide',
    'Fluke Seoul Wabi Sabi Archive Day Guide',
    '整理预约、签到和限定物料，帮助粉丝判断这类 archive day 怎么玩最值。',
    'Fluke 这种 archive day 对粉丝来说，真正值得先看的不是“有没有活动”，而是预约、签到和限定物料到底怎么玩。很多人会被活动名吸引过去，但如果没先看规则，现场体验往往会差很多。\n\n这条快读会优先说明预约方式、签到规则和限定物料，帮助第一次补 Studio Wabi Sabi 第三层人物线的粉丝快速判断这场门店活动适不适合去。比起只刷几张预热图，先看一条整理好的中文说明会更省时间。\n\n如果后续补出门店地图、预约页或限定领取规则，站内会继续把这些更新并回这一条。',
    '品牌活动',
    'published',
    '2026-08-27T14:40:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['fluke-natouch']
  ),
  (
    'road-singapore-open-label-pop-up-day-note',
    'Road Singapore Open Label Pop-up Day Note',
    '整理预约、签到和限定物料，帮助粉丝判断这类海外 pop-up day 怎么玩最值。',
    'Road 这种 pop-up day 对粉丝来说，真正值得先看的不是“有没有活动”，而是预约、签到和限定物料到底怎么玩。很多人会被活动名吸引过去，但如果没先看规则，现场体验往往会差很多。\n\n这条快读会优先说明预约方式、签到规则和限定物料，帮助第一次补 OPEN LABEL 第二层人物线的粉丝快速判断这场门店活动适不适合去。比起只刷几张预热图，先看一条整理好的中文说明会更省时间。\n\n如果后续补出门店地图、预约页或限定领取规则，站内会继续把这些更新并回这一条。',
    '品牌活动',
    'published',
    '2026-08-29T14:10:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['road-yongyut']
  ),
  (
    'win-jakarta-open-label-style-night-watch',
    'Win Jakarta Open Label Style Night Watch',
    '整理媒体露出、公开区和这类 style night 值不值得继续盯的判断点。',
    'Win 这种 style night 最值得先看的，不是活动看起来是不是大，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明媒体露出、公开区和会后图像物料，帮助想继续补 OPEN LABEL 线的粉丝快速判断这场活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-08-31T11:50:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['win-metawin']
  ),
  (
    'gulf-shenzhen-channel3-brand-forum-note',
    'Gulf Shenzhen Channel 3 Brand Forum Note',
    '整理公开区、媒体物料和这类品牌 forum 值不值得继续追的判断点。',
    'Gulf 这种品牌 forum，最值得先看的不是活动看起来多正式，而是公开区有没有价值、媒体会不会产出足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、媒体物料和品牌更新密度，帮助想补 Channel 3 个人线的粉丝快速判断这场深圳活动值不值得继续盯。比起只看品牌标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、品牌图集或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-09-02T13:20:00+08:00',
    'https://www.ch3plus.com/',
    array['gulf-kanawut']
  ),
  (
    'bow-bangkok-channel3-cafe-day-guide',
    'Bow Bangkok Channel 3 Cafe Day Guide',
    '整理预约、签到和限定物料，帮助粉丝判断这类 cafe day 适不适合低门槛参与。',
    'Bow 这种 cafe day 的价值，通常不在于活动有多大，而在于它是不是一场适合低门槛参与、顺手建立人物印象的活动。对新粉来说，这类活动最需要先看的是门店预约、签到规则和现场互动强度。\n\n这条整理会优先说明预约方式、签到规则和店内互动重点，帮助第一次补 Channel 3 个人线的粉丝快速判断值不值得去现场。相比只看活动标题，这条快读更容易让你知道这到底是一场“去打卡”还是“要认真准备”的活动。\n\n如果后续补出门店地图、预约页或店内特典信息，站内会继续并回这一条。',
    '品牌活动',
    'published',
    '2026-09-04T14:40:00+08:00',
    'https://www.ch3plus.com/',
    array['bow-maylada']
  ),
  (
    'prem-hong-kong-wabisabi-fan-circle-note',
    'Prem Hong Kong Wabi Sabi Fan Circle Note',
    '整理票区、互动福利和这类香港 fan circle 值不值得专门安排行程的判断点。',
    'Prem 这种香港 fan circle，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、互动福利和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、互动福利和会后规则，帮助第一次补 Studio Wabi Sabi 人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-09-06T15:20:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['prem-warut']
  ),
  (
    'earth-kuala-lumpur-wabisabi-media-day-note',
    'Earth Kuala Lumpur Wabi Sabi Media Day Note',
    '整理公开区、媒体图像物料和这类海外 media day 值不值得继续盯的判断点。',
    'Earth 这种 overseas media day 最值得先看的，不是活动标题，而是公开区和媒体图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明公开区、媒体图像物料和品牌更新密度，帮助想补 Studio Wabi Sabi 人物线的粉丝快速判断这场活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-09-08T11:30:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['earth-katsamonnat']
  ),
  (
    'ouroad-kuala-lumpur-open-label-weekend-guide',
    'OuRoad Kuala Lumpur Open Label Weekend Guide',
    '整理票区、双人互动和这类海外 weekend 活动值不值得专门安排行程的判断点。',
    'OuRoad 这种海外 weekend 活动，最值得先看的不是活动名字，而是这场到底值不值得专门跨城去追。票区、双人互动和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、双人互动和会后规则，帮助第一次补 OPEN LABEL 第二层人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-09-10T15:20:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['ou-chakrit','road-yongyut']
  ),
  (
    'win-manila-open-label-press-room-note',
    'Win Manila Open Label Press Room Note',
    '整理媒体露出、公开区和这类 press room 值不值得继续盯的判断点。',
    'Win 这种 press room 最值得先看的，不是活动看起来是不是大，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明媒体露出、公开区和会后图像物料，帮助想继续补 OPEN LABEL 线的粉丝快速判断这场活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-09-12T11:50:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['win-metawin']
  ),
  (
    'gulf-chengdu-channel3-style-day-note',
    'Gulf Chengdu Channel 3 Style Day Note',
    '整理公开区、媒体物料和这类品牌 style day 值不值得继续追的判断点。',
    'Gulf 这种 style day，最值得先看的不是活动看起来多正式，而是公开区有没有价值、媒体会不会产出足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、媒体物料和品牌更新密度，帮助想补 Channel 3 个人线的粉丝快速判断这场成都活动值不值得继续盯。比起只看品牌标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、品牌图集或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-09-14T13:20:00+08:00',
    'https://www.ch3plus.com/',
    array['gulf-kanawut']
  ),
  (
    'bow-hong-kong-channel3-beauty-talk-guide',
    'Bow Hong Kong Channel 3 Beauty Talk Guide',
    '整理预约、签到和这类门店 beauty talk 适不适合低门槛参与的判断点。',
    'Bow 这种 beauty talk 的价值，通常不在于活动有多大，而在于它是不是一场适合低门槛参与、顺手建立人物印象的活动。对新粉来说，这类活动最需要先看的是门店预约、签到规则和现场互动强度。\n\n这条整理会优先说明预约方式、签到规则和店内互动重点，帮助第一次补 Channel 3 个人线的粉丝快速判断值不值得去现场。相比只看活动标题，这条快读更容易让你知道这到底是一场“去打卡”还是“要认真准备”的活动。\n\n如果后续补出门店地图、预约页或店内特典信息，站内会继续并回这一条。',
    '品牌活动',
    'published',
    '2026-09-16T14:40:00+08:00',
    'https://www.ch3plus.com/',
    array['bow-maylada']
  ),
  (
    'fluke-taipei-wabisabi-archive-night-guide',
    'Fluke Taipei Wabi Sabi Archive Night Guide',
    '整理预约、签到和限定物料，帮助粉丝判断这类 archive night 怎么玩最值。',
    'Fluke 这种 archive night 对粉丝来说，真正值得先看的不是“有没有活动”，而是预约、签到和限定物料到底怎么玩。很多人会被活动名吸引过去，但如果没先看规则，现场体验往往会差很多。\n\n这条快读会优先说明预约方式、签到规则和限定物料，帮助第一次补 Studio Wabi Sabi 人物线的粉丝快速判断这场门店活动适不适合去。比起只刷几张预热图，先看一条整理好的中文说明会更省时间。\n\n如果后续补出门店地图、预约页或限定领取规则，站内会继续把这些更新并回这一条。',
    '品牌活动',
    'published',
    '2026-09-18T14:10:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['fluke-natouch']
  ),
  (
    'prem-seoul-wabisabi-weekend-circle-note',
    'Prem Seoul Wabi Sabi Weekend Circle Note',
    '整理票区、互动福利和这类首尔 weekend circle 值不值得专门安排行程的判断点。',
    'Prem 这种首尔 weekend circle，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、互动福利和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、互动福利和会后规则，帮助第一次补 Studio Wabi Sabi 人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-09-20T15:20:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['prem-warut']
  ),
  (
    'ouroad-seoul-open-label-pair-day-note',
    'OuRoad Seoul Open Label Pair Day Note',
    '整理公开区、双人露出和这类品牌 pair day 值不值得继续盯的判断点。',
    'OuRoad 这种 pair day，最值得先看的不是活动名本身，而是公开区有没有价值、品牌会不会放出足够双人物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、双人露出和图像物料密度，帮助想继续补 OPEN LABEL 第二层人物线的粉丝快速判断这场首尔活动值不值得继续盯。比起只看品牌标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、品牌图集或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-09-22T12:20:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['ou-chakrit','road-yongyut']
  ),
  (
    'road-bangkok-open-label-fan-studio-guide',
    'Road Bangkok Open Label Fan Studio Guide',
    '整理票区、互动福利和这类小型 fan studio 值不值得专门安排时间的判断点。',
    'Road 这种 fan studio，最值得先看的不是活动名字看起来多轻，而是票区、互动福利和会后规则到底值不值得你专门安排时间。对粉丝来说，这会直接影响你是冲现场，还是等站内快读就够了。\n\n这条快读会优先说明票区、互动福利和会后规则，帮助第一次补 OPEN LABEL 第二层人物线的新粉快速判断这场活动更偏福利型还是互动型。比起只看活动海报，先看这一条会更容易做决定。\n\n如果后续补出正式票区图、福利细则或会后物料，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-09-24T15:10:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['road-yongyut']
  ),
  (
    'fortpeat-manila-memindy-live-room-note',
    'FortPeat Manila MEMINDY Live Room Note',
    '整理预约方式、回看入口和这类 live room 最值得先看的判断点。',
    'FortPeat 这种 live room 的价值，通常不在于活动有多大，而在于它是不是一条适合低门槛参与、顺手补双人线的入口。对新粉来说，预约方式、回看入口和媒体连线节奏往往比活动名字本身更重要。\n\n这条整理会优先说明预约方式、回看入口和媒体连线重点，帮助第一次补 MEMINDY 双人线的粉丝快速理解这场活动怎么玩。比起只刷碎片内容，先看一条完整中文快读更省时间。\n\n如果后续补出正式直播页、回看链接或会后互动物料，站内会继续把这些更新并回这条稿里。',
    '直播',
    'published',
    '2026-09-26T13:00:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    array['fort-thitipong','peat-wasuthorn']
  ),
  (
    'bossnoeul-hong-kong-memindy-fan-night-watch',
    'BossNoeul Hong Kong MEMINDY Fan Night Watch',
    '整理票区、双人互动和这类香港 fan night 值不值得专门安排行程的判断点。',
    'BossNoeul 这种 fan night，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、双人互动和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、双人互动和会后规则，帮助第一次补 MEMINDY 第二条主线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-09-28T15:30:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    array['boss-chaikamon','noeul-nuttarat']
  ),
  (
    'earth-tokyo-wabisabi-reading-day-guide',
    'Earth Tokyo Wabi Sabi Reading Day Guide',
    '整理预约、签到和限定物料，帮助粉丝判断这类 reading day 怎么玩最值。',
    'Earth 这种 reading day 对粉丝来说，真正值得先看的不是“有没有活动”，而是预约、签到和限定物料到底怎么玩。很多人会被活动名吸引过去，但如果没先看规则，现场体验往往会差很多。\n\n这条快读会优先说明预约方式、签到规则和限定物料，帮助第一次补 Studio Wabi Sabi 人物线的粉丝快速判断这场门店活动适不适合去。比起只刷几张预热图，先看一条整理好的中文说明会更省时间。\n\n如果后续补出门店地图、预约页或限定领取规则，站内会继续把这些更新并回这一条。',
    '品牌活动',
    'published',
    '2026-09-30T14:00:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['earth-katsamonnat']
  ),
  (
    'fluke-bangkok-wabisabi-capsule-night-note',
    'Fluke Bangkok Wabi Sabi Capsule Night Note',
    '整理公开区、品牌物料和这类 capsule night 值不值得继续盯的判断点。',
    'Fluke 这种 capsule night，最值得先看的不是活动看起来多正式，而是公开区有没有价值、品牌会不会放出足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明公开区、品牌物料和展陈节奏，帮助想补 Studio Wabi Sabi 人物线的粉丝快速判断这场曼谷活动值不值得继续盯。比起只看活动标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-10-02T12:40:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['fluke-natouch']
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body_md = excluded.body_md,
  category = excluded.category,
  review_status = excluded.review_status,
  published_at = excluded.published_at,
  source_url = excluded.source_url,
  related_star_slugs = excluded.related_star_slugs,
  updated_at = now();

insert into events (
  slug,
  title,
  type,
  status,
  city,
  venue,
  starts_at,
  source_url,
  summary
) values
  (
    'ou-seoul-open-label-editor-session',
    'Ou Seoul Open Label Editor Session',
    'brand',
    'scheduled',
    '首尔',
    'Hannam Editorial Room',
    '2026-11-19T15:00:00+09:00',
    'https://www.instagram.com/openlabel_th/',
    '偏媒体编辑室露出和少量现场物料的一场首尔活动，适合先看公开区和图像更新节奏。'
  ),
  (
    'road-singapore-open-label-store-visit',
    'Road Singapore Open Label Store Visit',
    'brand',
    'scheduled',
    '新加坡',
    'ION Orchard Store Lounge',
    '2026-11-22T14:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '偏门店到访和限定物料露出的一场新加坡活动，适合先看预约和签到方式。'
  ),
  (
    'fort-bangkok-memindy-press-check',
    'Fort Bangkok MEMINDY Press Check',
    'brand',
    'scheduled',
    '曼谷',
    'Siam Hall Press Room',
    '2026-11-20T16:30:00+07:00',
    'https://www.instagram.com/memindyofficial/',
    '偏媒体露出和短时公开区判断的一场 press check，适合先看会后图像物料和到场窗口。'
  ),
  (
    'peat-taipei-memindy-fan-room',
    'Peat Taipei MEMINDY Fan Room',
    'fanmeeting',
    'scheduled',
    '台北',
    'Songshan Fan Room',
    '2026-11-24T18:30:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    '偏近距离互动和会后福利的一场台北 fan room，适合先看票区和签到规则。'
  ),
  (
    'earth-bangkok-wabisabi-studio-brief',
    'Earth Bangkok Wabi Sabi Studio Brief',
    'brand',
    'scheduled',
    '曼谷',
    'Ari Studio Loft',
    '2026-11-21T15:30:00+07:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏小型 studio 简报和门店露出的一场曼谷活动，适合先看预约方式和现场可见度。'
  ),
  (
    'prem-singapore-wabisabi-circle-day',
    'Prem Singapore Wabi Sabi Circle Day',
    'fanmeeting',
    'scheduled',
    '新加坡',
    'Bugis Fan Circle Room',
    '2026-11-26T17:30:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    '偏近距离互动和海外粉丝沟通的一场新加坡 circle day，适合先看票区和会后福利。'
  )
on conflict (slug) do update set
  title = excluded.title,
  type = excluded.type,
  status = excluded.status,
  city = excluded.city,
  venue = excluded.venue,
  starts_at = excluded.starts_at,
  source_url = excluded.source_url,
  summary = excluded.summary,
  updated_at = now();

insert into event_stars (event_id, star_id, role)
select e.id, s.id, 'guest'
from (
  values
    ('ou-seoul-open-label-editor-session','ou-chakrit'),
    ('road-singapore-open-label-store-visit','road-yongyut'),
    ('fort-bangkok-memindy-press-check','fort-thitipong'),
    ('peat-taipei-memindy-fan-room','peat-wasuthorn'),
    ('earth-bangkok-wabisabi-studio-brief','earth-katsamonnat'),
    ('prem-singapore-wabisabi-circle-day','prem-warut')
) as links(event_slug, star_slug)
join events e on e.slug = links.event_slug
join stars s on s.slug = links.star_slug
on conflict (event_id, star_id) do nothing;

insert into news_posts (
  slug,
  title,
  excerpt,
  body_md,
  category,
  review_status,
  published_at,
  source_url,
  related_star_slugs
) values
  (
    'ou-seoul-open-label-editor-session-note',
    'Ou Seoul Open Label Editor Session Note',
    '整理公开区、会后图像物料和这类 editor session 值不值得继续盯的判断点。',
    'Ou 这种 editor session 最值得先看的，不是活动名字本身，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明公开区、会后图像物料和媒体更新密度，帮助想继续补 OPEN LABEL 第二层人物线的粉丝快速判断这场首尔活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种中文快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-10-04T11:30:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['ou-chakrit']
  ),
  (
    'road-singapore-open-label-store-visit-guide',
    'Road Singapore Open Label Store Visit Guide',
    '整理预约、签到和限定物料，帮助粉丝判断这类门店活动值不值得去。',
    'Road 这种 store visit 对粉丝来说，真正值得先看的不是“有没有活动”，而是预约、签到和限定物料到底怎么玩。很多人会被活动名吸引过去，但如果没先看规则，现场体验往往会差很多。\n\n这条快读会优先说明预约方式、签到规则和限定物料，帮助第一次补 OPEN LABEL 第二层人物线的粉丝快速判断这场门店活动适不适合去。比起只刷几张预热图，先看一条整理好的中文说明会更省时间。\n\n如果后续补出门店地图、预约页或限定领取规则，站内会继续把这些更新并回这一条。',
    '品牌活动',
    'published',
    '2026-10-06T14:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    array['road-yongyut']
  ),
  (
    'fort-bangkok-memindy-press-check-note',
    'Fort Bangkok MEMINDY Press Check Note',
    '整理公开区、会后物料和这类 press check 值不值得继续盯的判断点。',
    'Fort 这种 press check 最值得先看的，不是活动看起来是不是大，而是公开区和会后图像物料到底够不够值。对粉丝来说，真正决定值不值得继续追的，通常是现场可见度、品牌会不会持续放图，以及媒体会不会给第二波内容。\n\n这条整理会优先说明公开区、会后图像物料和媒体更新密度，帮助想继续补 MEMINDY 主追线的粉丝快速判断这场曼谷活动更适合去现场，还是更适合等站内整理。比起先刷零散物料，这种中文快读更容易帮助你做决定。\n\n如果后续补出正式时段、媒体图或品牌联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-10-08T12:10:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    array['fort-thitipong']
  ),
  (
    'peat-taipei-memindy-fan-room-watch',
    'Peat Taipei MEMINDY Fan Room Watch',
    '整理票区、签到和这类台北 fan room 值不值得专门安排行程的判断点。',
    'Peat 这种台北 fan room，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、签到规则和会后福利，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、签到规则和会后福利，帮助第一次补 MEMINDY 主追线的新粉快速判断这场活动更偏福利型还是互动型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-10-10T15:00:00+08:00',
    'https://www.instagram.com/memindyofficial/',
    array['peat-wasuthorn']
  ),
  (
    'earth-bangkok-wabisabi-studio-brief-guide',
    'Earth Bangkok Wabi Sabi Studio Brief Guide',
    '整理预约方式、现场可见度和这类 studio brief 最值得先看的判断点。',
    'Earth 这种 studio brief 最值得先看的，不是活动标题，而是预约方式、现场可见度和会后有没有足够图像物料。对粉丝来说，这会直接影响到底要不要去现场，还是等站内整理和品牌图就够了。\n\n这条整理会优先说明预约方式、现场可见度和会后更新密度，帮助想补 Studio Wabi Sabi 人物线的粉丝快速判断这场曼谷活动值不值得继续盯。比起只看活动标题，这种中文快读更能帮你建立判断。\n\n如果后续补出正式时段、预约页或门店联动，站内会继续把这些更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-10-12T13:30:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['earth-katsamonnat']
  ),
  (
    'prem-singapore-wabisabi-circle-day-note',
    'Prem Singapore Wabi Sabi Circle Day Note',
    '整理票区、互动福利和这类新加坡 circle day 值不值得专门安排行程的判断点。',
    'Prem 这种新加坡 circle day，对粉丝来说最重要的并不是活动名字，而是这场到底值不值得专门跨城去追。票区、互动福利和会后规则，会直接影响这场活动的实际价值。\n\n这条快读会优先说明票区、互动福利和会后规则，帮助第一次补 Studio Wabi Sabi 第二层人物线的新粉快速判断这场活动更偏福利型还是舞台型。比起只看活动海报，先看这一条会更容易知道自己该怎么准备。\n\n如果后续补出正式票区图、福利细则或海外粉丝须知，站内会继续把这些更新并回这条稿里。',
    '活动速递',
    'published',
    '2026-10-14T15:40:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    array['prem-warut']
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body_md = excluded.body_md,
  category = excluded.category,
  review_status = excluded.review_status,
  published_at = excluded.published_at,
  source_url = excluded.source_url,
  related_star_slugs = excluded.related_star_slugs,
  updated_at = now();

select 'stars' as table_name, count(*) as total from stars
union all
select 'events', count(*) from events
union all
select 'event_stars', count(*) from event_stars
union all
select 'news_posts', count(*) from news_posts;
