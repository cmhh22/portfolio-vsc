# Handoff: cmhh's portfolio (VS Code metaphor)

## What this is
A personal portfolio for **Carlos Manuel Hernández** built as a fully interactive **VS Code IDE replica** in the browser. Every section of the resume (about, projects, skills, experience, etc.) is a "file" in the editor. Hi-fi React prototype using inline JSX via Babel standalone. Already designed and built — needs deployment + a couple polish/integration items.

The user's GitHub handle is `cmhh22`. The user wants to deploy on **Vercel**.

## File tree
```
index.html                  ← entry point. Loads React+Babel via CDN. Renders <div id="root">.
app.jsx                     ← main React app (≈2100 lines). Has the IDE shell, Copilot, dino game.
sections.jsx                ← contents of each "file" tab (HomeSection, AboutSection, ProjectsSection, etc.).
styles.css                  ← all styling (~2400 lines). Theme variables, components, animations.
avatar.svg                  ← Carlos's avatar shown in home.py.
api/chat.js                 ← Vercel Edge serverless function — proxies Copilot chat to Gemini API.
vercel.json                 ← Vercel config (just an index rewrite).
DEPLOY.md                   ← user-facing deploy guide (already written, may be useful reference).
uploads/
  Carlos_Manuel_CV_v2-6a0482d3.pdf   ← the actual CV file referenced from the app.
  Carlos_Manuel_CV_v2.pdf            ← (duplicate / older)
```

## Tech stack
- **React 18.3.1 + ReactDOM 18.3.1** loaded via `<script src="https://unpkg.com/...">` with pinned versions + SRI hashes. **Do not** change these tags.
- **Babel standalone 7.29.0** compiles the inline JSX in the browser. Same — pinned, do not touch.
- **Fonts**: JetBrains Mono + Inter via Google Fonts.
- **Two JSX files**: `sections.jsx` MUST be loaded BEFORE `app.jsx` (already correct in `index.html`).
- **No build step.** Everything runs as-is. No npm, no bundler. This is intentional — keeps deploy trivial.

## The Copilot chatbot — how it works
The portfolio has an in-app AI assistant ("CMHH's Copilot") in the right-side panel.

**Two execution paths** in `app.jsx` inside `CopilotPanel.send()`:
1. **Production (deployed on Vercel)** → fetches `/api/chat` (Edge function) → streams Gemini responses as Server-Sent Events back to the browser, token by token.
2. **Anthropic preview / fallback** → uses `window.claude.complete` if present (this only exists inside the Anthropic design preview where the project was built; ignore in production).

The code auto-detects which path to use: `const useServerless = !window.claude || !window.claude.complete;`

