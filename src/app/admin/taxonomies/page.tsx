"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash2, RefreshCw, X, Tag, Gem, Award, Layers } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminTaxonomyItem } from "@/lib/api/admin";

export default function AdminTaxonomiesPage() {
  const [activeTab, setActiveTab] = useState<"styles" | "diamondTypes" | "brands" | "collections">("styles");
  const [items, setItems] = useState<AdminTaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadTabItems() {
    setLoading(true);
    try {
      let res;
      if (activeTab === "styles") res = await adminApi.getStyles();
      else if (activeTab === "diamondTypes") res = await adminApi.getDiamondTypes();
      else if (activeTab === "brands") res = await adminApi.getBrands();
      else res = await adminApi.getCollections();

      setItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTabItems();
  }, [activeTab]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === "styles") await adminApi.createStyle({ name, slug });
      else if (activeTab === "diamondTypes") await adminApi.createDiamondType({ name, slug });
      else if (activeTab === "brands") await adminApi.createBrand({ name, slug });
      else await adminApi.createCollection({ name, slug, description: desc });

      toast.success("Item created successfully");
      setIsModalOpen(false);
      setName("");
      setSlug("");
      setDesc("");
      loadTabItems();
    } catch (err) {
      toast.error("Failed to create item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this taxonomy item?")) return;
    try {
      if (activeTab === "styles") await adminApi.deleteStyle(id);
      else if (activeTab === "diamondTypes") await adminApi.deleteDiamondType(id);
      else if (activeTab === "brands") await adminApi.deleteBrand(id);
      else await adminApi.deleteCollection(id);

      toast.success("Item deleted");
      loadTabItems();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="admin-space-y-6">
      {/* Header */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Taxonomies</h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="admin-btn admin-btn-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-filter-tabs modal-scrollbar">
        <button
          onClick={() => setActiveTab("styles")}
          className={`admin-filter-tab admin-flex admin-items-center admin-gap-2 ${activeTab === "styles" ? "active" : ""}`}
        >
          <Tag className="w-4 h-4" />
          <span>Styles</span>
        </button>

        <button
          onClick={() => setActiveTab("diamondTypes")}
          className={`admin-filter-tab admin-flex admin-items-center admin-gap-2 ${activeTab === "diamondTypes" ? "active" : ""}`}
        >
          <Gem className="w-4 h-4" />
          <span>Diamond Types</span>
        </button>

        <button
          onClick={() => setActiveTab("brands")}
          className={`admin-filter-tab admin-flex admin-items-center admin-gap-2 ${activeTab === "brands" ? "active" : ""}`}
        >
          <Award className="w-4 h-4" />
          <span>Brands</span>
        </button>

        <button
          onClick={() => setActiveTab("collections")}
          className={`admin-filter-tab admin-flex admin-items-center admin-gap-2 ${activeTab === "collections" ? "active" : ""}`}
        >
          <Layers className="w-4 h-4" />
          <span>Collections</span>
        </button>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="admin-loading">
          <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
          <span>Loading...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="admin-card admin-empty">
          <Sparkles />
          <p>No items found.</p>
        </div>
      ) : (
        <div className="admin-grid-3">
          {items.map((item) => (
            <div key={item.id} className="admin-card admin-flex-between gap-4">
              <div>
                <h4 className="admin-text-white admin-font-bold admin-text-sm">{item.name}</h4>
                <p className="admin-text-muted admin-text-xs font-mono">slug: {item.slug}</p>
                {item.description && <p className="admin-text-muted admin-text-xs mt-1">{item.description}</p>}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="admin-btn admin-btn-danger p-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm admin-space-y-4">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title uppercase">Add New Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="admin-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="admin-space-y-4">
              <div>
                <label className="admin-label">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solitaire Three Stone"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Slug (Optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="solitaire-three-stone"
                  className="admin-input"
                />
              </div>

              {activeTab === "collections" && (
                <div>
                  <label className="admin-label">Description</label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Collection summary..."
                    className="admin-textarea"
                  />
                </div>
              )}

              <div className="admin-flex admin-items-center justify-end admin-gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-gold">
                  {saving ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
