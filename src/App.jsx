import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/layout/Navbar/Navbar";

const Home = lazy(() => import("./pages/home"));
const Services = lazy(() => import("./pages/service"));
const About = lazy(() => import("./pages/about"));
const Products = lazy(() => import("./pages/products"));
const Contact = lazy(() => import("./pages/contact"));
const Category = lazy(() => import("./pages/products/category"));
const ProductPage = lazy(() => import("./pages/products/category/id"));

// The four top-level category slugs (see `src/lib/categories.js`, single
// source of truth). Each renders the same `Category` route component, which
// reads `categorySlug` from the URL param and filters products accordingly.
const CATEGORY_ROUTE_PATHS = [
  "/laundry",
  "/refrigeration",
  "/cooking",
  "/dishwashers",
];

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            {/* All products mixed together (navbar "Products" link) */}
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />

            {/* Four main category pages, e.g. /cooking?subcategory=hobs */}
            {CATEGORY_ROUTE_PATHS.map((path) => (
              <Route key={path} path={path} element={<Category />} />
            ))}

            {/* Legacy/back-compat: /products/:category still works and maps
                to the same category page. */}
            <Route path="/products/:category" element={<Category />} />
            <Route path="/products/:category/:id" element={<ProductPage />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;
