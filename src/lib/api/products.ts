import { apiClient } from "./client";

export interface ProductImage {
  id?: number;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface ProductSize {
  id?: number;
  size: string;
  stock: number;
}

export interface DiamondSpec {
  carat_weight?: string | number;
  caratWeight?: string | number;
  side_carat_weight?: string | number | null;
  sideCaratWeight?: string | number | null;
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
  is_active: boolean;
  isActive?: boolean;
  is_featured: boolean;
  isFeatured?: boolean;
  styles?: number[];
  collections?: number[];
  diamond_type?: number | null;
  brand?: number | null;
  diamond_spec?: DiamondSpec | null;
  images?: ProductImage[];
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

export type ProductQueryParams = Record<string, string | number | boolean | null | undefined>;

export const productsApi = {
  /** GET /api/products/ — List products with filters */
  getProducts: (params?: ProductQueryParams) =>
    apiClient.get<ProductsResponse>("/products/", { params }),

  /** GET /api/products/{id}/ — Retrieve product detail by ID or slug */
  getProduct: (id: string | number) =>
    apiClient.get<ProductItem>(`/products/${id}/`),

  /** GET /api/products/categories/ */
  getCategories: () =>
    apiClient.get<any[]>("/products/categories/"),

  /** GET /api/products/subcategories/summary/ */
  getSubcategoriesSummary: () =>
    apiClient.get<CategorySummary>("/products/subcategories/summary/"),
};
