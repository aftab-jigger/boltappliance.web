// Single source of truth for the product category taxonomy.
// Drives: routes, homepage category cards, navbar links, category pages,
// filters, and breadcrumbs.

/**
 * @typedef {object} SubcategoryConfig
 * @property {string} slug - URL-safe identifier, e.g. "microwave-ovens"
 * @property {string} title - Display label, e.g. "Microwave Ovens"
 */

/**
 * @typedef {object} CategoryConfig
 * @property {string} slug - URL-safe identifier / route path, e.g. "cooking"
 * @property {string} title - Display label, e.g. "Cooking"
 * @property {string} description - Short description for hero/cards
 * @property {SubcategoryConfig[]} subcategories - Allowed subcategories
 */

/** @type {CategoryConfig[]} */
export const CATEGORIES = [
  {
    slug: "laundry",
    title: "Laundry",
    description: "Washing machines and dryers built for every household.",
    subcategories: [
      { slug: "washing-machines", title: "Washing Machines" },
      { slug: "dryers", title: "Dryers" },
      {
        slug: "integrated-washing-machines",
        title: "Integrated Washing Machines",
      },
    ],
  },
  {
    slug: "refrigeration",
    title: "Refrigeration",
    description: "Keep your food fresh with our range of refrigerators.",
    subcategories: [{ slug: "refrigerators", title: "Refrigerators" }],
  },
  {
    slug: "cooking",
    title: "Cooking",
    description: "Cookers, ovens, microwaves and hobs for every kitchen.",
    subcategories: [
      { slug: "cookers", title: "Cookers" },
      { slug: "ovens", title: "Ovens" },
      { slug: "microwave-ovens", title: "Microwave Ovens" },
      { slug: "hobs", title: "Hobs" },
    ],
  },
  {
    slug: "dishwashers",
    title: "Dishwasher",
    description: "Efficient dishwashers to make cleanup effortless.",
    subcategories: [{ slug: "dishwashers", title: "Dishwashers" }],
  },
];

/**
 * Normalize any raw string into a URL-safe slug for comparison.
 * Handles case, whitespace and punctuation differences so matching never
 * relies on fragile exact display-name comparisons.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function normalizeSlug(value) {
  if (!value) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a category config by its slug or by a raw display name (e.g. from
 * sheet data or a route param). Comparison is always normalized.
 * @param {string} value
 * @returns {CategoryConfig | undefined}
 */
export function getCategoryConfig(value) {
  const slug = normalizeSlug(value);
  if (!slug) return undefined;
  return CATEGORIES.find((category) => category.slug === slug);
}

/**
 * Resolve a subcategory config within a given category by slug or raw name.
 * @param {string} categorySlugOrValue
 * @param {string} subcategoryValue
 * @returns {SubcategoryConfig | undefined}
 */
export function getSubcategoryConfig(categorySlugOrValue, subcategoryValue) {
  const category = getCategoryConfig(categorySlugOrValue);
  if (!category) return undefined;
  const slug = normalizeSlug(subcategoryValue);
  if (!slug) return undefined;
  return category.subcategories.find((sub) => sub.slug === slug);
}

/**
 * Check whether a product's category field matches a given category slug.
 * @param {{category?: string}} product
 * @param {string} categorySlug
 * @returns {boolean}
 */
export function productMatchesCategory(product, categorySlug) {
  return normalizeSlug(product?.category) === normalizeSlug(categorySlug);
}

/**
 * Check whether a product's subcategory field matches a given subcategory slug.
 * @param {{subcategory?: string}} product
 * @param {string} subcategorySlug
 * @returns {boolean}
 */
export function productMatchesSubcategory(product, subcategorySlug) {
  return normalizeSlug(product?.subcategory) === normalizeSlug(subcategorySlug);
}

/**
 * Derive the subcategory options that actually have products, for a given
 * category, from live product data. Self-updating: as soon as a product
 * exists for a subcategory it will appear here automatically.
 * @param {string} categorySlug
 * @param {Array<{category?: string, subcategory?: string}>} products
 * @returns {SubcategoryConfig[]}
 */
export function getAvailableSubcategories(categorySlug, products) {
  const category = getCategoryConfig(categorySlug);
  if (!category) return [];

  const productsInCategory = products.filter((product) =>
    productMatchesCategory(product, categorySlug),
  );
  const presentSlugs = new Set(
    productsInCategory
      .map((product) => normalizeSlug(product.subcategory))
      .filter(Boolean),
  );

  return category.subcategories.filter((sub) => presentSlugs.has(sub.slug));
}

/**
 * Get the category config for a product, based on its `category` field.
 * @param {{category?: string}} product
 * @returns {CategoryConfig | undefined}
 */
export function getCategoryForProduct(product) {
  return getCategoryConfig(product?.category);
}

/**
 * Get the display title for a product's category, falling back to the raw
 * value if it doesn't match a known category (keeps things resilient).
 * @param {{category?: string}} product
 * @returns {string}
 */
export function getCategoryTitleForProduct(product) {
  const config = getCategoryForProduct(product);
  return config?.title || product?.category || "";
}

/**
 * Get the URL slug to use when linking to a product's category page.
 * @param {{category?: string}} product
 * @returns {string}
 */
export function getCategorySlugForProduct(product) {
  const config = getCategoryForProduct(product);
  return config?.slug || normalizeSlug(product?.category);
}
