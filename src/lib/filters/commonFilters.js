// Configuration-driven definitions for the COMMON product filters.
//
// Design goals:
// - Nothing is hardcoded: every option list is derived from live product data.
// - Values read from the Google Sheet `specifications` JSON object (no new
//   sheet columns), using alias lists so small key differences (e.g.
//   `color` vs `colour`) never break a filter.
// - Each definition owns its own option generation and comparison logic, so
//   pages just render whatever definitions come back.
//
// Category-specific filters (spin speed, hob type, capacity, ...) are a later
// phase; they will plug into this same shape.

import { getCategoryConfig, normalizeSlug } from "@/lib/categories";

/** Value used by every filter to mean "no filtering applied". */
export const ALL_VALUE = "All";

export const ALL_PRICES_OPTION = { label: "All Prices", min: 0, max: Infinity };

/* -------------------------------------------------------------------------- */
/* Value helpers                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Clean a raw string coming from the sheet: collapse whitespace, drop
 * placeholder values like "N/A" / "-" and return "" when there is nothing
 * usable. Keeps original casing so labels still read nicely.
 * @param {unknown} value
 * @returns {string}
 */
function cleanText(value) {
  if (value == null) return "";
  const text = String(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  if (lower === "n/a" || lower === "na" || lower === "-" || lower === "none") {
    return "";
  }
  return text;
}

/**
 * Read the first usable value for a spec from a product, trying each alias in
 * order. Alias matching is case/format-insensitive so `energyRating`,
 * `energy rating` and `Energy_Rating` all resolve.
 * @param {object} product
 * @param {string[]} specKeys
 * @returns {string}
 */
function readSpec(product, specKeys) {
  const specs = product?.specifications;
  if (!specs || typeof specs !== "object") return "";

  // Fast path: exact key hit.
  for (const key of specKeys) {
    const direct = cleanText(specs[key]);
    if (direct) return direct;
  }

  // Fallback: normalized key comparison (handles casing/spacing differences).
  const wanted = specKeys.map((key) => normalizeSlug(key));
  for (const [key, value] of Object.entries(specs)) {
    if (!wanted.includes(normalizeSlug(key))) continue;
    const text = cleanText(value);
    if (text) return text;
  }

  return "";
}

/**
 * Title-case a cleaned value so options look consistent even if the sheet
 * mixes "white", "White" and "WHITE".
 * @param {string} value
 * @returns {string}
 */
function toTitleCase(value) {
  return value
    .split(" ")
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word // keep short all-caps tokens such as "LED"
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

/**
 * Normalize a guarantee/warranty string down to a single "N Years" label.
 * The sheet mixes "2 Years", "2 Year Guarantee" and
 * "1 Year + 10 Year Parts Guarantee" — all of which should collapse into one
 * option based on the leading number of years.
 * @param {string} value
 * @returns {string}
 */
function normalizeGuarantee(value) {
  const match = /(\d+(?:\.\d+)?)\s*(year|yr|month)/i.exec(value);
  if (!match) return toTitleCase(value);

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return toTitleCase(value);

  const unit = match[2].toLowerCase();
  if (unit === "month") {
    return amount === 1 ? "1 Month" : `${amount} Months`;
  }
  return amount === 1 ? "1 Year" : `${amount} Years`;
}

/** Extract the leading number from a label, for numeric sorting. */
function leadingNumber(label) {
  const match = /(\d+(?:\.\d+)?)/.exec(label);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function sortAlphabetically(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/** Energy labels sort A → G, with anything unrecognised pushed to the end. */
function sortEnergyRatings(a, b) {
  const rank = (value) => {
    const match = /^([A-G])/i.exec(value.trim());
    if (!match) return Number.POSITIVE_INFINITY;
    // "A+++" beats "A++" beats "A"; more plus signs ⇒ better.
    const plusses = (value.match(/\+/g) || []).length;
    return match[1].toUpperCase().charCodeAt(0) - plusses * 0.1;
  };

  const diff = rank(a) - rank(b);
  return diff !== 0 ? diff : sortAlphabetically(a, b);
}

function sortByNumberThenText(a, b) {
  const diff = leadingNumber(a) - leadingNumber(b);
  return diff !== 0 ? diff : sortAlphabetically(a, b);
}

/* -------------------------------------------------------------------------- */
/* Option builders                                                           */
/* -------------------------------------------------------------------------- */

function roundToStep(value, step) {
  return Math.ceil(value / step) * step;
}

/**
 * Dynamic price buckets derived from the products in scope. Always starts with
 * the "All Prices" option.
 * @param {Array<object>} products
 * @returns {Array<{label: string, min: number, max: number}>}
 */
export function buildPriceRanges(products) {
  const prices = products
    .map((product) => Number(product?.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  if (prices.length === 0) return [ALL_PRICES_OPTION];

  const maxPrice = Math.max(...prices);
  if (maxPrice === 0) return [ALL_PRICES_OPTION];

  const ranges = [ALL_PRICES_OPTION];
  const niceMax = roundToStep(maxPrice, 100);
  const bucketCount = 4;
  const step = Math.max(roundToStep(niceMax / bucketCount, 50), 50);

  for (let i = 0; i < bucketCount; i += 1) {
    const min = i * step;
    const max = i === bucketCount - 1 ? Infinity : (i + 1) * step;

    if (min > maxPrice) break;

    let label;
    if (i === 0) {
      label = `Under £${max}`;
    } else if (max === Infinity) {
      label = `Over £${min}`;
    } else {
      label = `£${min} - £${max}`;
    }

    ranges.push({ label, min, max });
  }

  return ranges;
}

/**
 * Build the option list for a "single" (radio) filter by collecting every
 * distinct value produced by `getValue` across the products in scope.
 * Handles missing values, empty strings, duplicates, casing differences and
 * trailing spaces via the definition's `getValue` implementation.
 * @param {{getValue: (product: object) => string, sort?: (a: string, b: string) => number}} definition
 * @param {Array<object>} products
 * @returns {string[]} options including the leading "All" entry
 */
function buildSingleOptions(definition, products) {
  const seen = new Map();

  products.forEach((product) => {
    const value = definition.getValue(product);
    if (!value) return;
    const dedupeKey = normalizeSlug(value);
    if (!dedupeKey || seen.has(dedupeKey)) return;
    seen.set(dedupeKey, value);
  });

  const values = [...seen.values()].sort(definition.sort || sortAlphabetically);
  return [ALL_VALUE, ...values];
}

/* -------------------------------------------------------------------------- */
/* Filter definitions                                                        */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {object} FilterDefinition
 * @property {string} key            Unique id, also the key in filter state
 * @property {string} label          UI label
 * @property {"single"|"range"} type Render + comparison strategy
 * @property {(product: object) => string|number} getValue Source accessor
 * @property {string[]} [options]    Populated by `buildFilterDefinitions`
 * @property {*} [defaultValue]      Populated by `buildFilterDefinitions`
 */

/**
 * The common filters, in display order. Category/Subcategory are handled
 * separately (they are navigation-level concerns and only apply to /products).
 * @type {Array<Omit<FilterDefinition, "options"|"defaultValue">>}
 */
export const COMMON_FILTER_DEFINITIONS = [
  {
    key: "brand",
    label: "Brand",
    type: "single",
    getValue: (product) => cleanText(product?.brand),
    sort: sortAlphabetically,
  },
  {
    key: "price",
    label: "Price",
    type: "range",
    getValue: (product) => Number(product?.price),
  },
  {
    key: "colour",
    label: "Colour",
    type: "single",
    getValue: (product) => {
      const raw = readSpec(product, [
        "color",
        "colour",
        "colorOfUnit",
        "hobColour",
      ]);
      return raw ? toTitleCase(raw) : "";
    },
    sort: sortAlphabetically,
  },
  {
    key: "energyRating",
    label: "Energy Rating",
    type: "single",
    getValue: (product) => {
      const raw = readSpec(product, [
        "energyRating",
        "energyEfficiencyGrade",
        "energyClass",
      ]);
      return raw ? raw.toUpperCase() : "";
    },
    sort: sortEnergyRatings,
  },
  {
    key: "guarantee",
    label: "Guarantee",
    type: "single",
    getValue: (product) => {
      const raw = readSpec(product, ["warranty", "guarantee"]);
      return raw ? normalizeGuarantee(raw) : "";
    },
    sort: sortByNumberThenText,
  },
];

/* -------------------------------------------------------------------------- */
/* Definition building / comparison                                           */
/* -------------------------------------------------------------------------- */

/**
 * Turn the static definitions into runtime definitions with options derived
 * from the given products. Filters whose option list would be empty (only
 * "All") are dropped so the UI never shows a useless section.
 * @param {Array<object>} products
 * @returns {FilterDefinition[]}
 */
export function buildFilterDefinitions(products) {
  const list = Array.isArray(products) ? products : [];

  return COMMON_FILTER_DEFINITIONS.map((definition) => {
    if (definition.type === "range") {
      const options = buildPriceRanges(list);
      return { ...definition, options, defaultValue: ALL_PRICES_OPTION };
    }

    const options = buildSingleOptions(definition, list);
    return { ...definition, options, defaultValue: ALL_VALUE };
  }).filter((definition) => definition.options.length > 1);
}

/**
 * Whether a filter value differs from its default (i.e. is actively filtering).
 * @param {FilterDefinition} definition
 * @param {*} value
 * @returns {boolean}
 */
export function isFilterActive(definition, value) {
  if (!definition) return false;
  if (definition.type === "range") {
    return Boolean(value) && value.label !== ALL_PRICES_OPTION.label;
  }
  return Boolean(value) && value !== ALL_VALUE;
}

/**
 * Does a product satisfy a single filter?
 * @param {FilterDefinition} definition
 * @param {*} value
 * @param {object} product
 * @returns {boolean}
 */
export function productMatchesFilter(definition, value, product) {
  if (!isFilterActive(definition, value)) return true;

  if (definition.type === "range") {
    const price = Number(definition.getValue(product));
    if (!Number.isFinite(price)) return false;
    return price >= value.min && price <= value.max;
  }

  return normalizeSlug(definition.getValue(product)) === normalizeSlug(value);
}

/**
 * Reset object for a set of definitions.
 * @param {FilterDefinition[]} definitions
 * @returns {Record<string, *>}
 */
export function createDefaultFilters(definitions) {
  return definitions.reduce((acc, definition) => {
    acc[definition.key] = definition.defaultValue;
    return acc;
  }, {});
}

/**
 * Drop/repair any filter values that are no longer selectable (e.g. the
 * product set changed and a brand disappeared). Returns the same object when
 * nothing changed so callers can skip re-renders.
 * @param {Record<string, *>} filters
 * @param {FilterDefinition[]} definitions
 * @returns {Record<string, *>}
 */
export function sanitizeFilters(filters, definitions) {
  const next = {};
  let changed = false;

  definitions.forEach((definition) => {
    const current = filters?.[definition.key];

    if (definition.type === "range") {
      const match = definition.options.find(
        (option) => option.label === current?.label,
      );
      next[definition.key] = match || definition.defaultValue;
    } else {
      const match = definition.options.find(
        (option) => normalizeSlug(option) === normalizeSlug(current),
      );
      next[definition.key] = match || definition.defaultValue;
    }

    if (next[definition.key] !== current) changed = true;
  });

  // Any leftover keys (definition no longer rendered) count as a change.
  if (!changed && Object.keys(filters || {}).length !== definitions.length) {
    changed = true;
  }

  return changed ? next : filters;
}

/* -------------------------------------------------------------------------- */
/* Category / Subcategory options (only used by the all-products page)        */
/* -------------------------------------------------------------------------- */

/**
 * Category options for /products, derived from live data. Values are the
 * normalized slugs stored on products; labels come from `categories.js`.
 * @param {Array<object>} products
 * @returns {Array<{value: string, label: string}>}
 */
export function getCategoryOptions(products) {
  const seen = new Set();

  (products || []).forEach((product) => {
    const slug = normalizeSlug(product?.category);
    if (slug) seen.add(slug);
  });

  const options = [...seen]
    .map((slug) => ({
      value: slug,
      label: getCategoryConfig(slug)?.title || toTitleCase(slug),
    }))
    .sort((a, b) => sortAlphabetically(a.label, b.label));

  return [{ value: ALL_VALUE, label: ALL_VALUE }, ...options];
}

/**
 * Subcategory options for a selected category, derived from live data so a
 * subcategory with no products never appears. Titles come from the category
 * config when known, otherwise from the product value itself.
 * @param {string} categoryValue
 * @param {Array<object>} products
 * @returns {Array<{value: string, label: string}>}
 */
export function getSubcategoryOptions(categoryValue, products) {
  if (!categoryValue || categoryValue === ALL_VALUE) return [];

  const categorySlug = normalizeSlug(categoryValue);
  const config = getCategoryConfig(categorySlug);
  const seen = new Map();

  (products || []).forEach((product) => {
    if (normalizeSlug(product?.category) !== categorySlug) return;
    const slug = normalizeSlug(product?.subcategory);
    if (!slug || seen.has(slug)) return;

    const configured = config?.subcategories?.find((sub) => sub.slug === slug);
    seen.set(slug, {
      value: slug,
      label: configured?.title || toTitleCase(cleanText(product.subcategory)),
    });
  });

  const options = [...seen.values()].sort((a, b) =>
    sortAlphabetically(a.label, b.label),
  );

  return options.length > 0
    ? [{ value: ALL_VALUE, label: ALL_VALUE }, ...options]
    : [];
}
