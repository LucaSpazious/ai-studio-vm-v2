"use client";

interface ActionBarProps {
  count: number;
  pendingNightCount: number;
  mode: "day" | "night";
  generating: boolean;
  downloading: boolean;
  onApplyNight: () => void;
  onDownload: () => void;
  onClear: () => void;
}

export default function ActionBar({
  count,
  pendingNightCount,
  mode,
  generating,
  downloading,
  onApplyNight,
  onDownload,
  onClear,
}: ActionBarProps) {
  if (count === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border"
      style={{ backgroundColor: "#0D2929", borderColor: "#1B3A3A" }}
    >
      <span className="text-sm text-white/80 whitespace-nowrap">
        {count} photo{count !== 1 ? "s" : ""} selected
      </span>

      {mode === "day" && (
        pendingNightCount > 0 ? (
          <button
            onClick={onApplyNight}
            disabled={generating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#0A9E8C" }}
          >
            {generating ? (
              <><Spinner /> Generating…</>
            ) : (
              <>🌙 Apply Night Mode{pendingNightCount < count ? ` (${pendingNightCount})` : ""}</>
            )}
          </button>
        ) : (
          <span className="text-sm text-white/40 px-3 py-1.5">
            Already generated
          </span>
        )
      )}

      <button
        onClick={onDownload}
        disabled={downloading || generating}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-colors disabled:opacity-50 border"
        style={{ borderColor: "#1B3A3A" }}
      >
        {downloading ? (
          <><Spinner /> Downloading…</>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 2v8M4 8l3 3 3-3M2 12h10" />
            </svg>
            Download
          </>
        )}
      </button>

      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
      >
        ✕ Clear
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 019.8 8" strokeLinecap="round" />
    </svg>
  );
}
