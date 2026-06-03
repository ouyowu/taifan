import fs from "fs";
import path from "path";

const MOCK_DATA_PATH = path.join(process.cwd(), "src", "lib", "mock-data.ts");

export async function POST(req: Request) {
  const { slug, coverUrl } = await req.json();
  if (!slug || !coverUrl) {
    return Response.json({ ok: false, error: "缺少 slug 或 coverUrl" }, { status: 400 });
  }

  try {
    let src = fs.readFileSync(MOCK_DATA_PATH, "utf-8");

    // Find the artist block by slug and replace coverUrl + avatarUrl inside it
    // Strategy: replace the coverUrl line within the nearest slug block
    const slugPattern = new RegExp(
      `(slug:\\s*["']${slug}["'][^}]*?coverUrl:\\s*["'])([^"']+)(["'])`,
      "s"
    );
    const avatarPattern = new RegExp(
      `(slug:\\s*["']${slug}["'][^}]*?avatarUrl:\\s*["'])([^"']+)(["'])`,
      "s"
    );

    if (!slugPattern.test(src)) {
      return Response.json({ ok: false, error: `找不到 slug: ${slug}` }, { status: 404 });
    }

    src = src.replace(slugPattern, `$1${coverUrl}$3`);
    src = src.replace(avatarPattern, `$1${coverUrl}$3`);

    fs.writeFileSync(MOCK_DATA_PATH, src, "utf-8");
    return Response.json({ ok: true, slug, coverUrl });
  } catch (e: unknown) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
