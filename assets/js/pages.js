// Minimal pages JS: smooth reveal + auto "Last updated" + safe contact form mailto
(function () {
    "use strict";

    // Intersection-based reveal
    const io =
        "IntersectionObserver" in window
            ? new IntersectionObserver(
                  (entries) => {
                      for (const e of entries) {
                          if (e.isIntersecting) {
                              e.target.classList.add("in");
                              io.unobserve(e.target);
                          }
                      }
                  },
                  { rootMargin: "-10% 0px -5% 0px" }
              )
            : null;

    document.querySelectorAll(".reveal").forEach((el) => {
        if (io) io.observe(el);
        else el.classList.add("in");
    });

    // Set today's date (YYYY-MM-DD) for <span data-today>
    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    document.querySelectorAll("[data-today]").forEach((el) => (el.textContent = iso));

    // Contact form => open mailto with subject/body
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (ev) => {
            ev.preventDefault();
            const name = (form.querySelector("#name")?.value || "").trim();
            const email = (form.querySelector("#email")?.value || "").trim();
            const msg = (form.querySelector("#msg")?.value || "").trim();

            const to = "support@tenrusl.com";
            const subject = encodeURIComponent(`[DocShot] Message from ${name || "Anonymous"}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n\n— Sent from TenRusl - DocShot contact page`
            );
            const href = `mailto:${to}?subject=${subject}&body=${body}`;
            window.location.href = href;
        });
    }
})();
