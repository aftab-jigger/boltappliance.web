import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Home,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import {
  getCategoryConfig,
  getAvailableSubcategories,
  normalizeSlug,
  productMatchesCategory,
  productMatchesSubcategory,
} from "@/lib/categories";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/products/ProductCard";
import {
  DesktopFilterSidebar,
  MobileFilterPanel,
} from "@/components/products/FilterPanel";
import { useProductFilters } from "@/hooks/useProductFilters";
import { isFilterActive } from "@/lib/filters/commonFilters";
import { SUBCATEGORY_PARAM } from "@/lib/filters/filterParams";
import { useListingParams } from "@/hooks/useListingParams";
import { useListingPagination } from "@/hooks/useListingPagination";

// Subcategory Chips - full width row, secondary navigation within category.
// Options are derived purely from live product data (categories.js), so a
// subcategory with zero products never appears, and appears automatically
// once real products exist for it.
function SubcategoryChips({ subcategories, activeSlug, onSelect }) {
  if (subcategories.length === 0) return null;

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm sticky top-16 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => onSelect("")}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              !activeSlug
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            All
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.slug}
              type="button"
              onClick={() => onSelect(sub.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeSlug === sub.slug
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {sub.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pagination Component

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  for (let i = 1; i <= totalPages; i += 1) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-10 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="border-teal-200 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 h-8 w-8 sm:h-10 sm:w-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 sm:px-2 text-muted-foreground text-sm"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={`h-8 w-8 sm:h-10 sm:w-10 text-sm sm:text-base ${
              currentPage === page
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                : "border-teal-200 hover:bg-teal-50 hover:border-teal-300"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="border-teal-200 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 h-8 w-8 sm:h-10 sm:w-10"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

const PRODUCTS_PER_PAGE = 12;

/**
 * Generic main-category page. Renders products belonging to a single
 * top-level category (Laundry / Refrigeration / Cooking / Dishwashers),
 * driven entirely by the shared category configuration in `@/lib/categories`.
 * The active subcategory is kept in sync with the `?subcategory=` query
 * param so filters are shareable/bookmarkable via the URL.
 * @param {{ categorySlug: string }} props
 */
export default function MainCategoryPage({ categorySlug }) {
  const { products, isLoading } = useProducts();
  const { searchParams, updateParams } = useListingParams();

  const config = useMemo(() => getCategoryConfig(categorySlug), [categorySlug]);

  const categoryProducts = useMemo(
    () =>
      products.filter((product) =>
        productMatchesCategory(product, categorySlug),
      ),
    [products, categorySlug],
  );

  const availableSubcategories = useMemo(
    () => getAvailableSubcategories(categorySlug, products),
    [categorySlug, products],
  );

  const activeSubcategorySlug = normalizeSlug(
    searchParams.get(SUBCATEGORY_PARAM),
  );

  const setActiveSubcategory = useCallback(
    (slug) => {
      // Switching subcategory changes the result set, so pagination resets in
      // the same navigation (a separate page update would be overwritten).
      // `replace: false` keeps the pre-existing behaviour of the chip bar,
      // which pushed a history entry per subcategory selection.
      updateParams(
        (params) => {
          if (slug) {
            params.set(SUBCATEGORY_PARAM, slug);
          } else {
            params.delete(SUBCATEGORY_PARAM);
          }
        },
        { resetPage: true, replace: false },
      );
    },
    [updateParams],
  );

  const subcategoryFilteredProducts = useMemo(() => {
    if (!activeSubcategorySlug) return categoryProducts;
    return categoryProducts.filter((product) =>
      productMatchesSubcategory(product, activeSubcategorySlug),
    );
  }, [categoryProducts, activeSubcategorySlug]);

  // Reusable common filters (Brand / Price / Colour / Energy Rating /
  // Guarantee), scoped to the products currently in view. All option lists and
  // matching logic live in the shared hook, so no filter logic is duplicated
  // here or on /products.
  const {
    definitions,
    filters,
    setFilter,
    clearAll,
    activeCount,
    filteredProducts,
  } = useProductFilters(subcategoryFilteredProducts);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    const { top, bottom } = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (top < viewportHeight && bottom > 0) {
      setIsVisible(true);
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, []);

  // `setFilter` / `clearAll` write to the URL and already reset pagination
  // within the same navigation, as does `setActiveSubcategory` above — so no
  // separate page-reset bookkeeping is needed here any more.
  const handleFilterChange = setFilter;
  const clearFilters = clearAll;

  // "No products found" resets the subcategory as well as the filters. Both
  // live in the same search params, so they're cleared in one navigation.
  const clearFiltersAndSubcategory = useCallback(() => {
    updateParams(
      (params) => {
        params.delete(SUBCATEGORY_PARAM);
        definitions.forEach((definition) => params.delete(definition.key));
      },
      { resetPage: true },
    );
  }, [updateParams, definitions]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Pagination changes (page number / Next / Previous) bring the products
  // grid back into view instead of leaving the viewport wherever it was
  // scrolled to on the previous page (e.g. resting on the old pagination
  // controls). Filter/subcategory resets above intentionally don't scroll,
  // since the user is already looking at that part of the page.
  const { currentPage, handlePageChange } = useListingPagination(
    totalPages,
    sectionRef,
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters = activeCount > 0;

  // Accordion sections for the shared filter panel: Brand, Price, Colour,
  // Energy Rating and Guarantee — all produced from the shared definitions,
  // so this page adds zero filter logic of its own.
  const sections = useMemo(
    () =>
      definitions.map((definition) => {
        const value = filters[definition.key];
        const active = isFilterActive(definition, value);
        return {
          key: definition.key,
          label: definition.label,
          options: definition.options,
          value,
          onChange: (option) => handleFilterChange(definition.key, option),
          isActive: active,
          selectedLabel: active
            ? definition.type === "range"
              ? value.label
              : value
            : "",
        };
      }),
    [definitions, filters, handleFilterChange],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Category Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-teal-500 to-cyan-600 py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link
              to="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-white">{config.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            {config.title}
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl">
            {config.description}
          </p>
        </div>
      </section>

      {/* Subcategory Chips - full width secondary navigation */}
      <SubcategoryChips
        subcategories={availableSubcategories}
        activeSlug={activeSubcategorySlug}
        onSelect={setActiveSubcategory}
      />

      {/* Mobile Filter Panel (shared accordion filters) */}
      <MobileFilterPanel
        sections={sections}
        activeCount={activeCount}
        onClearAll={clearFilters}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
      />

      {/* Mobile Sticky Filter Bar */}
      <div className="lg:hidden sticky top-[7.5rem] z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="outline"
            className="w-full border-teal-200 hover:bg-teal-50 hover:border-teal-300 bg-transparent mb-2"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)}{" "}
            of {filteredProducts.length} products
          </p>
        </div>
      </div>

      {/* Products Section */}
      <section ref={sectionRef} className="py-6 sm:py-10 relative">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Sticky offset kept at top-36 so the sidebar clears the
                URL-synced subcategory chip bar above it. */}
            <DesktopFilterSidebar
              sections={sections}
              activeCount={activeCount}
              onClearAll={clearFilters}
              stickyClassName="top-36 max-h-[calc(100vh-10rem)]"
            />

            <div className="flex-1 min-w-0">
              <div className="hidden lg:block mb-4">
                <p className="text-base text-muted-foreground">
                  Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}-
                  {Math.min(
                    startIndex + PRODUCTS_PER_PAGE,
                    filteredProducts.length,
                  )}{" "}
                  of {filteredProducts.length} products
                </p>
              </div>

              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className={`transition-all duration-500 ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12 sm:py-20">
                  <p className="text-muted-foreground text-base sm:text-lg">
                    No products found matching your filters.
                  </p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    onClick={clearFiltersAndSubcategory}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
