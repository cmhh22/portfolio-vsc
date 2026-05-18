# Deploy a Vercel + activar el Copilot (Gemini API GRATIS)

Guía paso a paso. Tiempo total: ~10 minutos.

---

## 1. Conseguir API key de Google Gemini (GRATIS, sin tarjeta)

1. Abre **https://aistudio.google.com/apikey**
2. Inicia sesión con cualquier cuenta de Google
3. Click **"Create API key"** → "Create API key in new project"
4. **Copia la key** (empieza con `AIza...`). Guárdala temporalmente — la pegarás en Vercel en el paso 4.

**Límites del plan gratuito** (más que suficiente para un portfolio):
- 15 peticiones por minuto
- 1,500 peticiones por día
- Modelo: `gemini-1.5-flash`

---

## 2. Subir el código a GitHub

1. Crea cuenta en **https://github.com** si no tienes
2. Crea un repo nuevo: **New repository → nombre: `portfolio-vsc` → Public → Create**
3. En tu computadora, descarga este proyecto y súbelo al repo:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio-vsc.git
git push -u origin main
```

> Si nunca has usado git, instala **GitHub Desktop** (https://desktop.github.com) — es más fácil: arrastra la carpeta y dale "Publish".

---

## 3. Deploy en Vercel

1. Ve a **https://vercel.com** y crea cuenta con tu GitHub
2. Click **"Add New… → Project"**
3. Selecciona tu repo `portfolio-vsc` → **Import**
4. En la pantalla de configuración:
   - **Framework Preset**: `Other` (déjalo así)
   - **Build Command**: déjalo vacío
   - **Output Directory**: déjalo vacío
5. **NO le des deploy todavía** — primero el paso 4 ↓

---

## 4. Configurar la API key en Vercel

En la MISMA pantalla de configuración del proyecto (o luego en Settings → Environment Variables):

1. Abre la sección **"Environment Variables"**
2. Agrega:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: la key que copiaste en el paso 1 (`AIza...`)
3. **Click "Deploy"**

En ~30 segundos te dará una URL tipo `https://portfolio-vsc-tuusuario.vercel.app`.

---

## 5. Probar

1. Abre la URL que te dio Vercel
2. Verifica:
   - ✅ El sitio carga
   - ✅ El cursor minimalista funciona
   - ✅ La pestaña dice "cmhh's portfolio" con el favicon de VS Code
   - ✅ Abre el Copilot (click el ✦ en la barra lateral o `⌘I`)
   - ✅ Pregúntale algo: "Tell me about Carlos"
   - ✅ Te responde Gemini

---

## ¿Algo falló?

**El Copilot responde "I'm having trouble connecting"**
- Revisa en Vercel: **Settings → Environment Variables** que `GEMINI_API_KEY` esté presente
- Después de agregarla, ve a **Deployments → último deploy → ⋯ → Redeploy** (las env vars necesitan redeploy)

**Error 429 (too many requests)**
- Estás superando 15 req/min del plan gratuito. Espera un minuto.

**El sitio carga pero el favicon no aparece**
- Hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac). El navegador cachea favicons agresivamente.

**Quiero dominio propio**
- Compra uno en Namecheap/Porkbun (~$10/año)
- En Vercel: **Settings → Domains → Add** → pega tu dominio y sigue las instrucciones DNS

---

## Archivos clave del proyecto

```
index.html        ← página de entrada (antes era portfolio.html)
app.jsx           ← lógica React del IDE
sections.jsx      ← contenido de cada "archivo" del editor
styles.css        ← todo el styling
avatar.svg        ← avatar de Carlos
api/chat.js       ← función serverless que llama a Gemini (Vercel la detecta sola)
vercel.json       ← configuración de Vercel
uploads/          ← tu CV PDF
```

---

## Costo total: **$0**

- Vercel hobby plan: gratis para siempre
- Gemini API free tier: gratis para siempre
- GitHub: gratis para repos públicos
