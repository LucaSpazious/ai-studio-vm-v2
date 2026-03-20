"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StepIndicator from "../components/StepIndicator";
import { useLifestyle } from "../context/LifestyleContext";
import { ARCHETYPES } from "../utils/archetypes";

const PROGRESS_STEPS = [
  "Uploading your photo",
  "Analyzing composition",
  "Identifying people",
  "Generating archetype",
  "Preserving background & lighting",
];

export default function ResultPage() {
  const ctx = useLifestyle();
  const router = useRouter();

  useEffect(() => {
    if (ctx.status === "idle" && !ctx.file) {
      router.replace("/ai-lifestyle/upload");
    }
  }, [ctx.status, ctx.file, router]);

  if (ctx.status === "idle" && !ctx.file) return null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b" style={{ borderColor: "#1B3A3A" }}>
        <StepIndicator currentStep={3} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {(ctx.status === "uploading" || ctx.status === "processing") && (
          <ProcessingView />
        )}
        {ctx.status === "completed" && <CompletedView />}
        {ctx.status === "error" && <ErrorView />}
      </div>
    </div>
  );
}

function ProcessingView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 min-h-[400px]">
      <svg className="animate-spin h-10 w-10" style={{ color: "#0A9E8C" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 019.8 8" strokeLinecap="round" />
      </svg>

      <div className="flex flex-col gap-3">
        {PROGRESS_STEPS.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-3 text-sm animate-pulse"
            style={{
              color: "#60D4C8",
              animationDelay: `${i * 1.5}s`,
              animationDuration: "2s",
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#0A9E8C" }}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedView() {
  const {
    originalImageUrl, previewUrl, resultUrls, selectedVariation,
    selectVariation, archetype, reset, resetGeneration,
  } = useLifestyle();
  const router = useRouter();

  const currentResult = resultUrls[selectedVariation];
  const originalSrc = originalImageUrl || previewUrl;
  const archetypeLabel = archetype ? ARCHETYPES[archetype].label : "";

  const handleDownload = () => {
    if (currentResult) window.open(currentResult, "_blank");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Before / After */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "#60D4C8" }}>
            Original
          </p>
          {originalSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={originalSrc} alt="Original" className="w-full rounded-lg object-contain" style={{ maxHeight: 400 }} />
          )}
        </div>
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "#0A9E8C" }}>
            {archetypeLabel}
          </p>
          {currentResult && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentResult} alt="Result" className="w-full rounded-lg object-contain" style={{ maxHeight: 400 }} />
          )}
        </div>
      </div>

      {/* Variation thumbnails */}
      {resultUrls.length > 1 && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#60D4C8" }}>
            Variations ({resultUrls.length})
          </p>
          <div className="flex gap-2">
            {resultUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => selectVariation(i)}
                className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0"
                style={{
                  borderColor: selectedVariation === i ? "#0A9E8C" : "#1B3A3A",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Variation ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownload}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0A9E8C" }}
        >
          Download
        </button>
        <button
          onClick={() => {
            resetGeneration();
            router.push("/ai-lifestyle/archetype");
          }}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border"
          style={{ borderColor: "#1B3A3A", color: "#60D4C8" }}
        >
          Try another archetype
        </button>
        <button
          onClick={() => {
            reset();
            router.push("/ai-lifestyle/upload");
          }}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border"
          style={{ borderColor: "#1B3A3A", color: "#60D4C8" }}
        >
          New photo
        </button>
        <Link
          href="/hub"
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#60D4C8", opacity: 0.6 }}
        >
          Back to Hub
        </Link>
      </div>
    </div>
  );
}

function ErrorView() {
  const { error, file, archetype, tone, sceneType, generate, reset } = useLifestyle();
  const router = useRouter();

  const handleRetry = () => {
    if (file && archetype && tone) {
      generate({ file, archetype, tone, sceneType, numVariations: 4 });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 min-h-[400px]">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
          <circle cx="14" cy="14" r="12" />
          <path d="M10 10l8 8M18 10l-8 8" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#E2F5F2" }}>
          Generation failed
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "#60D4C8", opacity: 0.7 }}>
          {error || "An unknown error occurred"}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0A9E8C" }}
        >
          Try again
        </button>
        <button
          onClick={() => {
            reset();
            router.push("/ai-lifestyle/upload");
          }}
          className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors"
          style={{ borderColor: "#1B3A3A", color: "#60D4C8" }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
