"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Builder({ params }) {
  const search = useSearchParams();
  const defaultLang = search.get("lang") || "ar";
  const [lang, setLang] = useState(defaultLang);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const slug = params.slug || "my-app";

  const filePath = useMemo(() => `projects/${slug}.md`, [slug]);

  async function handleBuild() {
    if (!input.trim() || busy) return;
    setBusy(true);
    setMessage("Generating app with AI ...");
    setPreview("");

    try {
      const aiRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, lang })
      });
      const ai = await aiRes.json();
      if (!ai.ok) throw new Error(ai.error || "AI failed");

      setPreview(ai.content || "");
      setMessage("Preview ready. You can Publish or Continue Editing.");
    } catch (e) {
      setMessage("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    if (!preview.trim() || busy) return;
    setBusy(true);
    setMessage("Saving to GitHub and triggering Vercel ...");
    try {
      const res = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content: preview,
          message: `NovaForge: update ${filePath}`,
          trigger: true
        })
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Build failed");
      setMessage("Published! Open your site or keep editing.");
    } catch (e) {
      setMessage("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  function useTemplate(t) {
    const templates = {
      "landing": "Landing page with hero, features, FAQ, and contact.",
      "dashboard": "Admin dashboard with sidebar, topbar, stats cards, and table.",
      "store": "E-commerce store with product grid, cart drawer, and checkout placeholder."
    };
    setInput(templates[t] || "");
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Builder</h1>
        <div className="flex items-center gap-2">
          <select className="input w-36" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="ar">العربية</option>
            <option value="he">עברית</option>
            <option value="en">English</option>
          </select>
          <button className="btn" onClick={() => useTemplate("landing")}>Template: Landing</button>
          <button className="btn" onClick={() => useTemplate("dashboard")}>Template: Dashboard</button>
          <button className="btn" onClick={() => useTemplate("store")}>Template: Store</button>
        </div>
      </header>

      <section className="card p-4">
        <label className="block text-sm mb-2">أكتب ماذا تريد بناءه</label>
        <textarea
          className="input h-32"
          placeholder="مثال: صفحة هبوط لروبوت تداول مع قسم أسعار وخطة اشتراك"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <button className="btn" onClick={handleBuild} disabled={busy}>
            {busy ? "Working..." : "Build (Preview)"}
          </button>
          <button className="btn" onClick={() => setInput("")}>Clear</button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Preview</h2>
            <div className="text-xs text-neutral-400">{filePath}</div>
          </div>
          <pre className="whitespace-pre-wrap text-sm">{preview || "No preview yet."}</pre>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={handlePublish} disabled={!preview || busy}>Publish</button>
            <button className="btn" onClick={() => setPreview("")} disabled={!preview || busy}>Continue Editing</button>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <p className="text-sm text-neutral-300">{message || "Ready."}</p>
          <div className="mt-4">
            <a className="btn" href="/">Back to Home</a>
          </div>
        </div>
      </section>
    </main>
  );
}
