"use client";

import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const RESEND_COOLDOWN_SECONDS = 60;

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const {
    requestOtp,
    verifyOtp,
    adminLogin,
    isAuthenticated,
    isLoading: isSessionLoading,
  } = useAuth();

  // ── Mode State ──
  const [mode, setMode] = useState<"customer" | "admin">("customer");

  // ── Customer OTP State ──
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  // ── Admin Login State ──
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const [adminEmailTouched, setAdminEmailTouched] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState<string | null>(null);

  // Robust email validation
  const validateEmail = useCallback((value: string): string | null => {
    if (!value.trim()) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      if (!value.includes("@")) return "Please include an '@' in the email address.";
      const [, domain] = value.split("@");
      if (!domain || !domain.includes(".")) return "Please enter a complete domain (e.g. gmail.com).";
      return "Please enter a valid email address.";
    }
    return null;
  }, []);

  // Live validation after first touch (customer)
  const liveError = useMemo(() => {
    if (!emailTouched) return null;
    return validateEmail(email);
  }, [email, emailTouched, validateEmail]);

  // Live validation after first touch (admin)
  const adminLiveError = useMemo(() => {
    if (!adminEmailTouched) return null;
    return validateEmail(adminEmail);
  }, [adminEmail, adminEmailTouched, validateEmail]);

  // Already signed in? Skip the form entirely.
  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isSessionLoading, isAuthenticated, nextPath, router]);

  // Resend cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-advance to the dashboard a beat after showing the success state.
  useEffect(() => {
    if (step !== "success") return;
    const dest = mode === "admin" ? "/admin" : nextPath;
    const timer = setTimeout(() => router.push(dest), 1800);
    return () => clearTimeout(timer);
  }, [step, nextPath, router, mode]);

  const sendOtp = useCallback(
    async (targetEmail: string) => {
      await requestOtp(targetEmail);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
    [requestOtp]
  );

  // Handle email submit (customer)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmittingEmail) return;

    setEmailTouched(true);
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError(null);

    setIsSubmittingEmail(true);
    try {
      await sendOtp(email);
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the code.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await sendOtp(email);
      toast.success("A new code is on its way.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't resend the code.");
    } finally {
      setIsResending(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6 || isVerifying) return;

    setIsVerifying(true);
    try {
      await verifyOtp(email, code);
      setStep("success");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That code didn't work.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Admin Login Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword || isAdminSubmitting) return;

    setAdminEmailTouched(true);
    const error = validateEmail(adminEmail);
    if (error) {
      setAdminEmailError(error);
      return;
    }
    setAdminEmailError(null);

    setIsAdminSubmitting(true);
    try {
      await adminLogin(adminEmail, adminPassword);
      setEmail(adminEmail);
      setStep("success");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Admin login failed.");
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  // ── Shared input style ──
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    height: "48px",
    backgroundColor: hasError
      ? "rgba(220, 38, 38, 0.04)"
      : "rgba(255, 255, 255, 0.02)",
    border: hasError
      ? "1px solid rgba(220, 80, 80, 0.5)"
      : "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "0px",
    paddingLeft: "42px",
    paddingRight: "14px",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "12.5px",
    outline: "none",
    transition: "border-color 0.3s ease, background-color 0.3s ease",
  });

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    if (!hasError) {
      e.target.style.borderColor = "#c6a45f";
      e.target.style.backgroundColor = "rgba(198, 164, 95, 0.04)";
    }
  };

  const handleInputBlurReset = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    if (hasError) {
      e.target.style.borderColor = "rgba(220, 80, 80, 0.5)";
      e.target.style.backgroundColor = "rgba(220, 38, 38, 0.04)";
    } else {
      e.target.style.borderColor = "rgba(255, 255, 255, 0.14)";
      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
    }
  };

  // ── Error message component ──
  const ErrorMessage = ({ message }: { message: string | null }) => (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            overflow: "hidden",
          }}
        >
          <AlertCircle size={13} style={{ color: "#dc6b6b", flexShrink: 0 }} />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              color: "#dc6b6b",
              letterSpacing: "0.2px",
              lineHeight: "1.4",
            }}
          >
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const successEmail = mode === "admin" ? adminEmail : email;

  return (
    <div
      style={{
        backgroundColor: "#040404",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 35%, rgba(198, 164, 95, 0.09) 0%, rgba(18, 14, 8, 0.3) 45%, rgba(4, 4, 4, 1) 80%)",
      }}
    >
      {/* ── Top Left Admin Mode Toggle Button ── */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "28px",
          zIndex: 20,
        }}
      >
        <button
          onClick={() => {
            setMode(mode === "customer" ? "admin" : "customer");
            setStep("email");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: mode === "admin" ? "rgba(198, 164, 95, 0.15)" : "rgba(18, 18, 18, 0.7)",
            border: mode === "admin" ? "1px solid #c6a45f" : "1px solid rgba(198, 164, 95, 0.3)",
            borderRadius: "0px",
            color: mode === "admin" ? "#c6a45f" : "#ffffff",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "10.5px",
            fontWeight: "600",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c6a45f";
            e.currentTarget.style.color = "#c6a45f";
          }}
          onMouseLeave={(e) => {
            if (mode !== "admin") {
              e.currentTarget.style.borderColor = "rgba(198, 164, 95, 0.3)";
              e.currentTarget.style.color = "#ffffff";
            }
          }}
        >
          {mode === "customer" ? (
            <>
              <ShieldCheck size={14} style={{ color: "#c6a45f" }} />
              <span>Admin Login</span>
            </>
          ) : (
            <>
              <User size={14} style={{ color: "#c6a45f" }} />
              <span>Customer Sign In</span>
            </>
          )}
        </button>
      </div>

      {/* Top Header Logo */}
      <header
        style={{
          position: "absolute",
          top: "36px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Link href="/" className="logo-link" style={{ position: "static", transform: "none" }}>
          <span className="logo-tagline">✦ GAMA ✦</span>
          <span className="logo-name">DIAMOND</span>
          <div className="logo-underline" />
        </Link>
      </header>

      {/* Seamless Floating Form Container */}
      <div
        style={{
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          marginTop: "40px",
        }}
      >
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════
              CUSTOMER MODE — Step 1: Enter Email (OTP)
             ════════════════════════════════════════════════ */}
          {mode === "customer" && step === "email" && (
            <motion.div
              key="customer-email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.85rem",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Sign In
              </h1>

              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Enter your email address to receive a secure sign-in link.
              </p>

              <form onSubmit={handleEmailSubmit} style={{ width: "100%" }}>
                {/* Email Input */}
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#666666",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="name@domain.com"
                    style={inputStyle(!!(liveError || emailError))}
                    onFocus={(e) => handleInputFocus(e, !!(liveError || emailError))}
                    onBlur={(e) => {
                      setEmailTouched(true);
                      const err = validateEmail(email);
                      handleInputBlurReset(e, !!err);
                    }}
                  />
                  <ErrorMessage message={liveError || emailError} />
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmittingEmail}
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor: "#c6a45f",
                    color: "#000000",
                    border: "none",
                    borderRadius: "0px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: isSubmittingEmail ? "not-allowed" : "pointer",
                    opacity: isSubmittingEmail ? 0.75 : 1,
                    transition: "background-color 0.3s ease",
                    marginBottom: "24px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d4b472")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c6a45f")
                  }
                >
                  {isSubmittingEmail ? (
                    <>
                      SENDING
                      <Loader2 size={14} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      CONTINUE
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Legal Notice */}
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    color: "#666666",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    style={{ color: "#a0a0a0", textDecoration: "underline" }}
                  >
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link
                    href="/privacy"
                    style={{ color: "#a0a0a0", textDecoration: "underline" }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════
              CUSTOMER MODE — Step 2: OTP Verification
             ════════════════════════════════════════════════ */}
          {mode === "customer" && step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.85rem",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Verification Code
              </h1>

              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Enter the 6-digit code sent to{" "}
                <span style={{ color: "#c6a45f" }}>{email}</span>
              </p>

              <form onSubmit={handleOtpSubmit} style={{ width: "100%" }}>
                {/* OTP Input Row */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      style={{
                        width: "46px",
                        height: "52px",
                        textAlign: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: digit
                          ? "1px solid rgba(198, 164, 95, 0.5)"
                          : "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "0px",
                        color: "#ffffff",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "18px",
                        fontWeight: "600",
                        letterSpacing: "2px",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        caretColor: "#c6a45f",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#c6a45f";
                        e.target.style.backgroundColor = "rgba(198, 164, 95, 0.04)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = digit
                          ? "rgba(198, 164, 95, 0.5)"
                          : "rgba(255, 255, 255, 0.14)";
                        e.target.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                      }}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={otp.join("").length !== 6 || isVerifying}
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor:
                      otp.join("").length === 6 ? "#c6a45f" : "rgba(198, 164, 95, 0.3)",
                    color: otp.join("").length === 6 ? "#000000" : "#888888",
                    border: "none",
                    borderRadius: "0px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor:
                      otp.join("").length === 6 && !isVerifying
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.3s ease",
                    marginBottom: "20px",
                  }}
                >
                  {isVerifying ? (
                    <>
                      VERIFYING
                      <Loader2 size={14} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      VERIFY & SIGN IN
                    </>
                  )}
                </button>

                {/* Change Email & Resend */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888888",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending}
                    style={{
                      background: "none",
                      border: "none",
                      color: cooldown > 0 ? "#555555" : "#c6a45f",
                      cursor: cooldown > 0 || isResending ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      textDecoration: "none",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {isResending
                      ? "Sending..."
                      : cooldown > 0
                        ? `Resend Code in ${cooldown}s`
                        : "Resend Code"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════
              ADMIN MODE — Email + Password
             ════════════════════════════════════════════════ */}
          {mode === "admin" && step === "email" && (
            <motion.div
              key="admin-login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.85rem",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Admin Portal
              </h1>

              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Sign in with your admin credentials to access the portal.
              </p>

              <form onSubmit={handleAdminSubmit} style={{ width: "100%" }}>
                {/* Admin Email Input */}
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#666666",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      if (adminEmailError) setAdminEmailError(null);
                    }}
                    placeholder="admin@gamadiamonds.com"
                    style={inputStyle(!!(adminLiveError || adminEmailError))}
                    onFocus={(e) => handleInputFocus(e, !!(adminLiveError || adminEmailError))}
                    onBlur={(e) => {
                      setAdminEmailTouched(true);
                      const err = validateEmail(adminEmail);
                      handleInputBlurReset(e, !!err);
                    }}
                  />
                  <ErrorMessage message={adminLiveError || adminEmailError} />
                </div>

                {/* Admin Password Input */}
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#666666",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    style={{
                      ...inputStyle(false),
                      paddingRight: "44px",
                    }}
                    onFocus={(e) => handleInputFocus(e, false)}
                    onBlur={(e) => handleInputBlurReset(e, false)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#666666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a45f")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Admin Submit Button */}
                <button
                  type="submit"
                  disabled={isAdminSubmitting}
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor: "#c6a45f",
                    color: "#000000",
                    border: "none",
                    borderRadius: "0px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: isAdminSubmitting ? "not-allowed" : "pointer",
                    opacity: isAdminSubmitting ? 0.75 : 1,
                    transition: "background-color 0.3s ease",
                    marginBottom: "24px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d4b472")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c6a45f")
                  }
                >
                  {isAdminSubmitting ? (
                    <>
                      AUTHENTICATING
                      <Loader2 size={14} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      SIGN IN TO DASHBOARD
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    color: "#555555",
                  }}
                >
                  <Lock size={11} />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </form>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════
              SHARED — Step 3: Success
             ════════════════════════════════════════════════ */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              <CheckCircle2
                size={40}
                style={{ color: "#c6a45f", margin: "0 auto 16px" }}
              />
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: "#ffffff",
                  marginBottom: "6px",
                  fontWeight: "500",
                }}
              >
                Welcome Back
              </h2>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  lineHeight: "1.5",
                  marginBottom: "24px",
                }}
              >
                Signed in as <span style={{ color: "#c6a45f" }}>{successEmail}</span>
              </p>
              <Link
                href={mode === "admin" ? "/admin" : nextPath}
                style={{
                  height: "46px",
                  padding: "0 28px",
                  backgroundColor: "#c6a45f",
                  color: "#000000",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "10.5px",
                  fontWeight: "600",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mode === "admin" ? "GO TO ADMIN DASHBOARD" : "GO TO DASHBOARD"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary in the App Router.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
