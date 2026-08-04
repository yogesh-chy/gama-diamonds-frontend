"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Wrap any page that requires a logged-in user. While the initial session
 * check is running it shows a themed loading state; once settled, an
 * unauthenticated visitor is bounced to /login (with a `next` param so
 * login can return them here), and children only render once authenticated.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = typeof window !== "undefined" ? window.location.pathname : "/account";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: "#040404",
          color: "#a0a0a0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: "2px solid rgba(198, 164, 95, 0.25)",
            borderTopColor: "#c6a45f",
            borderRadius: "50%",
            marginRight: 14,
            animation: "gama-spin 0.8s linear infinite",
          }}
        />
        Loading your account
        <style>{`@keyframes gama-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
