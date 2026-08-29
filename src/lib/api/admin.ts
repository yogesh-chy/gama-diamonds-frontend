import { apiClient } from "./client";

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  subcategory?: string | null;
  base_price: string | number;
  discount_price: string | number | null;
  basePrice?: number;
  discountPrice?: number | null;
  total_stock: number;
  totalStock?: number;
  metal_type?: string | null;
  metal_karat?: string | null;
  diamond_cut?: string | null;
  earring_type?: string | null;
  necklace_style?: string | null;
  bracelet_type?: string | null;
  band_fit?: string | null;
  finish?: string;
  customisation_available?: string;
  engraving_available?: string;
  gender?: string;
  occasion?: string;
  seo_title?: string;
  seoTitle?: string;
  seo_description?: string;
  seoDescription?: string;
  seo_keywords?: string;
  seoKeywords?: string;
  tax_percentage?: string | number;
  low_stock_threshold?: number;
  video_url?: string | null;
  videoUrl?: string | null;
  is_active: boolean;
  is_featured: boolean;
  thumbnail?: string | null;
  styles?: number[];
  stylesDetail?: Array<{ id: number; name: string; slug: string }>;
  collections?: number[];
  collectionsDetail?: Array<{ id: number; name: string; slug: string }>;
  diamond_type?: number | null;
  diamondTypeDetail?: { id: number; name: string; slug: string } | null;
  brand?: number | null;
  brandDetail?: { id: number; name: string; slug: string } | null;
  diamond_spec?: {
    diamond_origin?: string;
    carat_weight?: string | number;
    center_carat_weight?: string | number | null;
    side_carat_weight?: string | number | null;
    total_carat_weight?: string | number | null;
    diamond_value?: string | number | null;
    cut_grade?: string | null;
    colour_grade?: string | null;
    clarity_grade?: string | null;
    certification_lab?: string;
    certificate_number?: string;
  } | null;
  images?: Array<{ id?: number; url: string; publicId?: string; isPrimary?: boolean }>;
  variants?: Array<{
    id?: number;
    sku?: string;
    metal_type?: string;
    metal_karat?: string;
    metal_weight_grams?: string | number | null;
    size?: string;
    price?: string | number | null;
    compare_at_price?: string | number | null;
    stock?: number;
    is_active?: boolean;
    is_default?: boolean;
    isDefault?: boolean;
    images?: Array<{ id?: number; url: string; isPrimary?: boolean }>;
  }>;
  sizes?: Array<{ id?: number; size: string; stock: number }>;
  created_at: string;
  updated_at: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  subcategories?: AdminSubcategory[];
  created_at?: string;
}

export interface AdminSubcategory {
  id: number;
  category: number;
  category_name?: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface AdminTaxonomyItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface AdminOrderItem {
  id: number;
  product: number | null;
  product_name: string;
  product_sku: string;
  product_price: string;
  size: string;
  quantity: number;
  line_total: string;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  user_email: string;
  status: string;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  address_full_name: string;
  address_phone_number: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
  razorpay_order_id: string;
  reservation_expires_at: string | null;
  items: AdminOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface AdminCartItem {
  id: number;
  product: number;
  product_detail?: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    image_url: string | null;
    is_active: boolean;
  };
  size: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface AdminCart {
  id: number;
  user_id: number;
  user_email: string;
  items: AdminCartItem[];
  total_amount: string;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  phone_number: string;
  is_staff: boolean;
  is_email_verified: boolean;
  created_at: string;
  orders_count?: number;
}

type ApiQueryParams = Record<string, string | number | boolean | null | undefined>;

function normalizeListResponse<T>(response: { data?: unknown }): T[] {
  const payload = response?.data;

  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.results)) return record.results as T[];
    if (Array.isArray(record.data)) return record.data as T[];
  }

  return [];
}

