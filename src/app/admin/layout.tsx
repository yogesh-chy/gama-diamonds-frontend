"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

const titleMap: Record<string, string> = {
  "/admin": "Overview",
  "/admin/orders": "Orders",
  "/admin/carts": "Active Carts",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/taxonomies": "Taxonomies",
  "/admin/users": "Users",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Guard: Redirect to /login if unauthenticated or not a staff/admin user
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user?.is_staff) {
        const next = typeof window !== "undefined" ? window.location.pathname : "/admin";
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  // Keyboard shortcut (Ctrl + \) or (Cmd + \) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentTitle = titleMap[pathname] || "Admin Console";

  useEffect(() => {
    if (sidebarMobileOpen) {
      setSidebarMobileOpen(false);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarMobileOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  // Render luxury loading state while checking session
  if (isLoading || !isAuthenticated || !user?.is_staff) {
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
        Authenticating Admin Console...
        <style>{`@keyframes gama-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Full-width Top Header */}
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        title={currentTitle}
      />

      {/* Body containing Sidebar on Left and Main Content on Right */}
      <div className="admin-body">
        <AdminSidebar
          isOpen={sidebarMobileOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setSidebarMobileOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Content Area */}
        <div className={`admin-main-wrap ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
