import { useCallback } from "react";
import { useListingParams } from "@/hooks/useListingParams";
import { usePaginationScroll } from "@/hooks/usePaginationScroll";
import {
  clampPage,
  readPageFromParams,
  writePageToParams,
} from "@/lib/filters/filterParams";

/**
 * Pagination state for the product listing pages, stored in the route's
 * `?page=` search param instead of component state.
 *
 * Because the page number is part of the listing URL, opening a product from
 * page N pushes the detail route *on top of* `…?page=N`, so browser Back (and
 * the detail page's back link) returns to that same page. Nothing else about
 * pagination changes: page 1 is still the default, the param is omitted on
 * page 1, and changing page still scrolls the grid back into view via the
 * existing `usePaginationScroll` behaviour.
 *
 * The value read from the URL is clamped to the pages that currently exist, so
 * a bookmarked/hand-edited `?page=99` — or a page that no longer exists after
 * the live product data loaded — still renders products.
 *
 * @param {number} totalPages Number of pages the current results produce.
 * @param {React.RefObject<HTMLElement>} targetRef Products grid container.
 * @returns {{ currentPage: number, handlePageChange: (page: number) => void }}
 */
export function useListingPagination(totalPages, targetRef) {
  const { searchParams, updateParams } = useListingParams();

  const currentPage = clampPage(readPageFromParams(searchParams), totalPages);

  const setCurrentPage = useCallback(
    (page) => {
      updateParams((params) => writePageToParams(params, page));
    },
    [updateParams],
  );

  const handlePageChange = usePaginationScroll(setCurrentPage, targetRef);

  return { currentPage, handlePageChange };
}

export default useListingPagination;
