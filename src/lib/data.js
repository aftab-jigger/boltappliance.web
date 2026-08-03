// Generic helpers used app-wide. Category taxonomy now lives in
// `src/lib/categories.js` (single source of truth) — this file keeps
// small, unrelated utilities that are still needed.

export function getProductById(id, products = []) {
  return products.find((p) => p.id === parseInt(id, 10));
}
