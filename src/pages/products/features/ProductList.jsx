import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  SlidersHorizontal,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import {
  getCategorySlugForProduct,
  productMatchesCategory,
  productMatchesSubcategory,
} from "@/lib/categories";

import { useProducts } from "@/context/ProductsContext";
import {
  DesktopFilterSidebar,
  MobileFilterPanel,
} from "@/components/products/FilterPanel";
import { useProductFilters } from "@/hooks/useProductFilters";
import {
  ALL_VALUE,
  getCategoryOptions,
  getSubcategoryOptions,
  isFilterActive,
} from "@/lib/filters/commonFilters";
import {
  CATEGORY_PARAM,
  SUBCATEGORY_PARAM,
} from "@/lib/filters/filterParams";
import { useListingParams } from "@/hooks/useListingParams";
import { useListingPagination } from "@/hooks/useListingPagination";
import { buildListingState } from "@/lib/listingNavigation";

// Product Card Component
function ProductCard({ product }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const categorySlug = getCategorySlugForProduct(product);
  const navigate = useNavigate();
  const location = useLocation();

  const productDetailPath = `/products/${categorySlug}/${product.id}`;
  // Remember the listing URL we came from (page number, filters, category,
  // subcategory) so the detail page's back link can return to it exactly.
  const listingState = buildListingState(location);

  return (
    <Link to={productDetailPath} state={listingState} className="block">
      <div className="group relative bg-card rounded-xl sm:rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Product Image */}
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
            {/* Discount Badge */}
            {product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-5">
            {/* Name and Model */}
            <h3 className="font-bold text-foreground text-base sm:text-lg mb-0.5 sm:mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">
              {product.model}
            </p>

            {/* Description */}
            <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="mb-2 sm:mb-3">
              <StarRating
                rating={product.rating}
                reviews={product.reviews}
                className="mb-2 sm:mb-3"
              />
            </div>

            {/* Price */}
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

            {/* Features Accordion */}
            <div className="mb-3 sm:mb-4">
              <button
                onClick={(e) => {
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
                className={`overflow-hidden transition-all duration-300 ${
                  showFeatures ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
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

            {/* CTA Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(productDetailPath, { state: listingState });
                }}
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-teal-200 hover:bg-teal-50 hover:border-teal-300 bg-transparent h-8 w-8 sm:h-10 sm:w-10"
                onClick={(e) => e.stopPropagation()}
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

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
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

const PRODUCTS_PER_PAGE = 15;

const ProductList = () => {
  const { products } = useProducts();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Category / Subcategory are navigation-level concerns on /products, so they
  // are handled here rather than in `useProductFilters` (which owns the
  // reusable common filters shared with the category pages). Like the page
  // number and the common filters, they live in the URL so the listing entry
  // in history fully describes the view and can be restored on Back.
  const { searchParams, updateParams } = useListingParams();

  const [isVisible] = useState(true);
  const sectionRef = useRef(null);

  // Options are always derived from live data, never hardcoded.
  const categoryOptions = useMemo(
    () => getCategoryOptions(products),
    [products],
  );

  const rawCategory = searchParams.get(CATEGORY_PARAM) || ALL_VALUE;
  // An unknown/stale category in the URL falls back to "All" instead of
  // showing an empty grid (e.g. a shared link to a category that has no
  // products any more).
  const category = categoryOptions.some((option) => option.value === rawCategory)
    ? rawCategory
    : ALL_VALUE;

  const subcategoryOptions = useMemo(
    () => getSubcategoryOptions(category, products),
    [category, products],
  );

  const rawSubcategory = searchParams.get(SUBCATEGORY_PARAM) || ALL_VALUE;
  const subcategory = subcategoryOptions.some(
    (option) => option.value === rawSubcategory,
  )
    ? rawSubcategory
    : ALL_VALUE;

  // Narrow by category/subcategory FIRST so the common filter options only
  // ever offer values that exist within the current navigation scope.
  const scopedProducts = useMemo(() => {
    let scoped = products;
    if (category !== ALL_VALUE) {
      scoped = scoped.filter((product) =>
        productMatchesCategory(product, category),
      );
    }
    if (subcategory !== ALL_VALUE) {
      scoped = scoped.filter((product) =>
        productMatchesSubcategory(product, subcategory),
      );
    }
    return scoped;
  }, [products, category, subcategory]);

  const {
    definitions,
    filters,
    setFilter,
    activeCount,
    filteredProducts,
  } = useProductFilters(scopedProducts);

  const handleCategoryChange = useCallback(
    (option) => {
      // Category, subcategory reset and page reset all go into a single
      // navigation: separate updates would each start from the same `prev`
      // params and overwrite one another.
      updateParams(
        (params) => {
          if (option.value === ALL_VALUE) {
            params.delete(CATEGORY_PARAM);
          } else {
            params.set(CATEGORY_PARAM, option.value);
          }
          params.delete(SUBCATEGORY_PARAM);
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  const handleSubcategoryChange = useCallback(
    (option) => {
      updateParams(
        (params) => {
          if (option.value === ALL_VALUE) {
            params.delete(SUBCATEGORY_PARAM);
          } else {
            params.set(SUBCATEGORY_PARAM, option.value);
          }
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  // `setFilter` / `clearAll` already reset pagination in the same navigation.
  const handleFilterChange = setFilter;

  const handleClearAll = useCallback(() => {
    updateParams(
      (params) => {
        params.delete(CATEGORY_PARAM);
        params.delete(SUBCATEGORY_PARAM);
        definitions.forEach((definition) => params.delete(definition.key));
      },
      { resetPage: true },
    );
  }, [updateParams, definitions]);

  // Paginate. `totalPages` is computed before the pagination hook so a page
  // number coming from the URL can be clamped to the pages that actually
  // exist for the current filter/category selection.
  const productsPerPage = PRODUCTS_PER_PAGE;
  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / productsPerPage),
    [filteredProducts.length, productsPerPage],
  );

  // Pagination changes (page number / Next / Previous) bring the products
  // grid back into view instead of leaving the viewport wherever it was
  // scrolled to on the previous page (e.g. resting on the old pagination
  // controls). Filter/category resets above intentionally don't scroll, since
  // the user is already looking at that part of the page.
  const { currentPage, handlePageChange } = useListingPagination(
    totalPages,
    sectionRef,
  );

  // Category + dependent Subcategory + the reusable common filter sections,
  // in a single list consumed by both the desktop sidebar and mobile drawer.
  const sections = useMemo(() => {
    const navSections = [];

    if (categoryOptions.length > 1) {
      const selectedCategory = categoryOptions.find(
        (option) => option.value === category,
      );
      navSections.push({
        key: "category",
        label: "Category",
        options: categoryOptions,
        value: category,
        onChange: handleCategoryChange,
        isActive: category !== ALL_VALUE,
        selectedLabel: selectedCategory?.label,
      });
    }

    // Dependent: only rendered once a category with real subcategories is set.
    if (subcategoryOptions.length > 1) {
      const selectedSubcategory = subcategoryOptions.find(
        (option) => option.value === subcategory,
      );
      navSections.push({
        key: "subcategory",
        label: "Subcategory",
        options: subcategoryOptions,
        value: subcategory,
        onChange: handleSubcategoryChange,
        isActive: subcategory !== ALL_VALUE,
        selectedLabel: selectedSubcategory?.label,
      });
    }

    const commonSections = definitions.map((definition) => {
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
    });

    return [...navSections, ...commonSections];
  }, [
    categoryOptions,
    category,
    handleCategoryChange,
    subcategoryOptions,
    subcategory,
    handleSubcategoryChange,
    definitions,
    filters,
    handleFilterChange,
  ]);

  const navActiveCount =
    (category !== ALL_VALUE ? 1 : 0) + (subcategory !== ALL_VALUE ? 1 : 0);
  const totalActiveCount = navActiveCount + activeCount;
  const hasActiveFilters = totalActiveCount > 0;

  // Slice the page currently in view out of the filtered results.
  const startIndex = useMemo(
    () => (currentPage - 1) * productsPerPage,
    [currentPage, productsPerPage],
  );
  const paginatedProducts = useMemo(
    () => filteredProducts.slice(startIndex, startIndex + productsPerPage),
    [filteredProducts, startIndex, productsPerPage],
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-teal-50 via-cyan-50 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20" />

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-teal-500 font-semibold tracking-wider text-sm uppercase">
              Our Collection
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Browse Our Products
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover our wide range of premium home appliances designed to
              make your life easier.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        sections={sections}
        activeCount={totalActiveCount}
        onClearAll={handleClearAll}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
      />

      {/* Mobile Sticky Filter Bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
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
            Showing {startIndex + 1}-
            {Math.min(startIndex + productsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      {/* Products Section with Sidebar */}
      <section ref={sectionRef} className="py-6 sm:py-10 relative">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filter */}
            <DesktopFilterSidebar
              sections={sections}
              activeCount={totalActiveCount}
              onClearAll={handleClearAll}
            />

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Desktop Results Count */}
              <div className="hidden lg:block mb-4">
                <p className="text-base text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(
                    startIndex + productsPerPage,
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

                  {/* Pagination */}
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
                    onClick={handleClearAll}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductList;
