"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Film,
  Gem,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminProduct, AdminCategory, AdminSubcategory, AdminTaxonomyItem } from "@/lib/api/admin";

const SUBCATEGORIES_MAP: Record<string, string[]> = {
  "engagement-rings": ["HALO", "SHOULDER SET", "SOLITAIRE", "TRIOLOGY", "UNDER HALO"],
  "eternity-bands": ["Channel Set", "Grain (Prong) Set", "Mirco Set", "Pave Set", "Scallop Set", "Station Set", "Vintage", "ET Bands"],
  "wedding-bands": ["Diamond Bands", "Plain Ladies Bands", "Plain Gens Bands", "Pattern Plain Bands"],
  "rings": ["Engagement Rings", "Eternity Bands", "Wedding Bands", "Solitaire Rings"],
  "earrings": ["Solitaire Studs", "Hoop Earrings", "Drop Earrings"],
  "necklaces": ["Pendant Necklaces", "Chains", "Solitaire Necklaces"],
  "bracelets": ["Tennis Bracelets", "Bangles", "Chain Bracelets"],
};

const CATEGORY_OPTIONS = [
  { value: "engagement-rings", label: "Engagement Rings" },
  { value: "eternity-bands", label: "Eternity Bands" },
  { value: "wedding-bands", label: "Wedding Bands" },
  { value: "rings", label: "Rings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "bracelets", label: "Bracelets" },
  { value: "earrings", label: "Earrings" },
];

const EARRING_TYPE_OPTIONS = [
  { value: "", label: "Not applicable" },
  { value: "studs", label: "Studs" },
  { value: "hoops", label: "Hoops" },
  { value: "drops", label: "Drops" },
  { value: "huggies", label: "Huggies" },
  { value: "climbers", label: "Climbers" },
  { value: "chandelier", label: "Chandelier" },
];

const NECKLACE_STYLE_OPTIONS = [
  { value: "", label: "Not applicable" },
  { value: "pendant", label: "Pendant" },
  { value: "chain", label: "Chain" },
  { value: "choker", label: "Choker" },
  { value: "collar", label: "Collar" },
  { value: "station", label: "Station" },
  { value: "lariat", label: "Lariat" },
  { value: "tennis", label: "Tennis" },
];

const BRACELET_TYPE_OPTIONS = [
  { value: "", label: "Not applicable" },
  { value: "bangle", label: "Bangle" },
  { value: "tennis", label: "Tennis" },
  { value: "chain", label: "Chain" },
  { value: "cuff", label: "Cuff" },
  { value: "charm", label: "Charm" },
  { value: "link", label: "Link" },
];

const AVAILABILITY_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "on_request", label: "On Request" },
];

type ProductApiResponse = AdminProduct | { data?: AdminProduct };

function getProductFromResponse(response: ProductApiResponse): AdminProduct | null {
  if (Object.prototype.hasOwnProperty.call(response, "data")) {
    return (response as { data?: AdminProduct }).data ?? null;
  }
  return response as AdminProduct;
}

