/**
 * Helpers for remembering which listing URL a product detail page was opened
 * from.
 *
 * Listing state already lives in the URL (see `@/lib/filters/filterParams`),
 * so the only thing the detail page needs is the listing location it came
 * from. It travels in the history entry's `state` — the router's own
 * mechanism — rather than in a global store, and is simply absent when a
 * product URL is opened directly (shared link, bookmark, new tab), in which
 * case callers fall back to the product's category page.
 */

/** Key used inside `location.state` for the originating listing URL. */
export const LISTING_FROM_KEY = "listingFrom";

/**
 * Build the `state` to attach when navigating from a listing to a product
 * detail page. Captures pathname + search so pagination, filters, category and
 * subcategory are all preserved.
 * @param {{pathname: string, search: string}} location Current listing location.
 * @returns {{listingFrom: string}}
 */
export function buildListingState(location) {
  return { [LISTING_FROM_KEY]: `${location.pathname}${location.search}` };
}

/**
 * Read back the originating listing URL, if there is one. Only same-origin
 * absolute paths are accepted so a crafted history state can't be used to
 * navigate somewhere unexpected.
 * @param {{state?: object}} location Current (detail page) location.
 * @returns {string} Listing URL, or "" when the page wasn't opened from a listing.
 */
export function getListingFrom(location) {
  const from = location?.state?.[LISTING_FROM_KEY];
  if (typeof from !== "string") return "";
  return from.startsWith("/") && !from.startsWith("//") ? from : "";
}
