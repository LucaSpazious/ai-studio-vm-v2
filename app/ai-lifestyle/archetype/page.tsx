"use client";

import StepIndicator from "../components/StepIndicator";

export default function ArchetypePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Step bar */}
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: "#1B3A3A" }}
      >
        <StepIndicator currentStep={2} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <h2 className="text-lg font-semibold" style={{ color: "#E2F5F2" }}>
          Select an archetype
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md">
          {["Business", "Leisure", "Family", "Romantic", "Wellness", "Adventure"].map(
            (archetype) => (
              <div
                key={archetype}
                className="rounded-lg border p-4 flex flex-col items-center gap-2 opacity-40"
                style={{
                  backgroundColor: "#0D2929",
                  borderColor: "#1B3A3A",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#1B3A3A" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#60D4C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="7" r="3" />
                    <path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  </svg>
                </div>
                <span className="text-xs font-medium" style={{ color: "#60D4C8" }}>
                  {archetype}
                </span>
              </div>
            )
          )}
        </div>

        <p className="text-xs" style={{ color: "#60D4C8", opacity: 0.5 }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}
