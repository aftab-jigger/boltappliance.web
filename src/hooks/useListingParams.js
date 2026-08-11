import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { writePageToParams } from "@/lib/filters/filterParams";

/**
 * Low-level access to the listing route's search params.
 *
 * Every product listing page keeps its state (page, filters,
 * category/subcategory) in its own URL. That makes the listing entry in the
 * browser's history self-describing, so navigating to a product detail page
 * and coming back — via browser Back or the detail page's back link — lands on
 * exactly the same listing page instead of remounting it with default state.
 *
 * All updates go through a single `setSearchParams` call: React Router derives
 * the `prev` params from the params of the current render, so two calls fired
 * from the same event handler would overwrite each other. `updateParams` is
 * therefore the only writer, and takes care of resetting pagination in the
 * same navigation when a filter/navigation change requires it.
 *
 * @returns {{
 *   searchParams: URLSearchParams,
 *   updateParams: (
 *     mutate: (params: URLSearchParams) => void,
 *     options?: { resetPage?: boolean, replace?: boolean },
 *   ) => void,
 * }}
 */
export function useListingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = useCallback(
    (mutate, options = {}) => {
      const { resetPage = false, replace = true } = options;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          // Results change ⇒ the old page number may not exist any more, so
          // filter/navigation changes always return to the first page.
          if (resetPage) writePageToParams(next, 1);
          return next;
        },
        // Listing state changes replace the current history entry by default,
        // matching the previous component-state behaviour: paging and
        // filtering never added history entries the user had to Back through.
        { replace },
      );
    },
    [setSearchParams],
  );

  return { searchParams, updateParams };
}

export default useListingParams;
