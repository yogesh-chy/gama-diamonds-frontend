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
  Check,
  ChevronRight,
  SlidersHorizontal,
  Info,
  Layers,
  Truck,
  Globe,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminProduct, AdminCategory, AdminSubcategory, AdminTaxonomyItem } from "@/lib/api/admin";

const CATEGORY_OPTIONS = [
  { value: "engagement-rings", label: "Engagement Rings" },
  { value: "wedding-bands", label: "Wedding Bands" },
  { value: "eternity-bands", label: "Eternity Bands" },
  { value: "rings", label: "Rings & Fashion Rings" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "pendants", label: "Pendants" },
  { value: "bracelets", label: "Bracelets" },
  { value: "bangles", label: "Bangles" },
  { value: "other", label: "Other Jewellery" },
];

const METAL_VARIANT_OPTIONS = [
  { code: "SL925", label: "Silver", metal_type: "silver", metal_karat: "925Ag", defaultWeight: "1.70" },
  { code: "YG9", label: "9K Yellow Gold", metal_type: "yellow-gold", metal_karat: "9K", defaultWeight: "1.90" },
  { code: "YG10", label: "10K Yellow Gold", metal_type: "yellow-gold", metal_karat: "10K", defaultWeight: "2.00" },
  { code: "YG14", label: "14K Yellow Gold", metal_type: "yellow-gold", metal_karat: "14K", defaultWeight: "2.30" },
  { code: "YG18", label: "18K Yellow Gold", metal_type: "yellow-gold", metal_karat: "18K", defaultWeight: "2.65" },
  { code: "WG18", label: "18K White Gold", metal_type: "white-gold", metal_karat: "18K", defaultWeight: "2.65" },
  { code: "RG18", label: "18K Rose Gold", metal_type: "rose-gold", metal_karat: "18K", defaultWeight: "2.65" },
  { code: "PT950", label: "Platinum", metal_type: "platinum", metal_karat: "950Pt", defaultWeight: "3.68" },
];

const RING_SIZE_OPTIONS = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"];
const CHAIN_LENGTH_OPTIONS = ['16"', '18"', '20"', '22"', '24"'];
const BRACELET_LENGTH_OPTIONS = ['6.5"', '7"', '7.5"', '8"'];
const BANGLE_SIZE_OPTIONS = ["2.2", "2.4", "2.6", "2.8"];

