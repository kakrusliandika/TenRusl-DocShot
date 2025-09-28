/*!
 * consent-base.js — lightweight consent banner (no external network)
 * Stores preferences in localStorage under "docshot.consent".
 * Categories: essential (always true), analytics (opt-in).
 */
(function () {
    "use strict";

    var KEY = "docshot.consent";

    function getConsent() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return { essential: true, analytics: false, ts: 0 };
            var obj = JSON.parse(raw);
            if (typeof obj.essential !== "boolean") obj.essential = true;
            if (typeof obj.analytics !== "boolean") obj.analytics = false;
            return obj;
        } catch (_) {
            return { essential: true, analytics: false, ts: 0 };
        }
    }

    function setConsent(next) {
        try {
            next.ts = Date.now();
            localStorage.setItem(KEY, JSON.stringify(next));
        } catch (_) {}
    }

    function hide(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function injectBanner() {
        // Do not show if already chosen
        var c = getConsent();
        if (c.ts) return;

        var wrap = document.createElement("div");
        wrap.setAttribute("role", "dialog");
        wrap.setAttribute("aria-live", "polite");
        wrap.setAttribute("aria-label", "Cookies and local storage consent");
        wrap.style.cssText =
            "position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;background:#151823;color:#e7e9ee;border:1px solid #2a2f45;border-radius:12px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);font:500 14px ui-sans-serif,system-ui;";

        wrap.innerHTML =
            '<div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">' +
            '<div style="flex:1 1 auto;min-width:240px">' +
            "<strong>We use local storage</strong> for theme, language, and presets. " +
            "Analytics is <em>optional</em> and disabled by default." +
            "</div>" +
            '<div style="display:flex;gap:8px;align-items:center">' +
            '<label style="display:flex;gap:6px;align-items:center;background:#0b0e14;border:1px solid #2a2f45;border-radius:8px;padding:6px 8px">' +
            '<input id="consent-analytics" type="checkbox" />' +
            "<span>Allow analytics</span>" +
            "</label>" +
            '<button id="consent-accept" style="padding:8px 12px;border-radius:8px;border:none;background:linear-gradient(135deg,#7c5cff,#22d3ee);color:#fff;cursor:pointer;">Accept</button>' +
            '<button id="consent-decline" style="padding:8px 12px;border-radius:8px;border:1px solid #2a2f45;background:#1b1f2e;color:#e7e9ee;cursor:pointer;">Decline</button>' +
            "</div>" +
            "</div>";

        document.body.appendChild(wrap);

        var analyticsToggle = wrap.querySelector("#consent-analytics");
        var acceptBtn = wrap.querySelector("#consent-accept");
        var declineBtn = wrap.querySelector("#consent-decline");

        acceptBtn.addEventListener("click", function () {
            setConsent({ essential: true, analytics: !!analyticsToggle.checked });
            hide(wrap);
            dispatchEvent(new CustomEvent("docshot:consent:changed", { detail: getConsent() }));
        });
        declineBtn.addEventListener("click", function () {
            setConsent({ essential: true, analytics: false });
            hide(wrap);
            dispatchEvent(new CustomEvent("docshot:consent:changed", { detail: getConsent() }));
        });
    }

    // Public API
    window.DocConsent = {
        get: getConsent,
        set: setConsent,
        show: injectBanner,
    };

    // Auto-show when DOM ready
    window.addEventListener("DOMContentLoaded", injectBanner);
})();
