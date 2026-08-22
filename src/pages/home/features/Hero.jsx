import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Headphones,
  Refrigerator,
  WashingMachine,
  Zap,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import ProductImageWithFallback from "@/components/ui/product-image-with-fallback";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const slides = [
  {
    id: 1,
    eyebrow: "Smart Refrigerators",
    eyebrowIcon: Refrigerator,
    heading: "Keep Your Food Fresh & Organized",
    description:
      "Discover reliable refrigeration designed to keep your food fresher for longer.",
    image: "/hero/hero-refrigerators.webp",
    cta: "Shop Refrigerators",
  },
  {
    id: 2,
    eyebrow: "Laundry Appliances",
    eyebrowIcon: WashingMachine,
    heading: "Powerful Care for Every Load",
    description:
      "Make laundry easier with efficient washing machines and dryers built for everyday performance.",
    image: "/hero/hero-laundry.webp",
    cta: "Shop Laundry",
  },
  {
    id: 3,
    eyebrow: "Cooking Appliances",
    eyebrowIcon: ChefHat,
    heading: "Cook Like a Pro",
    description:
      "Upgrade your kitchen with premium ovens and hobs designed for effortless everyday cooking.",
    image: "/hero/hero-cooking.webp",
    cta: "Shop Cooking",
  },
  {
    id: 4,
    eyebrow: "Dishwashers",
    eyebrowIcon: Droplets,
    heading: "Effortless Cleaning, Every Day",
    description:
      "Enjoy powerful, efficient cleaning with dishwashers designed to make kitchen cleanup effortless.",
    image: "/hero/hero-dishwasher.webp",
    cta: "Shop Dishwashers",
  },
];

