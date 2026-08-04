"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

const titleMap: Record<string, string> = {
  "/admin": "Overview Dashboard",
  "/admin/orders": "Orders Management",
  "/admin/carts": "Customer Active Carts",
  "/admin/products": "Product Catalog",
  "/admin/categories": "Categories & Subcategories",
  "/admin/taxonomies": "Luxury Facets & Taxonomies",
  "/admin/users": "User Accounts",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Temporarily skipped auth check for instant preview as requested by user
  /*
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/admin");
      } else if (user && !user.is_staff) {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || (user && !user.is_staff)) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-[#c6a45f] animate-spin mb-4" />
        <p className="text-xs font-poppins tracking-[3px] uppercase text-[#c6a45f]">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }
  */

  const currentTitle = titleMap[pathname] || "Admin Console";

  return (
    <div className="admin-shell">
      {/* Admin Navigation Sidebar Column */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="admin-main-wrap">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} title={currentTitle} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
