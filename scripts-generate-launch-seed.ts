import { stars, events, newsItems } from './src/lib/mock-data';

function sqlString(value: string | null | undefined) {
  if (value == null) return 'null';
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlTextArray(values: string[] | null | undefined) {
  if (!values || values.length === 0) return "array[]::text[]";
  return `array[${values.map((value) => sqlString(value)).join(', ')}]`;
}

function sqlJson(value: unknown) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

const lines: string[] = [];
lines.push('-- 泰饭网首批线上数据导入');
lines.push('-- 可直接在 Supabase SQL Editor 运行');
lines.push('');
lines.push('alter table if exists news_posts add column if not exists review_status text default \'published\';');
lines.push('');

lines.push(`insert into stars (slug, name_cn, name_en, fandom_name, agency, base_city, bio, tags, avatar_url, cover_url, popularity_score, china_fan_priority)`);
lines.push('values');
lines.push(
  stars.map((star, index) => `  (\n    ${sqlString(star.slug)},\n    ${sqlString(star.nameCn)},\n    ${sqlString(star.nameEn)},\n    ${sqlString(star.fandomName)},\n    ${sqlString(star.agency)},\n    ${sqlString(star.baseCity)},\n    ${sqlString(star.bio)},\n    ${sqlTextArray(star.tags)},\n    ${sqlString(star.avatarUrl)},\n    ${sqlString(star.coverUrl)},\n    ${1000 - (star.chinaFanPriority ?? 999)},\n    ${star.chinaFanPriority ?? 999}\n  )${index === stars.length - 1 ? '' : ','}`)
    .join('\n')
);
lines.push('on conflict (slug) do update set');
lines.push('  name_cn = excluded.name_cn,');
lines.push('  name_en = excluded.name_en,');
lines.push('  fandom_name = excluded.fandom_name,');
lines.push('  agency = excluded.agency,');
lines.push('  base_city = excluded.base_city,');
lines.push('  bio = excluded.bio,');
lines.push('  tags = excluded.tags,');
lines.push('  avatar_url = excluded.avatar_url,');
lines.push('  cover_url = excluded.cover_url,');
lines.push('  popularity_score = excluded.popularity_score,');
lines.push('  china_fan_priority = excluded.china_fan_priority,');
lines.push('  updated_at = now();');
lines.push('');

lines.push(`insert into events (slug, title, type, status, city, venue, starts_at, ends_at, source_url, summary, ai_extracted)`);
lines.push('values');
lines.push(
  events.map((event, index) => `  (\n    ${sqlString(event.slug)},\n    ${sqlString(event.title)},\n    ${sqlString(event.type)},\n    ${sqlString(event.status)},\n    ${sqlString(event.city)},\n    ${sqlString(event.venue)},\n    ${sqlString(event.startsAt)},\n    ${sqlString(event.endsAt ?? null)},\n    null,\n    ${sqlString(event.summary)},\n    ${sqlJson({ highlights: event.highlights, ticketStatus: event.ticketStatus, sourceLabel: event.sourceLabel })}\n  )${index === events.length - 1 ? '' : ','}`)
    .join('\n')
);
lines.push('on conflict (slug) do update set');
lines.push('  title = excluded.title,');
lines.push('  type = excluded.type,');
lines.push('  status = excluded.status,');
lines.push('  city = excluded.city,');
lines.push('  venue = excluded.venue,');
lines.push('  starts_at = excluded.starts_at,');
lines.push('  ends_at = excluded.ends_at,');
lines.push('  summary = excluded.summary,');
lines.push('  ai_extracted = excluded.ai_extracted,');
lines.push('  updated_at = now();');
lines.push('');

lines.push('delete from event_stars;');
lines.push('insert into event_stars (event_id, star_id, role)');
lines.push('select e.id, s.id, \'guest\'');
lines.push('from (values');
const eventStarPairs = events.flatMap((event) => event.starSlugs.map((starSlug) => ({ eventSlug: event.slug, starSlug })));
lines.push(
  eventStarPairs.map((pair, index) => `  (${sqlString(pair.eventSlug)}, ${sqlString(pair.starSlug)})${index === eventStarPairs.length - 1 ? '' : ','}`).join('\n')
);
lines.push(') as links(event_slug, star_slug)');
lines.push('join events e on e.slug = links.event_slug');
lines.push('join stars s on s.slug = links.star_slug');
lines.push('on conflict (event_id, star_id) do update set role = excluded.role;');
lines.push('');

lines.push(`insert into news_posts (slug, title, excerpt, body_md, category, review_status, published_at, source_url, cover_url, related_star_slugs)`);
lines.push('values');
lines.push(
  newsItems.map((item, index) => {
    const leadStar = item.relatedStars[0];
    const leadStarCover = stars.find((star) => star.slug === leadStar)?.coverUrl ?? null;
    const body = item.bodyMd ?? `${item.excerpt}\n\n这是一条首发导入的中文整理稿，可在后台继续补充更完整的活动攻略、票务说明和原文搜索线索。`;
    return `  (\n    ${sqlString(item.slug)},\n    ${sqlString(item.title)},\n    ${sqlString(item.excerpt)},\n    ${sqlString(body)},\n    ${sqlString(item.category)},\n    ${sqlString(item.reviewStatus ?? 'published')},\n    ${sqlString(item.publishedAt)},\n    ${sqlString(item.sourceUrl ?? null)},\n    ${sqlString(leadStarCover)},\n    ${sqlTextArray(item.relatedStars)}\n  )${index === newsItems.length - 1 ? '' : ','}`;
  }).join('\n')
);
lines.push('on conflict (slug) do update set');
lines.push('  title = excluded.title,');
lines.push('  excerpt = excluded.excerpt,');
lines.push('  body_md = excluded.body_md,');
lines.push('  category = excluded.category,');
lines.push('  review_status = excluded.review_status,');
lines.push('  published_at = excluded.published_at,');
lines.push('  source_url = excluded.source_url,');
lines.push('  cover_url = excluded.cover_url,');
lines.push('  related_star_slugs = excluded.related_star_slugs,');
lines.push('  updated_at = now();');
lines.push('');
lines.push(`select 'stars' as table_name, count(*) as total from stars union all select 'events', count(*) from events union all select 'event_stars', count(*) from event_stars union all select 'news_posts', count(*) from news_posts;`);

console.log(lines.join('\n'));
