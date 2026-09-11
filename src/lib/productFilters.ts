export type FilterableProduct = {
  price: number;
  inStock?: boolean;
  metal?: string;
  diamondType?: string;
  carat?: string;
  style?: string;
  color?: string;
  shape?: string;
};

export function normalizeText(value?: string | null): string {
  if (!value) return "";

  const aliasMap: Record<string, string> = {
    "18k white gold": "18ct white gold",
    "18 ct white gold": "18ct white gold",
    "18k yellow gold": "18ct yellow gold",
    "18 ct yellow gold": "18ct yellow gold",
    "18k rose gold": "18ct rose gold",
    "18 ct rose gold": "18ct rose gold",
    "9k white gold": "9ct white gold",
    "9k yellow gold": "9ct yellow gold",
    "9k rose gold": "9ct rose gold",
    "14k white gold": "14k white gold",
    "950 platinum": "platinum",
    "platinum 950": "platinum",
    "lab grown diamond": "lab grown diamond",
    "natural diamond": "natural diamond",
    "studs": "stud earrings",
    "stud": "stud earrings",
    "hoops": "hoop earrings",
    "hoop": "hoop earrings",
    "drops": "drop earrings",
    "drop": "drop earrings",
    "round brilliant": "round brilliant",
    "round-brilliant": "round brilliant",
    "oval": "oval",
    "princess": "princess",
    "emerald": "emerald",
    "solitaire": "solitaire",
    "halo": "halo",
    "under halo": "under halo",
    "three stone": "three stone",
    "trilogy": "three stone",
    "diamond shoulder": "diamond shoulder",
    "diamond shoulders": "diamond shoulder",
  };

  const compact = String(value).toLowerCase().replace(/&/g, " and ");
  const cleaned = compact.replace(/[^a-z0-9]+/g, " ").trim();
  const normalized = aliasMap[cleaned] || cleaned;
  return normalized.replace(/\s+/g, " ");
}

export function matchesAnyNormalized(value: string | undefined, selected: string[]): boolean {
  if (!selected || selected.length === 0) return true;
  const normalizedValue = normalizeText(value);
  if (!normalizedValue) return false;

  return selected.some((item) => {
    const normalizedItem = normalizeText(item);
    if (!normalizedItem) return false;
    return (
      normalizedItem === normalizedValue ||
      normalizedValue.includes(normalizedItem) ||
      normalizedItem.includes(normalizedValue)
    );
  });
}

export function applyProductFilters<T extends FilterableProduct>(
  products: T[],
  filters: {
    inStockOnly?: boolean;
    selectedDiamondTypes?: string[];
    selectedMetals?: string[];
    selectedCarats?: string[];
    selectedStyles?: string[];
    selectedColors?: string[];
    selectedShapes?: string[];
    minPrice?: number;
    maxPrice?: number;
  } = {}
): T[] {
  const {
    inStockOnly = false,
    selectedDiamondTypes = [],
    selectedMetals = [],
    selectedCarats = [],
    selectedStyles = [],
    selectedColors = [],
    selectedShapes = [],
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
  } = filters;

  return products.filter((product) => {
    if (inStockOnly && !product.inStock) return false;

    if (selectedDiamondTypes.length > 0 && !matchesAnyNormalized(product.diamondType, selectedDiamondTypes)) {
      return false;
    }

    if (selectedMetals.length > 0 && !matchesAnyNormalized(product.metal, selectedMetals)) {
      return false;
    }

    if (selectedCarats.length > 0 && !matchesAnyNormalized(product.carat, selectedCarats)) {
      return false;
    }

    if (selectedStyles.length > 0 && !matchesAnyNormalized(product.style, selectedStyles)) {
      return false;
    }

    if (selectedColors.length > 0 && !matchesAnyNormalized(product.color, selectedColors)) {
      return false;
    }

    if (selectedShapes.length > 0 && !matchesAnyNormalized(product.shape, selectedShapes)) {
      return false;
    }

    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }

    return true;
  });
}
