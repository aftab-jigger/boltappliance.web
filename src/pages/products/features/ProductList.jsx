import { useState, useRef, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import {
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
