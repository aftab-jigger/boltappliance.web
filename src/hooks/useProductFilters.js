import { useCallback, useMemo, useState } from "react";
import {
  buildFilterDefinitions,
  createDefaultFilters,
  isFilterActive,
  productMatchesFilter,
  sanitizeFilters,
} from "@/lib/filters/commonFilters";

/**
 * Single source of truth for common-filter state, shared by the all-products
 * page and every main category page. Callers pass the products already in
 * scope (e.g. after category/subcategory narrowing) and get back ready-made
 * definitions, state helpers and the filtered result.
 *
 * Filter *options* are always derived from `products`, so the available
 * choices shrink/grow with the live data and never contain hardcoded values.
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
  const definitions = useMemo(
    () => buildFilterDefinitions(products),
    [products],
  );

  const [filters, setFilters] = useState(() =>
    createDefaultFilters(definitions),
  );

  // Re-validate selections whenever the available definitions/options change
  // (new data loaded, subcategory switched, ...). Done during render — React's
  // documented "adjusting state when props change" pattern — to avoid an extra
  // cascading render from useEffect.
  const [prevDefinitions, setPrevDefinitions] = useState(definitions);
  if (prevDefinitions !== definitions) {
    setPrevDefinitions(definitions);
    setFilters((prev) => sanitizeFilters(prev, definitions));
  }

  const safeFilters = useMemo(
    () => sanitizeFilters(filters, definitions),
    [filters, definitions],
  );

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(createDefaultFilters(definitions));
  }, [definitions]);

  const activeCount = useMemo(
    () =>
      definitions.reduce(
        (count, definition) =>
          isFilterActive(definition, safeFilters[definition.key])
            ? count + 1
            : count,
        0,
      ),
    [definitions, safeFilters],
  );

  const filteredProducts = useMemo(
    () =>
      (products || []).filter((product) =>
        definitions.every((definition) =>
          productMatchesFilter(
            definition,
            safeFilters[definition.key],
            product,
          ),
        ),
      ),
    [products, definitions, safeFilters],
  );

  return {
    definitions,
    filters: safeFilters,
    setFilter,
    clearAll,
    activeCount,
    hasActiveFilters: activeCount > 0,
    filteredProducts,
  };
}

export default useProductFilters;
