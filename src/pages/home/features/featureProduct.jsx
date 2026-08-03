"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@/assets/icons/icons";
import { getCategorySlugForProduct } from "@/lib/categories";
import { useProducts } from "@/context/ProductsContext";
import SectionHeader from "@/components/ui/section-header";
import StarRating from "@/components/ui/star-rating";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";

const CARD_WIDTH = 280;
const CARD_GAP = 16;

function ProductCard({ product }) {
  const categorySlug = getCategorySlugForProduct(product);

  return (
    <Link
      to={`/products/${categorySlug}/${product.id}`}
      className="group flex-none snap-start snap-always"
      style={{
        width: `min(100%, ${CARD_WIDTH}px)`,
        maxWidth: `${CARD_WIDTH}px`,
      }}
    >
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col mx-1 sm:mx-1.5">
        <div className="relative overflow-hidden bg-linear-to-br from-teal-50 to-cyan-50 p-3 sm:p-4">
          <div className="relative h-44 sm:h-52 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <ProductImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 90vw, 280px"
            />
          </div>
          {product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-linear-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {Math.round((1 - product.price / product.originalPrice) * 100)}%
              OFF
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-foreground text-sm sm:text-base mb-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs mb-1.5">
            {product.model}
          </p>
          <div className="mb-2">
            <StarRating
              rating={product.rating}
              reviews={product.reviews}
              size="default"
            />
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-base sm:text-lg font-bold text-foreground">
              £{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                £{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeatureProduct() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 12);
  const { ref: sectionRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
  });
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [featuredProducts.length]);

  // Auto-rotate: advance by one card width every 4s
  useEffect(() => {
    if (!isVisible || featuredProducts.length === 0) return;
    const el = scrollRef.current;
    const interval = setInterval(() => {
      if (!el) return;
      const firstCard = el.querySelector("a");
      const step = firstCard
        ? firstCard.offsetWidth + CARD_GAP
        : el.scrollWidth / featuredProducts.length;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const next = el.scrollLeft + step;
      if (next >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, featuredProducts.length]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector("a");
    const step = firstCard
      ? firstCard.offsetWidth + CARD_GAP
      : el.scrollWidth / featuredProducts.length;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-14 md:py-16 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          badge="Featured"
          title="Featured Products"
          description="Handpicked appliances for your home. Quality and value you can trust."
          animate
          isVisible={isVisible}
          className="mb-8 sm:mb-10"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous products"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card shadow-lg border flex items-center justify-center transition-all hover:bg-teal-50 hover:border-teal-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next products"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card shadow-lg border flex items-center justify-center transition-all hover:bg-teal-50 hover:border-teal-300 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 sm:-mx-1.5 scrollbar-hide"
            style={{
              gap: CARD_GAP,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
