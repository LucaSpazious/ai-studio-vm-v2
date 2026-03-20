"use client";

import { useState, useRef, useCallback } from "react";
import Sidebar from "@/components/studio/Sidebar";
import Topbar from "@/components/studio/Topbar";
import FolderTree, { FolderTreeHandle } from "@/components/studio/FolderTree";
import AssetGrid, { Asset } from "@/components/studio/AssetGrid";
import ActionBar from "@/components/studio/ActionBar";

type Mode = "day" | "night";

/** Download a file by fetching as blob (works cross-origin) */
async function downloadFile(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("day");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const treeRef = useRef<FolderTreeHandle>(null);
  const assetsRef = useRef<Asset[]>([]);

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

  const handleAssetsLoaded = useCallback((assets: Asset[]) => {
    assetsRef.current = assets;
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
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDownload = async () => {
    if (selectedAssetIds.size === 0) return;
    setDownloading(true);

    const selected = assetsRef.current.filter((a) => selectedAssetIds.has(a.id));
    const suffix = isNight ? "_night" : "_day";

    try {
      for (const asset of selected) {
        const url = isNight ? asset.night_url : asset.day_url;
        if (!url) continue;

        const parts = asset.name.split(".");
        const dlName = parts.length > 1
          ? `${parts.slice(0, -1).join(".")}${suffix}.${parts[parts.length - 1]}`
          : `${asset.name}${suffix}`;

        await downloadFile(url, dlName);
        // Small delay between downloads to avoid browser blocking
        if (selected.length > 1) {
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    } finally {
      setDownloading(false);
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
        downloading={downloading}
        onApplyNight={handleApplyNight}
        onDownload={handleDownload}
        onClear={handleClearSelection}
      />
    </div>
  );
}
