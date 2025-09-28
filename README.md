# TenRusl – DocShot

Turn text **snippets** into clean **slides/images** you can drop into decks, docs, or Confluence — **super fast**, **super lightweight**, **secure**, **SEO-ready**, **Dark/Light**, **Multi-language (EN/ID)**, and **responsive**.

-   Live site: https://tenrusl-docshot.pages.dev/
-   Contact: **support@tenrusl.com**
-   License: [MIT](./LICENSE)

---

## ✨ Features

-   **⚡ Super Fast** — static HTML/CSS/JS only; no frameworks.
-   **🪶 Super Lightweight** — tiny footprint; no external fonts; SVG icons.
-   **🛡️ Secure by default** — strict headers via [`_headers`](./_headers) (CSP, HSTS, COOP, etc.).
-   **📈 SEO Full** — clean metadata, canonical, Open Graph/Twitter, sitemap(s).
-   **🌓 Dark/Light** — dark = ☀️ (sun icon), light = 🌙 (crescent) toggle.
-   **🌐 Multi-Language** — instant **EN | ID** switch.
-   **🎛️ Modern UI/UX** — subtle gradients, soft shadows, accessible focus states.
-   **📱 Responsive** — mobile-first; action buttons become **icon-only** on small screens.
-   **📦 Export** — PNG, PDF (via print), Batch PNG, Copy to clipboard.
-   **🖼️ Watermark** — optional, editable text.
-   **📏 Controls** — Size presets (16:9, A4, Custom), Padding, Gutter.

---

## 🧩 Tech Stack

-   **Vanilla** HTML + CSS + JavaScript
-   Optional vendor libs (already vendored locally):
    -   `html2canvas.min.js`, `jspdf.umd.min.js`, `idb-keyval.min.js`, `tiny-zip.min.js`
-   Hosting: **Cloudflare Pages**

---

## 📁 Project Structure

```
TenRusl-DocShot/
├─ index.html
├─ _headers
├─ _redirects
├─ .gitignore
├─ ads.txt
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ humans.txt
├─ LICENSE
├─ manifest.webmanifest
├─ robots.txt
├─ sitemap.xml
├─ sitemap-index.xml
├─ googleFClG-*.html              # (example: Google site verification)
├─ assets/
│  ├─ css/
│  │  ├─ app.css
│  │  └─ pages.css
│  ├─ images/
│  │  └─ icon.png
│  ├─ i18n/
│  │  ├─ en.json
│  │  └─ id.json
│  ├─ js/
│  │  ├─ app.js
│  │  ├─ pages.js
│  │  ├─ router.js
│  │  ├─ sw.js
│  │  └─ validators.js
│  ├─ json/
│  │  ├─ rusl-pitch.json
│  │  └─ rusl-report.json
│  └─ plugin/
│     ├─ html2canvas.min.js
│     ├─ jspdf.umd.min.js
│     ├─ idb-keyval.min.js
│     └─ tiny-zip.min.js
├─ pages/
│  ├─ index.html                   # redirects to "/"
│  ├─ privacy.html
│  ├─ terms.html
│  ├─ cookies.html
│  ├─ contact.html
│  ├─ ad-unit-example.html
│  ├─ head-snippets.html
│  └─ index-injection-example.html
└─ .well-known/
   └─ (optional security/verification files)
```

> **Note**  
> The runtime UI strings (for the main app) live in `assets/js/app.js` (dictionary). The `assets/i18n/*.json` are provided for future expansion (e.g., loading external packs), but are not required for the current UI.

---

## 🚀 Getting Started

### 1) Clone the repository

```bash
# HTTPS
git clone https://github.com/tenrusl/tenrusl-docshot.git
cd tenrusl-docshot

# or SSH
git clone git@github.com:tenrusl/tenrusl-docshot.git
cd tenrusl-docshot
```

> If your repo is named differently, adjust the URL accordingly.

### 2) Run locally (choose one)

**Python 3 (cross-platform)**

```bash
# from project root
python -m http.server 8080
# open http://localhost:8080
```

**PHP built-in server (works great with Laragon/WAMP/XAMPP)**

```bash
php -S localhost:8080 -t .
# open http://localhost:8080
```

**VS Code Live Server / any static server**  
Use your favorite static server; no build step is required.

---

## 🧪 Using DocShot

