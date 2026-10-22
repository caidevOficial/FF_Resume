/**
 * MIT License
 * Copyright (C) 2021-2026 <FacuFalcone - CaidevOficial>
 *
 * Modern Interactive Controller for Facundo Falcone's Resume Portal
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll progress indicator
    const progressBar = document.getElementById("myBar");
    const updateScrollProgress = () => {
        if (!progressBar) return;
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = `${scrolled}%`;
    };
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // 2. Two-state Dark Mode Toggle (System default vs Override) per modern-web-guidance
    const themeToggleBtn = document.getElementById("themeToggle");
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

    const getSystemScheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const getRenderedScheme = () => {
        const stored = (() => {
            try {
                return localStorage.getItem("color-scheme");
            } catch {
                return null;
            }
        })();
        if (stored === "dark" || stored === "light") return stored;
        return getSystemScheme();
    };

    if (themeToggleBtn && metaColorScheme) {
        themeToggleBtn.addEventListener("click", () => {
            const currentRendered = getRenderedScheme();
            const targetScheme = currentRendered === "dark" ? "light" : "dark";
            const systemScheme = getSystemScheme();

            try {
                if (targetScheme !== systemScheme) {
                    localStorage.setItem("color-scheme", targetScheme);
                    metaColorScheme.content = targetScheme;
                } else {
                    localStorage.removeItem("color-scheme");
                    metaColorScheme.content = "light dark";
                }
            } catch {
                metaColorScheme.content = targetScheme;
            }
        });

        window.addEventListener("storage", (event) => {
            if (event.key === "color-scheme") {
                metaColorScheme.content = event.newValue ?? "light dark";
            }
        });
    }

    // 3. Print / Save as PDF button
    const printBtn = document.getElementById("printResumeBtn");
    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    // 4. Native <dialog closedby="any"> Modal for Local Certificate Images + Light-dismiss fallback
    const certDialog = document.getElementById("certDialog");
    const certDialogImg = document.getElementById("certDialogImg");
    const certDialogTitle = document.getElementById("certDialogTitle");

    if (certDialog) {
        // Fallback for browsers without native closedby="any" support
        if (!("closedBy" in HTMLDialogElement.prototype)) {
            certDialog.addEventListener("click", (event) => {
                if (event.target !== certDialog) return;
                const rect = certDialog.getBoundingClientRect();
                const isDialogContent =
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width;
                if (isDialogContent) return;
                certDialog.close();
            });
        }

        document.querySelectorAll("[data-cert-img]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const imgSrc = btn.getAttribute("data-cert-img");
                const title = btn.getAttribute("data-cert-title") || "Certificate Preview";
                if (certDialogImg && imgSrc) {
                    certDialogImg.src = imgSrc;
                    certDialogImg.alt = title;
                }
                if (certDialogTitle) {
                    certDialogTitle.textContent = title;
                }
                certDialog.showModal();
            });
        });
    }

    // 5. Real-time Certificate & Course Search Filter
    const searchInput = document.getElementById("certSearchInput");
    if (searchInput) {
        const accordions = Array.from(document.querySelectorAll(".provider-accordion"));
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            accordions.forEach((details) => {
                const items = Array.from(details.querySelectorAll(".cert-list li"));
                let visibleCount = 0;
                items.forEach((li) => {
                    const text = li.textContent.toLowerCase();
                    const matches = !query || text.includes(query);
                    li.style.display = matches ? "" : "none";
                    if (matches) visibleCount++;
                });

                if (query) {
                    details.style.display = visibleCount > 0 ? "" : "none";
                    if (visibleCount > 0) details.open = true;
                } else {
                    details.style.display = "";
                }
            });
        });
    }
});
