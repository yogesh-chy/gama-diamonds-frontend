"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Keyboard shortcut (Ctrl + \) or (Cmd + \) to toggle sidebar like ChatGPT
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
    // On mobile screens (<1024px), toggle drawer
    if (window.innerWidth < 1024) {
      setSidebarMobileOpen((prev) => !prev);
    } else {
      // On desktop, collapse/expand sidebar
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="admin-shell">
      {/* Full-width Top Header spanning edge to edge across entire admin page */}
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        title={currentTitle}
      />

      {/* Body containing Sidebar on Left and Main Content on Right */}
      <div className="admin-body">
        {/* Admin Navigation Sidebar Column */}
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
