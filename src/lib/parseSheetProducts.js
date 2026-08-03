import { normalizeSlug } from "./categories";

function normalizeHeader(header) {
  return header.toLowerCase().trim().replace(/\s+/g, " ");
}

function parseCsvRows(csvText) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

function getCellValue(row, headerMap, keys) {
  for (const key of keys) {
    const index = headerMap.get(key);
    if (index === undefined) continue;
    const value = row[index]?.trim();
    if (value) return value;
  }
  return "";
}

function parseList(value) {
  if (!value) return [];

  const delimiter = /[|;]/.test(value) ? /[|;\n]/ : ",";
  return value
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value, fallback = 0) {
  if (value === "" || value == null) return fallback;
  const parsed = Number(String(value).replace(/[£$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildSpecifications(row, headerMap) {
  const specificationsJson = getCellValue(row, headerMap, [
    "specifications",
    "specs",
  ]);
  if (specificationsJson) {
    try {
      const parsed = JSON.parse(specificationsJson);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Fall through to column-based specs.
    }
  }

  return {
    dimensions:
      getCellValue(row, headerMap, [
        "dimensions",
        "spec dimensions",
        "spec_dimensions",
      ]) || "N/A",
    weight:
      getCellValue(row, headerMap, ["weight", "spec weight", "spec_weight"]) ||
      "N/A",
    powerConsumption:
      getCellValue(row, headerMap, [
        "powerconsumption",
        "power consumption",
        "power",
        "spec_powerconsumption",
      ]) || "N/A",
    warranty:
      getCellValue(row, headerMap, [
        "warranty",
        "spec warranty",
        "spec_warranty",
      ]) || "N/A",
    color:
      getCellValue(row, headerMap, [
        "color",
        "colour",
        "spec color",
        "spec_color",
      ]) || "N/A",
    capacity:
      getCellValue(row, headerMap, [
        "capacity",
        "spec capacity",
        "spec_capacity",
      ]) || "N/A",
  };
}

export function parseSheetProducts(csvText) {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const headerMap = new Map(headers.map((header, index) => [header, index]));

  return rows
    .slice(1)
    .map((row, index) => {
      const id = parseNumber(getCellValue(row, headerMap, ["id"]), index + 1);
      const name = getCellValue(row, headerMap, [
        "name",
        "product name",
        "product_name",
        "title",
      ]);
      if (!name) return null;

      const image = getCellValue(row, headerMap, [
        "image",
        "main image",
        "main_image",
        "thumbnail",
      ]);
      const imagesRaw = getCellValue(row, headerMap, [
        "images",
        "gallery",
        "image gallery",
        "image_gallery",
      ]);
      const parsedImages = parseList(imagesRaw);
      const images =
        parsedImages.length > 0 ? parsedImages : image ? [image] : [];

      const price = parseNumber(
        getCellValue(row, headerMap, ["price", "sale price", "sale_price"]),
      );
      const originalPrice = parseNumber(
        getCellValue(row, headerMap, [
          "originalprice",
          "original price",
          "original_price",
          "mrp",
        ]),
        price,
      );

      const description =
        getCellValue(row, headerMap, [
          "description",
          "short description",
          "short_description",
        ]) ||
        `High-quality ${name} with reliable performance for modern homes.`;

      const longDescription =
        getCellValue(row, headerMap, [
          "longdescription",
          "long description",
          "long_description",
          "details",
        ]) || description;

      // Category / Subcategory come directly from the sheet. The app stores
      // the normalized slug form; display titles are resolved via
      // `src/lib/categories.js` (single source of truth).
      const rawCategory = getCellValue(row, headerMap, [
        "category",
        "product category",
        "product_category",
      ]);
      const rawSubcategory = getCellValue(row, headerMap, [
        "subcategory",
        "sub category",
        "sub_category",
      ]);

      return {
        id,
        name,
        model:
          getCellValue(row, headerMap, [
            "model",
            "model number",
            "model_number",
          ]) || `Model ${id}`,
        price,
        originalPrice: originalPrice || price,
        description,
        longDescription,
        rating: parseNumber(
          getCellValue(row, headerMap, ["rating", "stars"]),
          4,
        ),
        reviews: parseNumber(
          getCellValue(row, headerMap, [
            "reviews",
            "review count",
            "review_count",
          ]),
          0,
        ),
        category: normalizeSlug(rawCategory),
        subcategory: normalizeSlug(rawSubcategory),
        brand:
          getCellValue(row, headerMap, ["brand", "manufacturer"]) || "Generic",
        image: image || images[0] || "",
        images,
        features: parseList(
          getCellValue(row, headerMap, [
            "features",
            "feature list",
            "feature_list",
          ]),
        ),
        specifications: buildSpecifications(row, headerMap),
      };
    })
    .filter(Boolean);
}
