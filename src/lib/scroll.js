/**
 * Shared scroll helpers for paginated listing pages.
 *
 * Product listing pages (e.g. `/products`, and the main category pages)
 * render their own sticky bars above the products grid (the global navbar,
 * subcategory chips, mobile "Filters" bar, ...). Those sticky elements vary
 * per page and per breakpoint, so instead of hardcoding pixel offsets we
 * measure whatever is *currently* pinned to the top of the viewport and
 * scroll just far enough to clear it.
 */

/**
 * Measures the combined height of any full-width sticky bars currently
 * pinned to the top of the viewport (navbar, sticky sub-nav, sticky mobile
 * filter bar, ...), so a scroll target isn't left hidden behind them.
 * Narrow sticky elements (like a desktop filter sidebar column) are
 * intentionally ignored since they don't overlay the products grid.
 * @param {number} [extra=0] Additional breathing room to add on top.
 * @returns {number} Pixel offset to subtract from a scroll target's position.
 */
export function getStickyHeaderOffset(extra = 0) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return extra;
  }

  const viewportWidth = window.innerWidth;
  let offset = 0;

  document.querySelectorAll(".sticky").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isFullWidthBar = rect.width >= viewportWidth * 0.6;
    // Only count bars that stack directly beneath what we've already
    // measured (i.e. they sit flush against the current canopy), so
    // unrelated sticky elements positioned lower on the page are ignored.
    const isStackedAtCanopy = rect.height > 0 && rect.top <= offset + 8;

    if (isFullWidthBar && isStackedAtCanopy) {
      offset = Math.max(offset, rect.bottom);
    }
  });

  return offset + extra;
}

/**
 * Scrolls so the given element's top edge lands just below any sticky
 * headers currently pinned to the top of the viewport, rather than jumping
 * to the very top of the whole page.
 * @param {HTMLElement | null} element Scroll target (e.g. the products grid section).
 * @param {{ extra?: number, behavior?: ScrollBehavior }} [options]
 */
export function scrollToElementTop(element, options = {}) {
  if (!element || typeof window === "undefined") return;

  const { extra = 16, behavior } = options;

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const offset = getStickyHeaderOffset(extra);
  const targetTop = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: behavior ?? (prefersReducedMotion ? "auto" : "smooth"),
  });
}
