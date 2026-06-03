import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const SCRIPT = path.join(process.cwd(), "scripts", "ig_fetch.py");
const PYTHON = "/Users/ouyowu/.local/bin/python3.11";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const count = searchParams.get("count") ?? "12";

  if (!handle) {
    return Response.json({ ok: false, error: "缺少 handle 参数" }, { status: 400 });
  }

  try {
    const { stdout } = await execAsync(
      `${PYTHON} ${SCRIPT} fetch ${handle} ${count}`,
      { timeout: 60000 }
    );
    return Response.json(JSON.parse(stdout));
  } catch (e: unknown) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
