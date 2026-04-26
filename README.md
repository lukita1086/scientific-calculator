# 🧮 Scientific Calculator / Calculadora Científica

A free, responsive, bilingual (English/Spanish) scientific calculator web app.  
No frameworks, no build step — pure HTML, CSS and vanilla JS.

🔗 **Live demo:** [yourcalculator.com](https://yourcalculator.com)

---

## ✨ Features

- **Scientific functions** — sin, cos, tan, asin, acos, atan, log, ln, √, |x|, n!, xʸ, x²
- **Constants** — π, e, with implicit multiplication (e.g. `2π`)
- **Smart UX** — auto-closes parentheses, strips trailing operators, ANS reuse
- **Calculation history** — click any entry to reuse it
- **Copy result** button
- **DEG / RAD** mode toggle
- **Dark & Light** theme
- **Two font sizes** — Normal / Large
- **Decimal rounding** — Auto or 0–15 fixed decimal places
- **Bilingual** — English & Spanish, auto-detected from browser language
- **✓ Verified** — 76 built-in tests run live in the browser
- **Fully responsive** — desktop, tablet, mobile
- **Ad-ready** — bottom banner placeholder for Google AdSense

---

## 🗂 Project Structure

```
scientific-calculator/
├── index.html          # Main page + SEO meta + JSON-LD
├── robots.txt          # Search engine crawl rules
├── sitemap.xml         # Sitemap for indexing
├── css/
│   └── style.css       # All styles, dark/light themes, responsive
└── js/
    ├── i18n.js         # Language detection & translations
    ├── calculator.js   # Math engine (tokenizer + parser, no eval)
    ├── history.js      # Calculation history (localStorage)
    ├── tests.js        # 76-test verification suite
    └── app.js          # UI wiring, theme, settings, keyboard
```

---

## 🚀 Running Locally

No build step needed — just open in a browser:

```bash
# Option 1 — direct file
open index.html

# Option 2 — local server (recommended)
npx serve .
# then visit http://localhost:3000

# Option 3 — Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## 🌐 Deploying

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```
Connect your GitHub repo in the Vercel dashboard for auto-deploys on every push.

### GitHub Pages
1. Push to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be at `https://yourusername.github.io/scientific-calculator/`

### Netlify
Drag and drop the project folder at [netlify.com/drop](https://app.netlify.com/drop).

---

## 🔍 SEO

Before deploying, replace `https://yourcalculator.com` with your real domain in:
- `index.html` — canonical, hreflang, og:url tags
- `robots.txt` — Sitemap URL
- `sitemap.xml` — `<loc>` and `<xhtml:link>` URLs

Then submit your sitemap in [Google Search Console](https://search.google.com/search-console).

**Target keywords:**
- ES: `calculadora científica online`, `calculadora científica gratis`, `calculadora científica Argentina`
- EN: `scientific calculator online`, `free scientific calculator`

---

## 📋 TODO

- [ ] Replace ad strip with real Google AdSense `<ins>` tag
- [ ] Add math content section below the fold (SEO + educational value)
- [ ] PWA support (manifest.json + service worker for offline use)
- [ ] History export (CSV/TXT download)
- [ ] Share calculation via URL (`?expr=sin(45)`)
- [ ] Keyboard shortcut cheatsheet overlay
- [ ] Hyperbolic functions (sinh, cosh, tanh)
- [ ] Memory buttons (M+, M−, MR, MC)
- [ ] nCr / nPr (combinations & permutations)
- [ ] Unit converter mode
- [ ] Graphing mode (y = f(x))

---

## 📄 License

MIT — free to use and modify.
