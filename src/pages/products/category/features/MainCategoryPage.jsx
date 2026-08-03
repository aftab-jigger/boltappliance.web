import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  X,
  SlidersHorizontal,
  Home,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import {
  getCategoryConfig,
  getAvailableSubcategories,
  normalizeSlug,
  productMatchesCategory,
  productMatchesSubcategory,
  getCategorySlugForProduct,
} from "@/lib/categories";
import { useProducts } from "@/context/ProductsContext";
import {
  buildCategoryFilterDefinitions,
  createInitialCategoryFilters,
  sanitizeCategoryFilters,
} from "@/lib/productFilters";

// Product Card Component
function ProductCard({ product }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const categorySlug = getCategorySlugForProduct(product);
  const productDetailPath = `/products/${categorySlug}/${product.id}`;

  return (
    <Link to={productDetailPath} className="block">
      <div className="group relative bg-card rounded-xl sm:rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 p-3 sm:p-4">
            <div className="h-48 sm:h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <ProductImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 30vw"
              />
            </div>
            {product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                OFF
              </div>
            )}
          </div>

          <div className="p-3 sm:p-5">
            <h3 className="font-bold text-foreground text-base sm:text-lg mb-0.5 sm:mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">
              {product.model}
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="mb-2 sm:mb-3">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-lg sm:text-xl font-bold text-foreground">
                £{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  £{product.originalPrice}
                </span>
              )}
            </div>

            <div className="mb-3 sm:mb-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFeatures(!showFeatures);
                }}
                className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors py-1.5 sm:py-2 border-t"
              >
                <span>View Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${showFeatures ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${showFeatures ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <ul className="py-1.5 sm:py-2 space-y-1">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                asChild
              >
                <span className="inline-flex items-center justify-center w-full">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Buy Now
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-teal-200 hover:bg-teal-50 hover:border-teal-300 bg-transparent h-8 w-8 sm:h-10 sm:w-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

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

// Config-Driven Filter Component (Brand / Price)
function FilterSection({ filterId, filterConfig, value, onChange }) {
  if (filterConfig.type === "select") {
    const options = filterConfig.options;
    const isObjectOptions = typeof options[0] === "object";

    return (
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">
          {filterConfig.label}
        </h3>
        <div className="space-y-2">
          {options.map((option, i) => {
            const optionValue = isObjectOptions ? option.label : option;
            const isSelected = isObjectOptions
              ? value?.label === option.label
              : value === option;

            return (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name={`filter-${filterId}`}
                  checked={isSelected}
                  onChange={() => onChange(option)}
                  className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {optionValue}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

// Desktop Sidebar Filter Component
function DesktopFilterSidebar({
  filterDefinitions,
  filters,
  setFilters,
  onClear,
  hasActiveFilters,
}) {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto bg-card rounded-2xl shadow-sm border">
        <div className="p-5">
          <h2 className="text-lg font-bold text-foreground mb-5">Filters</h2>

          <div className="space-y-6">
            {Object.keys(filterDefinitions).map((filterId) => (
              <FilterSection
                key={filterId}
                filterId={filterId}
                filterConfig={filterDefinitions[filterId]}
                value={filters[filterId]}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, [filterId]: val }))
                }
              />
            ))}

            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
                onClick={onClear}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Filter Panel Component
function MobileFilterPanel({
  filterDefinitions,
  filters,
  setFilters,
  isOpen,
  onClose,
  onClear,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose}>
      <div
        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-80 bg-background p-5 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {Object.keys(filterDefinitions).map((filterId) => (
            <FilterSection
              key={filterId}
              filterId={filterId}
              filterConfig={filterDefinitions[filterId]}
              value={filters[filterId]}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, [filterId]: val }))
              }
            />
          ))}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
              onClick={onClear}
            >
              Clear
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              onClick={onClose}
            >
              Apply
            </Button>
          </div>
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
  const [searchParams, setSearchParams] = useSearchParams();

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

  const activeSubcategorySlug = normalizeSlug(searchParams.get("subcategory"));

  const setActiveSubcategory = useCallback(
    (slug) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (slug) {
          next.set("subcategory", slug);
        } else {
          next.delete("subcategory");
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const subcategoryFilteredProducts = useMemo(() => {
    if (!activeSubcategorySlug) return categoryProducts;
    return categoryProducts.filter((product) =>
      productMatchesSubcategory(product, activeSubcategorySlug),
    );
  }, [categoryProducts, activeSubcategorySlug]);

  const dynamicFilterDefinitions = useMemo(
    () => buildCategoryFilterDefinitions(subcategoryFilteredProducts),
    [subcategoryFilteredProducts],
  );

  const initialFilters = useMemo(
    () =>
      createInitialCategoryFilters(
        { filters: { brand: true, price: true } },
        dynamicFilterDefinitions,
      ),
    [dynamicFilterDefinitions],
  );

  const [filters, setFiltersState] = useState(() => initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Reset the page + sanitize filters whenever the active subcategory (or
  // the set of available filter options) changes. Handled during render
  // (React's documented "adjusting state when a prop changes" pattern)
  // instead of inside an effect, avoiding an extra cascading render pass.
  const [prevSubcategorySlug, setPrevSubcategorySlug] = useState(
    activeSubcategorySlug,
  );
  if (prevSubcategorySlug !== activeSubcategorySlug) {
    setPrevSubcategorySlug(activeSubcategorySlug);
    setCurrentPage(1);
  }

  const [prevFilterDefinitions, setPrevFilterDefinitions] = useState(
    dynamicFilterDefinitions,
  );
  if (prevFilterDefinitions !== dynamicFilterDefinitions) {
    setPrevFilterDefinitions(dynamicFilterDefinitions);
    setFiltersState((prev) =>
      sanitizeCategoryFilters(prev, dynamicFilterDefinitions),
    );
  }

  const setFilters = useCallback((newFiltersOrUpdater) => {
    if (typeof newFiltersOrUpdater === "function") {
      setFiltersState((prev) => newFiltersOrUpdater(prev));
    } else {
      setFiltersState(newFiltersOrUpdater);
    }
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(
    () =>
      subcategoryFilteredProducts.filter((product) => {
        if (
          filters.brand &&
          filters.brand !== "All" &&
          product.brand !== filters.brand
        ) {
          return false;
        }
        if (filters.price && filters.price.label !== "All Prices") {
          if (
            product.price < filters.price.min ||
            product.price > filters.price.max
          ) {
            return false;
          }
        }
        return true;
      }),
    [subcategoryFilteredProducts, filters],
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(
    () =>
      Object.keys(filters).some((key) => {
        const def = dynamicFilterDefinitions[key];
        if (!def) return false;
        const defaultVal = def.defaultValue;
        const currentVal = filters[key];
        if (typeof defaultVal === "object") {
          return currentVal?.label !== defaultVal.label;
        }
        return currentVal !== defaultVal;
      }),
    [filters, dynamicFilterDefinitions],
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

      {/* Mobile Filter Panel (Brand / Price) */}
      <MobileFilterPanel
        filterDefinitions={dynamicFilterDefinitions}
        filters={filters}
        setFilters={setFilters}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        onClear={clearFilters}
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
            <DesktopFilterSidebar
              filterDefinitions={dynamicFilterDefinitions}
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
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
                      onPageChange={setCurrentPage}
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
                    onClick={() => {
                      clearFilters();
                      setActiveSubcategory("");
                    }}
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
