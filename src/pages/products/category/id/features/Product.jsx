import { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Share2,
  WhatsAppIcon,
  Home,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ProductImagePlaceholder,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import {
  getCategoryTitleForProduct,
  getCategorySlugForProduct,
} from "@/lib/categories";
import { useProducts } from "@/context/ProductsContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Star Rating Component
function StarRating({ rating, reviews, size = "default" }) {
  const starSize = size === "large" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : star - 0.5 <= rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviews} reviews)
      </span>
    </div>
  );
}

// Breadcrumb Component
function Breadcrumbs({ product, categorySlug, categoryName }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-teal-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to="/products" className="hover:text-teal-600 transition-colors">
        Products
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link
        to={`/products/${categorySlug}`}
        className="hover:text-teal-600 transition-colors"
      >
        {categoryName}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground font-medium truncate max-w-[200px]">
        {product.name}
      </span>
    </nav>
  );
}

// Image Gallery Component
const SWIPE_THRESHOLD = 45; // px of horizontal travel required to change image
const SWIPE_DIRECTION_LOCK = 12; // px before we decide swipe vs. page scroll

function getGalleryImages(product) {
  const images = product?.images;
  if (Array.isArray(images)) {
    const cleaned = images.filter(Boolean);
    if (cleaned.length > 0) return cleaned;
  }
  if (product?.image) return [product.image];
  return [];
}

