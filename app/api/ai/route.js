import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const AI_SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT ||
  "You are NovaForge AI, a developer that builds complete web apps using Next.js + Tailwind + Supabase.";

const TR_AR = (process.env.AI_TRANSLATE_AR || "true") === "true";
const TR_HE = (process.env.AI_TRANSLATE_HE || "true") === "true";
const TR_EN = (process.env.AI_TRANSLATE_EN || "true") === "true";

function normalizePrompt(raw, lang) {
  const user = (raw || "").trim();
  let note = "";
  if (lang === "ar" && TR_AR) {
    note = "If the user writes in Arabic, translate intentions to English spec before code.";
  } else if (lang === "he" && TR_HE) {
    note = "If the user writes in Hebrew, translate intentions to English spec before code.";
  } else if (lang === "en" && TR_EN) {
    note = "User writes in English.";
  }
  const spec = [
    "Generate a minimal but production-ready Next.js 14 (app dir) + Tailwind project section.",
    "Return only one Markdown block that contains code and brief instructions.",
    "Prefer components, semantic HTML, and Tailwind utility classes.",
    "Include TODO notes where integration (e.g., Supabase) would be required."
  ].join("\n- ");

  return `${AI_SYSTEM_PROMPT}\n${note}\nUser request:\n${user}\n\nBuild spec:\n- ${spec}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "");
    const lang = String(body?.lang || "ar");

    if (!prompt) {
      return NextResponse.json({ ok: false, error: "Missing prompt" }, { status: 400 });
    }
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const messages = [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: normalizePrompt(prompt, lang) }
    ];

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      const txt = await aiResponse.text();
      return NextResponse.json({ ok: false, error: `OpenAI error: ${txt}` }, { status: 500 });
    }
    const data = await aiResponse.json();
    const content = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ ok: true, content });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "ai-api" });
}
