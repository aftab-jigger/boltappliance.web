import { useLocation, useParams } from "react-router-dom";
import { normalizeSlug } from "@/lib/categories";
import MainCategoryPage from "./features/MainCategoryPage";

const Category = () => {
  const params = useParams();
  const location = useLocation();

  // Two ways this route can be reached:
  // 1. New top-level routes: /laundry, /refrigeration, /cooking, /dishwashers
  //    (no :category param — the slug is the first path segment).
  // 2. Legacy route: /products/:category (kept for backward compatibility).
  const categorySlug =
    params.category || normalizeSlug(location.pathname.split("/")[1]);

  return <MainCategoryPage categorySlug={categorySlug} />;
};

export default Category;
