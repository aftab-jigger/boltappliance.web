import { useCallback, useMemo } from "react";
import {
  buildFilterDefinitions,
  isFilterActive,
  productMatchesFilter,
} from "@/lib/filters/commonFilters";
import {
  clearFilterParams,
  readFiltersFromParams,
  writeFilterToParams,
} from "@/lib/filters/filterParams";
import { useListingParams } from "@/hooks/useListingParams";

/**
 * Single source of truth for common-filter state, shared by the all-products
 * page and every main category page. Callers pass the products already in
 * scope (e.g. after category/subcategory narrowing) and get back ready-made
 * definitions, state helpers and the filtered result.
 *
 * Filter *options* are always derived from `products`, so the available
 * choices shrink/grow with the live data and never contain hardcoded values.
 *
 * The selected *values* live in the listing route's search params rather than
 * in component state. The listing URL therefore fully describes what the user
 * is looking at, which is what lets browser Back from a product detail page
 * restore the exact listing view (page number and filters included) instead of
 * remounting the listing with defaults. Values that are no longer selectable
 * (data changed, subcategory switched, hand-edited URL) are ignored on read,
 * which replaces the previous `sanitizeFilters` pass at no extra cost.
 *
 * @param {Array<object>} products Products the filters should operate on
 * @returns {{
 *   definitions: import("@/lib/filters/commonFilters").FilterDefinition[],
 *   filters: Record<string, *>,
 *   setFilter: (key: string, value: *) => void,
 *   clearAll: () => void,
 *   activeCount: number,
 *   hasActiveFilters: boolean,
 *   filteredProducts: Array<object>,
 * }}
 */
export function useProductFilters(products) {
  const { searchParams, updateParams } = useListingParams();

  const definitions = useMemo(
    () => buildFilterDefinitions(products),
    [products],
  );

  const filters = useMemo(
    () => readFiltersFromParams(searchParams, definitions),
    [searchParams, definitions],
  );

  const setFilter = useCallback(
    (key, value) => {
      const definition = definitions.find((item) => item.key === key);
      if (!definition) return;
      // Changing a filter changes the result set, so pagination resets within
      // the same navigation — a separate page update would be overwritten.
      updateParams((params) => writeFilterToParams(params, definition, value), {
        resetPage: true,
      });
    },
    [definitions, updateParams],
  );

  const clearAll = useCallback(() => {
    updateParams((params) => clearFilterParams(params, definitions), {
      resetPage: true,
    });
  }, [definitions, updateParams]);

  const activeCount = useMemo(
    () =>
      definitions.reduce(
        (count, definition) =>
          isFilterActive(definition, filters[definition.key])
            ? count + 1
            : count,
        0,
      ),
    [definitions, filters],
  );

  const filteredProducts = useMemo(
    () =>
      (products || []).filter((product) =>
        definitions.every((definition) =>
          productMatchesFilter(definition, filters[definition.key], product),
        ),
      ),
    [products, definitions, filters],
  );

  return {
    definitions,
    filters,
    setFilter,
    clearAll,
    activeCount,
    hasActiveFilters: activeCount > 0,
    filteredProducts,
  };
}

export default useProductFilters;
