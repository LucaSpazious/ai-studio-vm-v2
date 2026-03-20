"use client";

import StepIndicator from "../components/StepIndicator";

export default function ResultPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Step bar */}
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: "#1B3A3A" }}
      >
        <StepIndicator currentStep={3} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#0D2929" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#60D4C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="24" height="24" rx="4" />
            <circle cx="11" cy="11" r="2" />
            <path d="M28 20l-8-8-12 12" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold" style={{ color: "#E2F5F2" }}>
          Result preview
        </h2>
        <p className="text-sm" style={{ color: "#60D4C8", opacity: 0.5 }}>
          Your AI-generated lifestyle photo will appear here
        </p>
        <p className="text-xs" style={{ color: "#60D4C8", opacity: 0.4 }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}
