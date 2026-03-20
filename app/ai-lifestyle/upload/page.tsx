"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "../components/StepIndicator";
import { useLifestyle } from "../context/LifestyleContext";

export default function UploadPage() {
  const { file, previewUrl, setFile } = useLifestyle();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) return;
      setFile(f);
    },
    [setFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const formatSize = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b" style={{ borderColor: "#1B3A3A" }}>
        <StepIndicator currentStep={1} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ position: "absolute", left: "-9999px" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        {previewUrl && file ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-xl object-contain border"
              style={{ maxHeight: 400, borderColor: "#1B3A3A" }}
            />
            <div className="flex items-center gap-3">
              <span className="text-sm truncate max-w-[240px]" style={{ color: "#E2F5F2" }}>
                {file.name}
              </span>
              <span className="text-xs" style={{ color: "#60D4C8", opacity: 0.6 }}>
                {formatSize(file.size)}
              </span>
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs px-3 py-1 rounded border transition-colors hover:opacity-80"
                style={{ borderColor: "#1B3A3A", color: "#60D4C8" }}
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className="w-full max-w-lg rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-4 transition-colors cursor-pointer"
            style={{
              borderColor: dragOver ? "#E2F5F2" : "#0A9E8C",
              backgroundColor: dragOver ? "rgba(10,158,140,0.08)" : undefined,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#0A9E8C" strokeWidth="1.5" strokeLinecap="round">
              <path d="M24 32V12M16 20l8-8 8 8M8 40h32" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "#E2F5F2" }}>
              Drop a photo here or click to browse
            </p>
            <p className="text-xs" style={{ color: "#60D4C8", opacity: 0.6 }}>
              JPG, PNG, WebP — max 10 MB
            </p>
          </button>
        )}

        <button
          disabled={!file}
          onClick={() => router.push("/ai-lifestyle/archetype")}
          className="px-8 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: "#0A9E8C" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