function ImageGallery({ product }) {
  const productId = product?.id;
  // Always render at least one slot so the placeholder can show.
  const galleryImages = getGalleryImages(product);
  const slides = galleryImages.length > 0 ? galleryImages : [null];
  const slideCount = slides.length;
  const hasMultipleImages = slideCount > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (slide from right), -1 = previous
  const prefersReducedMotion = usePrefersReducedMotion();

  const touchStateRef = useRef(null);

  // Reset when navigating to a different product / image set (render-phase reset).
  const [galleryKey, setGalleryKey] = useState(`${productId}-${slideCount}`);
  const nextGalleryKey = `${productId}-${slideCount}`;
  if (galleryKey !== nextGalleryKey) {
    setGalleryKey(nextGalleryKey);
    setActiveIndex(0);
    setDirection(1);
  }

  const goTo = useCallback(
    (nextIndex, nextDirection) => {
      if (slideCount === 0) return;
      const wrapped = ((nextIndex % slideCount) + slideCount) % slideCount;
      setActiveIndex((prev) => {
        if (wrapped === prev) return prev;
        setDirection(
          nextDirection ??
            (wrapped > prev || (prev === slideCount - 1 && wrapped === 0)
              ? 1
              : -1),
        );
        return wrapped;
      });
    },
    [slideCount],
  );

  const goNext = useCallback(
    () => goTo(activeIndex + 1, 1),
    [goTo, activeIndex],
  );
  const goPrev = useCallback(
    () => goTo(activeIndex - 1, -1),
    [goTo, activeIndex],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (!hasMultipleImages) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    },
    [hasMultipleImages, goNext, goPrev],
  );

  const handleTouchStart = useCallback(
    (event) => {
      if (!hasMultipleImages || event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isHorizontal: null,
      };
    },
    [hasMultipleImages],
  );

  const handleTouchMove = useCallback((event) => {
    const state = touchStateRef.current;
    if (!state || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    // Decide once whether this gesture is a horizontal swipe or a page scroll.
    if (state.isHorizontal === null) {
      if (
        Math.abs(deltaX) < SWIPE_DIRECTION_LOCK &&
        Math.abs(deltaY) < SWIPE_DIRECTION_LOCK
      ) {
        return;
      }
      state.isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    }
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      const state = touchStateRef.current;
      touchStateRef.current = null;
      if (!state || !state.isHorizontal) return;

      const touch = event.changedTouches?.[0];
      if (!touch) return;

      const deltaX = touch.clientX - state.startX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

      if (deltaX < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  const transitionClass = prefersReducedMotion
    ? "transition-none"
    : "transition-all duration-300 ease-out";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className={`relative bg-white rounded-2xl p-4 sm:p-8 overflow-hidden group ${
          hasMultipleImages ? "touch-pan-y" : ""
        }`}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${product?.name || "Product"} image gallery`}
        tabIndex={hasMultipleImages ? 0 : -1}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStateRef.current = null;
        }}
      >
        <div className="relative aspect-square max-w-md mx-auto overflow-hidden bg-white">
          {slides.map((image, index) => {
            const isActive = index === activeIndex;
            // Off-screen slides park on the side the animation should come from / go to.
            const offset =
              index === activeIndex ? 0 : index > activeIndex ? 1 : -1;
            const translate = prefersReducedMotion
              ? 0
              : offset * (direction >= 0 ? 100 : 100);

            return (
              <div
                key={`${image || "placeholder"}-${index}`}
                className={`absolute inset-0 ${transitionClass} ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  transform: prefersReducedMotion
                    ? undefined
                    : `translateX(${isActive ? 0 : translate}%)`,
                }}
                aria-hidden={!isActive}
              >
                {image ? (
                  <ProductImageWithFallback
                    src={image}
                    alt={`${product?.name || "Product"} image ${index + 1} of ${slideCount}`}
                    className="w-full h-full object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    sizes="(max-width: 1024px) 92vw, 48vw"
                    showSkeleton={false}
                  />
                ) : (
                  <ProductImagePlaceholder className="w-full h-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="View previous product image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-teal-600" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="View next product image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-teal-600" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Dots */}
      {hasMultipleImages && (
        <div className="flex items-center justify-center gap-1">
          {slides.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`dot-${image || "placeholder"}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`View product image ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                className="flex items-center justify-center w-8 h-8 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <span
                  className={`block rounded-full ${transitionClass} ${
                    isActive
                      ? "w-6 h-2 bg-teal-500"
                      : "w-2 h-2 bg-gray-300 hover:bg-teal-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Quantity Selector Component
function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground">Quantity:</span>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-teal-50 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-teal-50 transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

// Feature Badge Component
// eslint-disable-next-line no-unused-vars
function FeatureBadge({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl">
      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Dummy Reviews Data
const dummyReviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent product!",
    comment:
      "This appliance exceeded my expectations. Very quiet operation and energy efficient. The smart features are easy to use and the build quality is outstanding.",
    helpful: 12,
  },
  {
    id: 2,
    name: "James T.",
    rating: 4,
    date: "1 month ago",
    title: "Great value for money",
    comment:
      "Good performance overall. Installation was straightforward and it works as advertised. Only minor issue is the control panel could be more intuitive.",
    helpful: 8,
  },
  {
    id: 3,
    name: "Emily R.",
    rating: 5,
    date: "1 month ago",
    title: "Highly recommend",
    comment:
      "Best purchase I've made this year. The delivery was fast and the product quality is top-notch. Customer service was also very helpful with my questions.",
    helpful: 15,
  },
  {
    id: 4,
    name: "Michael K.",
    rating: 4,
    date: "2 months ago",
    title: "Solid appliance",
    comment:
      "Works great and looks modern in my kitchen. The energy savings are noticeable on my electricity bill. Would buy again.",
    helpful: 6,
  },
];

// Review Card Component
function ReviewCard({ review }) {
  return (
    <div className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {review.comment}
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <button className="flex items-center gap-1 hover:text-teal-600 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Helpful ({review.helpful})
        </button>
      </div>
    </div>
  );
}

// Tabs Section Component
function TabsSection({ product }) {
  const [activeTab, setActiveTab] = useState("specifications");

  const tabs = [
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${dummyReviews.length})` },
  ];

  return (
    <div className="mt-12 sm:mt-16">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 relative ${
              activeTab === tab.id
                ? "text-teal-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "specifications" && (
        <div className="bg-card rounded-2xl border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.specifications &&
              Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Reviews Summary */}
          <div className="bg-card rounded-2xl border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-4xl font-bold text-foreground">
                  {product.rating.toFixed(1)}
                </p>
                <div className="flex gap-0.5 justify-center sm:justify-start my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {product.reviews} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage =
                    rating === 5
                      ? 65
                      : rating === 4
                        ? 25
                        : rating === 3
                          ? 7
                          : rating === 2
                            ? 2
                            : 1;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-3">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Write Review Button */}
          <div className="text-center">
            <Button
              variant="outline"
              className="border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
            >
              Write a Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryProductDetailPage() {
  const params = useParams();
  const { getProductById, isLoading: isProductsLoading } = useProducts();
  const [quantity, setQuantity] = useState(1);

  // Derive product directly during render instead of via an effect — avoids
  // an unnecessary extra render pass and the "setState in effect" pitfall.
  const product = isProductsLoading ? null : getProductById(params.id);

  if (isProductsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist.
          </p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const categorySlug = getCategorySlugForProduct(product);
  const categoryName = getCategoryTitleForProduct(product);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-background py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            product={product}
            categorySlug={categorySlug}
            categoryName={categoryName}
          />

          {/* Back Button */}
          <Link
            to={`/products/${categorySlug}`}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to {categoryName}</span>
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery product={product} />
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                  {categoryName}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {product.brand}
                </span>
              </div>

              {/* Product Name */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-muted-foreground">{product.model}</p>
              </div>

              {/* Rating */}
              <StarRating
                rating={product.rating}
                reviews={product.reviews}
                size="large"
              />

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  £{product.price}
                </span>
                {discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      £{product.originalPrice}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Key Features:
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/447853580404?text=${encodeURIComponent(`Hi, I would like more information about this product:\n\n${product.name} (${product.model})\n\nPlease share details and availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                  aria-label="Ask on WhatsApp"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 sm:h-14 px-4 sm:px-6 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent text-green-700"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-green-600 sm:mr-2" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="h-12 sm:h-14 px-6 border-teal-200 hover:bg-teal-50 hover:border-teal-300 bg-transparent"
                >
                  <Share2 className="w-5 h-5 text-teal-600" />
                </Button>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
                <FeatureBadge
                  icon={Truck}
                  title="Free Delivery"
                  description="On orders over £50"
                />
                <FeatureBadge
                  icon={Shield}
                  title="2 Year Warranty"
                  description="Full coverage"
                />
                <FeatureBadge
                  icon={RotateCcw}
                  title="30 Day Returns"
                  description="Hassle-free"
                />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <TabsSection product={product} />
        </div>
      </section>
    </div>
  );
}
