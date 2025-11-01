export async function triggerDeploy() {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL || "";
  if (!hook) return { ok: false, reason: "No deploy hook provided" };
  try {
    const res = await fetch(hook, { method: "POST" });
    return { ok: res.ok };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}
