import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Share2 } from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import { getCategorySlugForProduct } from "@/lib/categories";
import { buildListingState } from "@/lib/listingNavigation";

// Shared product card used on the Products page and all category pages.
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
          <div className="relative overflow-hidden bg-white p-3 sm:p-4">
            <div className="h-48 sm:h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <ProductImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
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

            {/* Features Accordion — click-stopped as a whole so that expanding
                and interacting with the list never bubbles up to the card's
                Link and triggers navigation to the product detail page. */}
            <div
              className="mb-3 sm:mb-4"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors py-1.5 sm:py-2 border-t cursor-pointer"
              >
                <span>View Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${showFeatures ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 cursor-default ${
                  showFeatures ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Fixed-height, independently scrollable so a long feature
                    list never gets clipped by or bleeds into the CTA buttons
                    below — only this list scrolls, never the whole card. */}
                <ul className="max-h-40 overflow-y-auto overscroll-contain scrollbar-thin py-1.5 sm:py-2 pr-1.5 space-y-1 cursor-default">
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
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs sm:text-sm h-8 sm:h-10 cursor-pointer"
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

export default ProductCard;
