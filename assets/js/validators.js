/* TenRusl - DocShot · validators.js
   Lightweight validators & sanitizers used by the UI.
   Exposes window.DocValidators with:
   - sanitizeSnippet(text, maxLen?)
   - splitBlocks(text) -> [blocks]
   - validateSize(str) -> { ok, width, height, error? }
   - validateSettings({ padding, gutter, wmText }) -> { ok, errors:[] }
   - isHexColor(str)
*/
(function () {
    "use strict";

    function clamp(n, min, max) {
        n = Number(n);
        if (!Number.isFinite(n)) return min;
        return Math.max(min, Math.min(max, n));
    }

    function sanitizeSnippet(text, maxLen) {
        const cap = Math.max(1, maxLen || 800000);
        return String(text || "")
            .replace(/\r\n?/g, "\n")
            .replace(/\u0000/g, "") // strip NUL
            .slice(0, cap)
            .trim();
    }

    function splitBlocks(text) {
        const clean = sanitizeSnippet(text);
        const parts = clean
            .split(/^---$/m)
            .map((s) => s.trim())
            .filter(Boolean);
        return parts.length ? parts : [clean];
    }

    function validateSize(str) {
        const s = String(str || "").toLowerCase();
        // allow aliases
        if (s === "1600x900" || s === "16:9") return { ok: true, width: 1600, height: 900 };
        if (s === "1240x1754" || s === "a4") return { ok: true, width: 1240, height: 1754 };
        const m = s.match(/^(\d{2,5})x(\d{2,5})$/);
        if (!m) return { ok: false, error: "Invalid size format. Use WxH (e.g., 1600x900)." };
        const w = clamp(parseInt(m[1], 10), 64, 10000);
        const h = clamp(parseInt(m[2], 10), 64, 10000);
        return { ok: true, width: w, height: h };
    }

    function isHexColor(str) {
        return typeof str === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str);
    }

    function validateSettings(cfg) {
        const errors = [];
        const padding = clamp(cfg.padding, 0, 512);
        const gutter = clamp(cfg.gutter, 0, 256);
        const wmText = String(cfg.wmText || "");
        if (padding !== Number(cfg.padding)) errors.push("Padding coerced to range 0..512.");
        if (gutter !== Number(cfg.gutter)) errors.push("Gutter coerced to range 0..256.");
        if (wmText.length > 200) errors.push("Watermark text is too long (max 200 chars).");
        return { ok: errors.length === 0, errors, padding, gutter, wmText };
    }

    window.DocValidators = {
        sanitizeSnippet,
        splitBlocks,
        validateSize,
        validateSettings,
        isHexColor,
    };
})();
