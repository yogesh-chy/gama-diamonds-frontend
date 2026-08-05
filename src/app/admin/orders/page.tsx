"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ShoppingBag,
  Eye,
  CheckCircle,
  X,
  Clock,
  Truck,
  Package,
  User,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminOrder } from "@/lib/api/admin";

const ORDER_STATUSES = [
  { key: "", label: "All Orders" },
  { key: "pending_payment", label: "Pending Payment" },
  { key: "paid", label: "Paid" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        status: activeStatus || undefined,
        search: searchQuery || undefined,
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await adminApi.updateOrderStatus(selectedOrder.id, newStatus);
      toast.success(`Order #${selectedOrder.id} status updated to ${newStatus.replace("_", " ")}`);
      setSelectedOrder(res.data);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? res.data : o)));
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="admin-space-y-6">
      {/* Header & Search */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">Orders</h2>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="admin-flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input admin-input-with-icon"
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-gold"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Status Filter Tabs */}
      <div className="admin-filter-tabs modal-scrollbar">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status.key}
            onClick={() => setActiveStatus(status.key)}
            className={`admin-filter-tab ${activeStatus === status.key ? "active" : ""}`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders List Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
            <span>Loading...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <ShoppingBag />
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin-font-bold admin-text-white">#{order.id}</td>
                    <td>
                      <p className="admin-text-white admin-font-medium">{order.address_full_name}</p>
                      <p className="admin-text-muted admin-text-xs">{order.user_email}</p>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${
                          order.status === "delivered" || order.status === "confirmed" || order.status === "paid"
                            ? "green"
                            : order.status === "shipped"
                            ? "blue"
                            : order.status === "cancelled"
                            ? "rose"
                            : "amber"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="admin-font-semibold admin-text-gold">
                      ₹{parseFloat(order.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="admin-text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="admin-btn admin-btn-outline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspect & Update Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-lg admin-space-y-6">
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-label">Order Details</span>
                <h3 className="admin-modal-title">Order #{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="admin-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Control */}
            <div className="admin-info-panel-gold admin-flex-between flex-col sm:flex-row gap-4">
              <div>
                <p className="admin-font-semibold admin-text-white uppercase tracking-wider text-xs">Update Status</p>
              </div>

              <select
                disabled={updatingStatus}
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="admin-select"
              >
                {ORDER_STATUSES.filter((s) => s.key).map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer & Shipping Info */}
            <div className="admin-grid-2">
              <div className="admin-info-panel admin-space-y-2">
                <div className="admin-info-label">
                  <User />
                  <span>Customer Profile</span>
                </div>
                <p className="admin-text-white admin-font-medium">{selectedOrder.address_full_name}</p>
                <p className="admin-text-muted">Email: {selectedOrder.user_email}</p>
                <p className="admin-text-muted">Phone: {selectedOrder.address_phone_number}</p>
              </div>

              <div className="admin-info-panel admin-space-y-2">
                <div className="admin-info-label">
                  <MapPin />
                  <span>Shipping Address</span>
                </div>
                <p className="admin-text-muted">{selectedOrder.address_street}</p>
                <p className="admin-text-muted">
                  {selectedOrder.address_city}, {selectedOrder.address_state} - {selectedOrder.address_postal_code}
                </p>
                <p className="admin-text-muted">{selectedOrder.address_country}</p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="admin-space-y-3">
              <h4 className="admin-info-label">Items in Order</h4>
              <div className="admin-info-panel">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="admin-order-row">
                    <div>
                      <p className="admin-text-white admin-font-medium">{item.product_name}</p>
                      <p className="admin-text-muted admin-text-xs">
                        SKU: {item.product_sku} {item.size ? `| Size: ${item.size}` : ""}
                      </p>
                    </div>
                    <div className="admin-text-right">
                      <p className="admin-text-gold admin-font-semibold">₹{parseFloat(item.line_total).toLocaleString()}</p>
                      <p className="admin-text-muted admin-text-xs">
                        {item.quantity} x ₹{parseFloat(item.product_price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="admin-divider" />
            <div className="admin-flex-between">
              <span className="admin-text-muted">Total Order Amount</span>
              <span className="admin-text-2xl admin-font-bold font-playfair admin-text-gold">
                ₹{parseFloat(selectedOrder.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
