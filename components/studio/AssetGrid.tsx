"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Asset {
  id: string;
  category_id: string;
  property_id: string;
  name: string;
  day_url: string | null;
  night_url: string | null;
  status: string;
  created_at: string;
}

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

interface AssetGridProps {
  categoryId: string;
  mode: "day" | "night";
  selectedIds: Set<string>;
  processingIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAssetsLoaded?: (assets: Asset[]) => void;
}

export default function AssetGrid({
  categoryId,
  mode,
  selectedIds,
  processingIds,
  onToggleSelect,
  onAssetsLoaded,
}: AssetGridProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNight = mode === "night";

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch(`/api/assets?categoryId=${categoryId}`);
      if (res.ok) {
        const data: Asset[] = await res.json();
        setAssets(data);
        onAssetsLoaded?.(data);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryId, onAssetsLoaded]);

  useEffect(() => {
    setLoading(true);
    fetchAssets();
  }, [fetchAssets]);

  const handleUploadFiles = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("categoryId", categoryId);
        form.append("mode", mode);
        await fetch("/api/upload", { method: "POST", body: form });
      }
    } finally {
      setUploading(false);
    }
    await fetchAssets();
  };

  const c = {
    text: isNight ? "#E2F5F2" : "#374151",
    muted: isNight ? "#60D4C8" : "#9CA3AF",
    cardBg: isNight ? "#0D2929" : "#FFFFFF",
    placeholder: isNight ? "#1B3A3A" : "#F3F4F6",
    border: isNight ? "#1B3A3A" : "#E5E7EB",
    accent: "#0A9E8C",
  };

  return (
    <div className="p-4 h-full overflow-auto relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          const fileList = Array.from(files);
          e.target.value = "";
          handleUploadFiles(fileList);
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm" style={{ color: c.muted }}>Loading assets…</p>
        </div>
      ) : assets.length > 0 ? (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
        >
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              mode={mode}
              colors={c}
              selected={selectedIds.has(asset.id)}
              processing={processingIds.has(asset.id)}
              onToggle={() => onToggleSelect(asset.id)}
            />
          ))}
          <UploadZone
            compact
            colors={c}
            uploading={uploading}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <UploadZone
            colors={c}
            uploading={uploading}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      )}
    </div>
  );
}

/* ── Asset Card ── */
function AssetCard({
  asset,
  mode,
  colors,
  selected,
  processing,
  onToggle,
}: {
  asset: Asset;
  mode: "day" | "night";
  colors: { cardBg: string; placeholder: string; border: string; text: string; muted: string; accent: string };
  selected: boolean;
  processing: boolean;
  onToggle: () => void;
}) {
  const isNight = mode === "night";
  const url = isNight ? asset.night_url : asset.day_url;
  const hasNight = !!asset.night_url;
  const isError = asset.status === "error";

  return (
    <div
      className="group relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: selected ? colors.accent : colors.border,
      }}
      onClick={onToggle}
    >
      <div
        className="aspect-square flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: url ? undefined : colors.placeholder }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.5" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5-8 8" />
          </svg>
        )}
      </div>

      {/* Selected checkbox */}
      {selected && (
        <div
          className="absolute top-1.5 left-1.5 w-5 h-5 rounded flex items-center justify-center"
          style={{ backgroundColor: colors.accent }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6l2.5 2.5 4.5-5" />
          </svg>
        </div>
      )}

      {/* Night badge (day mode only) */}
      {!isNight && hasNight && !processing && (
        <span className="absolute top-1.5 right-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
          🌙
        </span>
      )}

      {/* Processing overlay */}
      {processing && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
          <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 019.8 8" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] text-white font-medium">Generating…</span>
        </div>
      )}

      {/* Error badge */}
      {isError && !processing && (
        <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center">
          <span className="text-[10px] text-red-300 font-medium bg-black/50 px-2 py-0.5 rounded">Error</span>
        </div>
      )}

      {/* Hover overlay (not when processing) */}
      {url && !processing && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-1.5 opacity-0 group-hover:opacity-100">
          <button
            className="w-5 h-5 flex items-center justify-center rounded bg-white/20 hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation();
              const suffix = isNight ? "_night" : "_day";
              const ext = asset.name.lastIndexOf(".") >= 0 ? "" : ".jpg";
              const parts = asset.name.split(".");
              const dlName = parts.length > 1
                ? `${parts.slice(0, -1).join(".")}${suffix}.${parts[parts.length - 1]}`
                : `${asset.name}${suffix}${ext}`;
              downloadFile(url, dlName);
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2v7M3 7l3 3 3-3M2 11h8" />
            </svg>
          </button>
        </div>
      )}

      <div className="px-2 py-1.5">
        <p className="text-[11px] truncate" style={{ color: colors.text }}>{asset.name}</p>
      </div>
    </div>
  );
}

/* ── Upload Zone ── */
function UploadZone({
  compact,
  colors,
  uploading,
  onClick,
}: {
  compact?: boolean;
  colors: { border: string; muted: string; accent: string };
  uploading: boolean;
  onClick: () => void;
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        disabled={uploading}
        className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:opacity-80"
        style={{ borderColor: colors.border, color: colors.muted }}
      >
        {uploading ? (
          <span className="text-[11px]">Uploading…</span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 14V4M6 8l4-4 4 4M3 17h14" />
            </svg>
            <span className="text-[10px]">Upload</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={uploading}
      className="w-full max-w-xs rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-2 transition-colors hover:opacity-80"
      style={{ borderColor: colors.accent, color: colors.muted }}
    >
      {uploading ? (
        <span className="text-sm">Uploading…</span>
      ) : (
        <>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round">
            <path d="M16 22V8M10 14l6-6 6 6M5 28h22" />
          </svg>
          <span className="text-sm font-medium">Click to upload photos</span>
          <span className="text-xs opacity-60">JPG, PNG, WebP</span>
        </>
      )}
    </button>
  );
}
