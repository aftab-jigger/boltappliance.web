import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as fallbackProducts } from "@/lib/dataLive";
import { loadProducts } from "@/lib/fetchProducts";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState("fallback");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    loadProducts().then((result) => {
      if (!isMounted) return;
      setProducts(result.products);
      setSource(result.source);
      setError(result.error);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter options are no longer built here: each page derives them from the
  // products currently in scope via `useProductFilters` /
  // `@/lib/filters/commonFilters`.
  const value = useMemo(
    () => ({
      products,
      isLoading,
      source,
      error,
      getProductById: (id) =>
        products.find((product) => product.id === parseInt(id, 10)),
    }),
    [products, isLoading, source, error],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
}
