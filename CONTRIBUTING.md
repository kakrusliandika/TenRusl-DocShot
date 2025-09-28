# Contributing to TenRusl - DocShot

Thanks for your interest in improving **TenRusl - DocShot**! Contributions are welcome via Issues and Pull Requests.

## Quick Start

-   This project is a **static site** (HTML/CSS/JS only). No build step required.
-   Open `index.html` in a modern browser, or serve the folder with any static server.
-   Target performance, security, accessibility, and UX in every change.

## How to Contribute

1. **Create an issue** describing the bug/feature.
2. **Fork** the repo and create a branch:
    - `feat/<short-description>` for features
    - `fix/<short-description>` for fixes
    - `docs/<short-description>` for docs
3. **Commit messages** using Conventional Commits (examples):
    - `feat: add ID/EN language toggle on pages`
    - `fix(css): align labels in toolbar`
4. **Pull Request**
    - Reference related issues.
    - Describe what changed and why.
    - Add before/after screenshots for UI changes.

## Code Style

-   **HTML**: semantic, accessible (labels, alt, aria, focus-visible). Prefer no inline JS/CSS unless necessary (e.g., JSON-LD).
-   **CSS**: use existing tokens, keep selectors small, prefer utility patterns and modern layout (grid/flex).
-   **JS**: vanilla ES modules or IIFE, no `eval`, avoid global leaks, escape untrusted content.

## Accessibility

-   Keyboard access (tab order, focus states).
-   Color contrast (WCAG AA).
-   Landmarks (`main`, `nav`, etc.), labels, aria attributes.

## Security

-   Never disable CSP in production headers; extend cautiously when adding 3rd parties.
-   Avoid external requests by default; when needed, document domains for CSP.
-   Sanitize/escape any user-provided text before injecting to DOM.

## Performance

-   Keep pages lightweight: minimal JS, compressed images, no blocking assets.
-   Use caching headers for `/assets/*`.
-   Prefer SVG for icons and CSS effects for visuals.

## i18n

-   Default language: **English**.
-   Keep English and Indonesian strings in dictionaries. Do not hardcode UI strings.

## Testing

-   Manual cross-browser: latest Chrome/Edge/Firefox/Safari; mobile Safari/Chrome.
-   Offline check (if Service Worker is enabled).
-   Lighthouse: target 90+ for Performance/Accessibility/Best Practices/SEO.

## Contact

If you need help or want to discuss an idea, open an issue or email **support@tenrusl.com**.
