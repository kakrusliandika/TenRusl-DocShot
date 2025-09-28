/* TenRusl - DocShot · router.js (hash router, no deps)
   Routes:
   - #/batch       : set batch placeholder, focus textarea
   - #/light       : switch to light theme
   - #/dark        : switch to dark theme
   - #/lang/en     : switch language to EN (clicks the EN button)
   - #/lang/id     : switch language to ID (clicks the ID button)
   - #/size/16x9   : set 16:9 radio
   - #/size/a4     : set A4 radio
   - #/demo        : inject sample snippet
*/
(function () {
    "use strict";

    const $ = (s) => document.querySelector(s);

    const routes = {
        "#/": () => {},
        "#/batch": () => {
            const ta = $("#snippet");
            if (ta) {
                ta.placeholder =
                    "Paste your snippet here.\nUse a single line with '---' to split slides.\nExample:\nTitle Slide\n---\nBullet 1\nBullet 2\n---\nClosing";
                try {
                    ta.focus();
                } catch {}
            }
        },
        "#/light": () => {
            localStorage.setItem("docshot.theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
            $("#themeToggle")?.querySelector("use")?.setAttribute("href", "#ico-moon");
        },
        "#/dark": () => {
            localStorage.setItem("docshot.theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
            $("#themeToggle")?.querySelector("use")?.setAttribute("href", "#ico-sun");
        },
        "#/lang/en": () => {
            // use UI buttons so app.js listeners run
            const btn = $("#langEN");
            if (btn) btn.click();
            else localStorage.setItem("docshot.lang", "en");
        },
        "#/lang/id": () => {
            const btn = $("#langID");
            if (btn) btn.click();
            else localStorage.setItem("docshot.lang", "id");
        },
        "#/size/16x9": () => {
            const r = document.getElementById("size169");
            if (r) r.checked = true;
        },
        "#/size/a4": () => {
            const r = document.getElementById("sizeA4");
            if (r) r.checked = true;
        },
        "#/demo": () => {
            const ta = $("#snippet");
            if (!ta) return;
            ta.value = [
                "TenRusl - DocShot",
                "Super Fast • Super Lightweight • Super Secure",
                "---",
                "Why DocShot?",
                "- Paste → pick preset",
                "- Adjust padding/gutter",
                "- Export PNG/PDF (batch OK)",
                "---",
                "Thank you!",
            ].join("\n");
            try {
                ta.focus();
            } catch {}
        },
    };

    function onRoute() {
        const h = location.hash || "#/";
        (routes[h] || routes["#/"])();
    }

    window.addEventListener("hashchange", onRoute);
    window.addEventListener("DOMContentLoaded", onRoute);

    // tiny helper for other scripts
    window.DocRouter = { go: (hash) => (location.hash = hash) };
})();
