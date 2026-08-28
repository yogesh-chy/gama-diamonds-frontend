"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Gift,
  Sparkles,
  Lock,
  Award,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { authApi, type Address } from "@/lib/api/auth";
import { cartApi, paymentsApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/api/errors";

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  metal?: string;
  size?: string;
  quantity: number;
  image?: string;
}



function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { isAuthenticated, user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftWrap, setGiftWrap] = useState(true);
  const [ringSizer, setRingSizer] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Backend addresses for checkout
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Read items from backend or localStorage on mount
  useEffect(() => {
    let cancelled = false;

    async function initCart() {
      if (isAuthenticated) {
        try {
          let res = await cartApi.getCart();
          if (cancelled) return;

          if (!res.data?.items || res.data.items.length === 0) {
            const stored = localStorage.getItem("gama_cart");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                for (const item of parsed) {
                  const rawId = item.id;
                  const numId = typeof rawId === "number" ? rawId : parseInt(String(rawId), 10);
                  const validProductId = !isNaN(numId) ? numId : 1;
                  try {
                    await cartApi.addItem(validProductId, item.size || "M", item.quantity || 1);
                  } catch {
                    /* ignore */
                  }
                }
                res = await cartApi.getCart();
              }
            }
          }

          if (res.data?.items && res.data.items.length > 0) {
            const mapped: CartItem[] = res.data.items.map((item) => ({
              id: item.id,
              title: item.product_detail?.name || `Product #${item.product}`,
              price: parseFloat(item.unit_price || "0"),
              size: item.size,
              quantity: item.quantity,
              image: item.product_detail?.image_url || "/bespoke_pear_solitaire.png",
            }));
            setCartItems(mapped);
            setLoading(false);
            return;
          }
        } catch {
          /* fallback to localStorage */
        }
      }

      try {
        const stored = localStorage.getItem("gama_cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          } else {
            setCartItems([]);
            localStorage.setItem("gama_cart", JSON.stringify([]));
            window.dispatchEvent(new Event("cartUpdated"));
          }
        } else {
          setCartItems([]);
          localStorage.setItem("gama_cart", JSON.stringify([]));
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch {
        setCartItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initCart();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Update storage & header counter
  const updateStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("gama_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = async (id: number | string, delta: number) => {
    const targetItem = cartItems.find((i) => i.id === id);
    if (!targetItem) return;
    const newQty = Math.max(1, (targetItem.quantity || 1) + delta);

    if (isAuthenticated && typeof id === "number") {
      try {
        await cartApi.updateItem(id, newQty);
      } catch {
        /* fallback to local update */
      }
    }

    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateStorage(updated);
  };

  const handleRemoveItem = async (id: number | string, title: string) => {
    if (isAuthenticated && typeof id === "number") {
      try {
        await cartApi.removeItem(id);
      } catch {
        /* fallback */
      }
    }

    const updated = cartItems.filter((item) => item.id !== id);
    updateStorage(updated);
    toast.success(`Removed ${title} from your shopping bag`);
  };

  const handleClearCart = () => {
    updateStorage([]);
    toast.success("Shopping bag cleared");
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "GAMA10" || code === "VIP10") {
      setDiscountPercent(10);
      toast.success("10% VIP Discount Applied!");
    } else if (code === "HATTON20") {
      setDiscountPercent(20);
      toast.success("20% Exclusive Partner Discount Applied!");
    } else if (code.length > 0) {
      toast.error("Invalid voucher code. Try GAMA10 for 10% off");
    }
  };

  // Full backend checkout handler with Razorpay Integration
  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to complete your checkout.");
      router.push("/login?next=/cart");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Fetch user's saved addresses or create a default one on the fly
      const addrRes = await authApi.listAddresses();
      const addrList: Address[] = Array.isArray(addrRes.data)
        ? addrRes.data
        : (addrRes.data as any).results || [];

      let addressId: number;
      if (addrList.length === 0) {
        const newAddrRes = await authApi.createAddress({
          full_name: user?.email ? user.email.split("@")[0] : "Valued Customer",
          phone_number: user?.phone_number || "+44 20 7946 0912",
          street_address: "12 Hatton Garden",
          city: "London",
          state: "Greater London",
          postal_code: "EC1N 8NX",
          country: "United Kingdom",
          is_default: true,
        });
        addressId = newAddrRes.data.id;
      } else {
        setAddresses(addrList);
        const defaultAddr = addrList.find((a) => a.is_default) || addrList[0];
        addressId = defaultAddr.id;
      }

      // 2. Ensure backend cart is populated before checkout
      try {
        const cartRes = await cartApi.getCart();
        if (!cartRes.data?.items || cartRes.data.items.length === 0) {
          for (const item of cartItems) {
            const rawId = item.id;
            const numId = typeof rawId === "number" ? rawId : parseInt(String(rawId), 10);
            const validProductId = !isNaN(numId) ? numId : 1;
            try {
              await cartApi.addItem(validProductId, item.size || "", item.quantity || 1);
            } catch {
              /* ignore individual item sync error */
            }
          }
        }
      } catch {
        /* proceed to checkout */
      }

      // 3. Initiate checkout on backend
      const checkoutRes = await cartApi.checkout(addressId);
      const { razorpay, order } = checkoutRes.data;

      // 3. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded || !(window as any).Razorpay) {
        toast.error("Razorpay payment gateway script could not be loaded. Please check your internet/ad-blocker and try again.");
        setIsCheckingOut(false);
        return;
      }

      // 4. Trigger Razorpay Checkout Modal
      const options = {
        key: razorpay.key_id,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Gama Jewels",
        description: `Order #${order.id} Payment`,
        order_id: razorpay.razorpay_order_id,
        prefill: {
          email: user?.email || "",
          contact: user?.phone_number || (addresses.length > 0 ? addresses[0].phone_number : "9876543210"),
        },
        theme: {
          color: "#c6a45f",
        },
        handler: async (response: any) => {
          try {
            await paymentsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified! Your order has been placed successfully.");
            updateStorage([]);
            router.push("/account");
          } catch (err) {
            toast.error(getApiErrorMessage(err, "Payment verification failed. Please contact support."));
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Checkout failed. Please ensure your cart has items and try again."));
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;
  const klarnaInstallment = Math.round(finalTotal / 3);

  return (
    <div style={{ background: "#040404", minHeight: "100vh", color: "#ffffff" }}>
      <Header />

      {/* ── Main Cart Content ── */}
      <main style={{ padding: "56px 0 80px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div
                style={{
                  color: "#c6a45f",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "2px",
                }}
              >
                LOADING YOUR SELECTION...
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "rgba(15, 15, 15, 0.6)",
                border: "1px solid rgba(198, 164, 95, 0.2)",
                borderRadius: "0px",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "0px",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  background: "rgba(198, 164, 95, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "#c6a45f",
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  color: "#ffffff",
                  marginBottom: "12px",
                }}
              >
                Your Shopping Bag is Currently Empty
              </h2>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  color: "#8a8a8a",
                  lineHeight: "1.7",
                  marginBottom: "32px",
                }}
              >
                Explore our master-crafted Hatton Garden collections of bespoke
                engagement rings, wedding bands, and fine solitaire diamond jewellery.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/rings" className="btn-gold" style={{ padding: "14px 32px", fontSize: "11px", borderRadius: "0px" }}>
                  EXPLORE ENGAGEMENT RINGS
                </Link>
              </div>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "40px",
              }}
              className="cart-grid-layout"
            >
              {/* ── Left Column: Items List & Services ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Cart Items Card Container */}
                <div
                  style={{
                    background: "rgba(15, 15, 15, 0.6)",
                    border: "1px solid rgba(198, 164, 95, 0.2)",
                    borderRadius: "0px",
                    overflow: "hidden",
                  }}
                >
                  {/* Table Header */}
                  <div
                    style={{
                      padding: "20px 28px",
                      background: "rgba(10, 10, 10, 0.8)",
                      borderBottom: "1px solid rgba(198, 164, 95, 0.15)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        fontWeight: "600",
                        letterSpacing: "1.5px",
                        color: "#c6a45f",
                        textTransform: "uppercase",
                      }}
                    >
                      SELECTED ITEMS ({cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)})
                    </span>

                    <button
                      onClick={handleClearCart}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#777777",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#777777")}
                    >
                      <RotateCcw size={12} />
                      <span>Clear All</span>
                    </button>
                  </div>

                  {/* Item Rows */}
                  <div style={{ padding: "0 28px" }}>
                    {cartItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          padding: "28px 0",
                          borderBottom:
                            idx < cartItems.length - 1
                              ? "1px solid rgba(255, 255, 255, 0.06)"
                              : "none",
                          display: "grid",
                          gridTemplateColumns: "100px 1fr auto",
                          gap: "24px",
                          alignItems: "center",
                        }}
                        className="cart-item-row"
                      >
                        {/* Thumbnail Image */}
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "0px",
                            overflow: "hidden",
                            border: "1px solid rgba(198, 164, 95, 0.25)",
                            background: "#0a0a0a",
                            position: "relative",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              item.image ||
                              "/bespoke_pear_solitaire.png"
                            }
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "17px",
                              fontWeight: "600",
                              color: "#ffffff",
                              marginBottom: "8px",
                              lineHeight: "1.4",
                            }}
                          >
                            {item.title}
                          </h3>

                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              flexWrap: "wrap",
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "12px",
                              color: "#9e9e9e",
                              marginBottom: "12px",
                            }}
                          >
                            {item.metal && (
                              <span>
                                Metal: <strong style={{ color: "#ffffff" }}>{item.metal}</strong>
                              </span>
                            )}
                            {item.size && (
                              <span>
                                Size: <strong style={{ color: "#ffffff" }}>{item.size}</strong>
                              </span>
                            )}
                            <span style={{ color: "#c6a45f" }}>✦ GIA/IGI Graded</span>
                          </div>

                          <div
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#c6a45f",
                            }}
                          >
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Quantity Controller & Remove Button */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "16px",
                          }}
                        >
                          {/* Quantity Selector */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid rgba(198, 164, 95, 0.3)",
                              borderRadius: "0px",
                              overflow: "hidden",
                              background: "rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#ffffff",
                                padding: "8px 12px",
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span
                              style={{
                                padding: "0 12px",
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#ffffff",
                                padding: "8px 12px",
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price Subtotal for row */}
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            {formatPrice(item.price * (item.quantity || 1))}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveItem(item.id, item.title)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#666666",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px",
                              fontFamily: "'Poppins', sans-serif",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Concierge Luxury Services Section ── */}
                <div
                  style={{
                    background: "rgba(15, 15, 15, 0.6)",
                    border: "1px solid rgba(198, 164, 95, 0.2)",
                    borderRadius: "0px",
                    padding: "24px 28px",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "16px",
                      color: "#ffffff",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Sparkles size={16} style={{ color: "#c6a45f" }} />
                    Complimentary Concierge Services
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Gift Wrap Toggle */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(198, 164, 95, 0.15)",
                        borderRadius: "0px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Gift size={18} style={{ color: "#c6a45f" }} />
                        <div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Luxury Velvet Gift Packaging & Wax Seal Card
                          </div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "11px",
                              color: "#888888",
                            }}
                          >
                            Handcrafted dark green velvet ring box with gold foil lettering.
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        style={{ accentColor: "#c6a45f", width: "16px", height: "16px" }}
                      />
                    </label>

                    {/* Ring Sizer Toggle */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(198, 164, 95, 0.15)",
                        borderRadius: "0px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Award size={18} style={{ color: "#c6a45f" }} />
                        <div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Include Complimentary Hatton Garden Ring Gauge Sizer
                          </div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "11px",
                              color: "#888888",
                            }}
                          >
                            Discreet size measurement kit dispatched immediately.
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={ringSizer}
                        onChange={(e) => setRingSizer(e.target.checked)}
                        style={{ accentColor: "#c6a45f", width: "16px", height: "16px" }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Right Column: Order Summary Sidebar ── */}
              <div>
                <div
                  style={{
                    position: "sticky",
                    top: "100px",
                    background: "linear-gradient(135deg, rgba(20, 18, 14, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                    border: "1px solid rgba(198, 164, 95, 0.3)",
                    borderRadius: "0px",
                    padding: "32px 28px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: "24px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid rgba(198, 164, 95, 0.2)",
                    }}
                  >
                    Order Summary
                  </h3>

                  {/* Summary Rows */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "13px",
                      marginBottom: "24px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#a0a0a0" }}>
                      <span>Subtotal</span>
                      <span style={{ color: "#ffffff", fontWeight: "600" }}>
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#c6a45f" }}>
                        <span>VIP Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", color: "#a0a0a0" }}>
                      <span>Insured Express Shipping</span>
                      <span style={{ color: "#c6a45f", fontWeight: "600" }}>FREE</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "#a0a0a0" }}>
                      <span>GIA & IGI Certificate Valuation</span>
                      <span style={{ color: "#c6a45f", fontWeight: "600" }}>INCLUDED</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "#a0a0a0" }}>
                      <span>UK VAT (20%)</span>
                      <span style={{ color: "#ffffff" }}>Included</span>
                    </div>
                  </div>

                  {/* Promo Form */}
                  <form onSubmit={handleApplyPromo} style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        border: "1px solid rgba(198, 164, 95, 0.3)",
                        borderRadius: "0px",
                        overflow: "hidden",
                        background: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Voucher Code (e.g. GAMA10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "none",
                          padding: "10px 14px",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontFamily: "'Poppins', sans-serif",
                          outline: "none",
                          textTransform: "uppercase",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: "#c6a45f",
                          color: "#000000",
                          border: "none",
                          padding: "0 16px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        APPLY
                      </button>
                    </div>
                  </form>

                  {/* Total Line */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(198, 164, 95, 0.2)",
                      paddingTop: "16px",
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#ffffff",
                        letterSpacing: "1px",
                      }}
                    >
                      ESTIMATED TOTAL
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#c6a45f",
                      }}
                    >
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {/* Klarna Installment Banner */}
                  <div
                    style={{
                      background: "rgba(198, 164, 95, 0.08)",
                      border: "1px solid rgba(198, 164, 95, 0.2)",
                      borderRadius: "0px",
                      padding: "12px 14px",
                      marginBottom: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Sparkles size={16} style={{ color: "#c6a45f", flexShrink: 0 }} />
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        color: "#d0d0d0",
                        lineHeight: "1.4",
                      }}
                    >
                      Pay <strong>3 instalments of {formatPrice(klarnaInstallment)}</strong> with 0% APR via Klarna.
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={isCheckingOut}
                    className="btn-gold"
                    style={{
                      width: "100%",
                      padding: "16px 24px",
                      fontSize: "11px",
                      letterSpacing: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      borderRadius: "0px",
                      opacity: isCheckingOut ? 0.7 : 1,
                      cursor: isCheckingOut ? "not-allowed" : "pointer",
                    }}
                  >
                    <Lock size={14} />
                    <span>{isCheckingOut ? "PROCESSING CHECKOUT..." : "PROCEED TO SECURE CHECKOUT"}</span>
                    <ArrowRight size={14} />
                  </button>

                  <Link
                    href="/rings"
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "1.5px",
                      color: "#8a8a8a",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a45f")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8a8a")}
                  >
                    ← CONTINUE SHOPPING
                  </Link>

                  {/* Trust Badges in Sidebar */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      marginTop: "24px",
                      paddingTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      fontSize: "11px",
                      fontFamily: "'Poppins', sans-serif",
                      color: "#888888",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Lock size={13} style={{ color: "#c6a45f" }} />
                      <span>256-Bit SSL Encrypted Payment</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ShieldCheck size={13} style={{ color: "#c6a45f" }} />
                      <span>30-Day Money Back Guarantee</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Truck size={13} style={{ color: "#c6a45f" }} />
                      <span>Fully Insured Royal Mail Special Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
