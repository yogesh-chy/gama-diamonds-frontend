"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminProduct, AdminCategory, AdminSubcategory, AdminTaxonomyItem } from "@/lib/api/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [subcategories, setSubcategories] = useState<AdminSubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "specs" | "diamond" | "media">("general");
  const [saving, setSaving] = useState(false);

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
    images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800", isPrimary: true }],
    sizes: [{ size: "M (UK)", stock: 5 }],
  });

  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes, subRes] = await Promise.allSettled([
        adminApi.getProducts({
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          limit: 100,
        }),
        adminApi.getCategories(),
        adminApi.getSubcategories(),
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value.data.data || []);
      }
      if (catRes.status === "fulfilled") {
        setCategories(catRes.value.data || []);
      }
      if (subRes.status === "fulfilled") {
        setSubcategories(subRes.value.data || []);
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
      images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800", isPrimary: true }],
      sizes: [{ size: "M", stock: 5 }],
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
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
      images: product.images && product.images.length > 0 ? product.images : [{ url: "", isPrimary: true }],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: "M", stock: 5 }],
    });
    setActiveTab("general");
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
                onClick={() => setActiveTab("general")}
                className={`admin-tab ${activeTab === "general" ? "active" : ""}`}
              >
                Basic Details
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`admin-tab ${activeTab === "pricing" ? "active" : ""}`}
              >
                Pricing & Stock
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`admin-tab ${activeTab === "specs" ? "active" : ""}`}
              >
                Metal & Style
              </button>
              <button
                onClick={() => setActiveTab("diamond")}
                className={`admin-tab ${activeTab === "diamond" ? "active" : ""}`}
              >
                4Cs Diamond Specs
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`admin-tab ${activeTab === "media" ? "active" : ""}`}
              >
                Images & Sizes
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="admin-space-y-4">
              {/* Tab 1: General */}
              {activeTab === "general" && (
                <div className="admin-space-y-4">
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

                  <div className="admin-grid-2">
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
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Description</label>
                    <textarea
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter detailed fine jewellery craftsmanship description..."
                      className="admin-textarea"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Pricing */}
              {activeTab === "pricing" && (
                <div className="admin-space-y-4">
                  <div className="admin-grid-2">
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
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Total Stock Count</label>
                      <input
                        type="number"
                        value={formData.total_stock || 0}
                        onChange={(e) => setFormData({ ...formData, total_stock: parseInt(e.target.value) || 0 })}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-flex admin-items-center admin-gap-6 pt-5">
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
                        <span className="admin-text-white admin-font-medium admin-text-xs">Featured Item</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Metal & Facets */}
              {activeTab === "specs" && (
                <div className="admin-space-y-4">
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Metal Type</label>
                      <select
                        value={formData.metal_type || "yellow-gold"}
                        onChange={(e) => setFormData({ ...formData, metal_type: e.target.value })}
                        className="admin-input"
                      >
                        <option value="yellow-gold">Yellow Gold</option>
                        <option value="white-gold">White Gold</option>
                        <option value="rose-gold">Rose Gold</option>
                        <option value="platinum">Platinum</option>
                        <option value="silver">Silver</option>
                        <option value="two-tone">Two-Tone</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Metal Karat</label>
                      <select
                        value={formData.metal_karat || "18K"}
                        onChange={(e) => setFormData({ ...formData, metal_karat: e.target.value })}
                        className="admin-input"
                      >
                        <option value="9K">9ct</option>
                        <option value="14K">14ct</option>
                        <option value="18K">18ct</option>
                        <option value="22K">22ct</option>
                        <option value="950Pt">950 Platinum</option>
                        <option value="925Ag">925 Silver</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Diamond Shape / Cut</label>
                      <select
                        value={formData.diamond_cut || "round"}
                        onChange={(e) => setFormData({ ...formData, diamond_cut: e.target.value })}
                        className="admin-input"
                      >
                        <option value="round">Round Brilliant</option>
                        <option value="princess">Princess</option>
                        <option value="oval">Oval</option>
                        <option value="pear">Pear</option>
                        <option value="cushion">Cushion</option>
                        <option value="emerald-cut">Emerald</option>
                        <option value="radiant">Radiant Cut</option>
                        <option value="marquise">Marquise</option>
                        <option value="asscher">Asscher</option>
                        <option value="heart">Heart</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Band Fit</label>
                      <select
                        value={formData.band_fit || "comfort"}
                        onChange={(e) => setFormData({ ...formData, band_fit: e.target.value })}
                        className="admin-input"
                      >
                        <option value="comfort">Comfort Fit</option>
                        <option value="standard">Standard / Traditional Fit</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: 4Cs Diamond Specs */}
              {activeTab === "diamond" && (
                <div className="admin-space-y-4">
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Carat Weight (ct)</label>
                      <input
                        type="text"
                        value={formData.diamond_spec?.carat_weight || "1.00"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diamond_spec: { ...formData.diamond_spec, carat_weight: e.target.value },
                          })
                        }
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
                        <option value="excellent">Excellent</option>
                        <option value="very_good">Very Good</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">Colour Grade (D-Z)</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.diamond_spec?.colour_grade || "G"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diamond_spec: { ...formData.diamond_spec, colour_grade: e.target.value.toUpperCase() },
                          })
                        }
                        className="admin-input uppercase"
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
                  </div>
                </div>
              )}

              {/* Tab 5: Media & Sizes */}
              {activeTab === "media" && (
                <div className="admin-space-y-4">
                  <div>
                    <label className="admin-info-label mb-2">
                      Product Images (URL)
                    </label>
                    {formData.images?.map((img, idx) => (
                      <div key={idx} className="admin-flex admin-items-center gap-2 mb-3">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={img.url}
                          onChange={(e) => {
                            const newImgs = [...(formData.images || [])];
                            newImgs[idx].url = e.target.value;
                            setFormData({ ...formData, images: newImgs });
                          }}
                          className="admin-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = formData.images?.filter((_, i) => i !== idx);
                            setFormData({ ...formData, images: newImgs });
                          }}
                          className="admin-btn admin-btn-danger p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...(formData.images || []), { url: "", isPrimary: false }] })}
                      className="admin-link-gold text-xs mt-4 inline-flex admin-items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Image URL</span>
                    </button>
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
