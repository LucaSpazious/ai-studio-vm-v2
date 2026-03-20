"use client";

import { useState, useRef, useCallback } from "react";
import Sidebar from "@/components/studio/Sidebar";
import Topbar from "@/components/studio/Topbar";
import FolderTree, { FolderTreeHandle } from "@/components/studio/FolderTree";
import AssetGrid from "@/components/studio/AssetGrid";
import ActionBar from "@/components/studio/ActionBar";

type Mode = "day" | "night";

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("day");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const treeRef = useRef<FolderTreeHandle>(null);

  const isNight = mode === "night";

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedAssetIds(new Set());
  }, []);

  const handleCategoryChange = useCallback((id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedAssetIds(new Set());
  }, []);

  const handleAssetsLoaded = useCallback(() => {
    // Hook for future use (e.g. clean up stale selections)
  }, []);

  const handleApplyNight = async () => {
    if (selectedAssetIds.size === 0) return;
    const ids = Array.from(selectedAssetIds);

    setGenerating(true);
    setProcessingIds(new Set(ids));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetIds: ids }),
      });

      if (!res.ok) {
        console.error("Generate failed:", await res.json());
      }
    } finally {
      setGenerating(false);
      setProcessingIds(new Set());
      setSelectedAssetIds(new Set());
      // Trigger re-fetch of assets
      setRefreshKey((k) => k + 1);
    }
  };

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
              onSelect={handleCategoryChange}
            />
          </div>

          <main
            className="flex-1 overflow-auto transition-colors duration-200"
            style={{ backgroundColor: isNight ? "#060F0E" : "#F9FAFB" }}
          >
            {selectedCategoryId ? (
              <AssetGrid
                key={`${selectedCategoryId}-${refreshKey}`}
                categoryId={selectedCategoryId}
                mode={mode}
                selectedIds={selectedAssetIds}
                processingIds={processingIds}
                onToggleSelect={handleToggleSelect}
                onAssetsLoaded={handleAssetsLoaded}
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

      <ActionBar
        count={selectedAssetIds.size}
        mode={mode}
        generating={generating}
        onApplyNight={handleApplyNight}
        onClear={handleClearSelection}
      />
    </div>
  );
}
