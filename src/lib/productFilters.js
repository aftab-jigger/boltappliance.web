import {
  getAvailableSubcategories,
  getCategoryConfig,
  normalizeSlug,
} from "./categories";

export const ALL_PRICES_OPTION = { label: "All Prices", min: 0, max: Infinity };

function getUniqueSortedValues(products, field) {
  return [
    ...new Set(products.map((product) => product[field]).filter(Boolean)),
  ].sort((a, b) => String(a).localeCompare(String(b)));
}

/**
 * Category filter options for the "All Products" page. Values are the raw
 * (normalized-slug) `product.category` values used for matching, but each
 * option carries a human-readable `label` (resolved via `categories.js`)
 * so the UI never shows a raw slug like "cooking" — it shows "Cooking".
 * Returns `Array<{ value: string, label: string }>`, with "All" first.
 */
export function getCategoryOptions(products) {
  const slugs = getUniqueSortedValues(products, "category");
  const options = slugs.map((slug) => ({
    value: slug,
    label: getCategoryConfig(slug)?.title || slug,
  }));
  options.sort((a, b) => a.label.localeCompare(b.label));
  return [{ value: "All", label: "All" }, ...options];
}

export function getBrandOptions(products) {
  return ["All", ...getUniqueSortedValues(products, "brand")];
}

/**
 * Subcategory options available for a given category, derived from live
 * product data (only subcategories that currently have products are shown).
 * Returns `SubcategoryConfig[]` (each with { slug, title }); empty array if
 * `categorySlug` is "All"/falsy or unknown.
 * @param {string} categorySlug
 * @param {Array<object>} products
 */
export function getSubcategoryOptions(categorySlug, products) {
  if (!categorySlug || categorySlug === "All") return [];
  return getAvailableSubcategories(categorySlug, products);
}

function roundToStep(value, step) {
  return Math.ceil(value / step) * step;
}

export function buildPriceRanges(products) {
  const prices = products
    .map((product) => Number(product.price))
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

export function buildProductFilterOptions(products) {
  return {
    categories: getCategoryOptions(products),
    brands: getBrandOptions(products),
    priceRanges: buildPriceRanges(products),
  };
}

export function createDefaultProductFilters() {
  return {
    category: "All",
    subcategory: "All",
    brand: "All",
    priceRange: ALL_PRICES_OPTION,
  };
}

export function sanitizeProductFilters(filters, filterOptions, products) {
  const priceRange = filterOptions.priceRanges.find(
    (range) => range.label === filters.priceRange?.label,
  );
  const category = filterOptions.categories.some(
    (option) => option.value === filters.category,
  )
    ? filters.category
    : "All";

  const availableSubcategories = getSubcategoryOptions(category, products);
  const subcategory = availableSubcategories.some(
    (sub) => sub.slug === normalizeSlug(filters.subcategory),
  )
    ? filters.subcategory
    : "All";

  return {
    category,
    subcategory,
    brand: filterOptions.brands.includes(filters.brand) ? filters.brand : "All",
    priceRange: priceRange || ALL_PRICES_OPTION,
  };
}

export function buildCategoryFilterDefinitions(products) {
  return {
    brand: {
      type: "select",
      label: "Brand",
      options: getBrandOptions(products),
      defaultValue: "All",
    },
    price: {
      type: "select",
      label: "Price Range",
      options: buildPriceRanges(products),
      defaultValue: ALL_PRICES_OPTION,
    },
  };
}

export function createInitialCategoryFilters(config, filterDefinitions) {
  const initial = {};

  if (config?.filters) {
    Object.keys(config.filters).forEach((filterId) => {
      if (config.filters[filterId] && filterDefinitions[filterId]) {
        initial[filterId] = filterDefinitions[filterId].defaultValue;
      }
    });
  }

  return initial;
}

export function sanitizeCategoryFilters(filters, filterDefinitions) {
  const next = { ...filters };

  Object.keys(filterDefinitions).forEach((filterId) => {
    const definition = filterDefinitions[filterId];
    const currentValue = filters[filterId];

    if (filterId === "brand") {
      next[filterId] = definition.options.includes(currentValue)
        ? currentValue
        : "All";
      return;
    }

    if (filterId === "price") {
      const matchedRange = definition.options.find(
        (option) => option.label === currentValue?.label,
      );
      next[filterId] = matchedRange || ALL_PRICES_OPTION;
    }
  });

  return next;
}
