# Cron First-Run Preflight

Last updated: 2026-05-18

This checklist is for the moment **before** you enable automatic daily runs.

Do not open cron first and hope the rest of the system is ready.
Cron is the last step.

## What must already be true

### 1. Health check is mostly green

Open:

- `/api/health`

Expected:

- `siteUrl` = ok
- `publicSupabase` = ok
- `adminSupabase` = ok
- `ai` = ok
- `cron` = ok or at least configured

If `publicSupabase` or `adminSupabase` is red, stop here.

### 2. Frontend already shows real content

Before enabling cron, confirm these pages do not feel empty or broken:

- `/`
- `/news`
- `/calendar`
- at least one `/stars/[slug]`
- at least one `/events/[slug]`

If the site still depends on mock-looking fallback content, stop here and fix the real data layer first.

### 3. Supabase migration has been executed

Confirm the main tables exist and are usable:

- `stars`
- `events`
- `news_posts`
- `ingestion_jobs`

Also confirm at least a few real rows already exist.

### 4. Manual newsroom loop has already succeeded once

Before cron is enabled, you should already have completed one manual loop:

1. `先试抓`
2. `用这条内容生成候选`
3. open candidate in admin
4. review
5. publish
6. confirm it appears on `/news`

If this has never worked manually, do not enable cron yet.

### 5. Source pause control is understood

Know how to stop a noisy source before you go live.

Current control:

- `DAILY_NEWS_DISABLED_SOURCES`

Use comma-separated source slugs to pause problematic sources.

### 6. Day-one lane is decided in advance

Do not enable all sources blindly.

Recommended first automatic lane:

- `MEMINDY`
- `Billkin Entertainment`
- `PP Krit Entertainment`
- `DOMUNDI TV`

Preview-first or selective lane:

- `Studio Wabi Sabi`
- `CHANGE ARTIST / CHANGE2561`
- `GMMTV`
- `OPEN LABEL`
- `BeOnCloud`

## First cron run policy

For the first real run:

- enable cron only after one manual pass succeeded
- start with the cleanest lane
- publish only `2 to 5` items on the first day
- do not treat “more candidates” as success

Success means:

- candidates are readable
- category is believable
- related star is correct
- links are correct
- frontend looks alive but not noisy

## Stop conditions

Pause cron or pause specific sources if:

- titles are noisy
- multiple duplicates appear
- most items fall into the wrong category
- related stars are wrong
- previews look like promo noise instead of usable updates

## Recommended first-day sequence

1. Check `/api/health`
2. Check frontend pages
3. Manually preview main lane sources
4. Generate `2 to 4` candidates
5. Publish `2 to 5` items
6. Verify `/news`
7. Only then enable cron

## Short version

If you only remember one sentence:

> First prove the manual flow works end-to-end, then enable cron last.
