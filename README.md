# cmhh's Portfolio — VS Code Edition

> A personal portfolio that *is* a VS Code window. Every section of the resume lives as a "file" in an interactive IDE replica built entirely in the browser — no build step, no bundler, just React + Babel + a single Vercel Edge function.

**Live →** [portfolio-vsc-five.vercel.app](https://portfolio-vsc-five.vercel.app)

---

## ✦ Features

- **Full VS Code metaphor** — activity bar, file explorer, tabs, breadcrumbs, status bar, and 8 selectable color themes (Tokyo Night, Dracula, One Dark, Monokai, GitHub Dark, Gruvbox, Catppuccin, Paper Mono).
- **AI Copilot panel** — in-app assistant powered by Gemini 2.5 Flash-Lite streaming SSE, answers questions about Carlos's projects, skills and experience in Spanish or English.
- **Interactive terminal** — fake bash with real commands: `ls`, `cat`, `whoami`, `skills`, `resume`, `github`, `sudo hire me`, and a few easter eggs.
- **Dino runner game** — when the 3 free Copilot messages are exhausted, a retro pixel runner appears inline. Score 200 pts to refill tokens. Game colors adapt to the active theme via CSS variables.
- **Command palette** (`Ctrl+P`) — fuzzy-search navigation across all sections.
- **Zero build step** — React 18 + Babel standalone loaded from CDN with SRI hashes. Deploy is a `git push`.

## 📁 File tree

```
index.html          Entry point. Loads React + Babel via CDN.
app.jsx             Main app (~2100 lines): IDE shell, Copilot, terminal, dino game.
sections.jsx        Content of each "file" tab: home, about, projects, skills, experience.
styles.css          All styling (~2400 lines): theme variables, components, animations.
avatar.svg          Profile avatar shown in home.py tab.
api/chat.js         Vercel Edge function — proxies Copilot chat to Gemini API via SSE.
vercel.json         Single index rewrite. No build config needed.
uploads/            Static assets served by Vercel (CV PDF).
```

## 🚀 Deploy your own

### 1. Get a free Gemini API key
Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → **Create API key**. No credit card required.

### 2. Push to GitHub
```bash
git clone https://github.com/cmhh22/portfolio-vsc.git
cd portfolio-vsc
# edit sections.jsx and api/chat.js with your own info
git add . && git commit -m "personalize" && git push
```

### 3. Deploy on Vercel
1. [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
2. Framework Preset: **Other**.
3. Build Command: **leave empty**.
4. Output Directory: **leave empty**.
5. Environment Variables → add `GEMINI_API_KEY` = your key (check **all 3 environments**: Production, Preview, Development).
6. **Deploy.**

### 4. Local dev (optional)
The static files work standalone. To test the Copilot locally:
```bash
npm i -g vercel
echo "GEMINI_API_KEY=AIza..." > .env.local
vercel dev
# visit http://localhost:3000
```

## 🤖 How the Copilot works

```
Browser  →  POST /api/chat  →  Vercel Edge Function  →  Gemini 2.5 Flash-Lite (SSE)
         ←  Server-Sent Events (token by token)       ←
```

- **3 free messages** per browser session (stored in `localStorage`).
- Failed API calls refund the token — users never lose a message to network errors.
- **Quota recovery**: run the inline dino game and score 200 pts to refill tokens.
- Responds in the same language the user writes (Spanish or English).

**Free tier limits (Gemini):** 15 req/min · 1,500 req/day · $0 · no card needed.

## 🎨 Theming

All colors are CSS variables — never hardcoded. Active theme set by a `data-theme` attribute on `<html>`. Available tokens:

```css
--bg, --bg-elev, --border
--fg, --fg-dim
--accent, --accent-2
--acc-amber, --acc-mint, --acc-rose
```

## ⚠️ Constraints (if you fork this)

- **Do not introduce a build step.** Everything runs as inline JSX through Babel standalone.
- **Do not change the `<script>` tags in `index.html`.** They have SRI hashes pinned.
- **Do not use `type="module"`** on script imports — breaks Babel standalone.
- When extending: use only the CSS variables above, never raw hex values.

## 🛠 Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 18.3.1 (UMD, CDN) |
| JSX compiler | Babel Standalone 7.29.0 (in-browser) |
| Styling | Vanilla CSS with custom properties |
| AI backend | Gemini 2.5 Flash-Lite via REST SSE |
| Serverless | Vercel Edge Functions |
| Fonts | JetBrains Mono + Inter (Google Fonts) |
| Hosting | Vercel (free tier) |

## 📄 License

MIT — [fork it and make it yours](https://github.com/cmhh22/portfolio-vsc/fork).

> If you use this template, a ⭐ on the repo is appreciated.  
> Remember to replace the content in `sections.jsx` and `api/chat.js` with your own info before deploying.
