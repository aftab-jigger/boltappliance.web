// URL search-param serialization for the product listing pages.
//
// Listing state (current page + the common filters + category/subcategory)
// lives in the route's own search params instead of component state. Two
// things fall out of that:
//
// 1. A listing URL fully describes what the user is looking at, so it stays
//    shareable and bookmarkable.
// 2. Opening a product detail page pushes a new history entry *on top of* the
//    listing entry, so browser Back (or the detail page's back link) returns
//    to the exact listing URL — same page number, same filters — instead of
//    remounting the listing with default state.
//
// Values are always validated against the filter definitions built from live
// product data, so unknown/stale params simply fall back to the default and a
// hand-typed or outdated URL can never break a listing.

import { normalizeSlug } from "@/lib/categories";
import {
  createDefaultFilters,
  isFilterActive,
} from "@/lib/filters/commonFilters";

/** 1-based pagination page. Omitted from the URL on page 1. */
export const PAGE_PARAM = "page";
/** Selected category slug (all-products page only). Omitted when "All". */
export const CATEGORY_PARAM = "category";
/** Selected subcategory slug. Omitted when "All"/none. */
export const SUBCATEGORY_PARAM = "subcategory";

/* -------------------------------------------------------------------------- */
/* Filter values                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Range (price) values are written as `min-max`, with an open upper bound left
 * empty (e.g. `0-200`, `200-400`, `400-`). Bounds are stable and readable,
 * unlike the display label which contains currency symbols and spaces.
 * @param {{min: number, max: number}} value
 * @returns {string}
 */
function serializeRangeValue(value) {
  if (!value) return "";
  const min = Number.isFinite(value.min) ? value.min : 0;
  const max = Number.isFinite(value.max) ? value.max : "";
  return `${min}-${max}`;
}

/**
 * Resolve a serialized range back to one of the definition's *current*
 * options, so a bucket that no longer exists is ignored rather than applied.
 * @param {import("@/lib/filters/commonFilters").FilterDefinition} definition
 * @param {string} raw
 * @returns {object | undefined}
 */
function parseRangeValue(definition, raw) {
  const [rawMin, rawMax] = String(raw).split("-");
  const min = Number(rawMin);
  if (!Number.isFinite(min)) return undefined;

  const hasMax = rawMax !== undefined && rawMax !== "";
  const max = hasMax ? Number(rawMax) : Infinity;
  if (hasMax && !Number.isFinite(max)) return undefined;

  return definition.options.find(
    (option) =>
      option.min === min &&
      (Number.isFinite(max) ? option.max === max : !Number.isFinite(option.max)),
  );
}

/**
 * Serialize a filter value for the URL. Returns "" when the value is the
 * default (i.e. nothing is being filtered), so the param can be dropped.
 * @param {import("@/lib/filters/commonFilters").FilterDefinition} definition
 * @param {*} value
 * @returns {string}
 */
export function serializeFilterValue(definition, value) {
  if (!definition || !isFilterActive(definition, value)) return "";
  return definition.type === "range"
    ? serializeRangeValue(value)
    : String(value);
}

/**
 * Parse a raw param back into a filter value, matched against the options that
 * currently exist. Returns `undefined` when the value is not selectable.
 * @param {import("@/lib/filters/commonFilters").FilterDefinition} definition
 * @param {string} raw
 * @returns {*}
 */
export function parseFilterValue(definition, raw) {
  if (!definition || !raw) return undefined;

  if (definition.type === "range") {
    return parseRangeValue(definition, raw);
  }

  // Slug comparison so casing/spacing differences in a shared URL still match.
  return definition.options.find(
    (option) => normalizeSlug(option) === normalizeSlug(raw),
  );
}

/**
 * Build the full filter state for a set of definitions from the URL, falling
 * back to each definition's default for anything missing or no longer valid.
 * @param {URLSearchParams} searchParams
 * @param {import("@/lib/filters/commonFilters").FilterDefinition[]} definitions
 * @returns {Record<string, *>}
 */
export function readFiltersFromParams(searchParams, definitions) {
  const filters = createDefaultFilters(definitions);

  definitions.forEach((definition) => {
    const raw = searchParams.get(definition.key);
    if (!raw) return;
    const parsed = parseFilterValue(definition, raw);
    if (parsed !== undefined) filters[definition.key] = parsed;
  });

  return filters;
}

/**
 * Write a single filter value into a params object (mutates and returns it).
 * Default values delete the param instead of writing `All`, keeping URLs clean.
 * @param {URLSearchParams} params
 * @param {import("@/lib/filters/commonFilters").FilterDefinition} definition
 * @param {*} value
 * @returns {URLSearchParams}
 */
export function writeFilterToParams(params, definition, value) {
  if (!definition) return params;

  const serialized = serializeFilterValue(definition, value);
  if (serialized) {
    params.set(definition.key, serialized);
  } else {
    params.delete(definition.key);
  }

  return params;
}

/**
 * Remove every common-filter param (mutates and returns the params object).
 * Unrelated params (category, subcategory, ...) are intentionally untouched.
 * @param {URLSearchParams} params
 * @param {import("@/lib/filters/commonFilters").FilterDefinition[]} definitions
 * @returns {URLSearchParams}
 */
export function clearFilterParams(params, definitions) {
  definitions.forEach((definition) => params.delete(definition.key));
  return params;
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Current page from the URL. Anything missing/invalid resolves to page 1.
 * @param {URLSearchParams} searchParams
 * @returns {number}
 */
export function readPageFromParams(searchParams) {
  const raw = Number.parseInt(searchParams.get(PAGE_PARAM) ?? "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

/**
 * Write the page into a params object (mutates and returns it). Page 1 is the
 * default and is omitted so unpaginated listings keep a clean URL.
 * @param {URLSearchParams} params
 * @param {number} page
 * @returns {URLSearchParams}
 */
export function writePageToParams(params, page) {
  const safePage = Number.isFinite(page) ? Math.floor(page) : 1;
  if (safePage > 1) {
    params.set(PAGE_PARAM, String(safePage));
  } else {
    params.delete(PAGE_PARAM);
  }
  return params;
}

/**
 * Keep a page number inside the range the current results actually have, so a
 * bookmarked `?page=99` (or a filter that shrank the result set) still renders
 * products instead of an empty grid.
 * @param {number} page
 * @param {number} totalPages
 * @returns {number}
 */
export function clampPage(page, totalPages) {
  const lastPage = Math.max(totalPages, 1);
  return Math.min(Math.max(page, 1), lastPage);
}
