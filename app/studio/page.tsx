"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/studio/Sidebar";
import Topbar from "@/components/studio/Topbar";
import FolderTree, { FolderTreeHandle } from "@/components/studio/FolderTree";
import AssetGrid from "@/components/studio/AssetGrid";

type Mode = "day" | "night";

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("day");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const treeRef = useRef<FolderTreeHandle>(null);

  const isNight = mode === "night";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          mode={mode}
          onModeChange={setMode}
          onNewCategory={() => treeRef.current?.createRoot()}
          onNewSubfolder={() => treeRef.current?.createSub()}
        />

        <div className="flex flex-1 min-h-0">
          {/* Folder tree panel */}
          <div
            className="w-[260px] shrink-0 border-r overflow-hidden flex flex-col"
            style={{
              backgroundColor: isNight ? "#0A1A19" : "#FFFFFF",
              borderColor: isNight ? "#1B3A3A" : "#E5E7EB",
            }}
          >
            <FolderTree
              ref={treeRef}
              mode={mode}
              onSelect={setSelectedCategoryId}
            />
          </div>

          {/* Content area */}
          <main
            className="flex-1 overflow-auto transition-colors duration-200"
            style={{ backgroundColor: isNight ? "#060F0E" : "#F9FAFB" }}
          >
            {selectedCategoryId ? (
              <AssetGrid
                key={selectedCategoryId}
                categoryId={selectedCategoryId}
                mode={mode}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p
                  className="text-sm"
                  style={{ color: isNight ? "#60D4C8" : "#9CA3AF" }}
                >
                  Select a category to begin
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
