import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const SCRIPT = path.join(process.cwd(), "scripts", "ig_fetch.py");
const PYTHON = "/Users/ouyowu/.local/bin/python3.11";

export async function GET() {
  try {
    const { stdout } = await execAsync(`${PYTHON} ${SCRIPT} status`);
    return Response.json(JSON.parse(stdout));
  } catch {
    return Response.json({ sessions: [] });
  }
}

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return Response.json({ ok: false, error: "需要用户名和密码" }, { status: 400 });
  }
  try {
    const { stdout } = await execAsync(
      `${PYTHON} ${SCRIPT} login ${JSON.stringify(username)} ${JSON.stringify(password)}`,
      { timeout: 30000 }
    );
    return Response.json(JSON.parse(stdout));
  } catch (e: unknown) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
