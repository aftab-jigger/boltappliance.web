import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  X,
  SlidersHorizontal,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import { getCategorySlugForProduct } from "@/lib/categories";
import { useProducts } from "@/context/ProductsContext";
import {
  createDefaultProductFilters,
  sanitizeProductFilters,
} from "@/lib/productFilters";

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

// Dropdown Filter Component
// function FilterDropdown({ label, value, options, onChange, isOpen, onToggle }) {
//   const dropdownRef = useRef(null)

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (isOpen) onToggle()
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [isOpen, onToggle])

//   return (
//     <div ref={dropdownRef} className="relative">
//       <button
//         onClick={onToggle}
//         className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm font-medium text-foreground hover:border-teal-400 hover:bg-teal-50/50 transition-all duration-200"
//       >
//         <span className="flex items-center gap-2">
//           <span className="text-muted-foreground">{label}:</span>
//           <span className="text-teal-600">{value}</span>
//         </span>
//         <ChevronDown
//           className={`w-4 h-4 text-teal-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-teal-100 rounded-xl shadow-lg z-50 overflow-hidden">
//           <div className="max-h-60 overflow-y-auto py-1">
//             {options.map((option, i) => {
//               const optionValue = typeof option === "string" ? option : option.label
//               const isSelected = value === optionValue
//               return (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     onChange(option)
//                     onToggle()
//                   }}
//                   className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
//                     isSelected
//                       ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
//                       : "text-foreground hover:bg-teal-50"
//                   }`}
//                 >
//                   {optionValue}
//                 </button>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// Mobile Filter Panel Component
function MobileFilterPanel({
  filters,
  setFilters,
  filterOptions,
  isOpen,
  onClose,
}) {
  const { categories, brands, priceRanges } = filterOptions;

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
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category.value}
                    onChange={() =>
                      setFilters({ ...filters, category: category.value })
                    }
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Brand</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brand === brand}
                    onChange={() => setFilters({ ...filters, brand })}
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="price"
                    checked={filters.priceRange.label === range.label}
                    onChange={() =>
                      setFilters({ ...filters, priceRange: range })
                    }
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear & Apply Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
              onClick={() =>
                setFilters(createDefaultProductFilters(filterOptions))
              }
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

// Desktop Sidebar Filter Component
function DesktopFilterSidebar({ filters, setFilters, filterOptions }) {
  const { categories, brands, priceRanges } = filterOptions;
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.brand !== "All" ||
    filters.priceRange.label !== "All Prices";

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto bg-card rounded-2xl shadow-sm border">
        <div className="p-5">
          <h2 className="text-lg font-bold text-foreground mb-5">Filters</h2>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category-desktop"
                      checked={filters.category === category.value}
                      onChange={() =>
                        setFilters({ ...filters, category: category.value })
                      }
                      className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                Brand
              </h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="brand-desktop"
                      checked={filters.brand === brand}
                      onChange={() => setFilters({ ...filters, brand })}
                      className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="price-desktop"
                      checked={filters.priceRange.label === range.label}
                      onChange={() =>
                        setFilters({ ...filters, priceRange: range })
                      }
                      className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
                onClick={() =>
                  setFilters(createDefaultProductFilters(filterOptions))
                }
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

const ProductList = () => {
  const { products, filterOptions } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(() =>
    createDefaultProductFilters(filterOptions),
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [isVisible] = useState(true);
  const sectionRef = useRef(null);

  const productsPerPage = 15;

  // Sanitize filters whenever the available filter options change, without
  // calling setState synchronously inside an effect (avoids a cascading
  // extra render). This mirrors React's documented "adjusting state when a
  // prop changes" pattern, applied during render instead of in useEffect.
  const [prevFilterOptions, setPrevFilterOptions] = useState(filterOptions);
  if (prevFilterOptions !== filterOptions) {
    setPrevFilterOptions(filterOptions);
    setFilters((prev) => sanitizeProductFilters(prev, filterOptions));
  }

  // Wrapper function to set filters and reset page
  const handleSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      filters.category !== "All" ||
      filters.brand !== "All" ||
      filters.priceRange.label !== "All Prices",
    [filters],
  );

  // Filter products
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (filters.category !== "All" && product.category !== filters.category)
          return false;
        if (filters.brand !== "All" && product.brand !== filters.brand)
          return false;
        if (
          product.price < filters.priceRange.min ||
          product.price > filters.priceRange.max
        )
          return false;
        return true;
      }),
    [filters, products],
  );

  // Paginate
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
        filters={filters}
        setFilters={handleSetFilters}
        filterOptions={filterOptions}
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
              filters={filters}
              setFilters={handleSetFilters}
              filterOptions={filterOptions}
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
                    onClick={() =>
                      handleSetFilters({
                        category: "All",
                        brand: "All",
                        priceRange: {
                          label: "All Prices",
                          min: 0,
                          max: Infinity,
                        },
                      })
                    }
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