function getProductList(response: unknown): AdminProduct[] {
  if (Array.isArray(response)) return response as AdminProduct[];
  if (response && typeof response === "object") {
    const record = response as { data?: unknown; results?: unknown };
    if (Array.isArray(record.data)) return record.data as AdminProduct[];
    if (Array.isArray(record.results)) return record.results as AdminProduct[];
  }
  return [];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [, setCategories] = useState<AdminCategory[]>([]);
  const [, setSubcategories] = useState<AdminSubcategory[]>([]);
  const [stylesList, setStylesList] = useState<AdminTaxonomyItem[]>([]);
  const [diamondTypesList, setDiamondTypesList] = useState<AdminTaxonomyItem[]>([]);
  const [brandsList, setBrandsList] = useState<AdminTaxonomyItem[]>([]);
  const [collectionsList, setCollectionsList] = useState<AdminTaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "media" | "variants">("details");
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [variantUploadingIdx, setVariantUploadingIdx] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const variantImageInputRef = useRef<HTMLInputElement>(null);
  const activeVariantIdxRef = useRef<number>(0);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: "",
    sku: "",
    description: "",
    category: "engagement-rings",
    subcategory: "HALO",
    base_price: 0,
    discount_price: null,
    total_stock: 10,
    metal_type: "yellow-gold",
    metal_karat: "18K",
    diamond_cut: "Round Cut",
    diamond_type: null,
    brand: null,
    styles: [],
    collections: [],
    earring_type: "",
    necklace_style: "",
    bracelet_type: "",
    band_fit: "",
    finish: "",
    customisation_available: "no",
    engraving_available: "no",
    gender: "women",
    occasion: "",
    tax_percentage: 0,
    low_stock_threshold: 5,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    is_active: true,
    is_featured: false,
    diamond_spec: {
      carat_weight: "1.00",
      cut_grade: "excellent",
      colour_grade: "F Color",
      clarity_grade: "VS1",
      certification_lab: "GIA",
    },
    images: [],
    variants: [
      {
        sku: "",
        metal_type: "yellow-gold",
        metal_karat: "18K",
        size: "6",
        price: 0,
        stock: 5,
        is_active: true,
        is_default: true,
        images: [],
      },
    ],
    video_url: "",
  });

  const generateAutoSku = (categoryName?: string, prodName?: string) => {
    const catCode = (categoryName || formData.category || "JWL").substring(0, 3).toUpperCase();
    const namePrefix = prodName ? prodName.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() : "";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `GAMA-${catCode}${namePrefix ? "-" + namePrefix : ""}-${randNum}`;
  };

  const getFrontendLocations = () => {
    const locations: string[] = [];
    const cat = (formData.category || "engagement-rings").toLowerCase();
    const sub = (formData.subcategory || "").toUpperCase();
    const cut = (formData.diamond_cut || "Round Cut").toLowerCase();

    if (cat === "engagement-rings" || cat === "rings") {
      locations.push(`/rings`);

      // Sub-category style page
      if (sub.includes("TRIOLOGY") || sub.includes("THREE")) {
        locations.push(`/rings?style=three-stone (Trilogy Page)`);
      } else if (sub.includes("HALO")) {
        locations.push(`/rings?style=halo (Halo Page)`);
      } else if (sub.includes("SOLITAIRE")) {
        locations.push(`/rings?style=solitaire (Solitaire Page)`);
      } else if (sub.includes("SHOULDER")) {
        locations.push(`/rings?style=diamond-shoulder (Shoulder Set Page)`);
      } else if (sub.includes("UNDER HALO")) {
        locations.push(`/rings?style=under-halo (Under Halo Page)`);
      }

      // Shop by Shape page
      if (cut.includes("round")) {
        locations.push(`/rings/round-brilliant (Round Shape Page)`);
      } else if (cut.includes("princess")) {
        locations.push(`/rings/princess (Princess Shape Page)`);
      } else if (cut.includes("oval")) {
        locations.push(`/rings/oval (Oval Shape Page)`);
      } else if (cut.includes("pear")) {
        locations.push(`/rings/pear (Pear Shape Page)`);
      } else if (cut.includes("cushion")) {
        locations.push(`/rings/cushion (Cushion Shape Page)`);
      } else if (cut.includes("emerald")) {
        locations.push(`/rings/emerald-cut (Emerald Shape Page)`);
      } else if (cut.includes("radiant")) {
        locations.push(`/rings/radiant (Radiant Shape Page)`);
      } else if (cut.includes("marquise")) {
        locations.push(`/rings/marquise (Marquise Shape Page)`);
      }
    } else if (cat === "eternity-bands") {
      locations.push(`/eternity`);
    } else if (cat === "wedding-bands") {
      locations.push(`/wedding`);
    } else if (cat === "earrings") {
      locations.push(`/earrings`);
    } else if (cat === "necklaces") {
      locations.push(`/necklaces`);
    } else if (cat === "bracelets") {
      locations.push(`/bracelets`);
    }

    if (formData.is_featured) {
      locations.push(`⭐ Homepage Carousel`);
    }

    return locations;
  };



  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes, subRes, stylesRes, dtRes, brandsRes, collectionsRes] = await Promise.allSettled([
        adminApi.getProducts({
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          limit: 100,
        }),
        adminApi.getCategories(),
        adminApi.getSubcategories(),
        adminApi.getStyles(),
        adminApi.getDiamondTypes(),
        adminApi.getBrands(),
        adminApi.getCollections(),
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts(getProductList(prodRes.value.data));
      }
      if (catRes.status === "fulfilled") setCategories(Array.isArray(catRes.value.data) ? catRes.value.data : []);
      if (subRes.status === "fulfilled") setSubcategories(Array.isArray(subRes.value.data) ? subRes.value.data : []);
      if (stylesRes.status === "fulfilled") setStylesList(Array.isArray(stylesRes.value.data) ? stylesRes.value.data : []);
      if (dtRes.status === "fulfilled") setDiamondTypesList(Array.isArray(dtRes.value.data) ? dtRes.value.data : []);
      if (brandsRes.status === "fulfilled") setBrandsList(Array.isArray(brandsRes.value.data) ? brandsRes.value.data : []);
      if (collectionsRes.status === "fulfilled") setCollectionsList(Array.isArray(collectionsRes.value.data) ? collectionsRes.value.data : []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [categoryFilter, statusFilter]);

  const handleImageUpload = async (files: FileList | File[]) => {
    setUploadingImages(true);
    try {
      const fileArr = Array.from(files);
      const validFiles = fileArr.filter((f) => f.type.startsWith("image/"));
      if (validFiles.length === 0) {
        toast.error("Please select valid image files");
        return;
      }
      for (const file of validFiles) {
        const res = await adminApi.uploadMedia(file);
        const url = res.data.url;
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), { url, isPrimary: (prev.images || []).length === 0 }],
        }));
        toast.success(`Uploaded ${file.name}`);
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVariantImageUpload = async (files: FileList | File[], variantIndex: number) => {
    setVariantUploadingIdx(variantIndex);
    try {
      const fileArr = Array.from(files);
      const validFiles = fileArr.filter((f) => f.type.startsWith("image/"));
      if (validFiles.length === 0) {
        toast.error("Please select valid image files");
        return;
      }
      for (const file of validFiles) {
        const res = await adminApi.uploadMedia(file);
        const url = res.data.url;
        setFormData((prev) => {
          const updatedVariants = [...(prev.variants || [])];
          const currVariant = updatedVariants[variantIndex] || {};
          const currImages = currVariant.images || [];
          updatedVariants[variantIndex] = {
            ...currVariant,
            images: [...currImages, { url, isPrimary: currImages.length === 0 }],
          };
          return { ...prev, variants: updatedVariants };
        });
        toast.success(`Uploaded variant image: ${file.name}`);
      }
    } catch (err) {
      toast.error("Variant image upload failed");
    } finally {
      setVariantUploadingIdx(null);
    }
  };

  const handleVideoUpload = async (files: FileList | File[]) => {
    setUploadingVideo(true);
    try {
      const file = Array.from(files).find((f) => f.type.startsWith("video/"));
      if (!file) {
        toast.error("Please select a valid video file");
        return;
      }
      const res = await adminApi.uploadMedia(file);
      setFormData((prev) => ({ ...prev, video_url: res.data.url }));
      toast.success(`Video uploaded: ${file.name}`);
    } catch (err) {
      toast.error("Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  };

  const bulkGenerateVariants = () => {
    const baseSku = formData.sku || generateAutoSku(formData.category, formData.name);
    const metalsConfig = [
      { metal_type: "silver", metal_karat: "925Ag", price: 201.97, metal_weight_grams: 4.0 },
      { metal_type: "yellow-gold", metal_karat: "9K", price: 954.36, metal_weight_grams: 4.55 },
      { metal_type: "yellow-gold", metal_karat: "10K", price: 1050.0, metal_weight_grams: 4.62 },
      { metal_type: "white-gold", metal_karat: "14K", price: 1200.0, metal_weight_grams: 5.2 },
      { metal_type: "yellow-gold", metal_karat: "18K", price: 1450.0, metal_weight_grams: 5.97 },
      { metal_type: "platinum", metal_karat: "950Pt", price: 1359.97, metal_weight_grams: 8.28 },
    ];

    const generated = metalsConfig.map((m, idx) => ({
      sku: `${baseSku}-${m.metal_karat}`,
      metal_type: m.metal_type,
      metal_karat: m.metal_karat,
      metal_weight_grams: m.metal_weight_grams,
      size: "6",
      price: m.price,
      stock: 10,
      is_active: true,
      is_default: idx === 0,
      images: [],
    }));

    setFormData((prev) => ({
      ...prev,
      sku: baseSku,
      variants: generated,
    }));
    toast.success("Generated 6 metal variants (Silver, 9K, 10K, 14K, 18K, Platinum)");
  };

  const [showAdvanced4Cs, setShowAdvanced4Cs] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    const initialSingleVariant = [
      {
        sku: "",
        metal_type: "yellow-gold",
        metal_karat: "18K",
        metal_weight_grams: null,
        price: null,
        stock: 10,
        is_active: true,
        is_default: true,
        images: [],
      },
    ];
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "engagement-rings",
      subcategory: "",
      base_price: 0,
      total_stock: 10,
      metal_type: "yellow-gold",
      metal_karat: "18K",
      diamond_cut: "Round Cut",
      diamond_type: null,
      brand: null,
      styles: [],
      collections: [],
      earring_type: "",
      necklace_style: "",
      bracelet_type: "",
      band_fit: "",
      finish: "",
      customisation_available: "no",
      engraving_available: "no",
      gender: "women",
      occasion: "",
      tax_percentage: 0,
      low_stock_threshold: 5,
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      is_active: true,
      is_featured: false,
      diamond_spec: {
        diamond_origin: "lab_grown",
        center_carat_weight: "",
        side_carat_weight: "",
        total_carat_weight: "",
        carat_weight: "",
        diamond_value: "",
        cut_grade: "excellent",
        colour_grade: "",
        clarity_grade: "VS1",
        certification_lab: "GIA",
      },
      images: [],
      variants: initialSingleVariant,
      video_url: "",
    });
    setActiveTab("details");
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      base_price: product.base_price || product.basePrice || 0,
      discount_price: product.discount_price ?? product.discountPrice ?? null,
      total_stock: product.total_stock ?? product.totalStock ?? 0,
      seo_title: product.seo_title ?? product.seoTitle ?? "",
      seo_description: product.seo_description ?? product.seoDescription ?? "",
      seo_keywords: product.seo_keywords ?? product.seoKeywords ?? "",
      diamond_spec: product.diamond_spec || {
        carat_weight: "1.00",
        cut_grade: "excellent",
        colour_grade: "F Color",
        clarity_grade: "VS1",
        certification_lab: "GIA",
      },
      images: product.images && product.images.length > 0 ? product.images : [],
      variants: product.variants && product.variants.length > 0 ? product.variants : [],
      video_url: product.video_url || product.videoUrl || "",
    });
    setActiveTab("details");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const parseDecimalOrNull = (val: unknown): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return isNaN(val) ? null : val;
    const str = String(val).trim();
    if (!str) return null;
    const match = str.match(/[\d.]+/);
    if (!match) return null;
    const num = parseFloat(match[0]);
    return isNaN(num) ? null : num;
  };

  const mapCutToBackendChoice = (cut: string): string => {
    if (!cut) return "round";
    const c = cut.toLowerCase().trim();
    if (c.includes("oval")) return "oval";
    if (c.includes("princess")) return "princess";
    if (c.includes("pear")) return "pear";
    if (c.includes("cushion")) return "cushion";
    if (c.includes("emerald")) return "emerald-cut";
    if (c.includes("radiant")) return "radiant";
    if (c.includes("marquise")) return "marquise";
    if (c.includes("asscher")) return "asscher";
    if (c.includes("heart")) return "heart";
    if (c.includes("round")) return "round";
    return c;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const rawSpec = formData.diamond_spec || {};
      const centerCarat = parseDecimalOrNull(rawSpec.center_carat_weight);
      const sideCarat = parseDecimalOrNull(rawSpec.side_carat_weight);
      const totalCarat = parseDecimalOrNull(rawSpec.total_carat_weight) || parseDecimalOrNull(rawSpec.carat_weight) || (centerCarat ? centerCarat + (sideCarat || 0) : 1.0);

      const cleanedDiamondSpec = {
        diamond_origin: rawSpec.diamond_origin || "lab_grown",
        carat_weight: totalCarat || 1.0,
        center_carat_weight: centerCarat,
        side_carat_weight: sideCarat,
        total_carat_weight: totalCarat,
        cut_grade: rawSpec.cut_grade || "excellent",
        colour_grade: (rawSpec.colour_grade || "F").replace(/\s+color/i, "").trim().substring(0, 2).toUpperCase() || "F",
        clarity_grade: rawSpec.clarity_grade || "VS1",
        certification_lab: rawSpec.certification_lab || "GIA",
      };

      const cleanedVariants = (formData.variants || []).map((v, i) => ({
        ...v,
        sku: v.sku || `${formData.sku || "PROD"}-${v.metal_karat || i + 1}`,
        price: typeof v.price === "number" ? v.price : parseFloat(String(v.price || "")) || 0,
        metal_weight_grams: parseDecimalOrNull(v.metal_weight_grams),
        stock: v.stock ?? 10,
        is_active: v.is_active ?? true,
        is_default: v.is_default ?? i === 0,
      }));

      const payload = {
        ...formData,
        sku: formData.sku || generateAutoSku(formData.category, formData.name),
        diamond_cut: mapCutToBackendChoice(formData.diamond_cut || "round"),
        tax_percentage: parseDecimalOrNull(formData.tax_percentage) || 0,
        low_stock_threshold: formData.low_stock_threshold ?? 5,
        diamond_spec: cleanedDiamondSpec,
        variants: cleanedVariants,
        base_price: cleanedVariants.find((v) => v.is_default)?.price || formData.base_price || 0,
      };

      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id, payload);
        const savedItem = getProductFromResponse(res.data as ProductApiResponse) || ({ ...editingProduct, ...payload } as AdminProduct);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...savedItem } : p)));
        toast.success("Product updated successfully");
      } else {
        const res = await adminApi.createProduct(payload);
        const savedItem = getProductFromResponse(res.data as ProductApiResponse);
        if (savedItem && (savedItem.id || savedItem.slug)) {
          setProducts((prev) => [savedItem, ...prev]);
        }
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const responseData = err && typeof err === "object" && "response" in err
        ? (err.response as { data?: unknown }).data
        : null;
      const msg = responseData ? JSON.stringify(responseData) : "Failed to save product";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const formInputClass = "admin-input";
  const formSelectClass = "admin-select";

  return (
    <div className="admin-space-y-6">
      {/* Header Controls */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Product Catalog</h2>
          <p className="admin-section-subtitle">
            Manage fine jewellery items, 4Cs diamond specs, metals, pricing, and stock levels.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-gold">
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card admin-flex-between flex-col sm:flex-row gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadData();
          }}
          className="flex-1 w-full admin-flex admin-items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input admin-input-with-icon"
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-ghost">
            Search
          </button>
        </form>

        <div className="admin-flex admin-items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Categories</option>
            <option value="engagement-rings">Engagement Rings</option>
            <option value="eternity-bands">Eternity Bands</option>
            <option value="wedding-bands">Wedding Bands</option>
            <option value="rings">Rings</option>
            <option value="necklaces">Necklaces</option>
            <option value="bracelets">Bracelets</option>
            <option value="earrings">Earrings</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Disabled</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading py-16">
            <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
            <span>Loading product inventory...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty py-16">
            <Package />
            <p>No products found in catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => {
                  const img = prod.images?.[0]?.url || prod.thumbnail;
                  const defaultVar = prod.variants?.find((v) => v.is_default || v.isDefault) || prod.variants?.[0];
                  const rawPrice = defaultVar?.price ?? prod.base_price ?? prod.basePrice;
                  const priceNum = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice || 0)) || 0;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className="admin-flex admin-items-center admin-gap-3">
                          {img ? (
                            <img src={img} alt={prod.name} className="w-10 h-10 object-cover border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="admin-font-semibold admin-text-white">{prod.name}</p>
                            <p className="admin-text-muted admin-text-xs capitalize">
                              {defaultVar?.metal_karat ? `${defaultVar.metal_karat} ${defaultVar.metal_type?.replace("-", " ")}` : prod.metal_type?.replace("-", " ") || "Custom Metal"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="font-mono admin-text-muted">{prod.sku}</td>
                      <td className="capitalize">{prod.category?.replace("-", " ")}</td>
                      <td className="admin-font-semibold admin-text-gold">
                        £{priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`admin-font-medium ${prod.total_stock <= 5 ? "text-amber-400" : "admin-text-white"}`}>
                          {prod.total_stock || 0} pcs
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${prod.is_active ? "green" : "rose"}`}>
                          {prod.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="admin-flex admin-items-center justify-end admin-gap-2">
                          <button onClick={() => openEditModal(prod)} className="admin-btn admin-btn-ghost p-1.5">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(prod.id)} className="admin-btn admin-btn-danger p-1.5">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Addition & Editing Modal - Native Admin Design System */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-xl admin-space-y-6">

            {/* Modal Header */}
            <div className="admin-modal-header">
              <div>
                <p className="admin-modal-label">Inventory Management</p>
                <h3 className="admin-modal-title">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="admin-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-filter-tabs flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`admin-filter-tab text-xs py-2 px-4 ${
                  activeTab === "details" ? "active" : ""
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Product & Metal Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`admin-filter-tab text-xs py-2 px-4 ${
                  activeTab === "media" ? "active" : ""
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos & Media ({formData.images?.length || 0})</span>
              </button>
            </div>

            {/* Form */}
            <form id="product-form" onSubmit={handleSaveProduct} className="admin-space-y-6">
              
              {/* TAB 1: PRODUCT & METALS MATRIX */}
              {activeTab === "details" && (
                <div className="admin-space-y-6">
                  {/* Basic Identification */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5">
                    <div className="admin-flex-between pb-2 border-b border-white/10">
                      <div>
                        <p className="admin-info-label text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">Product Identity</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Name, SKU, category placement, stock, and publish controls.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs admin-text-white font-medium">
                          <input
                            type="checkbox"
                            checked={formData.is_active ?? true}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="accent-[#c6a45f] w-4 h-4"
                          />
                          <span>Active</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs admin-text-white font-medium">
                          <input
                            type="checkbox"
                            checked={formData.is_featured ?? false}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="accent-[#c6a45f] w-4 h-4"
                          />
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#c6a45f]" /> Featured
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-3">
                      <div className="admin-flex-between mb-1">
                        <label className="admin-label mb-0">Style No. / SKU *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sku: generateAutoSku(formData.category, formData.name) })}
                          className="admin-link-gold text-[10px]"
                        >
                          Auto-SKU
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.sku || ""}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase().replace(/\s+/g, "-") })}
                        placeholder="e.g. BR826-01"
                        className={`${formInputClass} font-mono uppercase`}
                      />
                    </div>

                      <div className="lg:col-span-5">
                        <label className="admin-label">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Trilogy Three Stone Engagement Ring"
                          className={formInputClass}
                        />
                      </div>

                      <div className="lg:col-span-2">
                      <label className="admin-label">Category *</label>
                      <select
                        value={formData.category || "engagement-rings"}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          const subList = SUBCATEGORIES_MAP[newCat] || [];
                          setFormData((prev) => ({
                            ...prev,
                            category: newCat,
                            subcategory: subList[0] || "",
                            sku: prev.sku || generateAutoSku(newCat, prev.name),
                          }));
                        }}
                        className={formSelectClass}
                      >
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                      <div className="lg:col-span-2">
                      <label className="admin-label">Sub Category</label>
                      <select
                        value={formData.subcategory || ""}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className={formSelectClass}
                      >
                        <option value="">Select Sub Category</option>
                        {(SUBCATEGORIES_MAP[formData.category || "engagement-rings"] || []).map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                      <div className="lg:col-span-3">
                      <label className="admin-label">Total Stock Qty (Pcs)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.total_stock ?? 10}
                        onChange={(e) => setFormData({ ...formData, total_stock: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 10"
                        className={formInputClass}
                      />
                    </div>

                      <div className="lg:col-span-3">
                        <label className="admin-label">Low Stock Alert</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.low_stock_threshold ?? 5}
                          onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
                          placeholder="e.g. 5"
                          className={formInputClass}
                        />
                      </div>

                      <div className="lg:col-span-3">
                        <label className="admin-label">Tax Percentage</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.tax_percentage ?? 0}
                          onChange={(e) => setFormData({ ...formData, tax_percentage: e.target.value })}
                          placeholder="e.g. 0"
                          className={formInputClass}
                        />
                      </div>

                      <div className="lg:col-span-3">
                        <label className="admin-label">Target Gender</label>
                        <select
                          value={formData.gender || "women"}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className={formSelectClass}
                        >
                          <option value="women">Women</option>
                          <option value="men">Men</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>

                      <div className="lg:col-span-3">
                        <label className="admin-label">Occasion</label>
                        <input
                          type="text"
                          value={formData.occasion || ""}
                          onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                          placeholder="e.g. Bridal, Anniversary, Daily Wear"
                          className={formInputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Merchandising */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5">
                    <div className="pb-2 border-b border-white/10">
                      <p className="admin-info-label text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">Merchandising</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Tag the item for storefront browsing, campaigns, brands, and diamond type filters.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Diamond Type</label>
                        <select
                          value={formData.diamond_type ?? ""}
                          onChange={(e) => setFormData({ ...formData, diamond_type: e.target.value ? Number(e.target.value) : null })}
                          className={formSelectClass}
                        >
                          <option value="">No diamond type</option>
                          {diamondTypesList.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Brand</label>
                        <select
                          value={formData.brand ?? ""}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value ? Number(e.target.value) : null })}
                          className={formSelectClass}
                        >
                          <option value="">House / unbranded</option>
                          {brandsList.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Styles</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-white/10 bg-black/30 p-3">
                          {stylesList.length === 0 ? (
                            <span className="text-[11px] text-gray-500">No styles created yet.</span>
                          ) : (
                            stylesList.map((item) => (
                              <label key={item.id} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(formData.styles || []).includes(item.id)}
                                  onChange={(e) => {
                                    const selected = new Set(formData.styles || []);
                                    if (e.target.checked) selected.add(item.id);
                                    else selected.delete(item.id);
                                    setFormData({ ...formData, styles: Array.from(selected) });
                                  }}
                                  className="accent-[#c6a45f]"
                                />
                                <span>{item.name}</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Collections</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-white/10 bg-black/30 p-3">
                          {collectionsList.length === 0 ? (
                            <span className="text-[11px] text-gray-500">No collections created yet.</span>
                          ) : (
                            collectionsList.map((item) => (
                              <label key={item.id} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(formData.collections || []).includes(item.id)}
                                  onChange={(e) => {
                                    const selected = new Set(formData.collections || []);
                                    if (e.target.checked) selected.add(item.id);
                                    else selected.delete(item.id);
                                    setFormData({ ...formData, collections: Array.from(selected) });
                                  }}
                                  className="accent-[#c6a45f]"
                                />
                                <span>{item.name}</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diamond Details Card */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5 my-2">
                    <div className="admin-flex-between mb-2">
                      <p className="admin-info-label flex items-center gap-2 text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">
                        <Gem className="w-4 h-4" /> Diamond Details & Carat Weights
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAdvanced4Cs(!showAdvanced4Cs)}
                        className="text-xs text-gray-400 hover:text-[#c6a45f] underline flex items-center gap-1 transition-colors"
                      >
                        {showAdvanced4Cs ? "Hide 4Cs Specs" : "+ Optional 4Cs Specs (Cut, Color, Clarity)"}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="admin-label">Diamond Origin</label>
                        <select
                          value={formData.diamond_spec?.diamond_origin || "lab_grown"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diamond_spec: { ...formData.diamond_spec, diamond_origin: e.target.value },
                            })
                          }
                          className={formSelectClass}
                        >
                          <option value="lab_grown">Lab Grown</option>
                          <option value="natural">Natural</option>
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Center Stone</label>
                        <input
                          type="text"
                          value={formData.diamond_spec?.center_carat_weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diamond_spec: { ...formData.diamond_spec, center_carat_weight: e.target.value },
                            })
                          }
                          placeholder="e.g. 2.5 ct"
                          className={formInputClass}
                        />
                      </div>

                      <div>
                        <label className="admin-label">Melee / Side Stones</label>
                        <input
                          type="text"
                          value={formData.diamond_spec?.side_carat_weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diamond_spec: { ...formData.diamond_spec, side_carat_weight: e.target.value },
                            })
                          }
                          placeholder="e.g. 0.5x2 = 1ct"
                          className={formInputClass}
                        />
                      </div>

                      <div>
                        <label className="admin-label">Total Diamond Wt</label>
                        <input
                          type="text"
                          value={formData.diamond_spec?.total_carat_weight || formData.diamond_spec?.carat_weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diamond_spec: {
                                ...formData.diamond_spec,
                                carat_weight: e.target.value,
                                total_carat_weight: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. 3.5 ct"
                          className={formInputClass}
                        />
                      </div>

                      <div>
                        <label className="admin-label">Diamond Value ($)</label>
                        <input
                          type="text"
                          value={formData.diamond_spec?.diamond_value || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diamond_spec: { ...formData.diamond_spec, diamond_value: e.target.value },
                            })
                          }
                          placeholder="e.g. $625.00"
                          className={`${formInputClass} font-mono text-[#c6a45f]`}
                        />
                      </div>
                    </div>

                    {/* Advanced 4Cs Collapsible */}
                    {showAdvanced4Cs && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/5 animate-fadeIn">
                        <div>
                          <label className="admin-label">Cut Grade</label>
                          <select
                            value={formData.diamond_spec?.cut_grade || "excellent"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                diamond_spec: { ...formData.diamond_spec, cut_grade: e.target.value },
                              })
                            }
                            className={formSelectClass}
                          >
                            <option value="excellent">Excellent</option>
                            <option value="very_good">Very Good</option>
                            <option value="good">Good</option>
                          </select>
                        </div>

                        <div>
                          <label className="admin-label">Colour Grade</label>
                          <input
                            type="text"
                            value={formData.diamond_spec?.colour_grade || "F Color"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                diamond_spec: { ...formData.diamond_spec, colour_grade: e.target.value },
                              })
                            }
                            className={formInputClass}
                          />
                        </div>

                        <div>
                          <label className="admin-label">Clarity Grade</label>
                          <select
                            value={formData.diamond_spec?.clarity_grade || "VS1"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                diamond_spec: { ...formData.diamond_spec, clarity_grade: e.target.value },
                              })
                            }
                            className={formSelectClass}
                          >
                            <option value="FL">FL</option>
                            <option value="IF">IF</option>
                            <option value="VVS1">VVS1</option>
                            <option value="VVS2">VVS2</option>
                            <option value="VS1">VS1</option>
                            <option value="VS2">VS2</option>
                            <option value="SI1">SI1</option>
                          </select>
                        </div>

                        <div>
                          <label className="admin-label">Cert Lab</label>
                          <select
                            value={formData.diamond_spec?.certification_lab || "GIA"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                diamond_spec: { ...formData.diamond_spec, certification_lab: e.target.value },
                              })
                            }
                            className={formSelectClass}
                          >
                            <option value="GIA">GIA</option>
                            <option value="IGI">IGI</option>
                            <option value="none">Uncertified</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input for Variant Image Upload */}
                  <input
                    ref={variantImageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleVariantImageUpload(e.target.files, activeVariantIdxRef.current);
                      }
                      e.target.value = "";
                    }}
                  />

                  {/* Metal Options & Pricing Matrix */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5 my-6">
                    <div className="admin-flex-between pb-2 border-b border-white/10">
                      <div>
                        <p className="admin-info-label text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">Metal Options & Pricing</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Set metal weights, prices, variant photos, or add/delete metal options.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const current = formData.variants || [];
                            const baseSku = formData.sku || generateAutoSku();
                            setFormData({
                              ...formData,
                              variants: [
                                ...current,
                                {
                                  sku: `${baseSku}-VAR-${current.length + 1}`,
                                  metal_type: "yellow-gold",
                                  metal_karat: "18K",
                                  metal_weight_grams: 5.0,
                                  price: 1000,
                                  stock: 10,
                                  is_active: true,
                                  is_default: current.length === 0,
                                  images: [],
                                },
                              ],
                            });
                          }}
                          className="admin-btn admin-btn-gold text-xs py-1.5 px-3"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Metal Option</span>
                        </button>
                        <button
                          type="button"
                          onClick={bulkGenerateVariants}
                          className="admin-btn admin-btn-outline text-xs py-1.5 px-3"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#c6a45f]" />
                          <span>Reset Standard Metals</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
                            <th className="py-3 px-4">Metal Karat</th>
                            <th className="py-3 px-4">Metal Type</th>
                            <th className="py-3 px-4">Metal Wt (g)</th>
                            <th className="py-3 px-4">Total Price ($ / £)</th>
                            <th className="py-3 px-4">Stock Qty</th>
                            <th className="py-3 px-4">Variant Photos</th>
                            <th className="py-3 px-4 text-center">Default</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(formData.variants || []).map((variant, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-3 px-4">
                                <select
                                  value={variant.metal_karat || "18K"}
                                  onChange={(e) => {
                                    const updated = [...(formData.variants || [])];
                                    updated[idx] = { ...updated[idx], metal_karat: e.target.value };
                                    setFormData({ ...formData, variants: updated });
                                  }}
                                  className="bg-black/60 border border-white/10 text-[#c6a45f] font-mono font-bold text-xs px-2.5 py-1.5 rounded"
                                >
                                  <option value="9K">9K</option>
                                  <option value="10K">10K</option>
                                  <option value="14K">14K</option>
                                  <option value="18K">18K</option>
                                  <option value="22K">22K</option>
                                  <option value="24K">24K</option>
                                  <option value="950Pt">950Pt</option>
                                  <option value="925Ag">925Ag</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={variant.metal_type || "yellow-gold"}
                                  onChange={(e) => {
                                    const updated = [...(formData.variants || [])];
                                    updated[idx] = { ...updated[idx], metal_type: e.target.value };
                                    setFormData({ ...formData, variants: updated });
                                  }}
                                  className="bg-black/60 border border-white/10 text-white text-xs px-2.5 py-1.5 rounded"
                                >
                                  <option value="silver">Silver</option>
                                  <option value="yellow-gold">Yellow Gold</option>
                                  <option value="white-gold">White Gold</option>
                                  <option value="rose-gold">Rose Gold</option>
                                  <option value="platinum">Platinum</option>
                                  <option value="two-tone">Two-Tone</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={variant.metal_weight_grams ?? ""}
                                  onChange={(e) => {
                                    const updated = [...(formData.variants || [])];
                                    updated[idx] = {
                                      ...updated[idx],
                                      metal_weight_grams: e.target.value === "" ? null : parseFloat(e.target.value) || null,
                                    };
                                    setFormData({ ...formData, variants: updated });
                                  }}
                                  placeholder="e.g. 5.97g"
                                  className="w-24 bg-black/60 border border-white/10 text-white font-mono text-xs px-2.5 py-1.5 rounded"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={variant.price ?? ""}
                                  onChange={(e) => {
                                    const updated = [...(formData.variants || [])];
                                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
                                    updated[idx] = { ...updated[idx], price: val };
                                    const isDefault = updated[idx].is_default;
                                    setFormData({
                                      ...formData,
                                      base_price: isDefault ? val : formData.base_price,
                                      variants: updated,
                                    });
                                  }}
                                  placeholder="e.g. 1450.00"
                                  className="w-28 bg-black/60 border border-white/10 text-[#c6a45f] font-mono text-xs px-2.5 py-1.5 rounded font-bold"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.stock ?? 10}
                                  onChange={(e) => {
                                    const updated = [...(formData.variants || [])];
                                    updated[idx] = { ...updated[idx], stock: parseInt(e.target.value) || 0 };
                                    setFormData({ ...formData, variants: updated });
                                  }}
                                  placeholder="10"
                                  className="w-20 bg-black/60 border border-white/10 text-white font-mono text-xs px-2.5 py-1.5 rounded"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  {(variant.images || []).map((vImg, vImgIdx) => (
                                    <div key={vImgIdx} className="relative w-7 h-7 border border-white/20 rounded overflow-hidden group">
                                      <img src={vImg.url} alt="Variant" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...(formData.variants || [])];
                                          const currImgs = (updated[idx].images || []).filter((_, i) => i !== vImgIdx);
                                          updated[idx] = { ...updated[idx], images: currImgs };
                                          setFormData({ ...formData, variants: updated });
                                        }}
                                        className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px]"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      activeVariantIdxRef.current = idx;
                                      variantImageInputRef.current?.click();
                                    }}
                                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-[#c6a45f] rounded flex items-center gap-1 transition-colors"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>{variantUploadingIdx === idx ? "..." : "+ Photo"}</span>
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="radio"
                                  name="default_metal_variant"
                                  checked={variant.is_default || false}
                                  onChange={() => {
                                    const updated = (formData.variants || []).map((v, i) => ({
                                      ...v,
                                      is_default: i === idx,
                                    }));
                                    setFormData({
                                      ...formData,
                                      base_price: variant.price || formData.base_price,
                                      variants: updated,
                                    });
                                  }}
                                  className="accent-[#c6a45f]"
                                />
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  disabled={(formData.variants || []).length <= 1}
                                  onClick={() => {
                                    if ((formData.variants || []).length <= 1) return;
                                    const updated = (formData.variants || []).filter((_, i) => i !== idx);
                                    setFormData({ ...formData, variants: updated });
                                  }}
                                  className={(formData.variants || []).length <= 1 ? "text-gray-600 cursor-not-allowed" : "text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded"}
                                  title="Delete Variant"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Jewellery Attributes */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5">
                    <div className="pb-2 border-b border-white/10">
                      <p className="admin-info-label text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">Jewellery Attributes</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Use the fields that apply to the selected category; unused values can stay blank.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="admin-label">Diamond Cut / Shape</label>
                        <select
                          value={formData.diamond_cut || "round"}
                          onChange={(e) => setFormData({ ...formData, diamond_cut: e.target.value })}
                          className={formSelectClass}
                        >
                          <option value="round">Round Cut</option>
                          <option value="princess">Princess</option>
                          <option value="oval">Oval</option>
                          <option value="pear">Pear</option>
                          <option value="cushion">Cushion</option>
                          <option value="emerald-cut">Emerald Cut</option>
                          <option value="radiant">Radiant Cut</option>
                          <option value="marquise">Marquise</option>
                          <option value="asscher">Asscher</option>
                          <option value="heart">Heart</option>
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Earring Type</label>
                        <select
                          value={formData.earring_type || ""}
                          onChange={(e) => setFormData({ ...formData, earring_type: e.target.value })}
                          className={formSelectClass}
                        >
                          {EARRING_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Necklace Style</label>
                        <select
                          value={formData.necklace_style || ""}
                          onChange={(e) => setFormData({ ...formData, necklace_style: e.target.value })}
                          className={formSelectClass}
                        >
                          {NECKLACE_STYLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Bracelet Type</label>
                        <select
                          value={formData.bracelet_type || ""}
                          onChange={(e) => setFormData({ ...formData, bracelet_type: e.target.value })}
                          className={formSelectClass}
                        >
                          {BRACELET_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Band Fit</label>
                        <select
                          value={formData.band_fit || ""}
                          onChange={(e) => setFormData({ ...formData, band_fit: e.target.value })}
                          className={formSelectClass}
                        >
                          <option value="">Not applicable</option>
                          <option value="comfort">Comfort Fit</option>
                          <option value="standard">Standard / Traditional Fit</option>
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Finish</label>
                        <input
                          type="text"
                          value={formData.finish || ""}
                          onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                          placeholder="e.g. Polished, Satin, Hammered"
                          className={formInputClass}
                        />
                      </div>

                      <div>
                        <label className="admin-label">Customisation</label>
                        <select
                          value={formData.customisation_available || "no"}
                          onChange={(e) => setFormData({ ...formData, customisation_available: e.target.value })}
                          className={formSelectClass}
                        >
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Engraving</label>
                        <select
                          value={formData.engraving_available || "no"}
                          onChange={(e) => setFormData({ ...formData, engraving_available: e.target.value })}
                          className={formSelectClass}
                        >
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Description & SEO */}
                  <div className="admin-card bg-black/40 border border-white/10 p-5 sm:p-6 admin-space-y-5">
                    <div className="pb-2 border-b border-white/10">
                      <p className="admin-info-label text-[#c6a45f] text-xs font-semibold uppercase tracking-wider">Description & SEO</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Product copy and optional search metadata for storefront pages.</p>
                    </div>

                    <div>
                      <label className="admin-label">Product Description</label>
                      <textarea
                        rows={4}
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter handcrafted notes, gemstone details, metal finish, sizing notes, or care information..."
                        className="admin-textarea"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">SEO Title</label>
                        <input
                          type="text"
                          value={formData.seo_title || ""}
                          onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                          placeholder="e.g. Oval Diamond Engagement Ring"
                          className={formInputClass}
                        />
                      </div>

                      <div>
                        <label className="admin-label">SEO Keywords</label>
                        <input
                          type="text"
                          value={formData.seo_keywords || ""}
                          onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                          placeholder="diamond ring, lab grown, 18k gold"
                          className={formInputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">SEO Description</label>
                      <textarea
                        rows={3}
                        value={formData.seo_description || ""}
                        onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                        placeholder="Short search result description for this jewellery product..."
                        className="admin-textarea"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & PHOTOS */}
              {activeTab === "media" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photos */}
                  <div className="admin-card admin-space-y-4">
                    <div className="admin-flex-between">
                      <span className="admin-info-label">Main Product Card Photos</span>
                      <span className="admin-text-muted admin-text-xs font-mono">{formData.images?.length || 0} photos</span>
                    </div>

                    {(formData.images || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {formData.images!.map((img, idx) => (
                          <div key={idx} className={`relative border aspect-square bg-black ${img.isPrimary ? "border-[#c6a45f]" : "border-white/10"}`}>
                            <img src={img.url} alt="Photo" className="w-full h-full object-cover" />
                            {img.isPrimary && (
                              <span className="absolute top-1 left-1 bg-[#c6a45f] text-black text-[8px] font-bold px-1 uppercase">Primary</span>
                            )}
                            <div className="absolute top-1 right-1 flex gap-1">
                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (formData.images || []).map((im, i) => ({ ...im, isPrimary: i === idx }));
                                    setFormData({ ...formData, images: updated });
                                  }}
                                  className="w-5 h-5 bg-black/80 text-[#c6a45f] flex items-center justify-center text-[10px]"
                                  title="Set Primary"
                                >★</button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (formData.images || []).filter((_, i) => i !== idx);
                                  setFormData({ ...formData, images: updated });
                                }}
                                className="w-5 h-5 bg-red-600/90 text-white flex items-center justify-center text-xs"
                                title="Delete"
                              >×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="p-8 text-center border border-dashed border-white/20 hover:border-[#c6a45f] bg-white/[0.02] cursor-pointer"
                    >
                      <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) handleImageUpload(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      {uploadingImages ? (
                        <div className="flex items-center justify-center gap-2 text-[#c6a45f] text-xs">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mx-auto mb-2 text-[#c6a45f]" />
                          <p className="text-xs admin-text-white">
                            <span className="text-[#c6a45f]">Click to upload</span> product photos
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Video */}
                  <div className="admin-card admin-space-y-4">
                    <span className="admin-info-label">360° Showcase Video</span>

                    {formData.video_url ? (
                      <div className="relative border border-[#c6a45f]/30 bg-black p-2">
                        <video src={formData.video_url} controls className="w-full max-h-[200px] object-contain" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, video_url: "" })}
                          className="absolute top-3 right-3 p-1 bg-red-600 text-white hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="p-8 text-center border border-dashed border-white/20 hover:border-[#c6a45f] bg-white/[0.02] cursor-pointer"
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) handleVideoUpload(e.target.files);
                            e.target.value = "";
                          }}
                        />
                        {uploadingVideo ? (
                          <div className="flex items-center justify-center gap-2 text-[#c6a45f] text-xs">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Film className="w-6 h-6 mx-auto mb-2 text-[#c6a45f]" />
                            <p className="text-xs admin-text-white">
                              <span className="text-[#c6a45f]">Click to upload</span> 360° video
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Action Footer */}
              <div className="admin-flex admin-items-center justify-between pt-4 border-t border-white/10">
                <div className="admin-space-y-1">
                  <div className="admin-text-muted admin-text-xs font-mono">
                    SKU: {formData.sku || "NO-SKU"} • {(formData.variants || []).length} Variants
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span className="text-[#c6a45f]">Live Placement:</span>
                    {getFrontendLocations().map((loc, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-[9px] text-gray-300">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="admin-flex admin-items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="admin-btn admin-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="admin-btn admin-btn-gold"
                  >
                    {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
