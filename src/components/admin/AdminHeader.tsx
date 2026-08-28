"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Clock, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  title?: string;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="admin-header">
      {/* Left Area: Mobile Drawer Button Only */}
      <div className="admin-header-left">
        <button
          onClick={onToggleSidebar}
          className="admin-menu-btn lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-white hover:text-white" />
        </button>
      </div>

      {/* Center Area: Exact Landing Page Logo (Points to /admin) */}
      <Link href="/admin" className="logo-link">
        <span className="logo-tagline">✦ GAMA ✦</span>
        <span className="logo-name">JEWELS</span>
        <div className="logo-underline" />
      </Link>

      {/* Right Area: View Store & Live Clock */}
      <div className="admin-header-right">
        <Link
          href="/"
          target="_blank"
          className="admin-header-store-link"
          title="Open Customer Storefront"
        >
          <ExternalLink size={13} />
          <span>View Store</span>
        </Link>

        <div className="admin-header-clock">
          <Clock size={13} />
          <span>{timeStr || "00:00:00 AM"}</span>
        </div>
      </div>
    </header>
  );
}
