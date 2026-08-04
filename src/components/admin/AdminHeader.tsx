"use client";

import { useEffect, useState } from "react";
import { Menu, ShieldCheck, Clock } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export function AdminHeader({ onMenuToggle, title }: AdminHeaderProps) {
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
      <div className="admin-header-left">
        <button
          onClick={onMenuToggle}
          className="admin-menu-btn"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="admin-header-title">
            {title}
          </h1>
          <p className="admin-header-subtitle">
            Gama Diamonds Management Console
          </p>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Live Clock */}
        <div className="admin-header-clock">
          <Clock />
          <span>{timeStr || "00:00:00 AM"}</span>
        </div>

        {/* Staff Verification Badge */}
        <div className="admin-header-badge">
          <ShieldCheck />
          <span className="admin-header-badge-text">Authenticated Admin</span>
        </div>
      </div>
    </header>
  );
}
