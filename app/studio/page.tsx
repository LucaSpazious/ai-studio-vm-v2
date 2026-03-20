"use client";

import { useState } from "react";
import Sidebar from "@/components/studio/Sidebar";
import Topbar from "@/components/studio/Topbar";

type Mode = "day" | "night";

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("day");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isNight = mode === "night";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar mode={mode} onModeChange={setMode} />

        {/* Content area */}
        <main
          className="flex-1 overflow-auto transition-colors duration-200"
          style={{ backgroundColor: isNight ? "#060F0E" : "#F9FAFB" }}
        >
          <div className="flex items-center justify-center h-full">
            <p
              className="text-sm"
              style={{ color: isNight ? "#60D4C8" : "#9CA3AF" }}
            >
              Select a space to begin
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