1. **Paste** your snippet into the textarea.
2. Pick a **Size** (16:9, A4, or Custom width × height).
3. Adjust **Padding** and **Gutter**.
4. Toggle **Watermark** and edit text (optional).
5. Click **Preview** to render.
6. **Export PNG**, **Export PDF** (via browser print with images), **Batch PNG** (split slides with a line containing `---`), or **Copy Image** to clipboard.

**Multi-slides**  
Use `---` on a line by itself to split into slides:

```
# Slide 1
- point A
- point B
---
## Slide 2
- point C
```

---

## 🌗 Dark/Light & Language

-   **Theme toggle**:
    -   **Dark mode** shows **Sun** icon (tap to switch to Light).
    -   **Light mode** shows **Moon (crescent)** icon (tap to switch to Dark).
-   **Language**: click **EN | ID** (text buttons) to switch instantly.  
    The choice persists in `localStorage`.

---

## 🔐 Security

-   Tight **CSP** & security headers via [`_headers`](./_headers):
    -   `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, etc.
-   **No external scripts** by default (safe defaults).  
    If you add AdSense/Analytics, you must extend CSP allow-lists (see comments inside `_headers`).

**Consent & Ads (example pages)**

-   See `/pages/ad-unit-example.html` and `/pages/head-snippets.html`.
-   For EEA/UK/CH, use a Google-certified CMP + Consent Mode v2 before loading ads.

---

## 📈 SEO

-   Metadata: title, description, canonical, Open Graph/Twitter.
-   **Sitemaps**: `sitemap.xml`, `sitemap-index.xml`.
-   **robots.txt** configured.
-   Clean routes via [`_redirects`](./_redirects) (e.g., `/privacy` → `/pages/privacy.html`).

---

## ♿ Accessibility

-   Landmarks (`<main>`, `<nav>`).
-   Skip link, focus-visible outlines.
-   Sufficient color contrast (AA target).
-   Buttons have `aria-label` (icons only on mobile).

---

## 🧰 Development Notes

-   Main app files:
    -   **HTML**: `index.html`
    -   **CSS**: `assets/css/app.css`
    -   **JS**: `assets/js/app.js`
-   Pages (static content):
    -   HTML in `/pages/*.html`, styles in `assets/css/pages.css`, minor JS in `assets/js/pages.js`
-   Router/service worker stubs:
    -   `assets/js/router.js` (optional; you can wire SPA routes if needed)
    -   `assets/js/sw.js` (optional offline; disabled by default)

**Label Alignment**  
Labels in the top toolbar are **aligned** using a fixed width CSS variable:

```css
:root {
    --label-w: 96px;
}
.group.inline .label {
    flex: 0 0 var(--label-w);
    width: var(--label-w);
    text-align: right;
    padding-right: 6px;
}
```

---

## ☁️ Deploying to Cloudflare Pages

1. Create a new project and **Connect to Git** (your repo).
2. **Build settings**:
    - Framework preset: **None**
    - Build command: **(empty)**
    - Build output directory: **/** (project root)
3. Ensure `_headers` and `_redirects` are in the **root** of your project.
4. Set a custom domain if desired; TLS should be automatic.
5. On each push to `main`, Cloudflare will deploy a new version.

---

## 🤝 Contributing

We welcome contributions!

-   Read the [Code of Conduct](./CODE_OF_CONDUCT.md).
-   See [Contributing Guide](./CONTRIBUTING.md) for branch naming, commit style, and PR tips.
-   Open an Issue before large changes to align on approach.

---

## 🐞 Troubleshooting

-   **Icons not visible (light mode)**: Clear cache (CSP + cache headers might keep old CSS). Ensure `use href="#ico-moon"`/`#ico-sun` exists in sprite.
-   **PNG looks blurry**: We scale by `devicePixelRatio`; on unusual displays, try reloading or adjust browser zoom to 100%.
-   **PDF export empty window**: Some popup blockers prevent `window.open`. Allow popups for the site.
-   **Clipboard copy fails**: Requires Clipboard API + HTTPS. On unsupported browsers, use **Export PNG** instead.
-   **AdSense not loading**: Update `_headers` → `Content-Security-Policy` to include:
    -   `pagead2.googlesyndication.com`, `googleads.g.doubleclick.net`, `tpc.googlesyndication.com`, etc., and ensure consent flow runs first.

---

## 📄 Legal & Policies

-   [Privacy Policy](/pages/privacy.html)
-   [Terms of Service](/pages/terms.html)
-   [Cookie Policy](/pages/cookies.html)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 📬 Contact

-   Email: **support@tenrusl.com**
-   Website: https://tenrusl-docshot.pages.dev/
