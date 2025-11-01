export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold">NovaForge Studio (Pro)</h1>
      <p className="text-neutral-400 mt-2">
        اكتب وصف التطبيق ثم ابنِه، استعرض النتيجة، وانشر أو أكمل تعديل البناء.
      </p>
      <div className="mt-6 space-x-3">
        <a className="btn" href="/builder/my-app">ابدأ البناء (AR)</a>
        <a className="btn" href="/builder/my-app?lang=he">התחל בנייה (HE)</a>
        <a className="btn" href="/builder/my-app?lang=en">Start Building (EN)</a>
      </div>
    </main>
  );
}