export const adminApi = {
  // --- Products ---
  getProducts: (params?: ApiQueryParams) =>
    apiClient.get<{ success: boolean; data: AdminProduct[]; pagination?: unknown }> ("/products/", { params }),
  
  createProduct: (payload: Partial<AdminProduct>) =>
    apiClient.post<AdminProduct>("/products/", payload),

  updateProduct: (id: number, payload: Partial<AdminProduct>) =>
    apiClient.patch<AdminProduct>(`/products/${id}/`, payload),

  deleteProduct: (id: number) =>
    apiClient.delete(`/products/${id}/`),

  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ success: boolean; url: string; media_type: "image" | "video"; filename: string }>(
      "/products/upload/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // --- Categories & Subcategories ---
  getCategories: async () => {
    const res = await apiClient.get("/products/categories/");
    return { ...res, data: normalizeListResponse<AdminCategory>(res) };
  },

  createCategory: (payload: { name: string; slug?: string; description?: string }) =>
    apiClient.post<AdminCategory>("/products/categories/", payload),

  updateCategory: (id: number, payload: Partial<{ name: string; slug: string; description: string }>) =>
    apiClient.patch<AdminCategory>(`/products/categories/${id}/`, payload),

  deleteCategory: (id: number) =>
    apiClient.delete(`/products/categories/${id}/`),

  getSubcategories: async () => {
    const res = await apiClient.get("/products/subcategories/");
    return { ...res, data: normalizeListResponse<AdminSubcategory>(res) };
  },

  createSubcategory: (payload: { category: number; name: string; slug?: string }) =>
    apiClient.post<AdminSubcategory>("/products/subcategories/", payload),

  updateSubcategory: (id: number, payload: Partial<{ category: number; name: string; slug: string }>) =>
    apiClient.patch<AdminSubcategory>(`/products/subcategories/${id}/`, payload),

  deleteSubcategory: (id: number) =>
    apiClient.delete(`/products/subcategories/${id}/`),

  // --- Taxonomies (Styles, Diamond Types, Brands, Collections) ---
  getStyles: async () => {
    const res = await apiClient.get("/products/styles/");
    return { ...res, data: normalizeListResponse<AdminTaxonomyItem>(res) };
  },
  createStyle: (payload: { name: string; slug?: string }) => apiClient.post<AdminTaxonomyItem>("/products/styles/", payload),
  deleteStyle: (id: number) => apiClient.delete(`/products/styles/${id}/`),

  getDiamondTypes: async () => {
    const res = await apiClient.get("/products/diamond-types/");
    return { ...res, data: normalizeListResponse<AdminTaxonomyItem>(res) };
  },
  createDiamondType: (payload: { name: string; slug?: string }) => apiClient.post<AdminTaxonomyItem>("/products/diamond-types/", payload),
  deleteDiamondType: (id: number) => apiClient.delete(`/products/diamond-types/${id}/`),

  getBrands: async () => {
    const res = await apiClient.get("/products/brands/");
    return { ...res, data: normalizeListResponse<AdminTaxonomyItem>(res) };
  },
  createBrand: (payload: { name: string; slug?: string }) => apiClient.post<AdminTaxonomyItem>("/products/brands/", payload),
  deleteBrand: (id: number) => apiClient.delete(`/products/brands/${id}/`),

  getCollections: async () => {
    const res = await apiClient.get("/products/collections/");
    return { ...res, data: normalizeListResponse<AdminTaxonomyItem>(res) };
  },
  createCollection: (payload: { name: string; slug?: string; description?: string }) => apiClient.post<AdminTaxonomyItem>("/products/collections/", payload),
  deleteCollection: (id: number) => apiClient.delete(`/products/collections/${id}/`),

  // --- Orders ---
  getOrders: (params?: { status?: string; search?: string }) =>
    apiClient.get<{ count: number; results: AdminOrder[] } | AdminOrder[]>("/orders/", { params }),

  updateOrderStatus: (id: number, status: string) =>
    apiClient.patch<AdminOrder>(`/orders/${id}/`, { status }),

  // --- Carts ---
  getCarts: (params?: { search?: string }) =>
    apiClient.get<{ count: number; results: AdminCart[] } | AdminCart[]>("/orders/admin/carts/", { params }),

  // --- Users ---
  getUsers: (params?: { search?: string }) =>
    apiClient.get<{ count: number; results: AdminUser[] } | AdminUser[]>("/auth/admin/users/", { params }),

  updateUser: (id: number, payload: Partial<{ is_staff: boolean; phone_number: string }>) =>
    apiClient.patch<AdminUser>(`/auth/admin/users/${id}/`, payload),
};
