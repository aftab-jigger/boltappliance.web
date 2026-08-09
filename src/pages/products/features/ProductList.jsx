import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// Product Card Component
function ProductCard({ product }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const categorySlug = getCategorySlugForProduct(product);
  const navigate = useNavigate();

  const productDetailPath = `/products/${categorySlug}/${product.id}`;

  return (
    <Link to={productDetailPath} className="block">
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
                  navigate(productDetailPath);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Category / Subcategory are navigation-level concerns on /products, so they
  // live in local component state (not in `useProductFilters`, which owns the
  // reusable common filters shared with the category pages).
  const [category, setCategory] = useState(ALL_VALUE);
  const [subcategory, setSubcategory] = useState(ALL_VALUE);

  const [isVisible] = useState(true);
  const sectionRef = useRef(null);

  // Options are always derived from live data, never hardcoded.
  const categoryOptions = useMemo(
    () => getCategoryOptions(products),
    [products],
  );
  const subcategoryOptions = useMemo(
    () => getSubcategoryOptions(category, products),
    [category, products],
  );

  // If the data changes and the selected category/subcategory disappears,
  // fall back to "All". Adjusted during render (React's "adjusting state when
  // props change" pattern) to avoid a cascading extra render from an effect.
  const categoryStillValid = categoryOptions.some(
    (option) => option.value === category,
  );
  if (!categoryStillValid) {
    setCategory(ALL_VALUE);
    setSubcategory(ALL_VALUE);
  }

  const subcategoryStillValid =
    subcategory === ALL_VALUE ||
    subcategoryOptions.some((option) => option.value === subcategory);
  if (!subcategoryStillValid) {
    setSubcategory(ALL_VALUE);
  }

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
    clearAll,
    activeCount,
    filteredProducts,
  } = useProductFilters(scopedProducts);

  const handleCategoryChange = useCallback((option) => {
    setCategory(option.value);
    setSubcategory(ALL_VALUE);
    setCurrentPage(1);
  }, []);

  const handleSubcategoryChange = useCallback((option) => {
    setSubcategory(option.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilter(key, value);
      setCurrentPage(1);
    },
    [setFilter],
  );

  const handleClearAll = useCallback(() => {
    setCategory(ALL_VALUE);
    setSubcategory(ALL_VALUE);
    clearAll();
    setCurrentPage(1);
  }, [clearAll]);

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

  // Paginate
  const productsPerPage = PRODUCTS_PER_PAGE;
  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / productsPerPage),
    [filteredProducts.length, productsPerPage],
  );
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
