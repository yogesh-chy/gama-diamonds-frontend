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
  LogOut,
  X,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
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
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  isOpen = false,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const sidebarInner = (
    <div className={`admin-sidebar-inner ${isCollapsed ? "collapsed" : ""}`}>
      {/* Top Sidebar Bar: Standalone toggle icon on the right with NO outer container or text */}
      <div className="admin-sidebar-top-bar">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="admin-standalone-toggle-btn hidden lg:flex"
            aria-label="Toggle sidebar"
            title={isCollapsed ? "Expand Sidebar (Ctrl+\\)" : "Collapse Sidebar (Ctrl+\\)"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#c6a45f] hover:scale-110 transition-transform" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-white hover:scale-110 transition-transform" />
            )}
          </button>
        )}

        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="admin-sidebar-close lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <div className="admin-sidebar-nav modal-scrollbar">
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
                title={isCollapsed ? item.name : undefined}
                className={`admin-nav-link ${isActive ? "active" : ""} ${
                  isCollapsed ? "collapsed-link" : ""
                }`}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer: Admin Badge & Luxury Sign Out Button */}
      <div className="admin-sidebar-footer">
        {!isCollapsed && (
          <div className="admin-sidebar-badge">
            <ShieldCheck className="w-4 h-4 text-[#c6a45f]" />
            <span>ADMIN CONSOLE</span>
          </div>
        )}

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="admin-sidebar-signout-btn"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>SIGN OUT</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`admin-sidebar-desktop ${
          isCollapsed ? "collapsed-desktop" : ""
        }`}
      >
        {sidebarInner}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {isOpen && (
        <div className="admin-drawer-overlay">
          <div className="admin-drawer-backdrop" onClick={onClose} />
          <aside className="admin-drawer-panel">{sidebarInner}</aside>
        </div>
      )}
    </>
  );
}
