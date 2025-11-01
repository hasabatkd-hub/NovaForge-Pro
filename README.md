# NovaForge Pro

- Arabic / Hebrew / English input
- Build -> Preview -> Publish or Continue Editing
- Saves to `projects/<slug>.md` and updates `data/projects.json`

## Required ENV (Vercel)
GITHUB_TOKEN
GITHUB_OWNER
GITHUB_REPO
GITHUB_BRANCH
OPENAI_API_KEY
AI_MODEL=gpt-4o-mini
AI_SYSTEM_PROMPT=You are NovaForge AI, a developer that builds complete web apps using Next.js + Tailwind + Supabase.
AI_TRANSLATE_AR=true
AI_TRANSLATE_HE=true
AI_TRANSLATE_EN=true
VERCEL_DEPLOY_HOOK_URL (optional)

## Run
1) Upload to GitHub
2) Import in Vercel, set env vars, deploy
3) Open /builder/my-app
