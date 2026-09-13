"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface LuxurySelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

interface LuxurySelectProps {
  value: string | number;
  options: LuxurySelectOption[];
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LuxurySelect({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
  style,
  buttonStyle,
  dropdownStyle,
  disabled = false,
  size = "md",
}: LuxurySelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const heightBySize = size === "sm" ? "36px" : size === "lg" ? "50px" : "44px";
  const fontSizeBySize = size === "sm" ? "11px" : "12px";

  return (
    <div
      ref={wrapRef}
      className={`luxury-select-wrapper ${className}`}
      style={{ position: "relative", width: "100%", ...style }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        style={{
          width: "100%",
          height: heightBySize,
          backgroundColor: "#0d0d0d",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: open ? "#c6a45f" : "rgba(198, 164, 95, 0.35)",
          borderRadius: "3px",
          color: selectedOption ? "#ffffff" : "#777777",
          fontSize: fontSizeBySize,
          fontFamily: "'Poppins', sans-serif",
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          textAlign: "left",
          transition: "all 0.2s ease",
          boxShadow: open ? "0 0 0 1px rgba(198, 164, 95, 0.4)" : "none",
          opacity: disabled ? 0.6 : 1,
          ...buttonStyle,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          color="#c6a45f"
          style={{
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Luxury Dropdown Menu matching CurrencySelector */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              width: "100%",
              backgroundColor: "#0d0d0d",
              border: "1px solid rgba(198, 164, 95, 0.35)",
              borderRadius: "3px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.95)",
              zIndex: 9999,
              maxHeight: "260px",
              overflowY: "auto",
              padding: "4px 0",
              ...dropdownStyle,
            }}
            className="modal-scrollbar"
          >
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setOpen(false);
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: isSelected
                      ? "rgba(198, 164, 95, 0.1)"
                      : "transparent",
                    border: "none",
                    color: isSelected ? "#c6a45f" : "#cccccc",
                    fontSize: fontSizeBySize,
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "0.4px",
                    cursor: option.disabled ? "not-allowed" : "pointer",
                    textAlign: "left",
                    transition: "background 0.2s ease, color 0.2s ease",
                    opacity: option.disabled ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!option.disabled && !isSelected) {
                      e.currentTarget.style.background = "rgba(198, 164, 95, 0.12)";
                      e.currentTarget.style.color = "#c6a45f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!option.disabled && !isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#cccccc";
                    }
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span style={{ fontSize: "10px", color: "#888888" }}>
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check size={14} color="#c6a45f" style={{ flexShrink: 0, marginLeft: 8 }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
