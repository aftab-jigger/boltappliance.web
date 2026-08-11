import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll behaviour for route changes.
 *
 * - PUSH/REPLACE (a genuinely new view): scroll to the top, so a new page
 *   never opens at the previous page's scroll offset.
 * - POP (browser Back/Forward, and the in-app back links): restore the scroll
 *   offset that history entry was left at. Without this the browser can't
 *   restore the position itself — the SPA renders the previous route's content
 *   after the popstate event — so returning from a product detail page would
 *   dump the user at the top of the listing instead of back at the product
 *   they were looking at.
 *
 * Offsets are keyed by `location.key`, which React Router assigns per history
 * entry, and kept in `sessionStorage` so they survive a reload of the tab
 * without leaking across sessions.
 */
const STORAGE_KEY = "scrollPositions";

function readPositions() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writePosition(key, offset) {
  try {
    const positions = readPositions();
    positions[key] = offset;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Storage unavailable (private mode, quota) — scrolling still works, we
    // just fall back to not restoring.
  }
}

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Continuously track where the current history entry is scrolled to, so the
  // value is already recorded by the time a navigation replaces it.
  const currentKeyRef = useRef(location.key);

  useEffect(() => {
    currentKeyRef.current = location.key;
  }, [location.key]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        writePosition(currentKeyRef.current, window.scrollY);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // `pagehide` covers the tab being closed or reloaded mid-page.
    window.addEventListener("pagehide", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onScroll);
    };
  }, []);

  // Only the *pathname* decides whether this is a new view. Listing pages keep
  // their page/filter state in the search params, so a search-only change is
  // paging or filtering within the same view — those position the viewport
  // themselves via `usePaginationScroll` and must not be yanked to the top.
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const changedView = previousPathnameRef.current !== location.pathname;
    previousPathnameRef.current = location.pathname;

    if (navigationType !== "POP") {
      if (changedView) window.scrollTo(0, 0);
      return undefined;
    }

    const target = readPositions()[location.key];
    if (typeof target !== "number") return undefined;

    // Wait for the restored route to commit its content before scrolling,
    // otherwise the document isn't tall enough yet and the offset is clamped.
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, target);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.pathname, navigationType]);

  return null;
};

export default ScrollToTop;
