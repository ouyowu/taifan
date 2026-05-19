-- 泰饭网首批线上数据导入
-- 可直接在 Supabase SQL Editor 运行

alter table if exists news_posts add column if not exists review_status text default 'published';

insert into stars (slug, name_cn, name_en, fandom_name, agency, base_city, bio, tags, avatar_url, cover_url, popularity_score, china_fan_priority)
values
  (
    'bright-vaid',
    'Bright',
    'Bright Vachirawit',
    'Brights',
    'Cloud 9 Entertainment',
    '曼谷',
    '跨影视、时尚与品牌活动的头部泰国艺人，在中国粉丝圈的讨论点通常集中在品牌露出、公开到场和跨城活动节奏。',
    array['演员', '歌手', '品牌代言', '高热度'],
    '/portraits/bright-vachirawit.jpg',
    '/portraits/bright-vachirawit.jpg',
    999,
    1
  ),
  (
    'win-metawin',
    'Win',
    'Win Metawin',
    'Snowball Power',
    'One31 / independent brand work',
    '曼谷',
    '在中国粉丝圈长期保持高讨论度，品牌合作、公开站台和出行相关内容都很容易带来集中关注。',
    array['演员', '品牌代言', '高热度', '中国粉丝基础强'],
    '/portraits/win-metawin.png',
    '/portraits/win-metawin.png',
    998,
    2
  ),
  (
    'billkin',
    'Billkin',
    'Billkin',
    'Beside',
    'Billkin Entertainment',
    '曼谷',
    '在中国粉丝侧和 PP Krit 一起有很强的 CP 与个人热度，舞台、演唱会和联名活动通常最能拉动讨论。',
    array['演员', '歌手', '高热度', 'BKPP'],
    '/portraits/billkin.png',
    '/portraits/billkin.png',
    997,
    3
  ),
  (
    'pp-krit',
    'PP Krit',
    'PP Krit',
    'PP Baobei',
    'PP Krit Entertainment',
    '曼谷',
    '兼具时尚影响力与舞台表现力，对中国粉丝来说最值得持续追的是杂志、品牌秀场和舞台活动线。',
    array['演员', '歌手', '时尚', '舞台'],
    '/portraits/pp-krit.jpg',
    '/portraits/pp-krit.jpg',
    996,
    4
  ),
  (
    'gemini-norawit',
    'Gemini',
    'Gemini Norawit',
    'Nong',
    'GMMTV',
    '曼谷',
    '新一代中国粉丝关注度很高的 GMMTV 艺人，校园活动、品牌站台和见面会内容增长很快。',
    array['演员', '歌手', '新生代', '高增长'],
    '/portraits/gemini-norawit.png',
    '/portraits/gemini-norawit.png',
    995,
    5
  ),
  (
    'fourth-nattawat',
    'Fourth',
    'Fourth Nattawat',
    'Fourthnatic',
    'GMMTV',
    '曼谷',
    '和 Gemini 一样在中国粉丝圈讨论度很高，粉丝见面会、校园巡演和直播内容都很适合持续追踪。',
    array['演员', '新生代', '高增长', 'GMMTV'],
    '/portraits/fourth-nattawat.png',
    '/portraits/fourth-nattawat.png',
    994,
    6
  ),
  (
    'lingorm',
    'LingOrm',
    'LingOrm',
    'Lings',
    'Channel 3',
    '曼谷',
    '以双人 CP 活动和粉丝互动活动见长，适合新粉先从直播、见面会和剧宣活动进入。',
    array['CP', '粉丝见面会', '剧宣'],
    '/portraits/orm-kornnaphat.png',
    '/portraits/lingling-kwong.png',
    980,
    20
  ),
  (
    'zee-pruk',
    'Zee',
    'Zee Pruk',
    'ZonZon',
    'DOMUNDI TV',
    '曼谷',
    'DOMUNDI TV 最有代表性的头部艺人之一，适合从《Cutie Pie》《The Next Prince》相关活动、演唱会幕后和国际时装周露出开始追。',
    array['演员', '品牌活动', '演唱会', 'DOMUNDI'],
    'https://i.ytimg.com/vi/L4J-T_UN7xg/maxresdefault.jpg',
    'https://i.ytimg.com/vi/ZW7KWnLkCWc/maxresdefault.jpg',
    973,
    27
  ),
  (
    'nunew-chawarin',
    'NuNew',
    'NuNew Chawarin',
    'NanaNu',
    'DOMUNDI TV',
    '曼谷',
    'DOMUNDI TV 中国粉丝最熟悉的艺人之一，适合从《Cutie Pie》后的演唱会、音乐舞台和品牌露出切入。',
    array['歌手', '演员', '舞台', 'DOMUNDI'],
    'https://i.ytimg.com/vi/zWAnu3bWwuE/maxresdefault.jpg',
    'https://i.ytimg.com/vi/ZW7KWnLkCWc/maxresdefault.jpg',
    972,
    28
  ),
  (
    'jj-radchapon',
    'JJ',
    'JJ Radchapon',
    'JJFans',
    'DOMUNDI TV',
    '曼谷',
    '适合从官方 Cover 视频和公开活动开始认识，是 DOMUNDI 近阶段比较适合新粉入门的一条线。',
    array['歌手', 'Cover 视频', '新生代', 'DOMUNDI'],
    'https://i.ytimg.com/vi/tviZhlgCiW0/maxresdefault.jpg',
    'https://i.ytimg.com/vi/tviZhlgCiW0/maxresdefault.jpg',
    969,
    31
  ),
  (
    'latte-kim',
    'Latte / Kim',
    'Latte Kim',
    'LatteKimFans',
    'DOMUNDI TV',
    '曼谷',
    '适合从官方 Cover 与公开视频切入，属于很适合做库宽度补充的 DOMUNDI 艺人线。',
    array['歌手', '公开视频', '新生代', 'DOMUNDI'],
    'https://i.ytimg.com/vi/c0-IbET0aZE/maxresdefault.jpg',
    'https://i.ytimg.com/vi/c0-IbET0aZE/maxresdefault.jpg',
    968,
    32
  ),
  (
    'mile-phakphum',
    'Mile',
    'Mile Phakphum',
    'Miles',
    'Be On Cloud',
    '曼谷',
    'Be On Cloud 里最有中国粉丝辨识度的头部艺人之一，适合从《KinnPorsche》《Man Suang》到个人演唱会和官方 vlog 这条线开始追。',
    array['演员', '电影宣传', '品牌活动', 'Be On Cloud'],
    'https://i.ytimg.com/vi/FvycaT_ZaTs/maxresdefault.jpg',
    'https://i.ytimg.com/vi/Tk_H10kFYHA/maxresdefault.jpg',
    971,
    29
  ),
  (
    'apo-nattawin',
    'Apo',
    'Apo Nattawin',
    'ApoFans',
    'Be On Cloud',
    '曼谷',
    '适合从《KinnPorsche》《Man Suang》到上海粉丝签售、项目发布会和官方 vlog 这条线一起认识，是 Be On Cloud 最核心的艺人之一。',
    array['演员', '品牌活动', '项目宣传', 'Be On Cloud'],
    'https://i.ytimg.com/vi/Xz232wXzxoI/maxresdefault.jpg',
    'https://i.ytimg.com/vi/uwlfSckmMEQ/maxresdefault.jpg',
    970,
    30
  ),
  (
    'bible-wichapas',
    'Bible',
    'Bible Wichapas',
    'BibleFans',
    'Be On Cloud',
    '曼谷',
    '适合从《KinnPorsche》《4Minutes》到个人 one-day vlog、OST 和角色故事这条线切入，是 Be On Cloud 很适合继续扩充的一条艺人线。',
    array['演员', '幕后花絮', '项目宣传', 'Be On Cloud'],
    'https://i.ytimg.com/vi/xXJp8dOMzzE/maxresdefault.jpg',
    'https://i.ytimg.com/vi/yb8RNiZekt4/maxresdefault.jpg',
    967,
    33
  ),
  (
    'jes-jespipat',
    'Jes',
    'Jes Jespipat',
    'JesFans',
    'Be On Cloud',
    '曼谷',
    '适合从《4Minutes》角色发布、Buppha 电影宣传和近期公开视频开始认识，属于 Be On Cloud 现在最适合继续补厚的一条艺人线。',
    array['演员', '项目宣传', '公开视频', 'Be On Cloud'],
    'https://i.ytimg.com/vi/h7v-DgEGOnw/maxresdefault.jpg',
    'https://i.ytimg.com/vi/mTLXbLwgT5s/maxresdefault.jpg',
    966,
    34
  ),
  (
    'dew-jirawat',
    'Dew',
    'Dew Jirawat',
    'Dewlions',
    'GMMTV',
    '曼谷',
    'GMMTV 近年在中国粉丝圈关注度很高的演员之一，品牌活动、公开露出和影视宣传线都很适合持续追踪。',
    array['演员', '品牌活动', 'GMMTV', '高热度'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Dew_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Dew_300.jpg',
    992,
    8
  ),
  (
    'joong-archen',
    'Joong',
    'Joong Archen',
    'Junglers',
    'GMMTV',
    '曼谷',
    '双人活动、品牌露出和粉丝见面会都很有讨论度，适合从活动线和人物关系线一起追。',
    array['演员', '品牌活动', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Joong_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Joong_300.jpg',
    991,
    9
  ),
  (
    'dunk-natachai',
    'Dunk',
    'Dunk Natachai',
    'Dunkers',
    'GMMTV',
    '曼谷',
    '适合从双人活动、品牌更新和线下公开露出开始认识，是很典型的高互动型艺人路线。',
    array['演员', '品牌活动', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Dunk_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Dunk_300.jpg',
    990,
    10
  ),
  (
    'first-kanaphan',
    'First',
    'First Kanaphan',
    'Khunnoos',
    'GMMTV',
    '曼谷',
    '人物向内容和双人活动都很强，粉丝很适合从采访、活动和公开视频一起补课。',
    array['演员', '采访', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/First_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/First_300.jpg',
    989,
    11
  ),
  (
    'khaotung-thanawat',
    'Khaotung',
    'Khaotung Thanawat',
    'KaoTung',
    'GMMTV',
    '曼谷',
    '活动表现和人物向讨论都很强，适合从活动线和人物内容双线进入。',
    array['演员', '活动向', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Khaotung_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Khaotung_300.jpg',
    988,
    12
  ),
  (
    'force-jiratchapong',
    'Force',
    'Force Jiratchapong',
    'Forces',
    'GMMTV',
    '曼谷',
    '品牌、活动和双人内容都适合做粉丝入口，尤其适合先追公开露出和站内快读。',
    array['演员', '品牌活动', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Force_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Force_300.jpg',
    987,
    13
  ),
  (
    'book-kasidet',
    'Book',
    'Book Kasidet',
    'Bookies',
    'GMMTV',
    '曼谷',
    '适合从活动线、双人线和人物气质内容开始补，是很典型的持续追踪型艺人。',
    array['演员', '活动向', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Book_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Book_300.jpg',
    986,
    14
  ),
  (
    'boun-noppanut',
    'Boun',
    'Boun Noppanut',
    'BounPrem',
    'GMMTV',
    '曼谷',
    '适合从活动、公开露出和站内中文快读进入，双人活动线也很值得一起追。',
    array['演员', '活动向', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Boun_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Boun_300.jpg',
    985,
    15
  ),
  (
    'aou-thanaboon',
    'Aou',
    'Aou Thanaboon',
    'AouFans',
    'GMMTV',
    '曼谷',
    '公开活动和人物向关注都在增长，适合作为新一批补充进艺人库的高潜力艺人。',
    array['演员', '新生代', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Aou_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Aou_300.jpg',
    984,
    16
  ),
  (
    'boom-tharatorn',
    'Boom',
    'Boom Tharatorn',
    'Boomers',
    'GMMTV',
    '曼谷',
    '活动向和公开视频向都比较适合入门，适合作为艺人库厚度的补充。',
    array['演员', '活动向', '视频向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Boom_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Boom_300.jpg',
    983,
    17
  ),
  (
    'mix-sahaphap',
    'Mix',
    'Mix Sahaphap',
    'Mixels',
    'GMMTV',
    '曼谷',
    '在中国粉丝圈长期有稳定关注度，适合从活动、人物访谈和双人内容一起认识。',
    array['演员', '人物向', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Mix_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Mix_300.jpg',
    982,
    18
  ),
  (
    'nanon-korapat',
    'Nanon',
    'Nanon Korapat',
    'NANONAC',
    'GMMTV',
    '曼谷',
    '影视、舞台和品牌活动兼具，适合从多条内容线一起切入，是很典型的高认知度艺人。',
    array['演员', '歌手', '品牌活动', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Nanon_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Nanon_300.jpg',
    981,
    19
  ),
  (
    'pond-naravit',
    'Pond',
    'Pond Naravit',
    'PondPhuwin',
    'GMMTV',
    '曼谷',
    '适合从品牌更新、活动露出和双人内容开始追，是中国粉丝熟悉度比较高的一条线。',
    array['演员', '品牌活动', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Pond_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Pond_300.jpg',
    979,
    21
  ),
  (
    'phuwin-tangsakyuen',
    'Phuwin',
    'Phuwin Tangsakyuen',
    'PondPhuwin',
    'GMMTV',
    '曼谷',
    '适合从活动、品牌线和人物内容一起追，尤其适合作为新粉补课对象。',
    array['演员', '人物向', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Phuwin_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Phuwin_300.jpg',
    978,
    22
  ),
  (
    'off-jumpol',
    'Off',
    'Off Jumpol',
    'Babii',
    'GMMTV',
    '曼谷',
    '中国粉丝辨识度很高，适合从品牌活动、活动主持和双人内容一起进入。',
    array['演员', '品牌活动', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Off_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Off_300.jpg',
    977,
    23
  ),
  (
    'tay-tawan',
    'Tay',
    'Tay Tawan',
    'Polca',
    'GMMTV',
    '曼谷',
    '人物辨识度和公开活动价值都很高，适合从品牌活动、见面会和人物快读开始。',
    array['演员', '见面会', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Tay_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Tay_300.jpg',
    976,
    24
  ),
  (
    'new-thitipoom',
    'New',
    'New Thitipoom',
    'Polca',
    'GMMTV',
    '曼谷',
    '适合从活动、品牌和人物内容一起追，站内快读会比单刷图更有帮助。',
    array['演员', '品牌活动', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/New_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/New_300.jpg',
    975,
    25
  ),
  (
    'perth-tanapon',
    'Perth',
    'Perth Tanapon',
    'Perthlings',
    'GMMTV',
    '曼谷',
    '新旧粉都容易认识的一位，适合从活动线和人物说明一起补内容。',
    array['演员', '活动向', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Perth_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Perth_300.jpg',
    974,
    26
  ),
  (
    'santa-ponsapak',
    'Santa',
    'Santa Pongsapak',
    'SantaFans',
    'GMMTV',
    '曼谷',
    '新生代关注度增长快，适合作为下一批值得追的新人入口。',
    array['演员', '新生代', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Santa_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Santa_300.jpg',
    973,
    27
  ),
  (
    'sea-tawinan',
    'Sea',
    'Sea Tawinan',
    'Muanfas',
    'GMMTV',
    '曼谷',
    '适合从人物内容、双人活动和见面会线一起追，属于很典型的连续补课型艺人。',
    array['演员', '人物向', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Sea_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Sea_300.jpg',
    972,
    28
  ),
  (
    'singto-prachaya',
    'Singto',
    'Singto Prachaya',
    'Peraya',
    'GMMTV',
    '曼谷',
    '有很强的历史认知度，适合从活动与人物说明一起补回站内内容厚度。',
    array['演员', '人物向', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Singto_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Singto_300.jpg',
    971,
    29
  ),
  (
    'winny-thanawin',
    'Winny',
    'Winny Thanawin',
    'WinnyFans',
    'GMMTV',
    '曼谷',
    '适合从活动、人物向内容和新生代双人线开始看，属于很适合站内补课的一类艺人。',
    array['演员', '新生代', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Winny_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Winny_300.jpg',
    970,
    30
  ),
  (
    'milk-pansa',
    'Milk',
    'Milk Pansa',
    'Milkies',
    'GMMTV',
    '曼谷',
    '在中国粉丝侧有持续增长的关注度，适合从活动、品牌和人物快读进入。',
    array['演员', '品牌活动', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Milk_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Milk_300.jpg',
    969,
    31
  ),
  (
    'love-pattranite',
    'Love',
    'Love Pattranite',
    'Lovers',
    'GMMTV',
    '曼谷',
    '适合从人物向内容、活动和品牌露出一起追，站内整理会比碎片内容更好入门。',
    array['演员', '人物向', '品牌活动', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Love_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Love_300.jpg',
    968,
    32
  ),
  (
    'namtan-tipnaree',
    'Namtan',
    'Namtan Tipnaree',
    'NamtanFans',
    'GMMTV',
    '曼谷',
    '人物辨识度和活动价值都不错，适合从人物说明和近期活动一起补。',
    array['演员', '人物向', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Namtan_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Namtan_300.jpg',
    967,
    33
  ),
  (
    'jimmy-jitaraphol',
    'Jimmy',
    'Jimmy Jitaraphol',
    'Muanjai',
    'GMMTV',
    '曼谷',
    '适合从见面会、活动和双人线一起进入，是很典型的粉丝会优先看活动页的一类艺人。',
    array['演员', '见面会', '双人线', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Jimmy_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Jimmy_300.jpg',
    966,
    34
  ),
  (
    'luke-ishikawa',
    'Luke',
    'Luke Ishikawa',
    'Lukes',
    'GMMTV',
    '曼谷',
    '品牌活动、人物辨识度和公开露出都很适合作为站内入口，适合先看活动和品牌线。',
    array['演员', '品牌活动', '人物向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Luke_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Luke_300.jpg',
    965,
    35
  ),
  (
    'krist-perawat',
    'Krist',
    'Krist Perawat',
    'Peraya',
    'GMMTV',
    '曼谷',
    '回坑用户和老粉辨识度都很高，适合补进艺人库做更成熟的内容层次。',
    array['演员', '人物向', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Krist_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Krist_300.jpg',
    964,
    36
  ),
  (
    'nani-hirunkit',
    'Nani',
    'Nani Hirunkit',
    'NaniFans',
    'GMMTV',
    '曼谷',
    '新一代关注度增长很快，适合作为高潜力艺人补进站内入口。',
    array['演员', '新生代', '品牌活动', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Nani_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Nani_300.jpg',
    963,
    37
  ),
  (
    'marc-natarit',
    'Marc',
    'Marc Natarit',
    'MarcFans',
    'GMMTV',
    '曼谷',
    '适合逐步补进艺人库的新人线，先从活动和公开视频开始看会最轻松。',
    array['演员', '新生代', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Marc_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Marc_300.jpg',
    962,
    38
  ),
  (
    'william-jakrapatr',
    'William',
    'William Jakrapatr',
    'WilliamFans',
    'GMMTV',
    '曼谷',
    '适合从活动、公开露出和新生代内容一起认识，作为补充对象很合适。',
    array['演员', '新生代', '活动向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/William_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/William_300.jpg',
    961,
    39
  ),
  (
    'satang-kittiphop',
    'Satang',
    'Satang Kittiphop',
    'SatangFans',
    'GMMTV',
    '曼谷',
    '适合从活动、公开露出和视频内容一起进入，是很适合作为新粉补充对象的一位。',
    array['演员', '活动向', '视频向', 'GMMTV'],
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Satang_300.jpg',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Satang_300.jpg',
    960,
    40
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

insert into events (slug, title, type, status, city, venue, starts_at, ends_at, source_url, summary, ai_extracted)
values
  (
    'bright-shanghai-fanmeeting-2026',
    'Bright Vachirawit Fan Meeting in Shanghai 2026',
    'fanmeeting',
    'selling',
    '上海',
    '静安体育中心',
    '2026-06-08T19:30:00+08:00',
    '2026-06-08T21:30:00+08:00',
    null,
    '面向中国粉丝的见面互动场，包含采访、问答与小型舞台表演。',
    '{"highlights":["现场福利抽选","中文主持","应援物说明"],"ticketStatus":"预售中","sourceLabel":"CHANGE ARTIST @changeartist_"}'::jsonb
  ),
  (
    'win-shenzhen-brand-pop-up',
    'Win Metawin Shenzhen Brand Pop-up Event',
    'brand',
    'scheduled',
    '深圳',
    '万象天地快闪空间',
    '2026-06-11T18:30:00+08:00',
    null,
    null,
    '适合中国粉丝关注的品牌快闪活动，重点在围观攻略、到场动线和拍摄提醒。',
    '{"highlights":["预约入口","媒体拍摄区","应援物限制"],"ticketStatus":"围观预约","sourceLabel":"OPEN LABEL @openlabel_th"}'::jsonb
  ),
  (
    'billkin-shanghai-live-stage',
    'Billkin Live Stage Shanghai',
    'concert',
    'selling',
    '上海',
    '前滩31演艺中心',
    '2026-06-18T20:00:00+08:00',
    null,
    null,
    '聚焦中国粉丝更关心的开票、座位区和应援安排，是首页值得前置的一类活动。',
    '{"highlights":["票区图","入场时间","应援公告"],"ticketStatus":"开票中","sourceLabel":"BeOnCloud @beoncloud_th"}'::jsonb
  ),
  (
    'pp-krit-beijing-brand-night',
    'PP Krit Brand Night Beijing',
    'brand',
    'scheduled',
    '北京',
    '国贸商圈秀场',
    '2026-06-14T18:00:00+08:00',
    null,
    null,
    '品牌晚宴活动，适合做围观攻略、到场路线和拍摄提醒。',
    '{"highlights":["红毯时间段","媒体区入口","周边住宿建议"],"ticketStatus":"定向邀请","sourceLabel":"DOMUNDI TV @domunditv"}'::jsonb
  ),
  (
    'gemini-fourth-guangzhou-fanmeeting',
    'GeminiFourth Fan Meeting Guangzhou',
    'fanmeeting',
    'scheduled',
    '广州',
    '广交会展馆音乐厅',
    '2026-06-22T19:00:00+08:00',
    null,
    null,
    '新生代高热 CP 向活动，适合在首页给中国粉丝更靠前的曝光位置。',
    '{"highlights":["双人互动环节","官方应援说明","交通建议"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 官方 Instagram"}'::jsonb
  ),
  (
    'first-khaotung-bangkok-stage-talk',
    'FirstKhaotung Bangkok Stage Talk',
    'fanmeeting',
    'scheduled',
    '曼谷',
    'Impact Forum Hall 4',
    '2026-06-29T18:30:00+07:00',
    null,
    null,
    '适合双人线粉丝提前关注的舞台对谈活动，重点在开票节奏和互动福利。',
    '{"highlights":["舞台对谈","双人福利","票务节奏"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 官方活动页"}'::jsonb
  ),
  (
    'off-mix-bangkok-brand-forum',
    'OffMix Bangkok Brand Forum',
    'brand',
    'scheduled',
    '曼谷',
    'Queen Sirikit Hall B',
    '2026-06-27T18:00:00+07:00',
    null,
    null,
    '适合品牌活动向粉丝提前关注的一场公开论坛式露出，重点在预约方式和围观区说明。',
    '{"highlights":["论坛露出","预约入口","围观区提示"],"ticketStatus":"预约待公布","sourceLabel":"GMMTV 品牌合作活动"}'::jsonb
  ),
  (
    'lingorm-guangzhou-live',
    'LingOrm Guangzhou Live Booking Day',
    'broadcast',
    'scheduled',
    '广州',
    '线上直播 + 品牌门店',
    '2026-06-20T16:00:00+08:00',
    null,
    null,
    '门店打卡和直播连线组合活动，适合新粉丝低门槛参与。',
    '{"highlights":["线上预约链接","门店签到提醒","直播切片摘要"],"ticketStatus":"免费预约","sourceLabel":"品牌直播预约页"}'::jsonb
  ),
  (
    'joong-dunk-bangkok-pop-up-day',
    'JoongDunk Bangkok Pop-up Day',
    'brand',
    'scheduled',
    '曼谷',
    'CentralWorld Atrium',
    '2026-06-26T17:00:00+07:00',
    null,
    null,
    '双人线品牌露出活动，适合提前看围观区、品牌礼赠和到场时间。',
    '{"highlights":["围观区说明","品牌礼赠","到场时间"],"ticketStatus":"围观待确认","sourceLabel":"GMMTV 品牌合作线"}'::jsonb
  ),
  (
    'zee-nunew-macau-stage-greeting',
    'ZeeNuNew Macau Stage Greeting',
    'fanmeeting',
    'scheduled',
    '澳门',
    '澳门百老汇舞台厅',
    '2026-07-06T19:00:00+08:00',
    '2026-07-06T21:00:00+08:00',
    null,
    '以舞台问候、双人互动和现场福利为主的见面活动，适合中国粉丝提前准备出行和票务策略。',
    '{"highlights":["双人互动","场馆路线","应援规则"],"ticketStatus":"即将开售","sourceLabel":"DOMUNDI TV 官方公开视频 / 活动页"}'::jsonb
  ),
  (
    'forcebook-kuala-lumpur-fan-night',
    'ForceBook Kuala Lumpur Fan Night',
    'fanmeeting',
    'scheduled',
    '吉隆坡',
    'Plenary Hall KLCC',
    '2026-07-30T19:30:00+08:00',
    null,
    null,
    '适合双人线粉丝提前看福利、票区和酒店区域的一场海外 fan night。',
    '{"highlights":["双人互动","票区图","酒店建议"],"ticketStatus":"预售预告","sourceLabel":"GMMTV 国际活动线"}'::jsonb
  ),
  (
    'boun-prem-bangkok-stage-weekend',
    'BounPrem Bangkok Stage Weekend',
    'fanmeeting',
    'scheduled',
    '曼谷',
    'Union Hall 2',
    '2026-07-26T18:30:00+07:00',
    null,
    null,
    '适合双人线和回坑粉同时关注的舞台周末活动，重点在票务、互动和福利节奏。',
    '{"highlights":["周末双场","互动福利","票务节奏"],"ticketStatus":"即将开售","sourceLabel":"Studio Wabi Sabi 官方活动线"}'::jsonb
  ),
  (
    'mile-apo-hong-kong-fansign',
    'MileApo Hong Kong Fansign Weekend',
    'fanmeeting',
    'scheduled',
    '香港',
    '九龙湾国际展贸中心',
    '2026-07-19T17:30:00+08:00',
    '2026-07-19T20:00:00+08:00',
    null,
    '适合重点关注签售规则、入场批次和周边兑换说明的一场双人活动。',
    '{"highlights":["签售批次","周边兑换","入场规则"],"ticketStatus":"预登记中","sourceLabel":"Be On Cloud 官方视频 / 宣传线索"}'::jsonb
  ),
  (
    'tay-new-bangkok-anniversary-stage',
    'TayNew Bangkok Anniversary Stage',
    'fanmeeting',
    'scheduled',
    '曼谷',
    'Union Hall',
    '2026-07-23T19:00:00+07:00',
    null,
    null,
    '适合回坑用户和双人线粉丝提前关注的纪念活动，重点在福利、座位区和应援说明。',
    '{"highlights":["纪念互动环节","座位分区","应援规则"],"ticketStatus":"预售预告","sourceLabel":"GMMTV 官方活动页"}'::jsonb
  ),
  (
    'bible-jes-singapore-preview-night',
    'BibleJes Singapore Preview Night',
    'brand',
    'scheduled',
    '新加坡',
    '滨海湾艺术中心黑盒',
    '2026-07-28T19:30:00+08:00',
    null,
    null,
    '偏媒体与品牌合作性质的预览夜，值得提前关注是否会开放围观区或二次公开名额。',
    '{"highlights":["媒体区动线","品牌拍摄","围观可能性"],"ticketStatus":"定向邀请","sourceLabel":"Be On Cloud 宣传物料"}'::jsonb
  ),
  (
    'gemini-fourth-chengdu-campus-stage',
    'GeminiFourth Chengdu Campus Stage',
    'concert',
    'scheduled',
    '成都',
    '东安湖多功能厅',
    '2026-08-09T19:00:00+08:00',
    null,
    null,
    '偏校园巡演感的舞台活动，适合提前看票区、接送站和场馆周边住宿。',
    '{"highlights":["舞台互动","票区图","周边住宿"],"ticketStatus":"等待开票","sourceLabel":"GMMTV 公开活动线索"}'::jsonb
  ),
  (
    'dew-nani-bangkok-brand-campus-day',
    'DewNani Bangkok Brand Campus Day',
    'brand',
    'scheduled',
    '曼谷',
    'ICONSIAM Riverside Hall',
    '2026-08-18T16:30:00+07:00',
    null,
    null,
    '偏新生代品牌露出的公开活动，适合提前看预约入口和围观区说明。',
    '{"highlights":["品牌露出","预约入口","围观区说明"],"ticketStatus":"预约待公布","sourceLabel":"GMMTV 品牌合作活动"}'::jsonb
  ),
  (
    'nanon-manila-music-night',
    'Nanon Manila Music Night',
    'concert',
    'scheduled',
    '马尼拉',
    'SM North Edsa SkyDome',
    '2026-08-24T19:30:00+08:00',
    null,
    null,
    '偏音乐演出向的一场海外舞台活动，适合提前看票区和演出歌单预告。',
    '{"highlights":["音乐舞台","票区说明","歌单预告"],"ticketStatus":"即将开票","sourceLabel":"GMMTV 国际活动线"}'::jsonb
  ),
  (
    'bright-hangzhou-brand-gala',
    'Bright Hangzhou Brand Gala',
    'brand',
    'scheduled',
    '杭州',
    '运河大剧院秀场',
    '2026-08-16T18:30:00+08:00',
    null,
    null,
    '更适合关注品牌名单、入场批次和媒体露出时段的一场品牌夜活动。',
    '{"highlights":["品牌秀场","媒体时段","围观动线"],"ticketStatus":"围观待确认","sourceLabel":"品牌活动公开预热"}'::jsonb
  ),
  (
    'win-metawin-seoul-pop-up-weekend',
    'Win Metawin Seoul Pop-up Weekend',
    'brand',
    'scheduled',
    '首尔',
    '圣水洞品牌空间',
    '2026-08-23T14:00:00+09:00',
    null,
    null,
    '更适合关注预约资格、现场排队规则和快闪物料的一次海外品牌活动。',
    '{"highlights":["预约资格","快闪物料","排队规则"],"ticketStatus":"预约候补","sourceLabel":"品牌预约页 / 公开宣传"}'::jsonb
  ),
  (
    'milk-love-shanghai-brand-week',
    'MilkLove Shanghai Brand Week',
    'brand',
    'scheduled',
    '上海',
    '静安嘉里中心快闪空间',
    '2026-08-29T15:30:00+08:00',
    null,
    null,
    '适合新粉围观和拍照打卡的品牌周活动，重点是预约入口和现场动线。',
    '{"highlights":["预约入口","打卡装置","拍摄提醒"],"ticketStatus":"预约候补","sourceLabel":"GMMTV 品牌合作活动"}'::jsonb
  ),
  (
    'nunew-bangkok-solo-stage',
    'NuNew Bangkok Solo Stage',
    'concert',
    'scheduled',
    '曼谷',
    'Thunder Dome',
    '2026-09-05T19:00:00+07:00',
    null,
    null,
    '偏个人舞台和音乐演出的一场重点活动，适合提前看开票时间和座位区域。',
    '{"highlights":["个人舞台","开票时间","票区攻略"],"ticketStatus":"即将公布","sourceLabel":"DOMUNDI TV 官方视频 / 音乐线"}'::jsonb
  ),
  (
    'jimmy-sea-shanghai-screening-talk',
    'JimmySea Shanghai Screening Talk',
    'fanmeeting',
    'scheduled',
    '上海',
    '西岸艺术中心放映厅',
    '2026-09-14T18:00:00+08:00',
    null,
    null,
    '偏作品放映与双人对谈的一场活动，适合提前看票务、座位区和互动福利。',
    '{"highlights":["作品放映","双人对谈","互动福利"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 官方活动页"}'::jsonb
  ),
  (
    'milk-namtan-shenzhen-brand-day',
    'MilkNamtan Shenzhen Brand Day',
    'brand',
    'scheduled',
    '深圳',
    '万象天地中庭',
    '2026-09-21T16:00:00+08:00',
    null,
    null,
    '适合围观型粉丝提前看预约机制和拍照区说明的一场品牌日活动。',
    '{"highlights":["预约候补","拍照区说明","门店动线"],"ticketStatus":"预约候补","sourceLabel":"GMMTV 品牌活动线"}'::jsonb
  ),
  (
    'zee-pruk-tokyo-style-appearance',
    'Zee Pruk Tokyo Style Appearance',
    'brand',
    'scheduled',
    '东京',
    '涩谷时尚发布会现场',
    '2026-09-18T17:00:00+09:00',
    null,
    null,
    '更像时尚和品牌露出，适合看媒体图、品牌释出和公开出场时间。',
    '{"highlights":["时尚露出","品牌采访","公开出场"],"ticketStatus":"媒体 / 品牌邀请","sourceLabel":"DOMUNDI TV 品牌合作线索"}'::jsonb
  ),
  (
    'mile-apo-taipei-showcase-night',
    'MileApo Taipei Showcase Night',
    'concert',
    'scheduled',
    '台北',
    '台北流行音乐中心',
    '2026-09-27T19:30:00+08:00',
    null,
    null,
    '适合重点看开票节奏、场馆动线和官方周边兑换的一场 showcase night。',
    '{"highlights":["开票节奏","场馆动线","周边兑换"],"ticketStatus":"待开票","sourceLabel":"Be On Cloud 官方公开视频 / 活动线"}'::jsonb
  ),
  (
    'pond-phuwin-kunming-campus-night',
    'PondPhuwin Kunming Campus Night',
    'fanmeeting',
    'scheduled',
    '昆明',
    '滇池国际会展中心音乐厅',
    '2026-09-30T19:00:00+08:00',
    null,
    null,
    '适合双人线粉丝提前看开票、接送站和场馆周边住宿的一场校园夜活动。',
    '{"highlights":["双人互动","接送站提醒","周边住宿"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 官方活动线"}'::jsonb
  ),
  (
    'joong-dunk-manila-fan-party',
    'JoongDunk Manila Fan Party',
    'fanmeeting',
    'scheduled',
    '马尼拉',
    'New Frontier Theater',
    '2026-10-10T18:30:00+08:00',
    null,
    null,
    '适合双人线粉丝提前关注的海外见面活动，重点在开票时间、互动环节和到场攻略。',
    '{"highlights":["双人互动环节","官方应援公告","座位分区说明"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 官方活动页"}'::jsonb
  ),
  (
    'zee-nunew-kuala-lumpur-meet-night',
    'ZeeNuNew Kuala Lumpur Meet Night',
    'fanmeeting',
    'scheduled',
    '吉隆坡',
    'Mega Star Arena',
    '2026-10-18T19:00:00+08:00',
    null,
    null,
    '双人线海外活动，适合提前准备交通、酒店和应援物清单。',
    '{"highlights":["预售时间待定","应援物清单","到场动线提醒"],"ticketStatus":"预售预告","sourceLabel":"DOMUNDI TV @domunditv"}'::jsonb
  ),
  (
    'billkin-pp-singapore-brand-gala',
    'BillkinPP Singapore Brand Gala',
    'brand',
    'scheduled',
    '新加坡',
    'Marina Bay Sands Expo',
    '2026-10-29T18:00:00+08:00',
    null,
    null,
    '品牌晚宴型公开露出，适合围观型粉丝提前看红毯时段和媒体区位置。',
    '{"highlights":["红毯时间段","媒体区入口","拍摄须知"],"ticketStatus":"定向邀请","sourceLabel":"Billkin Entertainment / PP Krit Entertainment"}'::jsonb
  ),
  (
    'zee-nunew-hong-kong-fashion-week',
    'ZeeNuNew Hong Kong Fashion Week',
    'brand',
    'scheduled',
    '香港',
    '西九文化区秀场',
    '2026-10-24T18:30:00+08:00',
    null,
    null,
    '偏时尚露出和媒体拍摄的一场品牌周活动，适合提前看公开出场时间和媒体区位置。',
    '{"highlights":["时尚露出","媒体拍摄","公开出场时间"],"ticketStatus":"媒体 / 品牌邀请","sourceLabel":"DOMUNDI TV 品牌合作线"}'::jsonb
  ),
  (
    'taynew-singapore-anniversary-meet',
    'TayNew Singapore Anniversary Meet',
    'fanmeeting',
    'scheduled',
    '新加坡',
    'Capitol Theatre',
    '2026-10-27T19:00:00+08:00',
    null,
    null,
    '适合回坑粉和双人线粉丝提前看票务、福利和到场安排的一场周年见面活动。',
    '{"highlights":["周年互动","福利说明","到场安排"],"ticketStatus":"即将开售","sourceLabel":"GMMTV 国际活动页"}'::jsonb
  ),
  (
    'billkin-taipei-fashion-stage',
    'Billkin Taipei Fashion Stage',
    'brand',
    'scheduled',
    '台北',
    '松山文创园区秀场',
    '2026-10-26T18:00:00+08:00',
    null,
    null,
    '偏时尚和媒体露出的公开秀场活动，适合提前看公开出场时间和媒体区位置。',
    '{"highlights":["时尚秀场","媒体区位置","公开出场时间"],"ticketStatus":"媒体 / 品牌邀请","sourceLabel":"Billkin Entertainment 品牌线"}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title,
  type = excluded.type,
  status = excluded.status,
  city = excluded.city,
  venue = excluded.venue,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  summary = excluded.summary,
  ai_extracted = excluded.ai_extracted,
  updated_at = now();

delete from event_stars;
insert into event_stars (event_id, star_id, role)
select e.id, s.id, 'guest'
from (values
  ('bright-shanghai-fanmeeting-2026', 'bright-vaid'),
  ('win-shenzhen-brand-pop-up', 'win-metawin'),
  ('billkin-shanghai-live-stage', 'billkin'),
  ('pp-krit-beijing-brand-night', 'pp-krit'),
  ('gemini-fourth-guangzhou-fanmeeting', 'gemini-norawit'),
  ('gemini-fourth-guangzhou-fanmeeting', 'fourth-nattawat'),
  ('first-khaotung-bangkok-stage-talk', 'first-kanaphan'),
  ('first-khaotung-bangkok-stage-talk', 'khaotung-thanawat'),
  ('off-mix-bangkok-brand-forum', 'off-jumpol'),
  ('off-mix-bangkok-brand-forum', 'mix-sahaphap'),
  ('lingorm-guangzhou-live', 'lingorm'),
  ('joong-dunk-bangkok-pop-up-day', 'joong-archen'),
  ('joong-dunk-bangkok-pop-up-day', 'dunk-natachai'),
  ('zee-nunew-macau-stage-greeting', 'zee-pruk'),
  ('zee-nunew-macau-stage-greeting', 'nunew-chawarin'),
  ('forcebook-kuala-lumpur-fan-night', 'force-jiratchapong'),
  ('forcebook-kuala-lumpur-fan-night', 'book-kasidet'),
  ('boun-prem-bangkok-stage-weekend', 'boun-noppanut'),
  ('mile-apo-hong-kong-fansign', 'mile-phakphum'),
  ('mile-apo-hong-kong-fansign', 'apo-nattawin'),
  ('tay-new-bangkok-anniversary-stage', 'tay-tawan'),
  ('tay-new-bangkok-anniversary-stage', 'new-thitipoom'),
  ('bible-jes-singapore-preview-night', 'bible-wichapas'),
  ('bible-jes-singapore-preview-night', 'jes-jespipat'),
  ('gemini-fourth-chengdu-campus-stage', 'gemini-norawit'),
  ('gemini-fourth-chengdu-campus-stage', 'fourth-nattawat'),
  ('dew-nani-bangkok-brand-campus-day', 'dew-jirawat'),
  ('dew-nani-bangkok-brand-campus-day', 'nani-hirunkit'),
  ('nanon-manila-music-night', 'nanon-korapat'),
  ('bright-hangzhou-brand-gala', 'bright-vaid'),
  ('win-metawin-seoul-pop-up-weekend', 'win-metawin'),
  ('milk-love-shanghai-brand-week', 'milk-pansa'),
  ('milk-love-shanghai-brand-week', 'love-pattranite'),
  ('nunew-bangkok-solo-stage', 'nunew-chawarin'),
  ('jimmy-sea-shanghai-screening-talk', 'jimmy-jitaraphol'),
  ('jimmy-sea-shanghai-screening-talk', 'sea-tawinan'),
  ('milk-namtan-shenzhen-brand-day', 'milk-pansa'),
  ('milk-namtan-shenzhen-brand-day', 'namtan-tipnaree'),
  ('zee-pruk-tokyo-style-appearance', 'zee-pruk'),
  ('mile-apo-taipei-showcase-night', 'mile-phakphum'),
  ('mile-apo-taipei-showcase-night', 'apo-nattawin'),
  ('pond-phuwin-kunming-campus-night', 'pond-naravit'),
  ('pond-phuwin-kunming-campus-night', 'phuwin-tangsakyuen'),
  ('joong-dunk-manila-fan-party', 'joong-archen'),
  ('joong-dunk-manila-fan-party', 'dunk-natachai'),
  ('zee-nunew-kuala-lumpur-meet-night', 'zee-pruk'),
  ('zee-nunew-kuala-lumpur-meet-night', 'nunew-chawarin'),
  ('billkin-pp-singapore-brand-gala', 'billkin'),
  ('billkin-pp-singapore-brand-gala', 'pp-krit'),
  ('zee-nunew-hong-kong-fashion-week', 'zee-pruk'),
  ('zee-nunew-hong-kong-fashion-week', 'nunew-chawarin'),
  ('taynew-singapore-anniversary-meet', 'tay-tawan'),
  ('taynew-singapore-anniversary-meet', 'new-thitipoom'),
  ('billkin-taipei-fashion-stage', 'billkin')
) as links(event_slug, star_slug)
join events e on e.slug = links.event_slug
join stars s on s.slug = links.star_slug
on conflict (event_id, star_id) do update set role = excluded.role;

insert into news_posts (slug, title, excerpt, body_md, category, review_status, published_at, source_url, cover_url, related_star_slugs)
values
  (
    'bright-shanghai-ticket-guide',
    'Bright Vachirawit Shanghai Fan Meeting Ticket Guide',
    '整理主办公告、票档、实名规则和交通信息，帮助新粉快速上手。',
    '这场上海见面会目前最值得先看的，不是宣传海报本身，而是票务规则和到场节奏。对第一次跟 Bright 中国活动的新粉来说，先把实名要求、票档差异和入场时间看懂，比先刷路透更重要。

根据目前整理到的主办信息，这场活动的重点在互动体验，而不是纯舞台演出。也就是说，票区差异、现场视野和抽选福利，会直接影响粉丝的体验感。建议在开票前先把预算、同行人数和住宿区域想清楚，再决定冲哪个票档。

站内会继续优先整理三类信息：一是开票时间与平台入口，二是实名与换票规则，三是到场动线和场馆周边建议。如果后续主办更新了票区图、座位图或二次开售通知，也会优先补到这条整理稿里。',
    '活动速递',
    'published',
    '2026-05-16T10:00:00+08:00',
    'https://www.instagram.com/changeartist_/',
    '/portraits/bright-vachirawit.jpg',
    array['bright-vaid']
  ),
  (
    'win-shenzhen-brand-preview',
    'Win Metawin Shenzhen Brand Event Preview',
    '整理官方时间轴、预约方式和现场拍摄提醒，方便中国粉丝提前准备。',
    '这类品牌快闪活动和正式见面会不一样，重点不在票务，而在预约节奏、围观位置和到场时间。对 Win 的中国粉丝来说，提前判断这场活动是“适合专门去追”还是“顺路去看”，会比盲目冲现场更重要。

从目前已整理到的信息看，这场深圳活动更偏品牌露出与短时公开站台。通常这种活动会有媒体区、围观区和门店动线限制，粉丝真正最需要的是：什么时候到、站哪里、能不能拍、是否需要预约，以及品牌对现场秩序有没有额外要求。

如果后续品牌方补出门店地图、预约页、签到时间或官方海报更新，站内会优先同步整理。你在看中文快读的同时，也可以保留原始品牌名和活动原文，方便后续自己去搜官方帖和门店动态。',
    '品牌活动',
    'published',
    '2026-05-16T12:20:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '/portraits/win-metawin.png',
    array['win-metawin']
  ),
  (
    'billkin-shanghai-stage-ticketing',
    'Billkin Live Stage Shanghai Ticketing Guide',
    '汇总开票时间、票档、实名规则和粉丝常问问题，适合首页前置展示。',
    'Billkin 这类舞台活动，粉丝最关心的通常是开票时间、票档价值和现场应援空间，而不是单纯的官宣一句话。尤其是上海这种跨城追星密度高的场次，抢票规则和座位区差异会直接影响是否值得专门跑一趟。

从整理到的现阶段信息看，这场活动更适合站内做成“先看懂再决定冲不冲”的类型：包括票区划分、实名要求、是否允许转赠、入场时间、现场物料限制，这些都比情绪化冲票更重要。对于中国粉丝来说，先把这些规则读明白，能少踩很多坑。

后续如果主办补出座位图、二次售票、加场或应援物说明，站内会继续把更新合并进这条快读。你也可以直接用活动原文标题去搜主办和票务平台，做交叉核对。',
    '活动速递',
    'published',
    '2026-05-16T11:10:00+08:00',
    'https://www.instagram.com/beoncloud_th/',
    '/portraits/billkin.png',
    array['billkin']
  ),
  (
    'pp-krit-brand-appearance',
    'PP Krit Confirmed for Brand Night Beijing',
    '汇总品牌官宣、媒体区安排与粉丝围观注意事项。',
    'PP Krit 这类品牌夜活动，一旦确认出席，粉丝最先要判断的不是“值不值得看”，而是“这是不是适合围观、怎么围观、现场能看到多少”。品牌晚宴和公开商场活动的逻辑不同，很多时候并不对外开放，但仍然会有红毯、外场或媒体到场窗口。

目前整理到的信息显示，这场北京品牌之夜更适合做围观攻略，而不是票务攻略。也就是说，重点会放在到场时间段、红毯可能出现的位置、媒体区动线，以及周边交通和等待时长预期。对中国粉丝来说，这种活动的关键不是“抢位置”，而是提前预判信息差。

如果后续品牌方或合作媒体补出更明确的到场时间、门区设置或 dress code 相关内容，站内会继续补充在这条整理稿下面。原文品牌名和活动英文名也会保留，方便后续继续搜官方帖子。',
    '官宣',
    'published',
    '2026-05-15T14:00:00+08:00',
    'https://www.instagram.com/domunditv/',
    '/portraits/pp-krit.jpg',
    array['pp-krit']
  ),
  (
    'gemini-fourth-guangzhou-announcement',
    'GeminiFourth Guangzhou Fan Meeting Announcement',
    '整理双人活动档期、开售节奏和适合新粉快速理解的关注重点。',
    'GeminiFourth 这类双人活动，对中国粉丝来说最需要的不是“官宣已出”这个事实，而是快速搞懂这场活动到底偏互动、偏舞台，还是偏福利型见面会。因为这会直接决定你是想冲票、围观，还是先等更多细节再决定。

当前这条整理重点会放在三个层面：第一，活动档期和开售节奏；第二，双人互动内容的预期；第三，适合新粉快速入坑的关注点。相比单人品牌活动，这类双人粉丝见面会更容易牵动粉丝对票价、福利、座位和应援物的整体判断。

如果 GMMTV 后续放出正式海报、票务节奏、场馆信息或福利说明，站内会优先把这些内容补齐。你先看中文摘要就能大概判断值不值得追，后续再用原文标题去搜官方更新。',
    '官宣',
    'published',
    '2026-05-15T20:30:00+08:00',
    'https://www.instagram.com/gmmtv/',
    '/portraits/gemini-norawit.png',
    array['gemini-norawit', 'fourth-nattawat']
  ),
  (
    'lingorm-live-booking',
    'LingOrm Guangzhou Live Booking Opens',
    '附预约入口、直播时间、门店活动和应援建议。',
    '这类直播预约活动的门槛通常比线下见面会低很多，所以特别适合还在观望、或者暂时不想为跨城活动投入太多预算的新粉。对 LingOrm 这种互动感比较强的组合来说，直播和门店联动活动往往是更容易参与的一条线。

目前整理到的重点信息会围绕预约入口、直播时间、门店到场方式和应援建议来写。因为这类活动最容易出现的情况不是“抢不到”，而是“没搞清楚预约机制”或者“到了现场才发现动线不对”。所以这条整理稿会尽量把这些前置问题说清楚。

如果品牌门店后续更新签到、打卡、赠品或直播连线的具体规则，站内也会及时补充。你先用中文把玩法看懂，再决定要不要进一步追后续细则就够了。',
    '直播',
    'published',
    '2026-05-14T18:20:00+08:00',
    'https://www.instagram.com/wabisabith/',
    '/portraits/lingling-kwong.png',
    array['lingorm']
  ),
  (
    'bright-hangzhou-brand-travel-note',
    'Bright Vachirawit Hangzhou Brand Travel Note',
    '整理出发时间、商场动线和适合中国粉丝围观的时段提示。',
    '这类外地品牌活动最值得先看的，不是海报，而是交通和动线。对 Bright 的中国粉丝来说，真正决定值不值得追的一般不是“有没有官宣”，而是到场后到底能不能顺利看到、拍到、按时离场。

目前这条整理会优先解释三个层面：一是活动发生在商场还是封闭秀场；二是红毯、媒体区和粉丝围观区的关系；三是如果你当天往返，最容易卡住的时间节点是什么。把这些看懂之后，再去追更细的品牌细则会更有效率。

后续如果品牌方补出正式场地图、签到节奏或现场限制，站内会继续补在这条快读下面。',
    '品牌活动',
    'published',
    '2026-05-13T15:10:00+08:00',
    'https://www.instagram.com/changeartist_/',
    '/portraits/bright-vachirawit.jpg',
    array['bright-vaid']
  ),
  (
    'win-macao-media-arrival',
    'Win Metawin Macau Media Arrival Watchlist',
    '整理媒体到场窗口、酒店区域与适合蹲点的新粉提醒。',
    '媒体到场类内容最容易被误读成“公开活动”，所以这条整理最重要的任务，是先帮粉丝判断这到底适不适合追。对 Win 的中国粉丝来说，很多机场、酒店或媒体到场信息，看起来热闹，但实际上并不总适合专门跑一趟。

因此这条快读会优先说明现场属性、可能的可见度、等候时间成本，以及是否有更值得优先追的公开品牌活动。如果你时间有限，这种内容最适合拿来做“值不值得去”的快速判断，而不是把它当成正式活动攻略。

如果后续出现官方媒体图、品牌正式发帖或明确的公开到场窗口，站内会继续往这条稿里补。',
    '活动速递',
    'published',
    '2026-05-12T19:00:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '/portraits/win-metawin.png',
    array['win-metawin']
  ),
  (
    'billkin-new-song-live-clip',
    'Billkin New Song Live Clip Summary',
    '把短视频里的重点舞台信息和粉丝最关心的后续安排先整理清楚。',
    '这类短视频切片或现场 live clip，本身信息量不大，但粉丝会很在意它是不是预示着下一步舞台活动、巡演安排或新歌推广节奏。对 Billkin 来说，站内更有价值的做法不是复述视频内容，而是解释这条内容对后续追星判断意味着什么。

所以这条整理会优先告诉你：这是单次舞台物料、宣传预热，还是值得继续等后续官宣的信号。如果你只想快速知道“要不要继续关注”，看中文快读就够了；如果你想更细地判断，再去追原始视频和官方账号更新。

站内后续也会把相关的舞台、演出或品牌联动信息继续串回这条动态。',
    '直播',
    'published',
    '2026-05-11T21:30:00+08:00',
    'https://www.instagram.com/beoncloud_th/',
    '/portraits/billkin.png',
    array['billkin']
  ),
  (
    'pp-krit-magazine-cover-watch',
    'PP Krit Magazine Cover Release Watch',
    '整理封面释出节奏、拍摄主题和粉丝最值得关注的后续品牌线索。',
    '杂志封面这类内容表面上是图像发布，但对 PP Krit 这种时尚向关注度很高的艺人来说，它往往也是后续品牌合作和线下活动热度的前哨。粉丝真正会关心的，不只是封面漂不漂亮，而是它后面会不会带来采访、活动、签售或品牌夜相关线索。

因此这条整理会优先把封面的主题、合作方和后续可能延伸的内容线说明白，让中国粉丝知道为什么值得先收藏这条更新。站内保留原始杂志名和官方标题，也是为了方便后续继续搜更多物料。

如果后面有拍摄花絮、采访摘要或同主题品牌活动，也会继续串回这条内容。',
    '官宣',
    'published',
    '2026-05-10T17:20:00+08:00',
    'https://www.instagram.com/domunditv/',
    '/portraits/pp-krit.jpg',
    array['pp-krit']
  ),
  (
    'gemini-fourth-campus-show-recap',
    'GeminiFourth Campus Show Recap',
    '整理双人校园活动的互动亮点和后续最值得继续等的官宣信号。',
    '校园活动 recap 的价值，不在于把现场每个小互动都记一遍，而在于帮新粉快速理解：这类内容是日常营业、阶段性活动，还是更大活动前的信号。GeminiFourth 这种双人内容热度高的组合，粉丝最容易在大量切片里迷路，所以站内更适合做“重点提炼”。

这条快读会优先整理互动亮点、粉丝最常问的后续安排，以及值不值得继续等正式官宣。如果你本身就是 CP 向关注者，这类 recap 会帮助你判断下一步该追哪条线；如果你只是想快速补课，看这一条就能知道大概发生了什么。

站内也会继续把类似校园活动、粉丝见面会和正式票务活动做出区分，避免内容看起来都一样。',
    '活动速递',
    'published',
    '2026-05-09T20:45:00+08:00',
    'https://www.instagram.com/gmmtv/',
    '/portraits/gemini-norawit.png',
    array['gemini-norawit', 'fourth-nattawat']
  ),
  (
    'bright-airport-fashion-note',
    'Bright Airport Fashion Note',
    '整理机场造型、品牌露出和粉丝最关心的后续公开活动可能性。',
    '机场内容本身不是活动，但对头部艺人的粉丝来说，它常常会被当作“后面是不是有事”的信号。这条整理不会把机场 look 当成单独的大新闻，而是会解释它是否和后续品牌行程、公开到场或媒体拍摄有关系。

如果只是单次出行，粉丝没必要为一组图投入太多注意力；但如果它和后续官宣、品牌活动、海外行程连在一起，那就会变成值得继续追的一条线。所以这类内容站内会尽量做得短、准、能帮助判断优先级。

你先看中文整理判断价值，再决定要不要去翻更多路透和外网更新。',
    '品牌活动',
    'published',
    '2026-05-07T11:40:00+08:00',
    'https://www.instagram.com/changeartist_/',
    '/portraits/bright-vachirawit.jpg',
    array['bright-vaid']
  ),
  (
    'win-bangkok-store-visit-brief',
    'Win Metawin Bangkok Store Visit Brief',
    '把店访活动整理成适合中国粉丝快速判断的围观攻略。',
    '店访内容通常容易被低估，因为它不像正式见面会那样有票务信息，但对真正想追行程的粉丝来说，店访反而更考验信息整理能力。最关键的不是“有没有去”，而是“值不值得去、该什么时候去、现场到底是什么性质”。

这条整理稿会优先说明店访是短停留还是正式露出、围观空间多大、是否更适合在站内先看快读而不是直接出门。对中国粉丝来说，这类内容最需要的是一个能快速帮你做判断的中文入口。

如果品牌方后面补发现场图、商场图或正式 recap，也会继续补进来。',
    '品牌活动',
    'published',
    '2026-05-06T16:15:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '/portraits/win-metawin.png',
    array['win-metawin']
  ),
  (
    'pp-krit-live-session-reminder',
    'PP Krit Live Session Reminder',
    '整理直播时间、适合先看的重点和直播后可能继续延伸的活动线索。',
    '直播提醒的价值在于帮粉丝判断：这场直播只是短时营业，还是后面会接品牌活动、舞台内容或进一步官宣。对 PP Krit 来说，这类直播往往不只是“开播了”，而是和后续时尚、品牌或现场活动线会有连接。

所以站内会优先整理直播时间、最值得先看的部分，以及直播结束后你最该继续关注什么。如果你今天时间很少，只需要知道这条值不值得蹲，那看这条快读就够了。

后续如果直播内出现新活动信息、品牌合作线索或新的排期预告，也会继续补充。',
    '直播',
    'published',
    '2026-05-04T20:00:00+08:00',
    'https://www.instagram.com/domunditv/',
    '/portraits/pp-krit.jpg',
    array['pp-krit']
  ),
  (
    'gemini-fourth-photo-release-roundup',
    'GeminiFourth Official Photo Release Roundup',
    '整理官方图集发布后的重点、适合收藏的关键词和后续值得等的正式活动。',
    '官方图集本身未必带来新行程，但它常常是粉丝重新集中讨论、整理物料和等待后续正式活动的一个节点。对 GeminiFourth 这样的双人内容来说，图集发布之后，粉丝更在意的是：这是不是某场活动的 recap，还是下一次正式露出的铺垫。

这条整理会优先把图集来自哪场活动、适合收藏什么关键词、后续还值得等哪类正式内容说清楚。对于不想一张张翻图的新粉来说，这样的中文整理比单纯刷图更有入口价值。

如果之后这组物料继续带出巡演、见面会或品牌活动信息，站内会继续把后续线索补上。',
    '官宣',
    'published',
    '2026-05-03T13:50:00+08:00',
    'https://www.instagram.com/gmmtv/',
    '/portraits/gemini-norawit.png',
    array['gemini-norawit', 'fourth-nattawat']
  ),
  (
    'bright-magazine-interview-note',
    'Bright Magazine Interview Note',
    '整理采访里最值得新粉先看的重点，不用整篇翻完也能快速入门。',
    '长采访最容易出现的信息疲劳，所以这类内容站内更适合先做重点提炼。对 Bright 的中国粉丝来说，真正值得先看的往往不是完整对谈，而是那些会连接到后续活动、品牌和公开露出的信息点。

这条整理会优先提炼采访里跟工作重心、近期公开行程和后续活动线最相关的部分，让你不用整篇读完，也能先知道这条内容值不值得继续深追。对于第一次接触这位艺人的新粉，这种快读会比直接看长篇英文或泰文采访更友好。

如果后续这篇采访又被品牌活动、杂志图或公开视频引用，站内也会继续把线索串回来。',
    '官宣',
    'published',
    '2026-05-02T14:10:00+08:00',
    'https://www.instagram.com/changeartist_/',
    '/portraits/bright-vachirawit.jpg',
    array['bright-vaid']
  ),
  (
    'win-style-edit-roundup',
    'Win Metawin Style Edit Roundup',
    '把近期造型、品牌露出和粉丝最在意的后续活动线索放到一条里看懂。',
    '造型图本身很容易被刷过去，但对 Win 这种品牌与时尚露出密度都高的艺人来说，连续几组造型往往意味着后面还会有更正式的品牌露出或公开活动。因此，这条内容的重点不是图本身，而是它指向什么后续更新。

站内会优先把近期造型、合作品牌和是否值得继续等后续活动整理成一个判断入口。这样中国粉丝不需要一张张翻图，也能先知道：这是单次营业，还是值得继续盯一盯的节奏。

如果后面品牌补发更多物料、门店活动或现场亮相信息，这条稿会继续补全。',
    '品牌活动',
    'published',
    '2026-05-01T18:30:00+08:00',
    'https://www.instagram.com/openlabel_th/',
    '/portraits/win-metawin.png',
    array['win-metawin']
  ),
  (
    'billkin-stage-photo-roundup',
    'Billkin Stage Photo Roundup',
    '把舞台图集和后续活动判断放在一起，帮助粉丝快速决定要不要继续追。',
    '舞台图集的价值，不只是“看图”，而是帮助粉丝判断这是不是某次更大活动的开始。对 Billkin 来说，舞台内容往往会和后续演出、品牌合作或者新作品宣传接起来，所以站内更适合把它整理成一个判断入口，而不是单纯图墙。

这条整理会先告诉你，这组图来自哪类场景、后面最值得继续等什么、是否已经出现更明确的活动信号。如果你只想知道“后续要不要继续盯”，这一条就足够。

如果后面补出完整舞台视频、官方活动 recap 或相关演出安排，站内会继续往这里补。',
    '活动速递',
    'published',
    '2026-04-30T21:00:00+08:00',
    'https://www.instagram.com/beoncloud_th/',
    '/portraits/billkin.png',
    array['billkin']
  ),
  (
    'pp-krit-backstage-note',
    'PP Krit Backstage Note',
    '整理后台花絮里真正值得粉丝继续关注的部分，不让短内容白刷过去。',
    '后台花絮通常很短，但对时尚和品牌向内容来说，花絮经常比正式成片更早暴露后续方向。PP Krit 这类内容，如果只看一眼花絮就滑过去，反而容易错过后面真正值得追的品牌或活动节奏。

所以这条快读的重点，是帮粉丝先判断：这条花絮是在预热什么，是单次露出，还是和后续更完整的内容线有关。这样你即使时间不多，也能先知道该不该继续盯下去。

后面如果出现正式成片、采访或配套活动，站内会继续把信息并回这一条。',
    '品牌活动',
    'published',
    '2026-04-29T16:40:00+08:00',
    'https://www.instagram.com/domunditv/',
    '/portraits/pp-krit.jpg',
    array['pp-krit']
  ),
  (
    'gemini-fourth-fan-cam-guide',
    'GeminiFourth Fan Cam Guide',
    '整理现场切片该怎么看，哪些只是热闹，哪些可能连到后续正式活动。',
    '双人 fan cam 内容热度高，但也最容易让新粉只看到情绪，不知道后续要看什么。站内整理这种内容的意义，不是替代原始切片，而是把“这场切片值不值得继续追后续”这件事说明白。

这条快读会优先区分：哪些是现场氛围片段，哪些已经透露了下一步活动节奏或官方可能继续放出的内容。这样既照顾老粉，也能让第一次接触 GeminiFourth 的人更快找到入口。

如果官方后续补出正式视频、高清图或活动延伸公告，站内会继续补充。',
    '直播',
    'published',
    '2026-04-28T22:10:00+08:00',
    'https://www.instagram.com/gmmtv/',
    '/portraits/gemini-norawit.png',
    array['gemini-norawit', 'fourth-nattawat']
  ),
  (
    'lingorm-community-live-recap',
    'LingOrm Community Live Recap',
    '把直播里最值得新粉先记住的互动和后续入口先理一遍。',
    '社区直播类内容通常没有票务和行程那么直接，但对 LingOrm 这种互动感强的组合来说，直播往往就是新粉最容易进入的一道门。它的价值在于降低距离感，而不是提供复杂信息。

这条整理会优先告诉你直播里最值得先记住的互动点、后面最可能延伸出什么内容线，以及如果你今天只看一条更新，为什么可以先看这一条。它更像一条“入门提要”，而不是完整回放替代品。

后续如果这场直播又带出品牌、门店或线下活动线索，站内也会继续串回这里。',
    '直播',
    'published',
    '2026-04-27T19:30:00+08:00',
    'https://www.instagram.com/wabisabith/',
    '/portraits/lingling-kwong.png',
    array['lingorm']
  ),
  (
    'joong-dunk-bangkok-pop-up-watch',
    'JoongDunk Bangkok Pop-up Watchlist',
    '整理品牌快闪到场时间、围观区位置和适合新粉快速判断的关注重点。',
    'JoongDunk 这类品牌快闪活动，对中国粉丝来说最重要的不是“有活动”这件事本身，而是这场到底适不适合围观、值不值得专门追。尤其是商场型快闪，现场通常会分成品牌区、媒体区和粉丝围观区，如果不提前看清楚规则，到场之后反而很容易失望。

这条整理会优先说明三件事：第一，活动更像短时公开露出还是完整互动环节；第二，品牌方有没有给到预约、排队或礼赠机制；第三，如果你只想看人、不打算长时间停留，什么时间点最值得盯。对新粉来说，这种活动最适合用来判断“值不值得跟”。

如果后续品牌方补出快闪地图、礼赠领取方式或正式海报，站内会继续补回这条快读里，让你不用反复切回原始帖子去拼信息。',
    '品牌活动',
    'published',
    '2026-05-18T10:30:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Joong_300.jpg',
    array['joong-archen', 'dunk-natachai']
  ),
  (
    'taynew-anniversary-stage-preview',
    'TayNew Anniversary Stage Preview',
    '整理纪念舞台活动的开票节奏、座位区和适合回坑粉快速入门的关注点。',
    'TayNew 这种纪念舞台活动，对回坑粉和老粉来说往往不只是“一场活动”，而是一个很容易重新接回人物线和双人线的入口。比起单看海报，提前知道活动是偏互动、偏舞台还是偏福利，会更影响你到底要不要认真准备抢票和到场。

站内这条整理会优先说明开票节奏、座位区差异和官方福利说明，因为这些信息最能直接影响追不追。对第一次补 TayNew 线的新粉来说，也会顺手解释为什么这场活动值得先关注，而不是只把它当成一条普通行程信息。

如果后续 GMMTV 补出正式票区图、福利细则或应援规则，站内会继续合并进这条稿里，方便你直接一页看完。',
    '活动速递',
    'published',
    '2026-05-19T14:10:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Tay_300.jpg',
    array['tay-tawan', 'new-thitipoom']
  ),
  (
    'milklove-shanghai-brand-week-note',
    'MilkLove Shanghai Brand Week Note',
    '整理预约入口、打卡装置和拍摄提醒，帮助新粉快速判断这场活动怎么玩。',
    'MilkLove 这类品牌周活动通常不只是“看两位艺人到场”，而是还会带着快闪装置、打卡区和一整套预约机制。对于中国粉丝来说，最有用的信息不是海报本身，而是：要不要预约、现场能拍什么、到场后会不会因为动线问题浪费时间。

这条快读会优先说明预约入口、品牌装置、打卡流程和拍摄提醒，让第一次追这条女艺人线的新粉也能快速看懂。相比传统的正式见面会，这类活动更适合低门槛参与，所以更值得用站内整理把前置信息一次说清楚。

如果后续品牌方更新具体到场时间、门店地图或限量周边规则，站内也会继续把这些补在这条动态下面。',
    '品牌活动',
    'published',
    '2026-05-21T11:40:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Milk_300.jpg',
    array['milk-pansa', 'love-pattranite']
  ),
  (
    'pondphuwin-kunming-campus-guide',
    'PondPhuwin Kunming Campus Night Guide',
    '整理开票预期、接送站和周边住宿建议，适合双人线粉丝提前做决定。',
    'PondPhuwin 这类校园夜活动最值得先看的，通常不是官宣句子，而是开票节奏和出行成本。因为这类活动常常会牵涉接送站、场馆周边住宿和活动结束后的返程安排，对双人线粉丝来说，提前做决定比临时冲动要重要得多。

这条整理会优先把场馆属性、接送站提醒和周边住宿建议说清楚，也会顺手解释这场活动更偏舞台互动还是粉丝福利。对刚开始补 PondPhuwin 线的新粉来说，这类整理稿比直接看一张海报更能帮助判断“值不值得追”。

如果后续放出正式票务页、场馆图或应援细则，站内会继续把更新并回这条稿里，避免你来回找信息。',
    '活动速递',
    'published',
    '2026-05-22T16:00:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Pond_300.jpg',
    array['pond-naravit', 'phuwin-tangsakyuen']
  ),
  (
    'zeenunew-hk-fashion-week-watch',
    'ZeeNuNew Hong Kong Fashion Week Watch',
    '整理公开出场时间、媒体区位置和适合围观型粉丝的关注重点。',
    'ZeeNuNew 这种品牌周露出，最容易让粉丝误判成“去现场就一定能看得很清楚”。实际上，时尚周和秀场型活动往往更偏媒体拍摄和品牌招待，所以站内这条整理会先帮你判断：它更适合围观、拍媒体图，还是更适合等品牌后续释出。

这条快读会优先说明公开出场时间、媒体区位置和到场窗口，让想追双人线的粉丝先快速判断值不值得跑。对第一次追这类时尚活动的新粉来说，先把活动属性看懂，比单纯被双人名字吸引更重要。

如果后续品牌方或 DOMUNDI TV 补出更明确的秀场动线、到场时间或拍摄规则，站内会继续把这些补在这条内容下面。',
    '品牌活动',
    'published',
    '2026-05-24T18:25:00+08:00',
    'https://www.instagram.com/domunditv/',
    'https://i.ytimg.com/vi/ZW7KWnLkCWc/maxresdefault.jpg',
    array['zee-pruk', 'nunew-chawarin']
  ),
  (
    'firstkhaotung-stage-talk-preview',
    'FirstKhaotung Bangkok Stage Talk Preview',
    '整理开票节奏、双人互动看点和适合粉丝提前准备的关注重点。',
    'FirstKhaotung 这类舞台对谈活动，对双人线粉丝来说最重要的不是官宣海报本身，而是这场到底更偏互动、偏作品分享，还是偏福利型见面会。因为这会直接决定你要不要认真准备抢票，以及现场期待值该怎么放。

这条整理会优先把开票节奏、双人互动看点和官方福利说明说清楚，也会提醒哪些信息还在待补。对第一次补 FirstKhaotung 线的新粉来说，看这种中文快读比直接进票务页更容易先建立整体判断。

如果后续 GMMTV 补出正式票区图、福利细则或应援规则，站内会继续补回这条稿里，让你一条内容就能把关键信息串起来。',
    '活动速递',
    'published',
    '2026-05-26T11:00:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/First_300.jpg',
    array['first-kanaphan', 'khaotung-thanawat']
  ),
  (
    'forcebook-kl-fan-night-note',
    'ForceBook Kuala Lumpur Fan Night Note',
    '整理票区、酒店区域和适合海外追线下活动的准备重点。',
    'ForceBook 这类海外 fan night 对粉丝来说，最值得先看的一般不是一句“要来了”，而是票区价值、酒店区域和现场互动预期。尤其是吉隆坡这种跨国追活动的场景，住宿和交通判断往往和抢票一样重要。

这条整理会优先说明票区、酒店建议和双人互动福利，也会提醒新粉哪些信息还要等后续官宣补全。相比单纯看活动海报，这类快读更适合用来做“值不值得去”的初步决定。

如果后续补出正式座位图、酒店合作信息或官方福利细节，站内会继续补在这条动态下面。',
    '活动速递',
    'published',
    '2026-05-28T14:20:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Force_300.jpg',
    array['force-jiratchapong', 'book-kasidet']
  ),
  (
    'dewnani-brand-campus-watch',
    'DewNani Bangkok Brand Campus Watch',
    '整理预约入口、围观区和新生代品牌露出的关注重点。',
    'DewNani 这种新生代品牌露出活动，最适合先看预约入口、围观区和公开到场窗口。对中国粉丝来说，这类活动经常是“看起来离得近，其实现场动线很关键”的类型，所以中文快读的价值比一张海报要大得多。

这条整理会先帮你判断这场活动更适合品牌围观、拍媒体图，还是更适合等后续物料释出。对刚开始补 Dew 和 Nani 线的新粉来说，这种活动也很适合用来快速建立人物印象。

如果品牌方后续补出预约页、门店地图或具体出场时间，站内会继续把它们补进这条整理稿里。',
    '品牌活动',
    'published',
    '2026-05-30T10:50:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Dew_300.jpg',
    array['dew-jirawat', 'nani-hirunkit']
  ),
  (
    'jimmysea-shanghai-screening-guide',
    'JimmySea Shanghai Screening Guide',
    '整理放映活动的票务、对谈内容和双人福利关注点。',
    'JimmySea 这种放映加对谈型活动，和普通见面会的判断标准不太一样。粉丝真正要先看的是：这场更偏作品交流、双人互动，还是粉丝福利；以及票务和座位区有没有明显差异。对第一次追 JimmySea 线的新粉来说，这类活动尤其适合先看站内整理稿。

这条内容会先把票务、放映属性和双人对谈的看点讲清楚，也会提醒哪些福利信息还需要等官方补全。比起单纯刷官宣，先看中文整理更容易判断值不值得追。

如果后续放出票区图、放映片单或互动福利说明，站内也会继续并回这条稿里。',
    '活动速递',
    'published',
    '2026-06-02T16:30:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Jimmy_300.jpg',
    array['jimmy-jitaraphol', 'sea-tawinan']
  ),
  (
    'taynew-singapore-anniversary-watch',
    'TayNew Singapore Anniversary Watch',
    '整理周年活动的票务节奏、福利说明和回坑粉最该先看的部分。',
    'TayNew 周年活动这类内容，很容易同时吸引老粉、回坑粉和新粉，但每类人最需要的信息其实不一样。对回坑粉来说，最重要的是活动值不值得追；对新粉来说，最重要的是这场活动到底为什么值得先看。

这条快读会优先说明票务节奏、双人福利和到场安排，也会把这场活动和 TayNew 这条线的当前状态简单串起来。这样你即使之前没完整追过，也能快速看懂它的意义。

如果后续补出正式票区图、福利细节或品牌合作延伸内容，站内会继续补在这条动态下面。',
    '活动速递',
    'published',
    '2026-06-04T13:40:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Tay_300.jpg',
    array['tay-tawan', 'new-thitipoom']
  ),
  (
    'offmix-brand-forum-watch',
    'OffMix Bangkok Brand Forum Watch',
    '整理预约入口、论坛露出属性和适合品牌活动粉丝快速判断的重点。',
    'OffMix 这类论坛型品牌活动，最容易让粉丝误以为现场会像普通见面会那样有完整互动。实际上，这种活动通常更偏品牌主题、媒体露出和短时同台，所以最重要的是先判断：值不值得去、能不能看到、现场会不会有围观区。

这条整理会优先说明预约入口、论坛属性和围观区提示，让第一次追 OffMix 品牌线的新粉也能快速理解。这类内容最大的价值不是“海报好不好看”，而是提前看懂现场规则，避免白跑一趟。

如果后续品牌方补出入场地图、签到规则或公开出场时间，站内会继续把更新并回这条稿里。',
    '品牌活动',
    'published',
    '2026-06-06T10:20:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Off_300.jpg',
    array['off-jumpol', 'mix-sahaphap']
  ),
  (
    'bounprem-stage-weekend-preview',
    'BounPrem Bangkok Stage Weekend Preview',
    '整理双场节奏、票务重点和适合回坑粉先看的活动信息。',
    'BounPrem 这种双场周末活动，对回坑粉和双人线粉丝来说都很适合先看站内整理。因为真正需要先搞清楚的，通常不是有活动这件事，而是这两场到底会不会有内容差异、福利差异，以及值不值得两场都追。

这条快读会优先说明双场节奏、票务重点和互动福利，也会提示哪些信息还要等官方进一步补全。对第一次重新看回 BounPrem 线的人来说，这种整理比直接冲票务页更容易先建立判断。

如果后续 Studio Wabi Sabi 补出双场差异、特典说明或正式票区图，站内会继续更新在这条稿里。',
    '活动速递',
    'published',
    '2026-06-08T15:10:00+08:00',
    'https://www.facebook.com/StudiowabisabiTH',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Boun_300.jpg',
    array['boun-noppanut']
  ),
  (
    'nanon-manila-music-night-note',
    'Nanon Manila Music Night Note',
    '整理海外舞台活动的票区、歌单预告和适合新粉快速理解的关注点。',
    'Nanon 这类音乐舞台型活动，对中国粉丝来说最值得先看的通常不是海报，而是票区和歌单方向。因为这会直接影响你要不要为了这场活动专门做出行准备，以及这场到底更像小型演出还是完整舞台。

这条整理会优先说明票区、歌单预告和舞台属性，帮助第一次追 Nanon 个人线的新粉先快速建立判断。相比只看一句官宣，这种快读更适合做“值不值得追”的第一层筛选。

如果后续补出正式歌单、场馆图或粉丝福利，站内会继续把它们并回这条稿里。',
    '活动速递',
    'published',
    '2026-06-10T18:40:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Nanon_300.jpg',
    array['nanon-korapat']
  ),
  (
    'milknamtan-shenzhen-brand-day-note',
    'MilkNamtan Shenzhen Brand Day Note',
    '整理预约候补、拍照区和门店动线，适合围观型粉丝先看。',
    'MilkNamtan 这类品牌日活动最有价值的信息，通常集中在预约机制、拍照区和门店动线。对中国粉丝来说，这类活动不一定需要像见面会那样强准备，但如果没看清规则，也很容易现场体验不佳。

这条整理会先把预约候补、拍照区和门店动线说清楚，让想围观、拍照或顺路打卡的粉丝先快速判断怎么玩。对女艺人线的新粉来说，这种活动也很适合作为低门槛入口。

如果后续品牌方更新地图、签到时间或周边领取规则，站内会继续把这些补在这条内容下面。',
    '品牌活动',
    'published',
    '2026-06-12T12:00:00+08:00',
    'https://www.instagram.com/gmmtv/',
    'https://www.gmm-tv.com/cms/upload_file/vj_floating2026/thumb/Milk_300.jpg',
    array['milk-pansa', 'namtan-tipnaree']
  ),
  (
    'billkin-taipei-fashion-stage-watch',
    'Billkin Taipei Fashion Stage Watch',
    '整理公开出场时间、媒体区和适合时尚活动围观的关注重点。',
    'Billkin 这类时尚秀场活动，最需要先判断的是它到底更偏媒体露出还是更偏公开围观。因为这会影响你要不要专门跑现场，以及现场能看到的内容到底有多少。对中国粉丝来说，这类活动最怕的就是被名字吸引过去，结果现场并不适合围观。

这条快读会优先说明公开出场时间、媒体区和秀场属性，帮助你快速判断值不值得继续盯。相比单纯看品牌帖，这种整理更适合做第一层信息筛选。

如果后续品牌方补出秀场位置图、到场时间窗口或正式时尚图，站内会继续把更新并进这条稿里。',
    '品牌活动',
    'published',
    '2026-06-14T17:30:00+08:00',
    'https://www.youtube.com/@BillkinEntertainment/videos',
    '/portraits/billkin.png',
    array['billkin']
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body_md = excluded.body_md,
  category = excluded.category,
  review_status = excluded.review_status,
  published_at = excluded.published_at,
  source_url = excluded.source_url,
  cover_url = excluded.cover_url,
  related_star_slugs = excluded.related_star_slugs,
  updated_at = now();

select 'stars' as table_name, count(*) as total from stars union all select 'events', count(*) from events union all select 'event_stars', count(*) from event_stars union all select 'news_posts', count(*) from news_posts;
