"use client";

import { useState, useRef, useEffect } from "react";

type Mode = "day" | "night";

interface TopbarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onNewCategory?: () => void;
  onNewSubfolder?: () => void;
}

export default function Topbar({ mode, onModeChange, onNewCategory, onNewSubfolder }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isNight = mode === "night";

  return (
    <header
      className="h-[50px] flex items-center px-4 gap-3 shrink-0 border-b"
      style={{
        backgroundColor: isNight ? "#0A1A19" : "#ffffff",
        borderColor: isNight ? "#1B3A3A" : "#E5E7EB",
      }}
    >
      {/* Title */}
      <h1
        className="text-[18px] font-semibold flex-1 whitespace-nowrap"
        style={{ color: isNight ? "#E2F5F2" : "#111827" }}
      >
        AI Studio
      </h1>

      {/* Property badge */}
      <span
        className="text-xs font-medium px-3 py-1 rounded whitespace-nowrap"
        style={{
          backgroundColor: isNight ? "#0D2929" : "#F3F4F6",
          color: isNight ? "#60D4C8" : "#374151",
        }}
      >
        Rosewood Mayakoba
      </span>

      {/* Day/Night toggle */}
      <div className="flex rounded-full overflow-hidden border" style={{ borderColor: isNight ? "#0A9E8C" : "#FDE68A" }}>
        <button
          onClick={() => onModeChange("day")}
          className="px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isNight ? "#ffffff" : "transparent",
            color: !isNight ? "#D97706" : (isNight ? "#E2F5F2" : "#9CA3AF"),
            borderRight: `1px solid ${isNight ? "#0A9E8C" : "#FDE68A"}`,
          }}
        >
          ☀️ Day
        </button>
        <button
          onClick={() => onModeChange("night")}
          className="px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: isNight ? "#1B3A3A" : "transparent",
            color: isNight ? "#60D4C8" : "#9CA3AF",
          }}
        >
          🌙 Night
        </button>
      </div>

      {/* New button + dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0A9E8C" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
          New
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4l3 3 3-3" />
          </svg>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border py-1 z-50"
            style={{
              backgroundColor: isNight ? "#0D2929" : "#ffffff",
              borderColor: isNight ? "#1B3A3A" : "#E5E7EB",
            }}
          >
            <DropdownItem label="New Category" isNight={isNight} onClick={() => { setDropdownOpen(false); onNewCategory?.(); }} />
            <DropdownItem label="New Subfolder" isNight={isNight} onClick={() => { setDropdownOpen(false); onNewSubfolder?.(); }} />
            <div className="my-1 border-t" style={{ borderColor: isNight ? "#1B3A3A" : "#E5E7EB" }} />
            <DropdownItem label="Upload Photos" isNight={isNight} onClick={() => setDropdownOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({ label, isNight, onClick }: { label: string; isNight: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-sm transition-colors"
      style={{ color: isNight ? "#E2F5F2" : "#374151" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isNight ? "#1B3A3A" : "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {label}
    </button>
  );
}