const CUT_GRADE_OPTIONS = ["excellent", "very_good", "good", "fair"];
const COLOUR_GRADE_OPTIONS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITY_GRADE_OPTIONS = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
const CERT_LAB_OPTIONS = ["GIA", "IGI", "HRD", "EGL", "none"];
const DIAMOND_SHAPE_OPTIONS = [
  "round", "princess", "cushion", "oval", "pear", "emerald-cut", "radiant", "marquise", "asscher", "heart"
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

type ModalTab = "basic" | "specs" | "diamonds" | "variants" | "media" | "extra";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [subcategories, setSubcategories] = useState<AdminSubcategory[]>([]);
  const [stylesList, setStylesList] = useState<AdminTaxonomyItem[]>([]);
  const [diamondTypesList, setDiamondTypesList] = useState<AdminTaxonomyItem[]>([]);
  const [brandsList, setBrandsList] = useState<AdminTaxonomyItem[]>([]);
  const [collectionsList, setCollectionsList] = useState<AdminTaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("basic");
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [variantUploadingIdx, setVariantUploadingIdx] = useState<number | null>(null);

  // Variant Matrix Generator Selection
  const [selectedVariantMetals, setSelectedVariantMetals] = useState<string[]>(["YG9", "YG10", "YG14", "YG18", "PT950"]);
  const [selectedVariantSizes, setSelectedVariantSizes] = useState<string[]>(["6", "7", "8"]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: "",
    slug: "",
    sku: "",
    product_code: "",
    internal_reference: "",
    description: "",
    category: "engagement-rings",
    subcategory: "",
    base_price: 1500,
    discount_price: null,
    total_stock: 10,
    metal_type: "yellow-gold",
    metal_karat: "18K",
    diamond_cut: "round",
    diamond_type: null,
    brand: null,
    styles: [],
    collections: [],
    related_products: [],
    ring_type: "Engagement Ring",
    ring_style: "Solitaire",
    ring_shape: "Round Brilliant",
    band_style: "Classic",
    band_fit: "comfort",
    band_width: "2.0mm",
    ring_profile: "High Set",
    ring_finish: "Polished",
    ring_thickness: "1.8mm",
    resizable: "yes",
    earring_type: "studs",
    earring_style: "Classic Stud",
    closure_type: "Push Back",
    drop_length: "",
    earring_width: "",
    earring_height: "",
    necklace_type: "pendant",
    necklace_style: "pendant",
    chain_type: "Box Chain",
    chain_length: '18"',
    pendant_included: "yes",
    pendant_type: "Solitaire",
    pendant_shape: "Round",
    pendant_height: "",
    pendant_width: "",
    pendant_depth: "",
    chain_included: "yes",
    clasp_type: "Lobster",
    bracelet_type: "tennis",
    bracelet_style: "Tennis Bracelet",
    bracelet_length: '7"',
    bracelet_width: "",
    bracelet_thickness: "",
    bangle_type: "Solid",
    inner_diameter: "",
    bangle_width: "",
    bangle_thickness: "",
    opening_type: "Hinged",
    bangle_size: "2.4",
    adjustable: "no",
    gemstone_included: "no",
    gemstone_type: "",
    gemstone_shape: "",
    gemstone_colour: "",
    gemstone_carat_weight: null,
    gemstone_count: null,
    gemstone_origin: "",
    height: "",
    width: "",
    length: "",
    depth: "",
    thickness: "",
    weight: null,
    finish: "Polished",
    customisation_available: "no",
    engraving_available: "no",
    engraving_character_limit: 25,
    engraving_instructions: "",
    personalisation_available: "no",
    delivery_type: "Standard Secure Shipping",
    estimated_delivery_time: "3-5 Business Days",
    next_day_delivery_available: "no",
    made_to_order: "no",
    production_time: "",
    shipping_weight: null,
    gender: "women",
    occasion: "Engagement",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    tax_percentage: 0,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: false,
    diamond_spec: {
      diamond_origin: "lab_grown",
      diamond_shape: "round",
      carat_weight: "1.00",
      center_carat_weight: "0.00",
      side_carat_weight: "0.55",
      total_carat_weight: "0.55",
      number_of_diamonds: 1,
      diamond_value: "52.65",
      cut_grade: "excellent",
      colour_grade: "F",
      clarity_grade: "VS1",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      certification_lab: "GIA",
      certificate_number: "",
      certificate_url: "",
    },
    images: [],
    variants: [],
    video_url: "",
  });

  const generateAutoSku = (catSlug?: string, prodName?: string) => {
    const catCode = (catSlug || formData.category || "JWL").substring(0, 3).toUpperCase();
    const namePrefix = prodName ? prodName.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() : "";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `GAMA-${catCode}${namePrefix ? "-" + namePrefix : ""}-${randNum}`;
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

      if (prodRes.status === "fulfilled") setProducts(getProductList(prodRes.value.data));
      if (catRes.status === "fulfilled") setCategories(Array.isArray(catRes.value.data) ? catRes.value.data : []);
      if (subRes.status === "fulfilled") setSubcategories(Array.isArray(subRes.value.data) ? subRes.value.data : []);
      if (stylesRes.status === "fulfilled") setStylesList(Array.isArray(stylesRes.value.data) ? stylesRes.value.data : []);
      if (dtRes.status === "fulfilled") setDiamondTypesList(Array.isArray(dtRes.value.data) ? dtRes.value.data : []);
      if (brandsRes.status === "fulfilled") setBrandsList(Array.isArray(brandsRes.value.data) ? brandsRes.value.data : []);
      if (collectionsRes.status === "fulfilled") setCollectionsList(Array.isArray(collectionsRes.value.data) ? collectionsRes.value.data : []);
    } catch (err) {
      toast.error("Failed to load products catalog");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter]);

  const handleImageUpload = async (files: FileList | File[]) => {
    setUploadingImages(true);
    try {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArr.length === 0) {
        toast.error("Select valid image files");
        return;
      }
      for (const file of fileArr) {
        const res = await adminApi.uploadMedia(file);
        const url = res.data.url;
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), { url, isPrimary: (prev.images || []).length === 0 }],
        }));
        toast.success(`Uploaded image`);
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVariantImageUpload = async (files: FileList | File[], variantIdx: number) => {
    setVariantUploadingIdx(variantIdx);
    try {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArr.length === 0) {
        toast.error("Select valid image files");
        return;
      }
      for (const file of fileArr) {
        const res = await adminApi.uploadMedia(file);
        const url = res.data.url;
        setFormData((prev) => {
          const updatedVariants = [...(prev.variants || [])];
          const currVariant = updatedVariants[variantIdx] || {};
          const currImages = currVariant.images || [];
          updatedVariants[variantIdx] = {
            ...currVariant,
            images: [...currImages, { url, isPrimary: currImages.length === 0 }],
          };
          return { ...prev, variants: updatedVariants };
        });
        toast.success(`Variant image uploaded`);
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
        toast.error("Select a valid video file");
        return;
      }
      const res = await adminApi.uploadMedia(file);
      setFormData((prev) => ({ ...prev, video_url: res.data.url }));
      toast.success(`Video uploaded successfully`);
    } catch (err) {
      toast.error("Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  };

  const selectedCategory = (formData.category || "engagement-rings").toLowerCase();
  const isRingCategory = ["engagement-rings", "wedding-bands", "eternity-bands", "rings"].includes(selectedCategory);
  const isEarringCategory = selectedCategory === "earrings";
  const isNecklaceCategory = ["necklaces", "pendants"].includes(selectedCategory);
  const isBraceletCategory = selectedCategory === "bracelets";
  const isBangleCategory = selectedCategory === "bangles";

  const getDimensionOptions = () => {
    if (isNecklaceCategory) return CHAIN_LENGTH_OPTIONS;
    if (isBraceletCategory) return BRACELET_LENGTH_OPTIONS;
    if (isBangleCategory) return BANGLE_SIZE_OPTIONS;
    if (isRingCategory) return RING_SIZE_OPTIONS;
    return [""];
  };

  const bulkGenerateVariants = () => {
    const baseSku = formData.sku || generateAutoSku(formData.category, formData.name);
    const metals = METAL_VARIANT_OPTIONS.filter((metal) => selectedVariantMetals.includes(metal.code));
    const dimensions = isEarringCategory ? [""] : selectedVariantSizes;

    if (metals.length === 0 || (dimensions.length === 0 && !isEarringCategory)) {
      toast.error("Select metal and dimension combinations");
      return;
    }

    const generated = metals.flatMap((metal) =>
      dimensions.map((dim, dimIndex) => {
        const dimClean = dim.replace(/[^a-zA-Z0-9]/g, "");
        const variantIndex = dimIndex + 1;
        const sku = `${baseSku}-${metal.code}${dimClean ? `-${dimClean}` : ""}-${String(variantIndex).padStart(2, "0")}`;
        return {
          sku,
          metal_type: metal.metal_type,
          metal_karat: metal.metal_karat,
          metal_weight_grams: metal.defaultWeight || "2.00",
          size: isRingCategory ? dim : "",
          length: isNecklaceCategory || isBraceletCategory ? dim : "",
          bangle_size: isBangleCategory ? dim : "",
          price: formData.base_price || 0,
          compare_at_price: formData.discount_price || null,
          cost_price: null,
          stock: 10,
          is_active: true,
          is_default: false,
          images: [],
        };
      })
    ).map((v, idx) => ({ ...v, is_default: idx === 0 }));

    setFormData((prev) => ({
      ...prev,
      sku: baseSku,
      variants: generated,
    }));
    toast.success(`Generated ${generated.length} unique variants`);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    const defaultSku = generateAutoSku("engagement-rings", "Solitaire Ring");
    setFormData({
      name: "",
      slug: "",
      sku: defaultSku,
      product_code: "",
      internal_reference: "",
      description: "",
      category: "engagement-rings",
      subcategory: "",
      base_price: 1500,
      discount_price: null,
      total_stock: 10,
      metal_type: "yellow-gold",
      metal_karat: "18K",
      diamond_cut: "round",
      diamond_type: null,
      brand: null,
      styles: [],
      collections: [],
      related_products: [],
      ring_type: "Engagement Ring",
      ring_style: "Solitaire",
      ring_shape: "Round Brilliant",
      band_style: "Classic",
      band_fit: "comfort",
      band_width: "2.0mm",
      ring_profile: "High Set",
      ring_finish: "Polished",
      ring_thickness: "1.8mm",
      resizable: "yes",
      earring_type: "studs",
      earring_style: "Classic Stud",
      closure_type: "Push Back",
      drop_length: "",
      earring_width: "",
      earring_height: "",
      necklace_type: "pendant",
      necklace_style: "pendant",
      chain_type: "Box Chain",
      chain_length: '18"',
      pendant_included: "yes",
      pendant_type: "Solitaire",
      pendant_shape: "Round",
      pendant_height: "",
      pendant_width: "",
      pendant_depth: "",
      chain_included: "yes",
      clasp_type: "Lobster",
      bracelet_type: "tennis",
      bracelet_style: "Tennis Bracelet",
      bracelet_length: '7"',
      bracelet_width: "",
      bracelet_thickness: "",
      bangle_type: "Solid",
      inner_diameter: "",
      bangle_width: "",
      bangle_thickness: "",
      opening_type: "Hinged",
      bangle_size: "2.4",
      adjustable: "no",
      gemstone_included: "no",
      gemstone_type: "",
      gemstone_shape: "",
      gemstone_colour: "",
      gemstone_carat_weight: null,
      gemstone_count: null,
      gemstone_origin: "",
      height: "",
      width: "",
      length: "",
      depth: "",
      thickness: "",
      weight: null,
      finish: "Polished",
      customisation_available: "no",
      engraving_available: "no",
      engraving_character_limit: 25,
      engraving_instructions: "",
      personalisation_available: "no",
      delivery_type: "Standard Secure Shipping",
      estimated_delivery_time: "3-5 Business Days",
      next_day_delivery_available: "no",
      made_to_order: "no",
      production_time: "",
      shipping_weight: null,
      gender: "women",
      occasion: "Engagement",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      canonical_url: "",
      og_title: "",
      og_description: "",
      og_image: "",
      tax_percentage: 0,
      low_stock_threshold: 5,
      is_active: true,
      is_featured: false,
      diamond_spec: {
        diamond_origin: "lab_grown",
        diamond_shape: "round",
        carat_weight: "1.00",
        center_carat_weight: "0.00",
        side_carat_weight: "0.55",
        total_carat_weight: "0.55",
        number_of_diamonds: 1,
        diamond_value: "52.65",
        cut_grade: "excellent",
        colour_grade: "F",
        clarity_grade: "VS1",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        certification_lab: "GIA",
        certificate_number: "",
        certificate_url: "",
      },
      images: [],
      variants: [
        {
          sku: `${defaultSku}-YG18-06`,
          metal_type: "yellow-gold",
          metal_karat: "18K",
          metal_weight_grams: "2.65",
          size: "6",
          length: "",
          bangle_size: "",
          price: 1500,
          cost_price: null,
          stock: 10,
          is_active: true,
          is_default: true,
          images: [],
        },
      ],
      video_url: "",
    });
    setSelectedVariantMetals(["YG9", "YG10", "YG14", "YG18", "PT950"]);
    setSelectedVariantSizes(["6", "7", "8"]);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setFormData({
      ...prod,
      base_price: prod.base_price || prod.basePrice || 0,
      discount_price: prod.discount_price ?? prod.discountPrice ?? null,
      total_stock: prod.total_stock ?? prod.totalStock ?? 0,
      diamond_spec: prod.diamond_spec || {
        diamond_origin: "lab_grown",
        diamond_shape: prod.diamond_cut || "round",
        carat_weight: "1.00",
        center_carat_weight: "0.00",
        side_carat_weight: "0.00",
        total_carat_weight: "1.00",
        diamond_value: "0.00",
        cut_grade: "excellent",
        colour_grade: "F",
        clarity_grade: "VS1",
        certification_lab: "GIA",
      },
      images: prod.images || [],
      variants: prod.variants || [],
      video_url: prod.video_url || prod.videoUrl || "",
    });
    setActiveTab("basic");
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

  const parseNumOrNull = (val: unknown): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return isNaN(val) ? null : val;
    const str = String(val).trim();
    if (!str) return null;
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const rawSpec = formData.diamond_spec || {};
      const centerCarat = parseNumOrNull(rawSpec.center_carat_weight);
      const sideCarat = parseNumOrNull(rawSpec.side_carat_weight);
      const totalCarat = parseNumOrNull(rawSpec.total_carat_weight) || parseNumOrNull(rawSpec.carat_weight) || 1.0;
      const diamondValue = parseNumOrNull(rawSpec.diamond_value);

      const cleanedDiamondSpec = {
        diamond_origin: rawSpec.diamond_origin || "lab_grown",
        diamond_shape: rawSpec.diamond_shape || formData.diamond_cut || "round",
        carat_weight: totalCarat || 1.0,
        center_carat_weight: centerCarat,
        side_carat_weight: sideCarat,
        total_carat_weight: totalCarat,
        diamond_value: diamondValue,
        number_of_diamonds: rawSpec.number_of_diamonds ? parseInt(String(rawSpec.number_of_diamonds)) : 1,
        cut_grade: rawSpec.cut_grade || "excellent",
        colour_grade: (rawSpec.colour_grade || "F").replace(/\s+color/i, "").trim().toUpperCase() || "F",
        clarity_grade: rawSpec.clarity_grade || "VS1",
        polish: rawSpec.polish || "",
        symmetry: rawSpec.symmetry || "",
        fluorescence: rawSpec.fluorescence || "",
        certification_lab: rawSpec.certification_lab || "GIA",
        certificate_number: rawSpec.certificate_number || "",
        certificate_url: rawSpec.certificate_url || "",
      };

      const cleanedVariants = (formData.variants || []).map((v, i) => ({
        ...v,
        sku: v.sku || `${formData.sku || "PROD"}-${v.metal_karat || i + 1}`,
        metal_weight_grams: parseNumOrNull(v.metal_weight_grams),
        price: typeof v.price === "number" ? v.price : parseFloat(String(v.price || 0)) || 0,
        compare_at_price: parseNumOrNull(v.compare_at_price),
        cost_price: parseNumOrNull(v.cost_price),
        stock: v.stock ?? 10,
        is_active: v.is_active ?? true,
        is_default: v.is_default ?? i === 0,
        images: v.images || [],
      }));

      const payload = {
        ...formData,
        sku: formData.sku || generateAutoSku(formData.category, formData.name),
        tax_percentage: parseNumOrNull(formData.tax_percentage) || 0,
        low_stock_threshold: formData.low_stock_threshold ?? 5,
        diamond_spec: cleanedDiamondSpec,
        variants: cleanedVariants,
        base_price: cleanedVariants.find((v) => v.is_default)?.price || formData.base_price || 0,
      };

      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id, payload);
        const savedItem = getProductFromResponse(res.data as ProductApiResponse) || ({ ...editingProduct, ...payload } as AdminProduct);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...savedItem } : p)));
        toast.success("Product updated");
      } else {
        const res = await adminApi.createProduct(payload);
        const savedItem = getProductFromResponse(res.data as ProductApiResponse);
        if (savedItem && (savedItem.id || savedItem.slug)) {
          setProducts((prev) => [savedItem, ...prev]);
        }
        toast.success("Product published");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const responseData = err && typeof err === "object" && "response" in err ? (err.response as { data?: unknown }).data : null;
      const msg = responseData ? JSON.stringify(responseData) : "Failed to save product";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateVariant = (idx: number, patch: Partial<NonNullable<AdminProduct["variants"]>[number]>) => {
    const updated = [...(formData.variants || [])];
    updated[idx] = { ...updated[idx], ...patch };
    setFormData({ ...formData, variants: updated });
  };

  const addManualVariant = () => {
    const current = formData.variants || [];
    const baseSku = formData.sku || generateAutoSku(formData.category, formData.name);
    setFormData({
      ...formData,
      variants: [
        ...current,
        {
          sku: `${baseSku}-VAR-${current.length + 1}`,
          metal_type: "yellow-gold",
          metal_karat: "18K",
          metal_weight_grams: "2.65",
          size: isRingCategory ? "6" : "",
          length: isNecklaceCategory || isBraceletCategory ? '18"' : "",
          bangle_size: isBangleCategory ? "2.4" : "",
          price: formData.base_price || 0,
          cost_price: null,
          stock: 10,
          is_active: true,
          is_default: current.length === 0,
          images: [],
        },
      ],
    });
  };

  const toggleArrayItem = (id: number, currentList: number[] | undefined, setter: (items: number[]) => void) => {
    const list = currentList || [];
    setter(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    backgroundColor: "#000000",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "2px",
    color: "#ffffff",
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: "#a0a0a0",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginBottom: "12px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", fontFamily: "'Poppins', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", paddingBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
            <Sparkles style={{ width: 20, height: 20, color: "#c6a45f" }} />
            Jewellery Catalog
          </h1>
          <p style={{ fontSize: "11px", color: "#a0a0a0", margin: "2px 0 0" }}>
            Manage product inventory, specifications, and variant matrices.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "10px 20px",
            backgroundColor: "#c6a45f",
            color: "#000000",
            border: "none",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", backgroundColor: "#0c0c0c", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadData();
          }}
          style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 280px" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ width: 15, height: 15, color: "#666666", position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "34px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#e0e0e0",
              fontSize: "11px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 150 }}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 120 }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Disabled</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div style={{ backgroundColor: "#0c0c0c", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", color: "#a0a0a0", gap: "8px", fontSize: "12px" }}>
            <RefreshCw style={{ width: 16, height: 16, color: "#c6a45f", animation: "spin 1s linear infinite" }} />
            <span>Loading Catalog...</span>
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", color: "#666666", gap: "10px" }}>
            <Package style={{ width: 32, height: 32, strokeWidth: 1 }} />
            <p style={{ fontSize: "12px", margin: 0 }}>No products available.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "#050505", color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "10px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Item Name</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>SKU</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Price</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Variants</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Stock</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: "#dddddd" }}>
                {products.map((prod) => {
                  const img = prod.images?.[0]?.url || prod.thumbnail;
                  const defaultVar = prod.variants?.find((v) => v.is_default || v.isDefault) || prod.variants?.[0];
                  const rawPrice = defaultVar?.price ?? prod.base_price ?? prod.basePrice;
                  const priceNum = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice || 0)) || 0;
                  const varCount = prod.variants?.length || 0;

                  return (
                    <tr key={prod.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {img ? (
                            <img src={img} alt={prod.name} style={{ width: 36, height: 36, objectFit: "cover", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                          ) : (
                            <div style={{ width: 36, height: 36, backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#666666" }}>
                              <Package style={{ width: 16, height: 16 }} />
                            </div>
                          )}
                          <div>
                            <p style={{ fontWeight: 600, color: "#ffffff", margin: 0, fontSize: "12px" }}>{prod.name}</p>
                            <p style={{ fontSize: "10px", color: "#888888", margin: "2px 0 0", textTransform: "capitalize" }}>
                              {prod.diamond_cut ? `${prod.diamond_cut} Cut` : prod.metal_type?.replace("-", " ") || "Custom Piece"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px 14px", fontFamily: "monospace", color: "#aaaaaa" }}>{prod.sku}</td>

                      <td style={{ padding: "12px 14px", textTransform: "capitalize", color: "#aaaaaa" }}>
                        {CATEGORY_OPTIONS.find((c) => c.value === prod.category)?.label || prod.category}
                      </td>

                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#c6a45f" }}>
                        £{priceNum.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ padding: "12px 14px", color: "#aaaaaa" }}>
                        {varCount > 0 ? (
                          <span style={{ padding: "3px 6px", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "10px" }}>
                            {varCount} {varCount === 1 ? "variant" : "variants"}
                          </span>
                        ) : (
                          <span style={{ color: "#555555" }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: prod.total_stock > 0 ? "#4ade80" : "#f43f5e" }}>
                          {prod.total_stock > 0 ? `${prod.total_stock} in stock` : "Out of Stock"}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        {prod.is_active ? (
                          <span style={{ padding: "2px 6px", backgroundColor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.2)", fontSize: "10px", textTransform: "uppercase" }}>
                            Active
                          </span>
                        ) : (
                          <span style={{ padding: "2px 6px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#888888", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "10px", textTransform: "uppercase" }}>
                            Draft
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            onClick={() => openEditModal(prod)}
                            style={{ padding: "4px", backgroundColor: "transparent", border: "none", color: "#cccccc", cursor: "pointer" }}
                            title="Edit Product"
                          >
                            <Edit2 style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            style={{ padding: "4px", backgroundColor: "transparent", border: "none", color: "#f43f5e", cursor: "pointer" }}
                            title="Delete Product"
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
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

      {/* ========================================================================= */}
      {/* REDESIGNED UNIVERSAL PRODUCT EDITOR MODAL                                 */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}>
          <div style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(198, 164, 95, 0.35)", width: "100%", maxWidth: "1080px", maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "6px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)", overflow: "hidden" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", backgroundColor: "#050505", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ padding: "6px", backgroundColor: "rgba(198, 164, 95, 0.1)", border: "1px solid rgba(198, 164, 95, 0.3)", color: "#c6a45f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Gem style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                    {editingProduct ? editingProduct.name : "Product Editor"}
                  </h2>
                  <p style={{ fontSize: "10px", color: "#a0a0a0", margin: "1px 0 0" }}>
                    Category: <span style={{ color: "#c6a45f", textTransform: "capitalize", fontWeight: 600 }}>{selectedCategory.replace("-", " ")}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "4px", backgroundColor: "transparent", border: "none", color: "#aaaaaa", cursor: "pointer" }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", padding: "6px 16px", backgroundColor: "#080808", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {[
                { id: "basic", label: "1. Basic Details", icon: Info },
                { id: "specs", label: "2. Specifications", icon: Layers },
                { id: "diamonds", label: "3. Diamond & 4Cs", icon: Gem },
                { id: "variants", label: "4. Variant Matrix", icon: SlidersHorizontal },
                { id: "media", label: "5. Media Showcase", icon: ImageIcon },
                { id: "extra", label: "6. Delivery & SEO", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as ModalTab)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderBottom: active ? "2px solid #c6a45f" : "2px solid transparent",
                      color: active ? "#c6a45f" : "#aaaaaa",
                      backgroundColor: active ? "rgba(198, 164, 95, 0.08)" : "transparent",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <Icon style={{ width: 13, height: 13 }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Form Content */}
            <form onSubmit={handleSaveProduct} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === "basic" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Product Name"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>SKU *</label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <input
                          type="text"
                          required
                          value={formData.sku || ""}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="SKU Code"
                          style={{ ...inputStyle, fontFamily: "monospace" }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sku: generateAutoSku(formData.category, formData.name) })}
                          style={{ padding: "6px 10px", backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", fontSize: "10px", cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Category *</label>
                      <select
                        value={formData.category || "engagement-rings"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={inputStyle}
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Base Price (£/$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.base_price ?? 0}
                        onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Discount Price (£/$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discount_price ?? ""}
                        onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="Discount Price"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Total Stock *</label>
                      <input
                        type="number"
                        required
                        value={formData.total_stock ?? 10}
                        onChange={(e) => setFormData({ ...formData, total_stock: parseInt(e.target.value) || 0 })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Diamond Type</label>
                      <select
                        value={formData.diamond_type || ""}
                        onChange={(e) => setFormData({ ...formData, diamond_type: e.target.value ? parseInt(e.target.value) : null })}
                        style={inputStyle}
                      >
                        <option value="">None / Not Applicable</option>
                        {diamondTypesList.map((dt) => (
                          <option key={dt.id} value={dt.id}>{dt.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Brand</label>
                      <select
                        value={formData.brand || ""}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value ? parseInt(e.target.value) : null })}
                        style={inputStyle}
                      >
                        <option value="">Gama Diamonds</option>
                        {brandsList.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Target Gender</label>
                      <select
                        value={formData.gender || "women"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product Description"
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  {/* Taxonomy Tagging: Styles & Collections */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Styles</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: 110, overflowY: "auto", padding: "8px", backgroundColor: "#000000", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                        {stylesList.map((st) => {
                          const isSelected = (formData.styles || []).includes(st.id);
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => toggleArrayItem(st.id, formData.styles, (items) => setFormData({ ...formData, styles: items }))}
                              style={{
                                padding: "3px 8px",
                                fontSize: "10px",
                                border: isSelected ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)",
                                backgroundColor: isSelected ? "#c6a45f" : "rgba(255, 255, 255, 0.05)",
                                color: isSelected ? "#000000" : "#cccccc",
                                fontWeight: isSelected ? 600 : 400,
                                cursor: "pointer",
                              }}
                            >
                              {st.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Collections</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: 110, overflowY: "auto", padding: "8px", backgroundColor: "#000000", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                        {collectionsList.map((col) => {
                          const isSelected = (formData.collections || []).includes(col.id);
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => toggleArrayItem(col.id, formData.collections, (items) => setFormData({ ...formData, collections: items }))}
                              style={{
                                padding: "3px 8px",
                                fontSize: "10px",
                                border: isSelected ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)",
                                backgroundColor: isSelected ? "#c6a45f" : "rgba(255, 255, 255, 0.05)",
                                color: isSelected ? "#000000" : "#cccccc",
                                fontWeight: isSelected ? 600 : 400,
                                cursor: "pointer",
                              }}
                            >
                              {col.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingTop: "4px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active ?? true}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <span>Active Product</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.is_featured ?? false}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      />
                      <span>Featured Product</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORY SPECIFICATIONS */}
              {activeTab === "specs" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Ring Fields */}
                  {isRingCategory && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px", margin: 0 }}>Ring Attributes</h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Ring Style</label>
                          <input
                            type="text"
                            value={formData.ring_style || ""}
                            onChange={(e) => setFormData({ ...formData, ring_style: e.target.value })}
                            placeholder="Ring Style"
                            style={inputStyle}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Band Fit</label>
                          <select
                            value={formData.band_fit || "comfort"}
                            onChange={(e) => setFormData({ ...formData, band_fit: e.target.value })}
                            style={inputStyle}
                          >
                            <option value="comfort">Comfort Fit</option>
                            <option value="standard">Standard Fit</option>
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Band Width</label>
                          <input
                            type="text"
                            value={formData.band_width || ""}
                            onChange={(e) => setFormData({ ...formData, band_width: e.target.value })}
                            placeholder="Band Width"
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Ring Profile</label>
                          <input
                            type="text"
                            value={formData.ring_profile || ""}
                            onChange={(e) => setFormData({ ...formData, ring_profile: e.target.value })}
                            placeholder="Ring Profile"
                            style={inputStyle}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Ring Finish</label>
                          <input
                            type="text"
                            value={formData.ring_finish || ""}
                            onChange={(e) => setFormData({ ...formData, ring_finish: e.target.value })}
                            placeholder="Ring Finish"
                            style={inputStyle}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Resizable</label>
                          <select
                            value={formData.resizable || "yes"}
                            onChange={(e) => setFormData({ ...formData, resizable: e.target.value })}
                            style={inputStyle}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="on_request">On Request</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Earring Fields */}
                  {isEarringCategory && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px", margin: 0 }}>Earring Attributes</h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Earring Type</label>
                          <select
                            value={formData.earring_type || "studs"}
                            onChange={(e) => setFormData({ ...formData, earring_type: e.target.value })}
                            style={inputStyle}
                          >
                            <option value="studs">Studs</option>
                            <option value="hoops">Hoops</option>
                            <option value="drops">Drops</option>
                            <option value="huggies">Huggies</option>
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Closure Type</label>
                          <input
                            type="text"
                            value={formData.closure_type || ""}
                            onChange={(e) => setFormData({ ...formData, closure_type: e.target.value })}
                            placeholder="Closure Type"
                            style={inputStyle}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Drop Length</label>
                          <input
                            type="text"
                            value={formData.drop_length || ""}
                            onChange={(e) => setFormData({ ...formData, drop_length: e.target.value })}
                            placeholder="Drop Length"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Necklace Fields */}
                  {isNecklaceCategory && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px", margin: 0 }}>Necklace Attributes</h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Necklace Style</label>
                          <select
                            value={formData.necklace_style || "pendant"}
                            onChange={(e) => setFormData({ ...formData, necklace_style: e.target.value })}
                            style={inputStyle}
                          >
                            <option value="pendant">Pendant</option>
                            <option value="chain">Chain</option>
                            <option value="tennis">Tennis</option>
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Chain Type</label>
                          <input
                            type="text"
                            value={formData.chain_type || ""}
                            onChange={(e) => setFormData({ ...formData, chain_type: e.target.value })}
                            placeholder="Chain Type"
                            style={inputStyle}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Clasp Type</label>
                          <input
                            type="text"
                            value={formData.clasp_type || ""}
                            onChange={(e) => setFormData({ ...formData, clasp_type: e.target.value })}
                            placeholder="Clasp Type"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Universal Dimensions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Dimensions & Weight</h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Height (mm)</label>
                        <input
                          type="text"
                          value={formData.height || ""}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Width (mm)</label>
                        <input
                          type="text"
                          value={formData.width || ""}
                          onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Length (mm / in)</label>
                        <input
                          type="text"
                          value={formData.length || ""}
                          onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Weight (grams)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.weight ?? ""}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : null })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIAMOND & GEMSTONE WITH SPREADSHEET FIELDS */}
              {activeTab === "diamonds" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Gem style={{ width: 14, height: 14, color: "#c6a45f" }} />
                    Diamond Details & 4Cs
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", backgroundColor: "#000000", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <input
                      type="checkbox"
                      id="has_diamonds_check"
                      checked={Boolean(formData.diamond_type || formData.diamond_spec?.total_carat_weight || formData.diamond_spec?.carat_weight)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (!checked) {
                          setFormData({ ...formData, diamond_type: null });
                        } else {
                          setFormData({ ...formData, diamond_type: diamondTypesList[0]?.id || 1 });
                        }
                      }}
                      style={{ accentColor: "#c6a45f", width: 16, height: 16 }}
                    />
                    <label htmlFor="has_diamonds_check" style={{ fontSize: "12px", color: "#ffffff", fontWeight: 600, cursor: "pointer" }}>
                      Diamond Product (Contains Diamonds or Gemstones)
                    </label>
                  </div>

                  {!formData.diamond_type && !formData.diamond_spec?.total_carat_weight && !formData.diamond_spec?.carat_weight ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#888888", fontSize: "11px", border: "1px dashed rgba(255, 255, 255, 0.15)" }}>
                      This product is marked as plain metal (No Diamonds). Select "Diamond Product" above to configure 4Cs diamond attributes.
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Diamond Origin</label>
                          <select
                            value={formData.diamond_spec?.diamond_origin || "lab_grown"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), diamond_origin: e.target.value }
                            })}
                            style={inputStyle}
                          >
                            <option value="lab_grown">Lab Grown</option>
                            <option value="natural">Natural</option>
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Diamond Shape</label>
                          <select
                            value={formData.diamond_spec?.diamond_shape || formData.diamond_cut || "round"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData({
                                ...formData,
                                diamond_cut: val,
                                diamond_spec: { ...(formData.diamond_spec || {}), diamond_shape: val }
                              });
                            }}
                            style={{ ...inputStyle, textTransform: "capitalize" }}
                          >
                            {DIAMOND_SHAPE_OPTIONS.map((shape) => (
                              <option key={shape} value={shape}>{shape.replace("-cut", "")}</option>
                            ))}
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Carat Weight</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.diamond_spec?.total_carat_weight ?? formData.diamond_spec?.carat_weight ?? "1.00"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), total_carat_weight: e.target.value, carat_weight: e.target.value }
                            })}
                            placeholder="e.g. 1.00"
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Cut Grade</label>
                          <select
                            value={formData.diamond_spec?.cut_grade || "excellent"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), cut_grade: e.target.value }
                            })}
                            style={{ ...inputStyle, textTransform: "capitalize" }}
                          >
                            {CUT_GRADE_OPTIONS.map((cut) => (
                              <option key={cut} value={cut}>{cut.replace("_", " ")}</option>
                            ))}
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Colour Grade</label>
                          <select
                            value={formData.diamond_spec?.colour_grade || "F"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), colour_grade: e.target.value }
                            })}
                            style={inputStyle}
                          >
                            {COLOUR_GRADE_OPTIONS.map((col) => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Clarity Grade</label>
                          <select
                            value={formData.diamond_spec?.clarity_grade || "VS1"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), clarity_grade: e.target.value }
                            })}
                            style={inputStyle}
                          >
                            {CLARITY_GRADE_OPTIONS.map((cla) => (
                              <option key={cla} value={cla}>{cla}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Certification Lab</label>
                          <select
                            value={formData.diamond_spec?.certification_lab || "GIA"}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), certification_lab: e.target.value }
                            })}
                            style={inputStyle}
                          >
                            {CERT_LAB_OPTIONS.map((lab) => (
                              <option key={lab} value={lab}>{lab}</option>
                            ))}
                          </select>
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Certificate Number</label>
                          <input
                            type="text"
                            value={formData.diamond_spec?.certificate_number || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), certificate_number: e.target.value }
                            })}
                            placeholder="Certificate Number"
                            style={{ ...inputStyle, fontFamily: "monospace" }}
                          />
                        </div>

                        <div style={fieldGroupStyle}>
                          <label style={labelStyle}>Certificate URL</label>
                          <input
                            type="url"
                            value={formData.diamond_spec?.certificate_url || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              diamond_spec: { ...(formData.diamond_spec || {}), certificate_url: e.target.value }
                            })}
                            placeholder="https://..."
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: VARIANTS / SIZES */}
              {activeTab === "variants" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Bulk Matrix Generator Box */}
                  <div style={{ padding: "14px", backgroundColor: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#c6a45f", textTransform: "uppercase", letterSpacing: "1px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles style={{ width: 14, height: 14 }} />
                        Auto-generate variants
                      </h3>
                      <button
                        type="button"
                        onClick={bulkGenerateVariants}
                        style={{ padding: "6px 14px", backgroundColor: "#c6a45f", color: "#000000", border: "none", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}
                      >
                        Generate Matrix
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ ...labelStyle, marginBottom: "6px" }}>Metals:</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {METAL_VARIANT_OPTIONS.map((metal) => {
                            const isChecked = selectedVariantMetals.includes(metal.code);
                            return (
                              <button
                                key={metal.code}
                                type="button"
                                onClick={() => {
                                  setSelectedVariantMetals((prev) =>
                                    prev.includes(metal.code) ? prev.filter((m) => m !== metal.code) : [...prev, metal.code]
                                  );
                                }}
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "10px",
                                  border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)",
                                  backgroundColor: isChecked ? "rgba(198, 164, 95, 0.15)" : "#000000",
                                  color: isChecked ? "#c6a45f" : "#aaaaaa",
                                  cursor: "pointer",
                                }}
                              >
                                {metal.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {!isEarringCategory && (
                        <div>
                          <label style={{ ...labelStyle, marginBottom: "6px" }}>
                            Size / Length / Bangle Size:
                          </label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {getDimensionOptions().map((dim) => {
                              const isChecked = selectedVariantSizes.includes(dim);
                              return (
                                <button
                                  key={dim}
                                  type="button"
                                  onClick={() => {
                                    setSelectedVariantSizes((prev) =>
                                      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
                                    );
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    fontSize: "10px",
                                    border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)",
                                    backgroundColor: isChecked ? "rgba(198, 164, 95, 0.15)" : "#000000",
                                    color: isChecked ? "#c6a45f" : "#aaaaaa",
                                    cursor: "pointer",
                                  }}
                                >
                                  {dim}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Variant Fields Table */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                        Variant fields ({(formData.variants || []).length})
                      </h3>
                      <button
                        type="button"
                        onClick={addManualVariant}
                        style={{ padding: "5px 10px", backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                      >
                        + Add manually
                      </button>
                    </div>

                    {(formData.variants || []).length === 0 ? (
                      <div style={{ padding: "24px", textAlign: "center", color: "#666666", fontSize: "11px", border: "1px dashed rgba(255, 255, 255, 0.15)" }}>
                        No variants added. Auto-generate variants or add manually.
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "11px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#000000", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#aaaaaa", fontSize: "10px" }}>
                              <th style={{ padding: "8px", textAlign: "center" }}>Default Variant</th>
                              <th style={{ padding: "8px" }}>Metal</th>
                              <th style={{ padding: "8px" }}>Karat</th>
                              {!isEarringCategory && <th style={{ padding: "8px" }}>Size / Length / Bangle Size</th>}
                              <th style={{ padding: "8px" }}>Price (£/$)</th>
                              <th style={{ padding: "8px" }}>Stock</th>
                              <th style={{ padding: "8px" }}>Variant Image</th>
                              <th style={{ padding: "8px", textAlign: "right" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(formData.variants || []).map((variant, idx) => {
                              const varImg = variant.images && variant.images.length > 0 ? variant.images[0].url : null;
                              return (
                                <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                  <td style={{ padding: "8px", textAlign: "center" }}>
                                    <input
                                      type="radio"
                                      name="default_variant"
                                      checked={variant.is_default ?? false}
                                      onChange={() => {
                                        const updated = (formData.variants || []).map((v, i) => ({
                                          ...v,
                                          is_default: i === idx,
                                        }));
                                        setFormData({ ...formData, variants: updated });
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <select
                                      value={variant.metal_type || "yellow-gold"}
                                      onChange={(e) => updateVariant(idx, { metal_type: e.target.value })}
                                      style={{ ...inputStyle, width: 110, padding: "4px 6px", fontSize: "10px" }}
                                    >
                                      <option value="silver">Silver</option>
                                      <option value="yellow-gold">Yellow Gold</option>
                                      <option value="white-gold">White Gold</option>
                                      <option value="rose-gold">Rose Gold</option>
                                      <option value="platinum">Platinum</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <select
                                      value={variant.metal_karat || "18K"}
                                      onChange={(e) => updateVariant(idx, { metal_karat: e.target.value })}
                                      style={{ ...inputStyle, width: 75, padding: "4px 6px", fontSize: "10px" }}
                                    >
                                      <option value="9K">9K</option>
                                      <option value="10K">10K</option>
                                      <option value="14K">14K</option>
                                      <option value="18K">18K</option>
                                      <option value="950Pt">950 Pt (Platinum)</option>
                                      <option value="925Ag">925 Ag (Silver)</option>
                                    </select>
                                  </td>
                                  {!isEarringCategory && (
                                    <td style={{ padding: "8px" }}>
                                      <input
                                        type="text"
                                        value={variant.size || variant.length || variant.bangle_size || ""}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          if (isRingCategory) updateVariant(idx, { size: val });
                                          else if (isNecklaceCategory || isBraceletCategory) updateVariant(idx, { length: val });
                                          else if (isBangleCategory) updateVariant(idx, { bangle_size: val });
                                          else updateVariant(idx, { size: val });
                                        }}
                                        style={{ ...inputStyle, width: 80, padding: "4px 6px", textAlign: "center", fontSize: "10px" }}
                                      />
                                    </td>
                                  )}
                                  <td style={{ padding: "8px" }}>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={variant.price ?? 0}
                                      onChange={(e) => updateVariant(idx, { price: parseFloat(e.target.value) || 0 })}
                                      style={{ ...inputStyle, width: 85, padding: "4px 6px", color: "#c6a45f", fontWeight: 600, fontSize: "10px" }}
                                    />
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <input
                                      type="number"
                                      value={variant.stock ?? 10}
                                      onChange={(e) => updateVariant(idx, { stock: parseInt(e.target.value) || 0 })}
                                      style={{ ...inputStyle, width: 50, padding: "4px 6px", textAlign: "center", fontSize: "10px" }}
                                    />
                                  </td>

                                  {/* PER-VARIANT CLOUDINARY UPLOAD BUTTON */}
                                  <td style={{ padding: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      {varImg ? (
                                        <img src={varImg} alt="" style={{ width: 26, height: 26, objectFit: "cover", border: "1px solid rgba(255, 255, 255, 0.2)" }} />
                                      ) : null}
                                      <label
                                        htmlFor={`var-file-${idx}`}
                                        style={{
                                          padding: "4px 8px",
                                          backgroundColor: "rgba(198, 164, 95, 0.15)",
                                          border: "1px solid rgba(198, 164, 95, 0.3)",
                                          color: "#c6a45f",
                                          fontSize: "10px",
                                          cursor: "pointer",
                                          whiteSpace: "nowrap",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                      >
                                        <Upload style={{ width: 10, height: 10 }} />
                                        <span>{variantUploadingIdx === idx ? "..." : varImg ? "Change" : "Upload"}</span>
                                      </label>
                                      <input
                                        id={`var-file-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => e.target.files && handleVariantImageUpload(e.target.files, idx)}
                                      />
                                    </div>
                                  </td>

                                  <td style={{ padding: "8px", textAlign: "right" }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (formData.variants || []).filter((_, i) => i !== idx);
                                        setFormData({ ...formData, variants: updated });
                                      }}
                                      style={{ padding: "3px", backgroundColor: "transparent", border: "none", color: "#f43f5e", cursor: "pointer" }}
                                    >
                                      <X style={{ width: 14, height: 14 }} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA */}
              {activeTab === "media" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ padding: "8px 12px", backgroundColor: "rgba(198, 164, 95, 0.08)", border: "1px solid rgba(198, 164, 95, 0.2)", color: "#d8c08a", fontSize: "10px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                    This is the only place for media upload.
                  </div>

                  <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                      Product Images
                    </h3>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      style={{ padding: "6px 12px", backgroundColor: "#c6a45f", color: "#000000", border: "none", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}
                    >
                      {uploadingImages ? "Uploading..." : "+ Upload Product Images"}
                    </button>
                  </div>

                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  />

                  {(formData.images || []).length === 0 ? (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      style={{ padding: "40px 20px", border: "2px dashed rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "8px" }}
                    >
                      <ImageIcon style={{ width: 32, height: 32, color: "#c6a45f" }} />
                      <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 600, margin: 0 }}>Click to upload Product Images</p>
                      <p style={{ fontSize: "10px", color: "#888888", margin: 0 }}>PNG, JPG, WEBP</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                      {(formData.images || []).map((img, idx) => (
                        <div key={idx} style={{ position: "relative", border: img.isPrimary ? "2px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "#000000", padding: "6px" }}>
                          <img src={img.url} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.images || []).filter((_, i) => i !== idx);
                              setFormData({ ...formData, images: updated });
                            }}
                            style={{ position: "absolute", top: 10, right: 10, padding: "3px", backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", color: "#f43f5e", cursor: "pointer" }}
                          >
                            <X style={{ width: 12, height: 12 }} />
                          </button>
                          <div style={{ marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "4px", color: img.isPrimary ? "#c6a45f" : "#cccccc", fontWeight: img.isPrimary ? 700 : 400, cursor: "pointer" }}>
                              <input
                                type="radio"
                                name="primary_image"
                                checked={img.isPrimary ?? false}
                                onChange={() => {
                                  const updated = (formData.images || []).map((im, i) => ({
                                    ...im,
                                    isPrimary: i === idx,
                                  }));
                                  setFormData({ ...formData, images: updated });
                                }}
                              />
                              <span>Mark Primary Image</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Video */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                        Product Video
                      </h3>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        style={{ padding: "6px 12px", backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                      >
                        {uploadingVideo ? "Uploading..." : "+ Upload Product Video"}
                      </button>
                    </div>

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                    />

                    {formData.video_url ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "#000000", padding: "10px" }}>
                        <video src={formData.video_url} controls style={{ width: "100%", maxHeight: 220, backgroundColor: "#050505" }} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "10px", color: "#888888", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                            {formData.video_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, video_url: "" })}
                            style={{ padding: "4px 8px", backgroundColor: "rgba(244, 63, 94, 0.2)", border: "1px solid rgba(244, 63, 94, 0.4)", color: "#f43f5e", fontSize: "10px", cursor: "pointer" }}
                          >
                            Remove Video
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        style={{ padding: "28px 16px", border: "1px dashed rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(0, 0, 0, 0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "6px" }}
                      >
                        <Film style={{ width: 24, height: 24, color: "#666666" }} />
                        <p style={{ fontSize: "11px", color: "#aaaaaa", margin: 0 }}>Click to upload Product Video file</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: ADVANCED */}
              {activeTab === "extra" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Internal Reference</label>
                      <input
                        type="text"
                        value={formData.internal_reference || ""}
                        onChange={(e) => setFormData({ ...formData, internal_reference: e.target.value })}
                        placeholder="Internal Reference"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Product Code</label>
                      <input
                        type="text"
                        value={formData.product_code || ""}
                        onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                        placeholder="Product Code"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Delivery Type</label>
                      <input
                        type="text"
                        value={formData.delivery_type || "Standard Secure Shipping"}
                        onChange={(e) => setFormData({ ...formData, delivery_type: e.target.value })}
                        placeholder="Delivery Type"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Estimated Delivery Time</label>
                      <input
                        type="text"
                        value={formData.estimated_delivery_time || "3-5 Business Days"}
                        onChange={(e) => setFormData({ ...formData, estimated_delivery_time: e.target.value })}
                        placeholder="Estimated Delivery Time"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Tax Percentage (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.tax_percentage ?? 0}
                        onChange={(e) => setFormData({ ...formData, tax_percentage: parseFloat(e.target.value) || 0 })}
                        placeholder="Tax Percentage"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Shipping Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.shipping_weight ?? ""}
                        onChange={(e) => setFormData({ ...formData, shipping_weight: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="Shipping Weight"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Made to Order</label>
                      <select
                        value={formData.made_to_order || "no"}
                        onChange={(e) => setFormData({ ...formData, made_to_order: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  {/* Related Products Multiselect */}
                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Related Products</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: 120, overflowY: "auto", padding: "8px", backgroundColor: "#000000", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                      {products
                        .filter((p) => p.id !== editingProduct?.id)
                        .map((p) => {
                          const isSelected = (formData.related_products || []).includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => toggleArrayItem(p.id, formData.related_products, (items) => setFormData({ ...formData, related_products: items }))}
                              style={{
                                padding: "4px 8px",
                                fontSize: "10px",
                                border: isSelected ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.15)",
                                backgroundColor: isSelected ? "#c6a45f" : "rgba(255, 255, 255, 0.05)",
                                color: isSelected ? "#000000" : "#cccccc",
                                fontWeight: isSelected ? 600 : 400,
                                cursor: "pointer",
                              }}
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      {products.length === 0 && <span style={{ fontSize: "10px", color: "#666666" }}>No other products available</span>}
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#c6a45f", textTransform: "uppercase", letterSpacing: "1px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                      <Globe style={{ width: 14, height: 14 }} />
                      SEO Section
                    </h3>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>SEO Title</label>
                      <input
                        type="text"
                        value={formData.seo_title || ""}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                        placeholder="SEO Title"
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>SEO Description</label>
                      <textarea
                        rows={2}
                        value={formData.seo_description || ""}
                        onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                        placeholder="SEO Description"
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>SEO Keywords</label>
                        <input
                          type="text"
                          value={formData.seo_keywords || ""}
                          onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                          placeholder="SEO Keywords"
                          style={inputStyle}
                        />
                      </div>

                      <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Canonical URL</label>
                        <input
                          type="text"
                          value={formData.canonical_url || ""}
                          onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                          placeholder="Canonical URL"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", backgroundColor: "#050505", borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "0 -20px -20px -20px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 16px", backgroundColor: "transparent", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#cccccc", fontSize: "11px", cursor: "pointer" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "8px 24px", backgroundColor: "#c6a45f", color: "#000000", border: "none", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <RefreshCw style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />}
                  <span>{editingProduct ? "Save Changes" : "Publish Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