// Static trust row — identical across every slide, so it lives outside the
// per-slide crossfade and never re-mounts/re-animates on autoplay.
const heroFeatures = [
  { icon: Award, title: "Premium Quality", description: "Built to last" },
  { icon: Zap, title: "Smart Technology", description: "Innovative features" },
  {
    icon: Headphones,
    title: "Reliable Support",
    description: "Always here for you",
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Manual navigation (arrow/dot) pauses autoplay briefly so the slide the
  // user picked doesn't immediately get replaced.
  const pauseAutoplay = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), AUTOPLAY_INTERVAL_MS);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    pauseAutoplay();
  };

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const interval = setInterval(nextSlide, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, prefersReducedMotion]);

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative mx-3 mt-3 mb-3 overflow-hidden rounded-[2rem] bg-background shadow-lg shadow-black/5 sm:mx-0 sm:mt-0 sm:mb-0 sm:rounded-none sm:shadow-none">
      {/* Photography layer: a true full-bleed background spanning the
          entire hero (not a boxed/inset column), so the photo reads as
          part of the same canvas as the content instead of a floating
          card. Height is driven by the content row below via inset-0. */}
      <div className="pointer-events-none absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 ease-out ${
                prefersReducedMotion
                  ? "transition-opacity duration-200"
                  : "transition-all duration-1000"
              } ${
                isActive
                  ? "z-10 scale-100 opacity-100"
                  : `z-0 opacity-0 ${prefersReducedMotion ? "" : "scale-[0.97]"}`
              }`}
            >
              <ProductImageWithFallback
                src={slide.image}
                alt={slide.heading}
                className="h-full w-full object-cover object-[55%_center]"
                loading="eager"
                sizes="100vw"
              />
            </div>
          );
        })}

        {/* Soft white-to-transparent blend over the photo's left side — no
            dark overlay. This, not a boxed image, is what makes the photo
            read as part of the canvas rather than a separate card. Mobile-
            base is a quick, narrow fade right at the card's own left edge
            only — the curve below (not this gradient) is what carries the
            white/photo boundary on mobile, so the two don't fight over where
            the photo becomes visible. sm: up (unchanged from before): the
            original broader diagonal fade. */}
        <div
          className="absolute inset-0 z-20 bg-gradient-to-r from-white from-0% via-white via-10% to-transparent to-25% sm:via-70% sm:to-88% md:via-45% md:to-75% lg:via-25% lg:to-58% xl:to-[48%]"
          aria-hidden="true"
        />

        {/* Mobile-only curve: a cubic bezier with exactly ONE gentle
            inflection — it bows ~4% out toward the photo through the upper
            third, then reverses and sweeps left through the lower half.
            That single crossover is what reads as organic/asymmetric; a
            strictly monotonic path (no inflection) reads as a flat diagonal,
            and a large-amplitude double bend reads as a hard "S". Control
            points are tuned so the mid-section stays right of the heading /
            description / CTA, which are fixed-size and cannot reflow.
            preserveAspectRatio="none" stretches it to fill the card
            regardless of the row's actual (content-driven) height, so it
            never needs a fixed pixel size — the shape is defined in
            percent-of-card terms (viewBox units), so the stretch doesn't
            change where it sits relative to the text/photo. Gone entirely
            from sm: up — desktop/tablet keep the plain gradient above. */}
        <svg
          className="absolute inset-0 z-20 h-full w-full sm:hidden"
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M70,0 C88,28 38,88 38,140 L0,140 L0,0 Z"
            className="fill-background"
          />
          <path
            d="M70,0 C88,28 38,88 38,140"
            fill="none"
            stroke="var(--color-teal-200)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Content row: normal-flow, so it drives the section's height; the
          photography layer above stretches to match via inset-0. On
          desktop (lg+), height comes from a ~2:1 aspect ratio instead of a
          fixed min-height, so the canvas proportion matches the wide hero
          assets and the photo renders near its natural scale instead of
          being squeezed into a much shorter box. Capped with max-h so it
          doesn't balloon on ultra-wide monitors. */}
      <div className="relative mx-auto flex min-h-[490px] max-w-screen-2xl items-center px-5 pt-6 pb-14 sm:min-h-[480px] sm:px-10 sm:py-12 md:min-h-[520px] md:px-14 lg:aspect-[2/1] lg:max-h-[720px] lg:min-h-0 lg:px-20 lg:py-0">
        {/* Text sits above the blended canvas, left-aligned. The heading/
            description/CTA block stays width-constrained so it never runs
            into the photography; the feature row below has its own,
            independently-controlled width. */}
        <div className="relative z-30 w-full sm:w-auto">
          <div
            key={activeSlide.id}
            className={`max-w-md ${
              prefersReducedMotion
                ? ""
                : "animate-in fade-in-0 slide-in-from-bottom-2 duration-700 ease-out"
            }`}
          >
            {/* Category label. Mobile: a rounded light-teal pill with a
                small category icon, matching the reference direction.
                sm: up (unchanged from before): plain colored text, no pill,
                no icon. */}
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 py-1 pr-3 pl-1 sm:gap-0 sm:rounded-none sm:bg-transparent sm:p-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 sm:hidden">
                <activeSlide.eyebrowIcon className="h-3 w-3" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-teal-600 sm:text-sm">
                {activeSlide.eyebrow}
              </span>
            </div>
            <h1 className="max-w-[215px] text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:max-w-none sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-5xl">
              {activeSlide.heading}
            </h1>
            <p className="mt-2 max-w-[215px] text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:max-w-none sm:text-base sm:leading-normal">
              {activeSlide.description}
            </p>
            <Button
              size="lg"
              className="group mt-5 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 sm:mt-5"
            >
              {activeSlide.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Trust / feature row. Mobile: a dedicated floating white panel
              (own bg/shadow/radius) below the CTA, all 3 items in one
              horizontal row with icon-above-text so short labels fit 3-up
              in the panel's width, a hair wider than the text column above
              via -mx-2, and separated by subtle interior dividers. From sm:
              up (unchanged from before): the panel chrome drops away and it
              becomes an inline 3-col grid with icon-beside-text; lg:max-w-2xl
              widens it there so titles like "Smart Technology" don't need to
              truncate. */}
          <div className="relative z-30 mt-7 -mx-2 grid grid-cols-3 divide-x divide-border/60 gap-0.5 rounded-2xl bg-white p-2 shadow-lg shadow-black/5 sm:relative sm:z-auto sm:mx-0 sm:mt-6 sm:grid sm:max-w-md sm:grid-cols-3 sm:gap-3 sm:divide-x-0 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none lg:max-w-2xl">
            {heroFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:gap-2 sm:text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 sm:h-7 sm:w-7">
                  <feature.icon className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] leading-tight font-semibold text-foreground sm:text-sm sm:leading-normal sm:truncate">
                    {feature.title}
                  </p>
                  <p className="text-[9px] leading-tight text-muted-foreground sm:text-xs sm:leading-normal sm:truncate">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows: positioned relative to THIS row (which is
            capped at max-w-screen-2xl and centered), not the raw full-bleed
            <section>. On very wide viewports the section spans the full
            viewport while this row is inset/centered — anchoring the
            arrows to the section edge left them floating in the outer
            gutter, well past where the hero canvas actually ends. On
            mobile the text column runs the full height of a much taller
            canvas, so a vertically-centered arrow lands on top of the CTA
            — instead they sit in the bottom control row next to the dots
            on mobile, which is always clear of text. From sm: up
            (unchanged from before), they float at the vertical center near
            the row's edges. */}
        <button
          type="button"
          onClick={() => {
            prevSlide();
            pauseAutoplay();
          }}
          className="absolute left-3 bottom-4 top-auto z-30 cursor-pointer rounded-full border border-border bg-white p-1.5 shadow-md outline-none transition-colors hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500/60 sm:left-4 sm:top-1/2 sm:bottom-auto sm:p-2 sm:-translate-y-1/2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            nextSlide();
            pauseAutoplay();
          }}
          className="absolute right-3 bottom-4 top-auto z-30 cursor-pointer rounded-full border border-border bg-white p-1.5 shadow-md outline-none transition-colors hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500/60 sm:right-4 sm:top-1/2 sm:bottom-auto sm:p-2 sm:-translate-y-1/2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Pagination dots — centered on the whole canvas, close beneath it */}
      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center gap-2 sm:bottom-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2 cursor-pointer rounded-full outline-none transition-all duration-700 focus-visible:ring-2 focus-visible:ring-teal-500/60 ${
              index === currentSlide
                ? "w-8 bg-teal-500"
                : "w-2 bg-muted-foreground/45 hover:bg-muted-foreground/65 sm:bg-muted-foreground/30 sm:hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
};
export default Hero;
