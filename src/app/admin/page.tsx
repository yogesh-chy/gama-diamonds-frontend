"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  ShoppingCart,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
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
    <div className="admin-space-y-6" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Metrics Cards Grid - Smaller in Height */}
      <div
        className="admin-metrics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Total Revenue */}
        <div className="admin-metric-card" style={{ padding: "16px 20px", background: "#0a0a0a", border: "1px solid rgba(198, 164, 95, 0.2)" }}>
          <div className="admin-metric-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span className="admin-metric-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "1.5px" }}>Total Revenue</span>
            <div className="admin-metric-icon" style={{ color: "#c6a45f" }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: "0 0 4px" }}>
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="admin-metric-sub green" style={{ fontSize: "10px", color: "#4ade80", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
              <TrendingUp size={12} />
              <span>From confirmed orders</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-metric-card" style={{ padding: "16px 20px", background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div className="admin-metric-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span className="admin-metric-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "1.5px" }}>Total Orders</span>
            <div className="admin-metric-icon" style={{ color: "#c6a45f" }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: "0 0 4px" }}>
              {orders.length}
            </p>
            <p className="admin-metric-sub amber" style={{ fontSize: "10px", color: "#fbbf24", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
              <Clock size={12} />
              <span>{pendingOrders.length} active/processing</span>
            </p>
          </div>
        </div>

        {/* Active Carts */}
        <div className="admin-metric-card" style={{ padding: "16px 20px", background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div className="admin-metric-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span className="admin-metric-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "1.5px" }}>Active Carts</span>
            <div className="admin-metric-icon" style={{ color: "#c6a45f" }}>
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: "0 0 4px" }}>
              {carts.length}
            </p>
            <p className="admin-metric-sub gray" style={{ fontSize: "10px", color: "#888888", margin: 0 }}>
              Live customer shopping carts
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="admin-metric-card" style={{ padding: "16px 20px", background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div className="admin-metric-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span className="admin-metric-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "1.5px" }}>Total Products</span>
            <div className="admin-metric-icon" style={{ color: "#c6a45f" }}>
              <Package size={18} />
            </div>
          </div>
          <div className="admin-metric-body">
            <p className="admin-metric-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: "0 0 4px" }}>
              {products.length}
            </p>
            <p className="admin-metric-sub rose" style={{ fontSize: "10px", color: "#f43f5e", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
              <AlertCircle size={12} />
              <span>{lowStockProducts.length} low in stock</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders (Expanded Width) & Stock Alerts + Operations (Narrower 280px Width) */}
      <div
        className="admin-overview-grid flex flex-col lg:flex-row gap-5"
      >
        {/* Recent Orders Section - Takes Remaining Expanded Width */}
        <div className="admin-card flex-1" style={{ padding: "20px", background: "#080808", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div className="admin-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div>
              <h3 className="admin-section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#ffffff", margin: 0 }}>
                Recent Customer Orders
              </h3>
            </div>
            <Link
              href="/admin/orders"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#c6a45f", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", textDecoration: "none" }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div style={{ color: "#888888", fontSize: "12px", padding: "16px 0" }}>Loading order records...</div>
          ) : orders.length === 0 ? (
            <div style={{ color: "#888888", fontSize: "12px", padding: "16px 0" }}>No orders recorded yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#0c0c0c",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: "#ffffff", fontSize: "12px", display: "block" }}>Order #{order.id}</span>
                    <span style={{ color: "#888888", fontSize: "10px" }}>{order.user_email}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 600, color: "#c6a45f", fontSize: "12px", display: "block" }}>₹{parseFloat(order.total_amount).toLocaleString()}</span>
                    <span style={{ color: "#888888", fontSize: "10px" }}>{order.items?.length || 0} items</span>
                  </div>

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        fontSize: "9px",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        backgroundColor:
                          order.status === "delivered" || order.status === "confirmed" || order.status === "paid"
                            ? "rgba(34, 197, 94, 0.15)"
                            : order.status === "shipped"
                              ? "rgba(59, 130, 246, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                        color:
                          order.status === "delivered" || order.status === "confirmed" || order.status === "paid"
                            ? "#4ade80"
                            : order.status === "shipped"
                              ? "#60a5fa"
                              : "#fbbf24",
                        border: `1px solid ${order.status === "delivered" || order.status === "confirmed" || order.status === "paid"
                          ? "rgba(34, 197, 94, 0.3)"
                          : order.status === "shipped"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(245, 158, 11, 0.3)"
                          }`,
                      }}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quick Operations - Narrower Fixed 280px Width Column */}
        <div className="w-full lg:w-[280px] shrink-0" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Low Stock Alerts */}
          <div className="admin-card" style={{ padding: "16px 18px", background: "#080808", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <AlertCircle size={15} style={{ color: "#fbbf24" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#ffffff", margin: 0 }}>
                Low Stock Alerts
              </h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <p style={{ color: "#888888", fontSize: "11px", padding: "8px 0", margin: 0 }}>All inventory items are well-stocked.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                {lowStockProducts.slice(0, 5).map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#0c0c0c",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.name}</p>
                      <p style={{ color: "#888888", fontSize: "9px", margin: 0 }}>SKU: {prod.sku}</p>
                    </div>
                    <span style={{ fontSize: "9px", color: "#f43f5e", fontWeight: 600, border: "1px solid rgba(244, 63, 94, 0.3)", padding: "2px 6px", flexShrink: 0, marginLeft: "8px" }}>
                      {prod.total_stock} Left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Operations */}
          <div className="admin-card" style={{ padding: "16px 18px", background: "#080808", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#ffffff", margin: "0 0 12px" }}>
              Quick Operations
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                href="/admin/products"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0c0c0c", color: "#ffffff", textDecoration: "none", fontSize: "11px", letterSpacing: "0.5px", transition: "all 0.3s ease" }}
              >
                <span>Product Catalog</span>
                <ArrowRight size={13} style={{ color: "#c6a45f" }} />
              </Link>

              <Link
                href="/admin/carts"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0c0c0c", color: "#ffffff", textDecoration: "none", fontSize: "11px", letterSpacing: "0.5px", transition: "all 0.3s ease" }}
              >
                <span>Customer Active Carts</span>
                <ArrowRight size={13} style={{ color: "#c6a45f" }} />
              </Link>

              <Link
                href="/admin/users"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0c0c0c", color: "#ffffff", textDecoration: "none", fontSize: "11px", letterSpacing: "0.5px", transition: "all 0.3s ease" }}
              >
                <span>User Directory</span>
                <ArrowRight size={13} style={{ color: "#c6a45f" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
