import { NextResponse } from "next/server";
import { writeFile, updateProjectsIndex } from "@/lib/github";
import { triggerDeploy } from "@/lib/vercel";

export async function GET() {
  return NextResponse.json({ ok: true, service: "build-api" });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const path = String(body?.path || "");
    const content = String(body?.content || "");
    const message = String(body?.message || "NovaForge: update");
    const trigger = Boolean(body?.trigger ?? true);

    if (!path || !content) {
      return NextResponse.json({ ok: false, error: "path & content required" }, { status: 400 });
    }

    const result = await writeFile(path, content, message);
    await updateProjectsIndex(path);

    if (trigger) {
      await triggerDeploy();
    }

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
