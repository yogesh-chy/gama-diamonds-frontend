import { apiClient } from "./client";

export interface ProductImage {
  id?: number;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
  variantId?: number | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  metal_type?: string;
  metalType?: string;
  metal_karat?: string;
  metalKarat?: string;
  size?: string;
  price: string | number;
  compare_at_price?: string | number | null;
  compareAtPrice?: string | number | null;
  stock: number;
  is_active: boolean;
  isActive?: boolean;
  is_default: boolean;
  isDefault?: boolean;
  images?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ResolvedVariant extends ProductVariant {
  variant_id?: number;
  availability?: boolean;
}

export interface ProductPriceRange {
  min: number;
  max: number;
  display: string;
}

export interface ProductOptions {
  metal: string[];
  karat: string[];
  size: string[];
}

export interface ProductSize {
  id?: number;
  size: string;
  stock: number;
}

export interface DiamondSpec {
  diamond_shape?: string | null;
  carat_weight?: string | number;
  caratWeight?: string | number;
  center_carat_weight?: string | number | null;
  centerCaratWeight?: string | number | null;
  side_carat_weight?: string | number | null;
  sideCaratWeight?: string | number | null;
  total_carat_weight?: string | number | null;
  totalCaratWeight?: string | number | null;
  diamond_origin?: string;
  diamond_value?: string | number | null;
  cut_grade?: string | null;
  cutGrade?: string | null;
  colour_grade?: string | null;
  colourGrade?: string | null;
  clarity_grade?: string | null;
  clarityGrade?: string | null;
  certification_lab?: string;
  certificationLab?: string;
  certificate_number?: string;
  certificateNumber?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  base_price: string | number;
  discount_price: string | number | null;
  basePrice?: number;
  discountPrice?: number | null;
  price?: number | ProductPriceRange;
  total_stock: number;
  totalStock?: number;
  metal_type?: string | null;
  metalType?: string | null;
  metal_karat?: string | null;
  metalKarat?: string | null;
  diamond_cut?: string | null;
  diamondCut?: string | null;
  earring_type?: string | null;
  earringType?: string | null;
  necklace_style?: string | null;
  necklaceStyle?: string | null;
  bracelet_type?: string | null;
  braceletType?: string | null;
  band_fit?: string | null;
  bandFit?: string | null;
  finish?: string;
  customisation_available?: string;
  engraving_available?: string;
  gender?: string;
  occasion?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  is_active: boolean;
  isActive?: boolean;
  is_featured: boolean;
  isFeatured?: boolean;
  video_url?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  image?: string | null;
  styles?: number[];
  collections?: number[];
  diamond_type?: number | null;
  brand?: number | null;
  diamond_spec?: DiamondSpec | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  options?: ProductOptions;
  sizes?: ProductSize[];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: ProductItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategorySummary {
  success: boolean;
  rings: string[];
  diamond_cuts: string[];
  earrings: string[];
  necklaces: string[];
  bracelets: string[];
  metal_types: string[];
}

export interface FacetedFilters {
  categories: Array<{ id: number; name: string; slug: string }>;
  styles: Array<{ id: number; name: string; slug: string }>;
  diamond_types: Array<{ id: number; name: string; slug: string }>;
  diamond_shapes: Array<{ name: string; value: string }>;
  brands: Array<{ id: number; name: string; slug: string }>;
  collections: Array<{ id: number; name: string; slug: string }>;
  metals: string[];
  karats: string[];
  sizes: string[];
  price_range: { min: number; max: number };
}

export type ProductQueryParams = Record<string, string | number | boolean | null | undefined>;

export const productsApi = {
  /** GET /api/products/ — List products with filters */
  getProducts: (params?: ProductQueryParams) =>
    apiClient.get<ProductsResponse>("/products/", { params }),

  /** GET /api/products/{id}/ — Retrieve product detail by ID or slug */
  getProduct: (id: string | number) =>
    apiClient.get<ProductItem>(`/products/${id}/`),

  /** GET /api/products/{slug}/resolve-variant/ — Resolve exact variant by options */
  resolveVariant: (slug: string, params: { metal_type?: string; metal_karat?: string; size?: string }) =>
    apiClient.get<ResolvedVariant>(`/products/${slug}/resolve-variant/`, { params }),

  /** GET /api/products/filters/ — Get faceted filter option counts */
  getFacetedFilters: () =>
    apiClient.get<FacetedFilters>("/products/filters/"),

  /** GET /api/products/categories/ */
  getCategories: () =>
    apiClient.get<any[]>("/products/categories/"),

  /** GET /api/products/subcategories/summary/ */
  getSubcategoriesSummary: () =>
    apiClient.get<CategorySummary>("/products/subcategories/summary/"),
};
