"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  X,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Ruler,
  Diamond,
  Upload,
  Film,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminProduct, AdminCategory, AdminSubcategory, AdminTaxonomyItem } from "@/lib/api/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [subcategories, setSubcategories] = useState<AdminSubcategory[]>([]);
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
  const [activeTab, setActiveTab] = useState<"details" | "media">("details");
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: "",
    sku: "",
    description: "",
    category: "rings",
    base_price: 0,
    discount_price: null,
    total_stock: 10,
    metal_type: "white-gold",
    metal_karat: "18K",
    diamond_cut: "round",
    earring_type: "",
    necklace_style: "",
    bracelet_type: "",
    band_fit: "comfort",
    gender: "women",
    is_active: true,
    is_featured: false,
    customisation_available: "no",
    engraving_available: "no",
    diamond_spec: {
      carat_weight: "1.00",
      cut_grade: "excellent",
      colour_grade: "G",
      clarity_grade: "VS1",
      certification_lab: "GIA",
      certificate_number: "",
    },
    images: [],
    sizes: [{ size: "M (UK)", stock: 5 }],
    styles: [],
    collections: [],
    diamond_type: null,
    brand: null,
    video_url: "",
  });

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
        const d = prodRes.value.data;
        setProducts(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (catRes.status === "fulfilled") {
        const d = catRes.value.data;
        setCategories(Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (subRes.status === "fulfilled") {
        const d = subRes.value.data;
        setSubcategories(Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (stylesRes.status === "fulfilled") {
        const d = stylesRes.value.data;
        setStylesList(Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (dtRes.status === "fulfilled") {
        const d = dtRes.value.data;
        setDiamondTypesList(Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (brandsRes.status === "fulfilled") {
        const d = brandsRes.value.data;
        setBrandsList(Array.isArray(d) ? d : (d as any)?.results || []);
      }
      if (collectionsRes.status === "fulfilled") {
        const d = collectionsRes.value.data;
        setCollectionsList(Array.isArray(d) ? d : (d as any)?.results || []);
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new") {
        openAddModal();
      }
    }
  }, []);


  const handleImageUpload = async (files: FileList | File[]) => {
    setUploadingImages(true);
    try {
      const fileArr = Array.from(files);
      const validFiles = fileArr.filter((f) => f.type.startsWith("image/"));
      if (validFiles.length === 0) {
        toast.error("Please select valid image files (jpg, png, webp)");
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

  const handleVideoUpload = async (files: FileList | File[]) => {
    setUploadingVideo(true);
    try {
      const file = Array.from(files).find((f) => f.type.startsWith("video/"));
      if (!file) {
        toast.error("Please select a valid video file (mp4, webm, mov)");
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

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "rings",
      base_price: 0,
      discount_price: null,
      total_stock: 10,
      metal_type: "white-gold",
      metal_karat: "18K",
      diamond_cut: "round",
      gender: "women",
      is_active: true,
      is_featured: false,
      diamond_spec: {
        carat_weight: "1.00",
        cut_grade: "excellent",
        colour_grade: "G",
        clarity_grade: "VS1",
        certification_lab: "GIA",
      },
      images: [],
      sizes: [{ size: "M", stock: 5 }],
      styles: [],
      collections: [],
      diamond_type: null,
      brand: null,
      video_url: "",
    });
    setActiveTab("details");
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);

    const styleIds = product.styles
      ? (product.styles as any).map((s: any) => (typeof s === "object" ? s.id : s))
      : (product.stylesDetail ? product.stylesDetail.map((s) => s.id) : []);

    const collectionIds = product.collections
      ? (product.collections as any).map((c: any) => (typeof c === "object" ? c.id : c))
      : (product.collectionsDetail ? product.collectionsDetail.map((c) => c.id) : []);

    const dtId = typeof product.diamond_type === "object" && product.diamond_type
      ? (product.diamond_type as any).id
      : (product.diamond_type || (product.diamondTypeDetail ? product.diamondTypeDetail.id : null));

    const brandId = typeof product.brand === "object" && product.brand
      ? (product.brand as any).id
      : (product.brand || (product.brandDetail ? product.brandDetail.id : null));

    setFormData({
      ...product,
      base_price: product.base_price || product.basePrice || 0,
      discount_price: product.discount_price ?? product.discountPrice ?? null,
      total_stock: product.total_stock ?? product.totalStock ?? 0,
      diamond_spec: product.diamond_spec || {
        carat_weight: "1.00",
        cut_grade: "excellent",
        colour_grade: "G",
        clarity_grade: "VS1",
        certification_lab: "GIA",
      },
      images: product.images && product.images.length > 0 ? product.images : [],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: "M", stock: 5 }],
      styles: styleIds,
      collections: collectionIds,
      diamond_type: dtId,
      brand: brandId,
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await adminApi.createProduct(formData);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save product";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-space-y-6">
      {/* Header & Controls */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Product Catalog</h2>
          <p className="admin-section-subtitle">
            Manage fine jewellery items, 4Cs diamond specs, metals, pricing, and stock levels.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="admin-btn admin-btn-gold"
        >
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
            <option value="rings">Rings</option>
            <option value="necklaces">Necklaces</option>
            <option value="bracelets">Bracelets</option>
            <option value="earrings">Earrings</option>
            {(Array.isArray(categories) ? categories : [])
              .filter((c) => !["rings", "necklaces", "bracelets", "earrings"].includes(c.slug))
              .map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
            <span>Loading product inventory...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
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
                  const img = prod.images?.[0]?.url;
                  const price = prod.base_price || prod.basePrice || 0;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className="admin-flex admin-items-center admin-gap-3">
                          {img ? (
                            <img src={img} alt={prod.name} className="w-10 h-10 object-cover rounded border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center text-gray-500">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="admin-font-semibold admin-text-white">{prod.name}</p>
                            <p className="admin-text-muted admin-text-xs capitalize">{prod.metal_type?.replace("-", " ")}</p>
                          </div>
                        </div>
                      </td>

                      <td className="font-mono admin-text-muted">{prod.sku}</td>

                      <td className="capitalize">{prod.category}</td>

                      <td className="admin-font-semibold admin-text-gold">
                        ₹{parseFloat(String(price)).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className={`admin-font-medium ${prod.total_stock <= 5 ? "text-amber-400" : "admin-text-white"}`}>
                          {prod.total_stock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-badge ${
                            prod.is_active ? "green" : "rose"
                          }`}
                        >
                          {prod.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="admin-flex admin-items-center justify-end admin-gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="admin-btn admin-btn-ghost p-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="admin-btn admin-btn-danger p-1.5"
                          >
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

      {/* Comprehensive Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-lg admin-space-y-6">
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-label">Catalog Manager</span>
                <h3 className="admin-modal-title">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Luxury Product"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="admin-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="admin-tabs">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`admin-tab ${activeTab === "details" ? "active" : ""}`}
              >
                1. Details & Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`admin-tab ${activeTab === "media" ? "active" : ""}`}
              >
                2. Images & Video Gallery
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="admin-space-y-4">
              {/* Tab 1: Details & Specs */}
              {activeTab === "details" && (
                <div className="admin-space-y-4">
                  {/* Basic Details */}
                  <div>
                    <label className="admin-label">Product Title</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Solitaire Oval Diamond Engagement Ring"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-grid-3">
                    <div>
                      <label className="admin-label">Main Category</label>
                      <select
                        value={formData.category || "rings"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="admin-input"
                      >
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="earrings">Earrings</option>
                        {(Array.isArray(categories) ? categories : [])
                          .filter((c) => !["rings", "necklaces", "bracelets", "earrings"].includes(c.slug))
                          .map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Target Gender</label>
                      <select
                        value={formData.gender || "women"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="admin-input"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">SKU (Auto-generated if empty)</label>
                      <input
                        type="text"
                        value={formData.sku || ""}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g. GAMA-RNG-9812A"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="admin-grid-3">
                    <div>
                      <label className="admin-label">Base Price (INR ₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.base_price || 0}
                        onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="admin-label">Discount Price (INR ₹ - Optional)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discount_price ?? ""}
                        onChange={(e) =>
                          setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : null })
                        }
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="admin-label">Total Stock Count</label>
                      <input
                        type="number"
                        value={formData.total_stock || 0}
                        onChange={(e) => setFormData({ ...formData, total_stock: parseInt(e.target.value) || 0 })}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="admin-flex admin-items-center admin-gap-6 pt-1">
                    <label className="admin-flex admin-items-center admin-gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active ?? true}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="accent-[#c6a45f]"
                      />
                      <span className="admin-text-white admin-font-medium admin-text-xs">Active in Store</span>
                    </label>

                    <label className="admin-flex admin-items-center admin-gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_featured ?? false}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="accent-[#c6a45f]"
                      />
                      <span className="admin-text-white admin-font-medium admin-text-xs">Featured Product</span>
                    </label>
                  </div>

                  {/* Metal & Diamond Specs Header */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="admin-info-label mb-2">Precious Metal & Diamond Specs</p>
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Precious Metal Type</label>
                      <select
                        value={formData.metal_type || "yellow-gold"}
                        onChange={(e) => setFormData({ ...formData, metal_type: e.target.value })}
                        className="admin-input"
                      >
                        <option value="white-gold">White Gold</option>
                        <option value="yellow-gold">Yellow Gold</option>
                        <option value="rose-gold">Rose Gold</option>
                        <option value="platinum">Platinum</option>
                        <option value="silver">Silver</option>
                        <option value="two-tone">Two-Tone</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Diamond Shape / Cut</label>
                      <select
                        value={formData.diamond_cut || "Round Cut"}
                        onChange={(e) => setFormData({ ...formData, diamond_cut: e.target.value })}
                        className="admin-input"
                      >
                        <option value="Round Cut">Round Cut</option>
                        <option value="Princess">Princess</option>
                        <option value="Oval">Oval</option>
                        <option value="Pear">Pear</option>
                        <option value="Cushion">Cushion</option>
                        <option value="Emerald Cut">Emerald Cut</option>
                        <option value="Radiant Cut">Radiant Cut</option>
                        <option value="Marquise">Marquise</option>
                        <option value="Heart">Heart</option>
                      </select>
                    </div>
                  </div>

                  {/* 4Cs Diamond Specs */}
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Carat Weight (e.g. 0.50ct, 1.00ct)</label>
                      <input
                        type="text"
                        value={formData.diamond_spec?.carat_weight || "1.00"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diamond_spec: { ...formData.diamond_spec, carat_weight: e.target.value },
                          })
                        }
                        placeholder="e.g. 1.00"
                        className="admin-input"
                      />
                    </div>

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
                        className="admin-input"
                      >
                        <option value="excellent">Excellent Cut</option>
                        <option value="very_good">Very Good</option>
                        <option value="good">Good</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-grid-3">
                    <div>
                      <label className="admin-label">Colour Grade</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.diamond_spec?.colour_grade || "F Color"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diamond_spec: { ...formData.diamond_spec, colour_grade: e.target.value },
                          })
                        }
                        placeholder="e.g. F Color"
                        className="admin-input"
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
                        className="admin-input"
                      >
                        <option value="FL">FL (Flawless)</option>
                        <option value="IF">IF (Internally Flawless)</option>
                        <option value="VVS1">VVS1</option>
                        <option value="VVS2">VVS2</option>
                        <option value="VS1">VS1</option>
                        <option value="VS2">VS2</option>
                        <option value="SI1">SI1</option>
                        <option value="SI2">SI2</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Certification Lab</label>
                      <select
                        value={formData.diamond_spec?.certification_lab || "GIA"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diamond_spec: { ...formData.diamond_spec, certification_lab: e.target.value },
                          })
                        }
                        className="admin-input"
                      >
                        <option value="GIA">GIA Certified</option>
                        <option value="IGI">IGI Certified</option>
                        <option value="none">Uncertified</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="admin-label">Description & Craftsmanship Details</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter fine jewellery craftsmanship description..."
                      className="admin-textarea"
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Media — File Upload */}
              {activeTab === "media" && (
                <div className="admin-space-y-6">
                  {/* ── Image Upload ── */}
                  <div>
                    <label className="admin-info-label mb-3" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon className="w-4 h-4 text-[#c6a45f]" /> Product Images
                    </label>

                    {/* Thumbnail grid of already-uploaded images */}
                    {(formData.images || []).length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                        {formData.images!.map((img, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: "relative",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: img.isPrimary ? "2px solid #c6a45f" : "1px solid rgba(255,255,255,0.1)",
                              aspectRatio: "1",
                            }}
                          >
                            <img
                              src={img.url}
                              alt={`Product image ${idx + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23222' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' fill='%23666' text-anchor='middle' dominant-baseline='middle' font-size='12'%3ENo preview%3C/text%3E%3C/svg%3E"; }}
                            />
                            {img.isPrimary && (
                              <span style={{
                                position: "absolute", top: 4, left: 4,
                                background: "#c6a45f", color: "#000", fontSize: "9px", fontWeight: 700,
                                padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.5px",
                              }}>Primary</span>
                            )}
                            <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: "4px" }}>
                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  title="Set as primary"
                                  onClick={() => {
                                    const newImgs = (formData.images || []).map((im, i) => ({ ...im, isPrimary: i === idx }));
                                    setFormData({ ...formData, images: newImgs });
                                  }}
                                  style={{
                                    width: "22px", height: "22px", borderRadius: "50%", border: "none",
                                    background: "rgba(0,0,0,0.7)", color: "#c6a45f", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                                  }}
                                >★</button>
                              )}
                              <button
                                type="button"
                                title="Remove image"
                                onClick={() => {
                                  const newImgs = (formData.images || []).filter((_, i) => i !== idx);
                                  setFormData({ ...formData, images: newImgs });
                                }}
                                style={{
                                  width: "22px", height: "22px", borderRadius: "50%", border: "none",
                                  background: "rgba(220,38,38,0.85)", color: "#fff", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                                }}
                              >×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Drop zone for images */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setImageDragActive(true); }}
                      onDragLeave={() => setImageDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setImageDragActive(false);
                        if (e.dataTransfer.files.length > 0) handleImageUpload(e.dataTransfer.files);
                      }}
                      onClick={() => imageInputRef.current?.click()}
                      style={{
                        border: imageDragActive ? "2px solid #c6a45f" : "2px dashed rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        padding: "32px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: imageDragActive ? "rgba(198,164,95,0.08)" : "rgba(255,255,255,0.02)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) handleImageUpload(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      {uploadingImages ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <RefreshCw className="w-5 h-5 animate-spin text-[#c6a45f]" />
                          <span style={{ color: "#c6a45f", fontSize: "13px" }}>Uploading images...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.3)" }} />
                          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "4px" }}>
                            <strong style={{ color: "#c6a45f" }}>Click to browse</strong> or drag and drop images here
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                            JPG, PNG, WEBP — up to 10 MB each
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Video Upload ── */}
                  <div>
                    <label className="admin-info-label mb-3" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Film className="w-4 h-4 text-[#c6a45f]" /> Product Video (360° / Showcase)
                    </label>

                    {/* Preview existing video */}
                    {formData.video_url && (
                      <div style={{
                        position: "relative",
                        marginBottom: "16px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid rgba(198,164,95,0.3)",
                        background: "#0a0a0a",
                      }}>
                        <video
                          src={formData.video_url}
                          controls
                          style={{ width: "100%", maxHeight: "220px", objectFit: "contain" }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, video_url: "" })}
                          style={{
                            position: "absolute", top: 8, right: 8,
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: "rgba(220,38,38,0.9)", border: "none", color: "#fff",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "16px",
                          }}
                        >×</button>
                      </div>
                    )}

                    {/* Drop zone for video */}
                    {!formData.video_url && (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setVideoDragActive(true); }}
                        onDragLeave={() => setVideoDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setVideoDragActive(false);
                          if (e.dataTransfer.files.length > 0) handleVideoUpload(e.dataTransfer.files);
                        }}
                        onClick={() => videoInputRef.current?.click()}
                        style={{
                          border: videoDragActive ? "2px solid #c6a45f" : "2px dashed rgba(255,255,255,0.15)",
                          borderRadius: "12px",
                          padding: "32px 16px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: videoDragActive ? "rgba(198,164,95,0.08)" : "rgba(255,255,255,0.02)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) handleVideoUpload(e.target.files);
                            e.target.value = "";
                          }}
                        />
                        {uploadingVideo ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <RefreshCw className="w-5 h-5 animate-spin text-[#c6a45f]" />
                            <span style={{ color: "#c6a45f", fontSize: "13px" }}>Uploading video...</span>
                          </div>
                        ) : (
                          <>
                            <Film className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.3)" }} />
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "4px" }}>
                              <strong style={{ color: "#c6a45f" }}>Click to browse</strong> or drag and drop a video
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                              MP4, WEBM, MOV — up to 100 MB
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-white/10 admin-flex admin-items-center justify-end admin-gap-3">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