### Server function `api/chat.js`
- **Runtime: Vercel Edge** (`export const config = { runtime: "edge" }`) — required for streaming.
- Calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse`
- Reads system prompt + user message, streams the response back as SSE chunks `{"text": "..."}`.
- **Env var required: `GEMINI_API_KEY`** — must be set in Vercel project settings → Environment Variables before deploy.

### Free message quota + dino game
- Users get **3 free messages** per browser (stored in `localStorage` key `cmhh-copilot-tokens`, default 3).
- When tokens hit 0, the textarea is replaced with a "quota exhausted" CTA.
- Clicking the CTA renders **inline** (NOT modal) a retro pixel **dino runner** game inside the Copilot panel.
- Target score: **200 pts**. Win → tokens refill to 3.
- The game canvas reads CSS variables (`--accent`, `--accent-2`, `--fg`) from the active theme so it adapts to whichever theme the user picked (Dracula, Monokai, etc.).
- Failed API calls **refund the token** so users don't lose a message to network errors.

## The CV file
The "Download CV" / `resume.pdf` tab opens **`uploads/Carlos_Manuel_CV_v2-6a0482d3.pdf`** in a new tab.

Two places in `app.jsx` hardcode this path:
- `openFile()` function around line 247
- Terminal command `resume` / `cv` around line 1173

If the user wants to swap the CV, either:
1. Replace the file at `uploads/Carlos_Manuel_CV_v2-6a0482d3.pdf` (easiest), or
2. Update both string occurrences to point to the new filename.

## Deploy on Vercel — exact steps for the user
1. **Get a Gemini API key (free, no card)**: https://aistudio.google.com/apikey → Create API key. Copy the `AIza...` value.
2. **Push the project to GitHub** as a public repo.
3. **vercel.com → Add New Project → Import the repo.**
4. In the import config screen:
   - Framework Preset: **Other** (it's static + edge functions, no build).
   - Build Command: leave empty.
   - Output Directory: leave empty.
5. **Add Environment Variable** (in the same screen):
   - `GEMINI_API_KEY` = `AIza...` (the key from step 1).
6. **Deploy.** Vercel auto-detects `api/chat.js` as an Edge Function.
7. Verify: open the URL, click ✦ in the activity bar, send a message — it should stream Gemini's reply token by token.

### Free tier limits (Gemini)
- 15 requests/minute
- 1,500 requests/day
- Model: `gemini-1.5-flash`
- Total cost: **$0** with no card required.

## Known constraints / things NOT to change
- **Do not introduce a build step.** Everything runs as inline JSX through Babel standalone. Keep it that way.
- **Do not change the React/Babel/ReactDOM script tags in `index.html`.** They have SRI hashes pinned by the original system.
- **Do not** use `type="module"` on script imports — breaks Babel standalone.
- The `<style id="__om-edit-overrides">` block (if you see one) is for direct-manipulation edits; respect any `!important` rules in it.
- All canonical HTML: double-quoted attributes, explicit closes, no self-closing non-void elements.

## What might be polished / fixed
The user mentioned some loose ends to verify:
- Confirm the CV opens correctly after deploy (paths are relative to root, so `uploads/...` resolves fine on Vercel).
- Confirm streaming works after Vercel deploy (Edge runtime is required — already configured).
- If they want a different model: change the URL in `api/chat.js` (e.g. `gemini-1.5-pro` for higher quality, but lower rate limits).

## Quick local test (optional, before deploying)
Static files work standalone but `/api/chat` won't — only the in-Anthropic-preview fallback runs locally. To actually test the Gemini integration without deploying:
```bash
npm i -g vercel
vercel dev
```
Then visit `http://localhost:3000`. Requires `GEMINI_API_KEY` in a `.env.local` file at the root.

## Tone of the app
- VS Code dark mode aesthetic. 8 selectable themes (Default Dark+, Tokyo Night, One Dark, Dracula, Monokai, GitHub Dark, Gruvbox, Paper Mono).
- Monospace heavy (JetBrains Mono). Inter for UI text.
- Color: never invent new — use theme variables `--accent`, `--accent-2`, `--fg`, `--fg-dim`, `--bg`, `--bg-elev`, `--border`, `--acc-amber`, `--acc-mint`, `--acc-rose`.
- Animations: subtle, slow (2–4s loops), low intensity. The user explicitly asked for "silent" animations — nothing flashy.
- The Copilot chat: user messages on the right with person SVG avatar (no bubble — just text); assistant messages on the left with a gradient ✦ avatar that has a rotating shine + breathing halo while streaming.

## Contact info hardcoded in `app.jsx`
- Email: `carlosmanuelhdezhdez@gmail.com`
- Phone: `+53 56658638`
- GitHub: `github.com/cmhh22`
- LinkedIn: `linkedin.com/in/cmhh22`
- Location: Cuba

## The system prompt for the Copilot (lives in `api/chat.js`)
It's a long prompt instructing Gemini to only answer about Carlos, match the user's language (Spanish/English), and stay concise. Easter egg: if asked "who built this portfolio?" reply about Claude + the VS Code metaphor. Keep the prompt as-is unless the user explicitly asks to change it.
