/* TenRusl - DocShot — final UI/UX (container luas, toolbar horizontal, lang text, actions center)
   - Theme: dark shows SUN, light shows MOON (crescent)
   - Language: text buttons EN | ID
   - Mobile: action buttons icon-only (labels hidden via CSS)
   - Safe: escapeHTML, no external fetch/eval
*/
(function () {
    "use strict";

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    const escapeHTML = (s) =>
        String(s || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    function toast(msg) {
        const el = $("#toast");
        if (!el) return;
        el.textContent = msg;
        el.hidden = false;
        setTimeout(() => (el.hidden = true), 1500);
    }

    /* ===== Theme ===== */
    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("docshot.theme", theme);
        const use = $("#themeToggle")?.querySelector("use");
        if (use) use.setAttribute("href", theme === "dark" ? "#ico-sun" : "#ico-moon");
    }
    function initTheme() {
        const saved = localStorage.getItem("docshot.theme");
        const prefersDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(saved || (prefersDark ? "dark" : "light"));
        $("#themeToggle")?.addEventListener("click", () => {
            setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    }

    /* ===== I18N ===== */
    const DICT = {
        en: {
            app: {
                title: "Turn snippets into slides/images",
                subtitle: "Paste → pick preset → adjust padding/gutter → Export PNG/PDF",
            },
            controls: { size: "Size", padding: "Padding", gutter: "Gutter", watermark: "Watermark" },
            actions: {
                preview: "Preview",
                exportPNG: "Export PNG",
                exportPDF: "Export PDF",
                batch: "Batch PNG",
                copy: "Copy Image",
            },
            preview: { title: "Preview" },
            toast: {
                rendering: "Rendering...",
                done: "Done!",
                downloaded: "Downloaded",
                copied: "Copied to clipboard!",
            },
        },
        id: {
            app: {
                title: "Ubah snippet jadi slide/gambar",
                subtitle: "Paste → pilih preset → atur padding/gutter → Export PNG/PDF",
            },
            controls: { size: "Ukuran", padding: "Padding", gutter: "Gutter", watermark: "Watermark" },
            actions: {
                preview: "Preview",
                exportPNG: "Export PNG",
                exportPDF: "Export PDF",
                batch: "Batch PNG",
                copy: "Salin Gambar",
            },
            preview: { title: "Pratinjau" },
            toast: {
                rendering: "Merender...",
                done: "Selesai!",
                downloaded: "Diunduh",
                copied: "Disalin ke clipboard!",
            },
        },
    };

    const I18N = {
        lang: "en",
        setLang(code) {
            if (!DICT[code]) return;
            this.lang = code;
            localStorage.setItem("docshot.lang", code);
            document.documentElement.lang = code;

            document.querySelectorAll("[data-i18n]").forEach((el) => {
                const key = el.getAttribute("data-i18n");
                const val = key.split(".").reduce((a, k) => (a ? a[k] : undefined), DICT[code]);
                if (typeof val === "string") el.textContent = val;
            });

            // Update active state on text buttons
            $$(".lang-link").forEach((btn) => {
                const active = btn.dataset.lang === code;
                btn.classList.toggle("active", active);
                btn.setAttribute("aria-pressed", String(active));
            });
        },
        init() {
            const saved = localStorage.getItem("docshot.lang");
            const nav = (navigator.language || "en").slice(0, 2);
            this.setLang(saved || (["en", "id"].includes(nav) ? nav : "en"));

            // Text buttons
            $$(".lang-link").forEach((btn) => {
                btn.addEventListener("click", () => this.setLang(btn.dataset.lang));
            });
        },
    };

    /* ===== Controls (horizontal) ===== */
    function connectRangeNumber(rangeSel, numSel, min, max) {
        const r = $(rangeSel),
            n = $(numSel);
        if (!r || !n) return;
        const clampNum = (v) => String(clamp(parseInt(v || "0", 10), min, max));
        r.addEventListener("input", () => (n.value = r.value));
        n.addEventListener("input", () => (r.value = clampNum(n.value)));
        n.addEventListener("change", () => (n.value = r.value = clampNum(n.value)));
    }

    function currentSize() {
        const val = $$("input[name=size]").find((r) => r.checked)?.value || "1600x900";
        if (val === "custom") {
            const w = clamp(parseInt($("#customW").value || "1600", 10), 64, 10000);
            const h = clamp(parseInt($("#customH").value || "900", 10), 64, 10000);
            return { width: w, height: h };
        }
        const m = /^(\d{2,5})x(\d{2,5})$/.exec(val);
        return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
    }

    function initControls() {
        // Custom size visibility
        $$("#size169, #sizeA4, #sizeCustom").forEach((el) => {
            el.addEventListener("change", () => {
                $("#customSize").hidden = !$("#sizeCustom").checked;
            });
        });
        $("#customSize").hidden = !$("#sizeCustom").checked;

        // Sync sliders
        connectRangeNumber("#paddingRange", "#paddingInput", 0, 256);
        connectRangeNumber("#gutterRange", "#gutterInput", 0, 128);

        // Watermark switch
        $("#wmToggle")?.addEventListener("change", () => {
            $("#wmText").hidden = !$("#wmToggle").checked;
        });
    }

    /* ===== Snippet blocks ===== */
    function getBlocks() {
        const raw = ($("#snippet").value || "").replace(/\r\n?/g, "\n").slice(0, 800000);
        const parts = raw
            .split(/^---$/m)
            .map((s) => s.trim())
            .filter(Boolean);
        return parts.length ? parts : [raw.trim()];
    }

    /* ===== Render (SVG → Canvas) ===== */
    function buildSVG(frame, text) {
        const safe = escapeHTML(text).replace(/\n/g, "<br/>");
        const wm = frame.watermark
            ? `<div style="opacity:.35;font:600 12px ui-sans-serif;letter-spacing:.08em">${escapeHTML(
                  frame.wmText || ""
              )}</div>`
            : "";
        const html = `<div xmlns='http://www.w3.org/1999/xhtml' style="display:flex;flex-direction:column;width:100%;height:100%;padding:${
            frame.pad
        }px;box-sizing:border-box;color:#e7e9ee;background:${
            frame.bg
        };font:500 16px ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace">
        <div style="flex:0 0 auto;height:6px;background:linear-gradient(90deg,#755bff,#1ad4e8);border-radius:4px;margin-bottom:${
            frame.pad / 2
        }px"></div>
        <div style="flex:1 1 auto;white-space:pre-wrap;line-height:1.55;word-break:break-word">${safe}</div>
        ${wm}
      </div>`;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}">
      <rect width="100%" height="100%" fill="${frame.bg}"/>
      <foreignObject x="0" y="0" width="100%" height="100%">${html}</foreignObject>
    </svg>`;
    }

    async function svgToPNG(svg, scale = 1) {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.decoding = "async";
        img.src = url;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        return canvas.toDataURL("image/png");
    }

    async function renderOne(text) {
        const { width, height } = currentSize();
        const pad = clamp(parseInt($("#paddingInput").value || "32", 10), 0, 256);
        const gutter = clamp(parseInt($("#gutterInput").value || "16", 10), 0, 128); // reserved
        const wm = $("#wmToggle").checked;
        const wmText = $("#wmText").hidden ? "" : $("#wmText").value || "";
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0b0e14";

        const svg = buildSVG({ width, height, pad, gutter, bg, watermark: wm, wmText }, text);
        const scale = window.devicePixelRatio ? Math.max(1, Math.floor(devicePixelRatio)) : 1;
        const png = await svgToPNG(svg, scale);

        const prev = $("#preview");
        prev.innerHTML = "";
        const img = document.createElement("img");
        img.src = png;
        img.alt = "Preview";
        prev.appendChild(img);
        return png;
    }

    /* ===== Export ===== */
    function downloadDataURL(dataURL, filename) {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function exportPNG() {
        const png = await renderOne(getBlocks()[0]);
        downloadDataURL(png, "docshot.png");
        toast(DICT[I18N.lang].toast.downloaded);
    }

    async function exportPDFViaPrint(images) {
        const win = window.open("", "_blank", "noopener,noreferrer");
        if (!win) return;
        win.document.write(
            `<!doctype html><html><head><meta charset='utf-8'><title>Print</title><style>@page{size:A4;margin:0}body{margin:0}img{display:block;width:100%;page-break-after:always}</style></head><body></body></html>`
        );
        images.forEach((src) => {
            const img = win.document.createElement("img");
            img.src = src;
            win.document.body.appendChild(img);
        });
        win.document.close();
        await sleep(200);
        win.focus();
        win.print();
    }

    async function batchPNGs() {
        const blocks = getBlocks();
        let i = 1;
        for (const b of blocks) {
            const png = await renderOne(b);
            downloadDataURL(png, `docshot_${String(i).padStart(2, "0")}.png`);
            i++;
        }
        toast(DICT[I18N.lang].toast.downloaded);
    }

    async function copyImage() {
        try {
            const png = await renderOne(getBlocks()[0]);
            if (!navigator.clipboard || !window.ClipboardItem) throw new Error("Clipboard API not available");
            const blob = await (await fetch(png)).blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            toast(DICT[I18N.lang].toast.copied);
        } catch (e) {
            alert(e.message || e);
        }
    }

    /* ===== Init ===== */
    window.addEventListener("DOMContentLoaded", () => {
        // footer year
        const y = new Date().getFullYear();
        const year = $("#year");
        if (year) year.textContent = y;

        initTheme();
        I18N.init();
        initControls();

        // actions
        $("#previewBtn")?.addEventListener("click", async () => {
            toast(DICT[I18N.lang].toast.rendering);
            await renderOne(getBlocks()[0]);
            toast(DICT[I18N.lang].toast.done);
        });
        $("#exportPNGBtn")?.addEventListener("click", exportPNG);
        $("#exportPDFBtn")?.addEventListener("click", async () => {
            const imgs = [];
            for (const b of getBlocks()) imgs.push(await renderOne(b));
            await exportPDFViaPrint(imgs);
        });
        $("#batchPNGBtn")?.addEventListener("click", batchPNGs);
        $("#copyBtn")?.addEventListener("click", copyImage);
    });
})();
