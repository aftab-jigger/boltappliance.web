import { useCallback, useLayoutEffect, useRef } from "react";
import { scrollToElementTop } from "@/lib/scroll";

/**
 * Shared pagination behaviour for the product listing pages.
 *
 * Wraps a `setCurrentPage` setter so that changing page (page number, Next or
 * Previous) also brings the products grid back to the top of the viewport.
 * Only the page state is touched — filters, sorting, category/subcategory and
 * URL params are all left untouched, and no navigation/reload happens.
 *
 * The scroll intentionally runs *after* React has committed the new page's
 * DOM (via a layout effect + one animation frame) rather than inside the click
 * handler: a smooth scroll started before the re-render gets cancelled by the
 * browser when the grid's contents are swapped out underneath it.
 *
 * @param {(page: number) => void} setCurrentPage Page state setter to wrap.
 * @param {React.RefObject<HTMLElement>} targetRef Ref to the products listing container.
 * @returns {(page: number) => void} `onPageChange` handler for `<Pagination />`.
 */
export function usePaginationScroll(setCurrentPage, targetRef) {
  const shouldScrollRef = useRef(false);

  const handlePageChange = useCallback(
    (page) => {
      shouldScrollRef.current = true;
      setCurrentPage(page);
    },
    [setCurrentPage],
  );

  useLayoutEffect(() => {
    if (!shouldScrollRef.current) return undefined;
    shouldScrollRef.current = false;

    const frame = requestAnimationFrame(() => {
      scrollToElementTop(targetRef.current);
    });
    return () => cancelAnimationFrame(frame);
  });

  return handlePageChange;
}

export default usePaginationScroll;
