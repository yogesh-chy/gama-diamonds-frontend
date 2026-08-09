"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Plus,
  X,
  LogOut,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { authApi } from "@/lib/api/auth";
import { ordersApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { Order, OrderItem } from "@/lib/api/orders";
import type { Address as BackendAddress } from "@/lib/api/auth";

interface AddressForm {
  country: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  isDefault: boolean;
}

/**
 * The backend User model only stores email + phone_number (OTP-based auth
 * has no "name" field). We derive a friendly display name from the email
 * local-part purely for greeting copy — it's never sent back to the API.
 */
function displayNameFromEmail(email: string | undefined): string {
  if (!email) return "there";
  const local = email.split("@")[0] || "";
  const words = local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.length ? words.join(" ") : "there";
}

function AccountDashboardContent() {
  const { user, logout, refreshUser } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const displayName = displayNameFromEmail(user?.email);

  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Backend data
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [backendAddresses, setBackendAddresses] = useState<BackendAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  // Modal States
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState<AddressForm>({
    country: "United Kingdom",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    phone: "+44",
    isDefault: true,
  });

  // Fetch orders when the orders tab becomes active
  useEffect(() => {
    if (activeTab !== "orders") return;
    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);
    ordersApi
      .list()
      .then((res) => {
        if (!cancelled) {
          setOrders(res.data.results ?? res.data);
          setOrdersLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setOrdersError(getApiErrorMessage(err, "Failed to load orders."));
          setOrdersLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // Fetch addresses when the profile tab becomes active
  useEffect(() => {
    if (activeTab !== "profile") return;
    let cancelled = false;
    setAddressesLoading(true);
    setAddressesError(null);
    authApi
      .listAddresses()
      .then((res) => {
        if (!cancelled) {
          const data = res.data;
          const mapped: BackendAddress[] = Array.isArray(data)
            ? data.map((a) => ({
              id: a.id,
              full_name: a.full_name,
              phone_number: a.phone_number,
              street_address: a.street_address,
              city: a.city,
              state: a.state || "",
              postal_code: a.postal_code,
              country: a.country,
              is_default: a.is_default,
            }))
            : data.results?.map((a: any) => ({
              id: a.id,
              full_name: a.full_name,
              phone_number: a.phone_number,
              street_address: a.street_address,
              city: a.city,
              state: a.state || "",
              postal_code: a.postal_code,
              country: a.country,
              is_default: a.is_default,
            })) ?? [];
          setBackendAddresses(mapped);
          setAddressesLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setAddressesError(getApiErrorMessage(err, "Failed to load addresses."));
          setAddressesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // Contact Form State — email is read-only (backend identifier), only
  // phone_number is actually editable/persisted. ProtectedRoute guarantees
  // `user` is already loaded by the time this component renders, and the
  // "Edit" button re-seeds this with the latest value before opening the modal.
  const [contactForm, setContactForm] = useState({ phone: user?.phone_number || "" });

  // Open modal for Adding new address
  const handleOpenAddAddress = () => {
    setEditingAddressIndex(null);
    setAddressForm({
      country: "United Kingdom",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postcode: "",
      phone: "+44",
      isDefault: backendAddresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  // Open modal for Editing existing address
  const handleOpenEditAddress = (index: number) => {
    const addr = backendAddresses[index];
    const nameParts = addr.full_name.split(" ");
    setEditingAddressIndex(index);
    setAddressForm({
      country: addr.country,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      company: "",
      address: addr.street_address,
      apartment: "",
      city: addr.city,
      state: addr.state,
      postcode: addr.postal_code,
      phone: addr.phone_number,
      isDefault: addr.is_default,
    });
    setAddressModalOpen(true);
  };

  // Save Address — persists to the backend.
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressIndex !== null) {
      try {
        const addr = backendAddresses[editingAddressIndex];
        await authApi.updateAddress(addr.id, {
          full_name: `${addressForm.firstName} ${addressForm.lastName}`.trim(),
          phone_number: addressForm.phone,
          street_address: addressForm.address,
          city: addressForm.city,
          state: addressForm.state,
          postal_code: addressForm.postcode,
          country: addressForm.country,
          is_default: addressForm.isDefault,
        });
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Couldn't update your address."));
        return;
      }
      setBackendAddresses((prev) =>
        prev.map((a, i) =>
          i === editingAddressIndex
            ? {
              ...a,
              full_name: `${addressForm.firstName} ${addressForm.lastName}`.trim(),
              phone_number: addressForm.phone,
              street_address: addressForm.address,
              city: addressForm.city,
              state: addressForm.state,
              postal_code: addressForm.postcode,
              country: addressForm.country,
              is_default: addressForm.isDefault,
            }
            : a
        )
      );
    } else {
      try {
        const payload = {
          full_name: `${addressForm.firstName} ${addressForm.lastName}`.trim(),
          phone_number: addressForm.phone,
          street_address: addressForm.address,
          city: addressForm.city,
          state: addressForm.state,
          postal_code: addressForm.postcode,
          country: addressForm.country,
          is_default: addressForm.isDefault,
        };
        const { data } = await authApi.createAddress(payload);
        setBackendAddresses((prev) => [
          ...prev,
          {
            id: data.id,
            full_name: `${addressForm.firstName} ${addressForm.lastName}`.trim(),
            phone_number: addressForm.phone,
            street_address: addressForm.address,
            city: addressForm.city,
            state: addressForm.state,
            postal_code: addressForm.postcode,
            country: addressForm.country,
            is_default: addressForm.isDefault,
          },
        ]);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Couldn't save your address."));
        return;
      }
    }
    setAddressModalOpen(false);
  };

  // Save Contact Details — persists phone_number to the backend.
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingContact) return;
    setIsSavingContact(true);
    try {
      await authApi.updateMe({ phone_number: contactForm.phone });
      await refreshUser();
      toast.success("Contact details updated.");
      setContactModalOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update your details."));
    } finally {
      setIsSavingContact(false);
    }
  };

  // Sign out — clears the session both server- and client-side.
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#040404",
        color: "#ffffff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 25%, rgba(198, 164, 95, 0.08) 0%, rgba(18, 14, 8, 0.3) 45%, rgba(4, 4, 4, 1) 85%)",
      }}
    >
      {/* ── Top Header Logo ── */}
      <header
        style={{
          width: "100%",
          padding: "24px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Spacer for alignment balance */}
        <div style={{ width: "80px" }} />

        {/* Exact Centered Logo */}
        <Link href="/" className="logo-link" style={{ position: "static", transform: "none" }}>
          <span className="logo-tagline">✦ GAMA ✦</span>
          <span className="logo-name">DIAMOND</span>
          <div className="logo-underline" />
        </Link>

        {/* Right Action Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            href="/cart"
            style={{
              color: "#bfbfbf",
              transition: "color 0.3s",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0px",
              border: "1px solid rgba(198, 164, 95, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c6a45f",
              backgroundColor: "rgba(198, 164, 95, 0.06)",
            }}
          >
            <User size={15} strokeWidth={1.5} />
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ── */}
      <main
        style={{
          flex: 1,
          maxWidth: "1160px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 24px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "56px",
            height: "100%",
          }}
        >
          {/* ── Left Sidebar Navigation ── */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              borderRight: "1px solid rgba(255, 255, 255, 0.06)",
              paddingRight: "24px",
              alignSelf: "stretch",
              position: "sticky",
              top: "0",
              height: "calc(95vh - 130px)",
              flexShrink: 0,
              paddingBottom: "24px",
            }}
          >
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background:
                  activeTab === "orders" ? "rgba(198, 164, 95, 0.08)" : "transparent",
                border: "none",
                borderLeft:
                  activeTab === "orders"
                    ? "2px solid #c6a45f"
                    : "2px solid transparent",
                color: activeTab === "orders" ? "#ffffff" : "#888888",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: activeTab === "orders" ? "600" : "400",
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s ease",
              }}
            >
              <Package size={15} style={{ color: activeTab === "orders" ? "#c6a45f" : "#666" }} />
              Orders
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background:
                  activeTab === "profile" ? "rgba(198, 164, 95, 0.08)" : "transparent",
                border: "none",
                borderLeft:
                  activeTab === "profile"
                    ? "2px solid #c6a45f"
                    : "2px solid transparent",
                color: activeTab === "profile" ? "#ffffff" : "#888888",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: activeTab === "profile" ? "600" : "400",
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s ease",
              }}
            >
              <User size={15} style={{ color: activeTab === "profile" ? "#c6a45f" : "#666" }} />
              Profile
            </button>

            {/* ── Sign Out ── */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  color: "#ffffff",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11.5px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.7 : 1,
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
              >
                {isLoggingOut ? (
                  <Loader2 size={13} className="animate-spin" style={{ color: "#c6a45f" }} />
                ) : (
                  <LogOut size={13} style={{ color: "#c6a45f" }} />
                )}
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </nav>

          {/* ── Main Content Area ── */}
          <section style={{ overflowY: "auto", paddingBottom: "80px", paddingRight: "8px" }}>
            <AnimatePresence mode="wait">
              {/* TAB 1: ORDERS */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Welcome Luxury Banner */}
                  <div
                    style={{
                      backgroundColor: "rgba(10, 10, 10, 0.7)",
                      border: "1px solid rgba(198, 164, 95, 0.2)",
                      borderRadius: "0px",
                      padding: "36px 40px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "40px",
                      background:
                        "linear-gradient(135deg, rgba(198,164,95,0.06) 0%, rgba(8,8,8,0.95) 100%)",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.75rem",
                          fontWeight: "500",
                          color: "#ffffff",
                          marginBottom: "4px",
                        }}
                      >
                        Welcome, {displayName.split(" ")[0]}
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                          color: "#999999",
                          margin: 0,
                        }}
                      >
                        Ready to shop? Discover our bespoke fine jewellery.
                      </p>
                    </div>

                    <Link
                      href="/rings"
                      style={{
                        backgroundColor: "#c6a45f",
                        color: "#000000",
                        padding: "12px 30px",
                        borderRadius: "0px",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10.5px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "background-color 0.3s ease",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4b472")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a45f")}
                    >
                      Shop now
                    </Link>
                  </div>

                  {/* Orders History Section */}
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.3rem",
                        color: "#ffffff",
                        marginBottom: "20px",
                        fontWeight: "500",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Order History
                    </h3>

                    {ordersLoading && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "32px 0",
                          color: "#888888",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        <Loader2 size={18} className="animate-spin" style={{ color: "#c6a45f" }} />
                        Loading orders…
                      </div>
                    )}

                    {ordersError && (
                      <div
                        style={{
                          padding: "20px 24px",
                          backgroundColor: "rgba(255, 60, 60, 0.06)",
                          border: "1px solid rgba(255, 60, 60, 0.15)",
                          borderRadius: "0px",
                          color: "#ff6b6b",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        {ordersError}
                      </div>
                    )}

                    {!ordersLoading && !ordersError && orders.length === 0 && (
                      <div
                        style={{
                          padding: "32px 24px",
                          backgroundColor: "rgba(255, 255, 255, 0.015)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "0px",
                          color: "#888888",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        No orders yet. Start shopping to see your orders here.
                      </div>
                    )}

                    {!ordersLoading && !ordersError && orders.map((order) => (
                      <div
                        key={order.id}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.015)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "0px",
                          padding: "24px 28px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "6px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#c6a45f",
                                letterSpacing: "1px",
                              }}
                            >
                              #GAMA-{order.id}
                            </span>
                            <span
                              style={{
                                fontSize: "9.5px",
                                backgroundColor: "rgba(198, 164, 95, 0.15)",
                                color: "#c6a45f",
                                padding: "2px 10px",
                                borderRadius: "0px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                border: "1px solid rgba(198, 164, 95, 0.25)",
                              }}
                            >
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "12.5px",
                              color: "#888888",
                              margin: 0,
                            }}
                          >
                            {order.items.length > 0
                              ? `${order.items[0].quantity}x ${order.items[0].product_name} · Placed on ${new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                              : `No items · Placed on ${new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                            }
                          </p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#ffffff",
                              marginBottom: "4px",
                            }}
                          >
                            {formatPrice(Number(order.total_amount))}
                          </div>
                          <Link
                            href={`/account/orders/${order.id}`}
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "11px",
                              color: "#c6a45f",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: PROFILE */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", flexDirection: "column", gap: "36px" }}
                >
                  {/* Contact Section */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.25rem",
                          color: "#ffffff",
                          fontWeight: "500",
                          margin: 0,
                        }}
                      >
                        Contact
                      </h3>
                      <button
                        onClick={() => {
                          setContactForm({ phone: user?.phone_number || "" });
                          setContactModalOpen(true);
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid rgba(198, 164, 95, 0.4)",
                          color: "#c6a45f",
                          borderRadius: "0px",
                          padding: "6px 20px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "600",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(198, 164, 95, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        Edit
                      </button>
                    </div>

                    {/* Contact Detail Card */}
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.015)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "0px",
                        padding: "18px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "12px",
                          color: "#888888",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Email
                      </span>
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13.5px",
                          color: "#ffffff",
                          fontWeight: "500",
                        }}
                      >
                        {user?.email}
                      </span>
                    </div>

                    {/* Phone row */}
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.015)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderTop: "none",
                        borderRadius: "0px",
                        padding: "18px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "12px",
                          color: "#888888",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Phone
                      </span>
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13.5px",
                          color: user?.phone_number ? "#ffffff" : "#666666",
                          fontWeight: "500",
                        }}
                      >
                        {user?.phone_number || "Not added"}
                      </span>
                    </div>
                  </div>

                  {/* Addresses Section */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.25rem",
                          color: "#ffffff",
                          fontWeight: "500",
                          margin: 0,
                        }}
                      >
                        Address
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={handleOpenAddAddress}
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid rgba(198, 164, 95, 0.4)",
                            color: "#c6a45f",
                            borderRadius: "0px",
                            padding: "6px 14px",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(198, 164, 95, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <Plus size={12} /> Add
                        </button>
                        <button
                          onClick={() => handleOpenEditAddress(0)}
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid rgba(198, 164, 95, 0.4)",
                            color: "#c6a45f",
                            borderRadius: "0px",
                            padding: "6px 14px",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(198, 164, 95, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Address List / Card */}
                    {addressesLoading && (
                      <div
                        style={{
                          padding: "24px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          color: "#888888",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        <Loader2 size={18} className="animate-spin" style={{ color: "#c6a45f" }} />
                        Loading addresses…
                      </div>
                    )}

                    {addressesError && (
                      <div
                        style={{
                          padding: "20px 24px",
                          backgroundColor: "rgba(255, 60, 60, 0.06)",
                          border: "1px solid rgba(255, 60, 60, 0.15)",
                          borderRadius: "0px",
                          color: "#ff6b6b",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        {addressesError}
                      </div>
                    )}

                    {!addressesLoading && !addressesError && backendAddresses.length === 0 && (
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.015)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "0px",
                          padding: "24px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          color: "#888888",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        <MapPin size={18} style={{ color: "#666666" }} />
                        No addresses added
                      </div>
                    )}

                    {!addressesLoading && !addressesError && backendAddresses.map((addr, idx) => (
                      <div
                        key={addr.id ?? idx}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.015)",
                          border: addr.isDefault
                            ? "1px solid rgba(198, 164, 95, 0.35)"
                            : "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "0px",
                          padding: "20px 24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                          <MapPin
                            size={18}
                            style={{ color: "#c6a45f", marginTop: "2px", flexShrink: 0 }}
                          />
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#ffffff",
                                }}
                              >
                                {addr.firstName} {addr.lastName}
                              </span>
                              {addr.isDefault && (
                                <span
                                  style={{
                                    fontSize: "9px",
                                    backgroundColor: "rgba(198, 164, 95, 0.15)",
                                    color: "#c6a45f",
                                    padding: "1px 8px",
                                    borderRadius: "0px",
                                    fontWeight: "600",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    border: "1px solid rgba(198, 164, 95, 0.3)",
                                  }}
                                >
                                  Default
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "12.5px",
                                color: "#999999",
                                margin: 0,
                                lineHeight: "1.5",
                              }}
                            >
                              {addr.address}
                              {addr.apartment ? `, ${addr.apartment}` : ""}, {addr.city},{" "}
                              {addr.postcode}, {addr.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* ── LUXURY MODAL: Edit / Add Address ── */}
      <AnimatePresence>
        {addressModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setAddressModalOpen(false)}
          >
            <motion.div
              className="modal-scrollbar"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: "540px",
                width: "100%",
                maxHeight: "88vh",
                overflowY: "auto",
                backgroundColor: "#070707",
                border: "1px solid rgba(198, 164, 95, 0.35)",
                borderRadius: "0px",
                padding: "40px",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.95)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "28px",
                  borderBottom: "1px solid rgba(198, 164, 95, 0.2)",
                  paddingBottom: "16px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "9px",
                      fontWeight: "700",
                      letterSpacing: "4px",
                      color: "#c6a45f",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    ✦ GAMA DIAMOND ✦
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.5rem",
                      fontWeight: "500",
                      letterSpacing: "1px",
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {editingAddressIndex !== null ? "Edit Address" : "Add Address"}
                  </h2>
                </div>

                <button
                  onClick={() => setAddressModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#888888",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a45f")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Luxury Modal Form */}
              <form onSubmit={handleSaveAddress} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Country Selection */}
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Country / Region
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        appearance: "none",
                        outline: "none",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    >
                      <option value="United Kingdom" style={{ background: "#070707" }}>
                        United Kingdom
                      </option>
                      <option value="United States" style={{ background: "#070707" }}>
                        United States
                      </option>
                      <option value="Canada" style={{ background: "#070707" }}>
                        Canada
                      </option>
                      <option value="Australia" style={{ background: "#070707" }}>
                        Australia
                      </option>
                      <option value="Germany" style={{ background: "#070707" }}>
                        Germany
                      </option>
                      <option value="France" style={{ background: "#070707" }}>
                        France
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#c6a45f",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={addressForm.firstName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, firstName: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={addressForm.lastName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, lastName: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={addressForm.company}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, company: e.target.value })
                    }
                    style={{
                      width: "100%",
                      height: "46px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "0px",
                      padding: "0 14px",
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street address"
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, address: e.target.value })
                    }
                    style={{
                      width: "100%",
                      height: "46px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "0px",
                      padding: "0 14px",
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                  />
                </div>

                {/* Apartment, Suite (optional) */}
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Apartment, suite, etc (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Suite, unit, building, etc."
                    value={addressForm.apartment}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, apartment: e.target.value })
                    }
                    style={{
                      width: "100%",
                      height: "46px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "0px",
                      padding: "0 14px",
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                  />
                </div>

                {/* City & Postcode */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                  </div>
                </div>

                {/* State & Postcode */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Postcode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Postcode"
                      value={addressForm.postcode}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, postcode: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Phone
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="text"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      placeholder="+44 7700 900000"
                      style={{
                        flex: 1,
                        height: "46px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12.5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#c6a45f")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                    />
                    <span style={{ fontSize: "20px" }}>🇬🇧</span>
                  </div>
                </div>

                {/* Luxury Default Checkbox */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    color: "#cccccc",
                    marginTop: "8px",
                  }}
                >
                  <div
                    onClick={() =>
                      setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "0px",
                      border: addressForm.isDefault
                        ? "1px solid #c6a45f"
                        : "1px solid rgba(255, 255, 255, 0.3)",
                      backgroundColor: addressForm.isDefault
                        ? "#c6a45f"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000000",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {addressForm.isDefault && <Check size={12} strokeWidth={3} />}
                  </div>
                  This is my default address
                </label>

                {/* Modal Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888888",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#c6a45f",
                      color: "#000000",
                      border: "none",
                      borderRadius: "0px",
                      padding: "12px 32px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4b472")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a45f")}
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LUXURY MODAL: Edit Contact ── */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: "460px",
                width: "100%",
                backgroundColor: "#070707",
                border: "1px solid rgba(198, 164, 95, 0.35)",
                borderRadius: "0px",
                padding: "36px 40px",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.95)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                  borderBottom: "1px solid rgba(198, 164, 95, 0.2)",
                  paddingBottom: "16px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "9px",
                      fontWeight: "700",
                      letterSpacing: "4px",
                      color: "#c6a45f",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    ✦ GAMA DIAMOND ✦
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.4rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    Edit Contact
                  </h2>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#888888",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveContact} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    title="Your sign-in email can't be changed here."
                    style={{
                      width: "100%",
                      height: "46px",
                      backgroundColor: "rgba(255, 255, 255, 0.015)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "0px",
                      padding: "0 14px",
                      color: "#777777",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      outline: "none",
                      cursor: "not-allowed",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#c6a45f",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+919812345678"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    style={{
                      width: "100%",
                      height: "46px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "0px",
                      padding: "0 14px",
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888888",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingContact}
                    style={{
                      backgroundColor: "#c6a45f",
                      color: "#000000",
                      border: "none",
                      borderRadius: "0px",
                      padding: "12px 28px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10.5px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: isSavingContact ? "not-allowed" : "pointer",
                      opacity: isSavingContact ? 0.75 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {isSavingContact && <Loader2 size={13} className="animate-spin" />}
                    {isSavingContact ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AccountDashboardPage() {
  return (
    <ProtectedRoute>
      <AccountDashboardContent />
    </ProtectedRoute>
  );
}
