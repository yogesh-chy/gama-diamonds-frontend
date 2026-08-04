"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ShoppingCart,
  Plus,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { adminApi, AdminOrder, AdminProduct, AdminCart, AdminUser } from "@/lib/api/admin";

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [ordersRes, productsRes, cartsRes, usersRes] = await Promise.allSettled([
          adminApi.getOrders(),
          adminApi.getProducts({ limit: 100 }),
          adminApi.getCarts(),
          adminApi.getUsers(),
        ]);

        if (ordersRes.status === "fulfilled") {
          const data = ordersRes.value.data;
          setOrders(Array.isArray(data) ? data : data.results || []);
        }
        if (productsRes.status === "fulfilled") {
          setProducts(productsRes.value.data.data || []);
        }
        if (cartsRes.status === "fulfilled") {
          const data = cartsRes.value.data;
          setCarts(Array.isArray(data) ? data : data.results || []);
        }
        if (usersRes.status === "fulfilled") {
          const data = usersRes.value.data;
          setUsers(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "confirmed" || o.status === "shipped" || o.status === "delivered")
    .reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "pending_payment" || o.status === "paid" || o.status === "confirmed");
  const lowStockProducts = products.filter((p) => p.total_stock <= 5);

  return (
    <div className="admin-space-y-6">
      {/* Top Banner / Welcome */}
      <div className="admin-banner">
        <div className="admin-banner-glow" />
        <div className="admin-banner-content">
          <div>
            <div className="admin-banner-tag">
              <Sparkles />
              <span>Luxury Management Suite</span>
            </div>
            <h2 className="admin-banner-title">
              Gama Diamonds Dashboard
            </h2>
            <p className="admin-banner-desc">
              Monitor customer orders, active shopping carts, inventory stock, catalog categories, and luxury diamond specifications.
            </p>
          </div>

          <div className="admin-banner-actions">
            <Link
              href="/admin/products?action=new"
              className="admin-btn admin-btn-gold"
            >
              <Plus />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/categories"
              className="admin-btn admin-btn-outline"
            >
              <span>Manage Categories</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="admin-metrics-grid">
        {/* Total Revenue */}
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-label">Total Revenue</span>
            <div className="admin-metric-icon">
              <DollarSign />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="admin-metric-sub green">
              <TrendingUp />
              <span>From confirmed orders</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-label">Total Orders</span>
            <div className="admin-metric-icon">
              <ShoppingBag />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value">{orders.length}</p>
            <p className="admin-metric-sub amber">
              <Clock />
              <span>{pendingOrders.length} active/processing</span>
            </p>
          </div>
        </div>

        {/* Active Carts */}
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-label">User Active Carts</span>
            <div className="admin-metric-icon">
              <ShoppingCart />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value">{carts.length}</p>
            <p className="admin-metric-sub gray">Live customer shopping carts</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-label">Total Products</span>
            <div className="admin-metric-icon">
              <Package />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value">{products.length}</p>
            <p className="admin-metric-sub rose">
              <AlertCircle />
              <span>{lowStockProducts.length} low in stock</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Inventory Alerts */}
      <div className="admin-overview-grid">
        {/* Recent Orders Section */}
        <div className="admin-card">
          <div className="admin-section-head">
            <div>
              <h3 className="admin-section-title">Recent Customer Orders</h3>
              <p className="admin-section-subtitle">Latest order updates from store shoppers</p>
            </div>
            <Link
              href="/admin/orders"
              className="admin-link-gold"
            >
              <span>View All</span>
              <ArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">No orders recorded yet.</div>
          ) : (
            <div>
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="admin-order-row">
                  <div>
                    <span className="admin-font-semibold admin-text-white">Order #{order.id}</span>
                    <span className="admin-text-muted admin-text-xs block">{order.user_email}</span>
                  </div>

                  <div className="admin-text-right">
                    <span className="admin-font-semibold admin-text-gold block">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                    <span className="admin-text-muted admin-text-xs">{order.items?.length || 0} items</span>
                  </div>

                  <div>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quick Actions */}
        <div className="admin-space-y-6">
          {/* Low Stock Warnings */}
          <div className="admin-card">
            <div className="admin-flex admin-items-center admin-gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="admin-section-title">Low Stock Alerts</h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="admin-text-muted admin-text-xs py-4">All inventory items are well-stocked.</p>
            ) : (
              <div className="admin-space-y-2 max-h-60 overflow-y-auto modal-scrollbar pr-1">
                {lowStockProducts.slice(0, 5).map((prod) => (
                  <div key={prod.id} className="admin-stock-item">
                    <div className="admin-truncate">
                      <p className="admin-text-white admin-font-medium admin-truncate">{prod.name}</p>
                      <p className="admin-text-muted admin-text-xs">SKU: {prod.sku}</p>
                    </div>
                    <span className="admin-stock-badge">
                      {prod.total_stock} Left
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="admin-divider" />
            <Link
              href="/admin/products"
              className="admin-link-gold admin-flex-between"
            >
              <span>Manage Inventory</span>
              <ArrowRight />
            </Link>
          </div>

          {/* Quick Nav Shortcuts */}
          <div className="admin-card admin-space-y-3">
            <h3 className="admin-section-title mb-2">Quick Operations</h3>

            <Link
              href="/admin/products"
              className="admin-quick-link"
            >
              <span>Product Catalog</span>
              <ArrowRight />
            </Link>

            <Link
              href="/admin/carts"
              className="admin-quick-link"
            >
              <span>Inspect Customer Carts</span>
              <ArrowRight />
            </Link>

            <Link
              href="/admin/users"
              className="admin-quick-link"
            >
              <span>User & Staff Directory</span>
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
