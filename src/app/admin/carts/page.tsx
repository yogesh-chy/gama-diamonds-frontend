"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingCart, RefreshCw, User, Package, Clock } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminCart } from "@/lib/api/admin";

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchCarts() {
    setLoading(true);
    try {
      const res = await adminApi.getCarts({ search: searchQuery || undefined });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCarts(data);
    } catch (err) {
      toast.error("Failed to load customer carts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCarts();
  };

  return (
    <div className="admin-space-y-6">
      {/* Header & Search */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Customer Active Carts</h2>
          <p className="admin-section-subtitle">
            Inspect real-time items queued in shoppers' active carts before checkout.
          </p>
        </div>

        <form onSubmit={handleSearch} className="admin-flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input admin-input-with-icon"
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-gold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Active Carts Grid */}
      {loading ? (
        <div className="admin-loading">
          <RefreshCw className="w-5 h-5 animate-spin text-[#c6a45f]" />
          <span>Fetching live shopping carts...</span>
        </div>
      ) : carts.length === 0 ? (
        <div className="admin-card admin-empty">
          <ShoppingCart />
          <p>No active user carts found.</p>
        </div>
      ) : (
        <div className="admin-grid-2">
          {carts.map((cart) => (
            <div key={cart.id} className="admin-card admin-space-y-4">
              {/* Cart Top Info */}
              <div className="admin-flex-between pb-3 border-b border-white/10">
                <div className="admin-flex admin-items-center admin-gap-3">
                  <div className="admin-sidebar-avatar">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="admin-text-white admin-font-semibold admin-text-xs">{cart.user_email}</p>
                    <p className="admin-text-muted admin-text-xs admin-flex admin-items-center admin-gap-1">
                      <Clock className="w-3 h-3 text-[#c6a45f]" />
                      <span>Updated {new Date(cart.updated_at).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="admin-text-right">
                  <span className="admin-text-xl admin-font-bold font-playfair admin-text-gold block">
                    ₹{parseFloat(cart.total_amount || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="admin-text-muted admin-text-xs">
                    {cart.total_items} items
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="admin-space-y-2">
                <p className="admin-info-label">Cart Contents</p>
                {!cart.items || cart.items.length === 0 ? (
                  <p className="admin-text-muted italic py-2">Cart is empty</p>
                ) : (
                  <div className="admin-space-y-2 max-h-48 overflow-y-auto modal-scrollbar pr-1">
                    {cart.items.map((item) => (
                      <div key={item.id} className="admin-stock-item">
                        <div className="admin-flex admin-items-center admin-gap-3 admin-truncate">
                          {item.product_detail?.image_url ? (
                            <img
                              src={item.product_detail.image_url}
                              alt={item.product_detail.name}
                              className="w-10 h-10 object-cover rounded border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="admin-truncate">
                            <p className="admin-text-white admin-font-medium admin-truncate">{item.product_detail?.name || `Product #${item.product}`}</p>
                            <p className="admin-text-muted admin-text-xs">
                              SKU: {item.product_detail?.sku || "N/A"} {item.size ? `| Size: ${item.size}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="admin-text-right shrink-0">
                          <p className="admin-text-gold admin-font-semibold">₹{parseFloat(item.line_total).toLocaleString()}</p>
                          <p className="admin-text-muted admin-text-xs">{item.quantity} Qty</p>
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
    </div>
  );
}
