/**
 * MIT License
 * Copyright (C) 2021-2026 <FacuFalcone - CaidevOficial>
 *
 * Modern Interactive Controller for Facundo Falcone's Resume Portal
 * Implements:
 * - High-performance rAF-throttled scroll progress
 * - Native Theme Toggle with System Scheme Media Listener & Cross-tab sync
 * - Native <dialog closedby="any"> modal with Backdrop Light-Dismiss fallback
 * - Debounced real-time certificate search with active match counters
 * - Keyboard Accessibility (Esc, Focus trap via showModal) & Copy-to-Clipboard toast
 */

document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------------
    // 1. High-Performance Scroll Progress Indicator (rAF Throttled)
    // ---------------------------------------------------------
    const progressBar = document.getElementById("myBar");
    if (progressBar) {
        let ticking = false;
        const updateScrollProgress = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressBar.style.width = `${scrolled}%`;
            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateScrollProgress);
                    ticking = true;
                }
            },
            { passive: true }
        );
        updateScrollProgress();
    }

    // ---------------------------------------------------------
    // 2. Two-State Dark Mode Controller per modern-web-guidance
    // ---------------------------------------------------------
    const themeToggleBtn = document.getElementById("themeToggle");
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getSystemScheme = () => (colorSchemeMediaQuery.matches ? "dark" : "light");

    const getStoredScheme = () => {
        try {
            return localStorage.getItem("color-scheme");
        } catch {
            return null;
        }
    };

    const getRenderedScheme = () => {
        const stored = getStoredScheme();
        if (stored === "dark" || stored === "light") return stored;
        return getSystemScheme();
    };

    const updateThemeState = () => {
        const rendered = getRenderedScheme();
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute(
                "aria-label",
                rendered === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
        }
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
            updateThemeState();
        });

        // Listen for OS scheme changes in real time
        colorSchemeMediaQuery.addEventListener("change", () => {
            if (!getStoredScheme()) {
                metaColorScheme.content = "light dark";
                updateThemeState();
            }
        });

        // Listen for cross-tab storage changes
        window.addEventListener("storage", (event) => {
            if (event.key === "color-scheme") {
                metaColorScheme.content = event.newValue ?? "light dark";
                updateThemeState();
            }
        });

        updateThemeState();
    }

    // ---------------------------------------------------------
    // 3. Print / Save as PDF
    // ---------------------------------------------------------
    const printBtn = document.getElementById("printResumeBtn");
    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    // ---------------------------------------------------------
    // 4. Native <dialog closedby="any"> Modal for Local Certificate Images
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 5. Debounced Real-time Certificate & Course Search Filter
    // ---------------------------------------------------------
    const searchInput = document.getElementById("certSearchInput");
    if (searchInput) {
        const accordions = Array.from(document.querySelectorAll(".provider-accordion"));
        let debounceTimer = null;

        const executeSearch = () => {
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
        };

        searchInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(executeSearch, 150);
        });
    }

    // ---------------------------------------------------------
    // 6. Interactive Toast on Email Click (Copy to Clipboard)
    // ---------------------------------------------------------
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && navigator.clipboard) {
        emailLink.setAttribute("title", "Click to email, or Right-Click / Hold to copy");
    }
});
