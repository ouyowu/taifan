# Day-One Ops Plan

Last updated: 2026-05-18

This is the recommended first live operations plan for `taifan.club`.

This version assumes a low-cost soft launch:

- website is live
- Supabase is connected
- AI key may still be missing
- daily news auto-generation is optional and can stay off

Before using this plan, finish:

- [cron 首次开启前检查](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/cron-first-run-preflight.md>)

The goal is not “run everything at once.”
The goal is:

- verify the real source layer is stable
- verify previewed source content is readable
- verify review + publish flow feels smooth
- avoid flooding the newsroom on day one

## Day-one operating principle

- Start with the cleanest, most readable sources.
- Use preview-first on sources that behave more like merch / preorder / promo posts.
- Publish a small number of clear items first.
- Only expand the source set after the first loop feels stable.

## Recommended day-one source order

### Main daily lane

Run these first because they currently produce the clearest, most fan-relevant candidate shape:

1. `MEMINDY`
2. `Billkin Entertainment`
3. `PP Krit Entertainment`
4. `DOMUNDI TV`

### Secondary lane

Use these after the first group looks good:

5. `GMMTV`
6. `OPEN LABEL`
7. `BeOnCloud`

### Preview-first lane

Use preview before candidate generation:

8. `Studio Wabi Sabi`

### Event-discovery lane

Use selectively when you want activity / campaign discovery:

9. `CHANGE ARTIST / CHANGE2561`

## Exact day-one flow

If AI key is still missing, skip any step that depends on candidate generation and use preview + manual publishing judgment only.

### Step 1. Preview the cleanest four sources

In the admin source board, use `先试抓` on:

- `MEMINDY`
- `Billkin Entertainment`
- `PP Krit Entertainment`
- `DOMUNDI TV`

Check only four things:

- Is the title clearly readable?
- Is the link correct?
- Does the preview feel like a real update instead of noise?
- Does it already exist in the system?

If one of these looks wrong, do not generate a candidate from that source yet.

### Step 2. Generate only 2 to 4 candidates

Do **not** generate all sources on the first pass.

Recommended first day:

- pick the best 2 sources if you want a careful first run
- or pick 4 sources if you want a fuller first newsroom pass

Best first candidates:

- one `artist vlog / official video` style post
- one `fresh update / recent video` style post
- one `company content` post if it is still clearly useful

Avoid starting with low-signal or ambiguous posts.

### Step 3. Review candidates in the admin content lane

Go to the content lane with:

- `只看待发布`
- `只看自动整理`

Review each candidate for:

- title clarity
- category correctness
- whether the Chinese summary reads naturally
- whether the related star is correct
- whether the item is worth publishing on day one

## Day-one publishing target

Recommended target:

- publish `2 to 5` items only

That is enough to prove:

- the source layer works
- the review flow works
- the frontend news center looks alive

It is not necessary to fill the whole site on day one.

## What to publish first

Best first publishes:

- items with a clear artist name in the title
- items with a clear recent timestamp
- items that map well to current tracked stars
- items that read well as a short Chinese quick-read

Avoid publishing first:

- merch / preorder posts unless they are very clear
- ambiguous company posts
- posts with weak or generic titles

## Special handling by source

### MEMINDY
- Good default day-one source
- Use as a main quick-read candidate source

### Billkin Entertainment
- Good default day-one source
- Best used when the title clearly reflects artist-led content

### PP Krit Entertainment
- Good default day-one source
- Best paired with Billkin as a complementary source

### DOMUNDI TV
- Good default day-one source
- Usually stable enough for day-one publishing

### GMMTV
- Strong source, but can be broader than the currently tracked stars
- Better used after the first four sources feel stable

### OPEN LABEL
- Stable public source
- Sometimes better as a selective editorial pick than a day-one auto publish

### BeOnCloud
- Keep it in the secondary lane
- Good source, but recent cadence may be slower than the first group

### Studio Wabi Sabi
- Always preview first
- Treat as merch / preorder / promo lane, not generic newsroom

### CHANGE ARTIST / CHANGE2561
- Use when you specifically want event / campaign discovery
- Not necessary for the first candidate batch unless the activity is clearly relevant

## Day-one success condition

Day one is already a success if all of these are true:

- 4 main sources preview correctly
- 2 to 4 candidates are generated cleanly
- 2 to 5 items are reviewed and published
- the published items look good on `/news`
- no clearly wrong related star or broken source link appears

## Day-one stop condition

Stop and do not keep scaling the source run if:

- titles become noisy or unclear
- multiple candidates are duplicates
- category assignment is obviously wrong
- related stars are wrong
- a source starts producing low-quality promo noise

If that happens:

- pause that source
- keep only the cleanest working sources
- continue from the stable group only

## Suggested second-day expansion

If day one is stable, then on day two:

- add `GMMTV`
- add `OPEN LABEL`
- selectively add `BeOnCloud`
- keep `Studio Wabi Sabi` preview-first
- use `CHANGE ARTIST / CHANGE2561` only when there is a clear event worth surfacing
