"use client";

import { useEffect, useCallback } from "react";
import type { Asset } from "./AssetGrid";

interface PreviewModalProps {
  asset: Asset;
  assets: Asset[];
  mode: "day" | "night";
  onClose: () => void;
  onNavigate: (id: string) => void;
}

/** Download a file by fetching as blob */
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

export default function PreviewModal({
  asset,
  assets,
  mode,
  onClose,
  onNavigate,
}: PreviewModalProps) {
  const isNight = mode === "night";
  const showNight = isNight && !!asset.night_url;
  const url = showNight ? asset.night_url : asset.day_url;
  const versionLabel = showNight ? "NIGHT" : "DAY";

  const currentIndex = assets.findIndex((a) => a.id === asset.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < assets.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(assets[currentIndex - 1].id);
  }, [hasPrev, assets, currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(assets[currentIndex + 1].id);
  }, [hasNext, assets, currentIndex, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext]);

  const handleDownload = () => {
    if (!url) return;
    const suffix = showNight ? "_night" : "_day";
    const parts = asset.name.split(".");
    const dlName = parts.length > 1
      ? `${parts.slice(0, -1).join(".")}${suffix}.${parts[parts.length - 1]}`
      : `${asset.name}${suffix}`;
    downloadFile(url, dlName);
  };

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <p className="text-white text-sm font-medium">{asset.name}</p>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: showNight ? "#0A9E8C" : "#D97706",
              color: "white",
            }}
          >
            {versionLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 2v8M4 8l3 3 3-3M2 12h10" />
            </svg>
            Download
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image */}
      <div onClick={(e) => e.stopPropagation()} className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={asset.name}
          style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", filter: "brightness(1.15)" }}
        />
      </div>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
        {currentIndex + 1} / {assets.length}
      </div>
    </div>
  );
}
