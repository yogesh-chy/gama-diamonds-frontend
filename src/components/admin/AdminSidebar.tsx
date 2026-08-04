"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  FolderTree,
  Sparkles,
  Users,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customer Carts", href: "/admin/carts", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Taxonomies", href: "/admin/taxonomies", icon: Sparkles },
  { name: "Users", href: "/admin/users", icon: Users },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sidebarContent = (
    <div className="admin-sidebar-inner">
      {/* Brand Logo Header */}
      <div className="admin-sidebar-brand">
        <Link href="/admin" onClick={onClose} className="block text-center py-1">
          <span className="logo-tagline text-center block text-[11px] tracking-[5px]">✦ GAMA ✦</span>
          <span className="logo-name text-center block text-sm tracking-[3px] mt-0.5">DIAMOND</span>
          <div className="logo-underline mt-1.5" />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="admin-sidebar-close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <div className="admin-sidebar-nav modal-scrollbar">
        <div className="admin-sidebar-section-label">
          Management Console
        </div>
        <div className="admin-sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Info & Footer */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-actions">
          <Link href="/" target="_blank">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>

          <button onClick={() => logout()}>
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar Column */}
      <aside className="admin-sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile/Tablet Off-canvas Drawer */}
      {isOpen && (
        <div className="admin-drawer-overlay">
          <div
            className="admin-drawer-backdrop"
            onClick={onClose}
          />
          <aside className="admin-drawer-panel">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
