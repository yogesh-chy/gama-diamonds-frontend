"use client";

import { useEffect, useState } from "react";
import { Plus, FolderTree, Edit2, Trash2, X, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminCategory, AdminSubcategory } from "@/lib/api/admin";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Subcategory Modal
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<AdminSubcategory | null>(null);
  const [subParentCat, setSubParentCat] = useState<number>(0);
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");

  const [saving, setSaving] = useState(false);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Category Modal
  const openAddCategoryModal = () => {
    setEditingCat(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setIsCatModalOpen(true);
  };

  const openEditCategoryModal = (cat: AdminCategory) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || "");
    setIsCatModalOpen(true);
  };

  // Open Subcategory Modal
  const openAddSubcategoryModal = (parentCatId?: number) => {
    setEditingSub(null);
    setSubParentCat(parentCatId || (categories[0]?.id ?? 0));
    setSubName("");
    setSubSlug("");
    setIsSubModalOpen(true);
  };

  const openEditSubcategoryModal = (sub: AdminSubcategory) => {
    setEditingSub(sub);
    setSubParentCat(sub.category);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setIsSubModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, { name: catName, slug: catSlug, description: catDesc });
        toast.success("Category updated successfully");
      } else {
        await adminApi.createCategory({ name: catName, slug: catSlug, description: catDesc });
        toast.success("Category created successfully");
      }
      setIsCatModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Save Subcategory
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subParentCat) {
      toast.error("Please select a parent category");
      return;
    }
    setSaving(true);
    try {
      if (editingSub) {
        await adminApi.updateSubcategory(editingSub.id, { category: subParentCat, name: subName, slug: subSlug });
        toast.success("Subcategory updated successfully");
      } else {
        await adminApi.createSubcategory({ category: subParentCat, name: subName, slug: subSlug });
        toast.success("Subcategory created successfully");
      }
      setIsSubModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to save subcategory");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await adminApi.deleteSubcategory(id);
      toast.success("Subcategory deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="admin-space-y-6">
      {/* Header */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Categories</h2>
        </div>

        <div className="admin-flex admin-items-center admin-gap-3">
          <button
            onClick={() => openAddCategoryModal()}
            className="admin-btn admin-btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => openAddSubcategoryModal()}
            className="admin-btn admin-btn-outline"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {/* Category Tree Grid */}
      {loading ? (
        <div className="admin-loading">
          <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
          <span>Loading...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-card admin-empty">
          <FolderTree />
          <p>No categories created yet.</p>
        </div>
      ) : (
        <div className="admin-grid-2">
          {categories.map((cat) => (
            <div key={cat.id} className="admin-card admin-space-y-4">
              {/* Category Header */}
              <div className="admin-flex-between pb-3 border-b border-white/10">
                <div className="admin-flex admin-items-center admin-gap-3">
                  <div className="admin-sidebar-avatar">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="admin-text-white admin-font-bold font-playfair">{cat.name}</h3>
                    <p className="admin-text-muted admin-text-xs font-mono">slug: /{cat.slug}</p>
                  </div>
                </div>

                <div className="admin-flex admin-items-center admin-gap-2">
                  <button
                    onClick={() => openEditCategoryModal(cat)}
                    className="admin-btn admin-btn-ghost p-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="admin-btn admin-btn-danger p-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="admin-space-y-2">
                <div className="admin-flex-between">
                  <span className="admin-info-label">
                    Subcategories ({cat.subcategories?.length || 0})
                  </span>
                  <button
                    onClick={() => openAddSubcategoryModal(cat.id)}
                    className="admin-link-gold text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New</span>
                  </button>
                </div>

                {!cat.subcategories || cat.subcategories.length === 0 ? (
                  <p className="admin-text-muted italic py-2">No subcategories yet.</p>
                ) : (
                  <div className="admin-space-y-2">
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id} className="admin-stock-item">
                        <div className="admin-flex admin-items-center admin-gap-2">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          <span className="admin-text-white admin-font-medium">{sub.name}</span>
                          <span className="admin-text-muted admin-text-xs font-mono">({sub.slug})</span>
                        </div>

                        <div className="admin-flex admin-items-center admin-gap-1.5">
                          <button
                            onClick={() => openEditSubcategoryModal(sub)}
                            className="admin-btn admin-btn-ghost p-1"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(sub.id)}
                            className="admin-btn admin-btn-danger p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {isCatModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm admin-space-y-4">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingCat ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="admin-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="admin-space-y-4">
              <div>
                <label className="admin-label">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Engagement Rings"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Slug (Optional)</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="engagement-rings"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Category description..."
                  className="admin-textarea"
                />
              </div>

              <div className="admin-flex admin-items-center justify-end admin-gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-gold">
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Add/Edit Modal */}
      {isSubModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm admin-space-y-4">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingSub ? "Edit Subcategory" : "Add New Subcategory"}
              </h3>
              <button onClick={() => setIsSubModalOpen(false)} className="admin-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcategory} className="admin-space-y-4">
              <div>
                <label className="admin-label">Parent Category</label>
                <select
                  value={subParentCat}
                  onChange={(e) => setSubParentCat(Number(e.target.value))}
                  className="admin-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Subcategory Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Solitaire Rings"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Slug (Optional)</label>
                <input
                  type="text"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value)}
                  placeholder="solitaire-rings"
                  className="admin-input"
                />
              </div>

              <div className="admin-flex admin-items-center justify-end admin-gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-gold">
                  {saving ? "Saving..." : "Save Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
