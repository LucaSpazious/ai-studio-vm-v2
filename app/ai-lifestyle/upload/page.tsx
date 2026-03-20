"use client";

import StepIndicator from "../components/StepIndicator";

export default function UploadPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Step bar */}
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: "#1B3A3A" }}
      >
        <StepIndicator currentStep={1} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-lg rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-4"
          style={{ borderColor: "#0A9E8C" }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            stroke="#0A9E8C"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M24 32V12M16 20l8-8 8 8M8 40h32" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#E2F5F2" }}>
            Upload a photo with people to replace
          </p>
          <p className="text-xs" style={{ color: "#60D4C8", opacity: 0.6 }}>
            JPG, PNG, WebP — max 10 MB
          </p>
          <button
            disabled
            className="mt-2 px-6 py-2 rounded-lg text-sm font-medium text-white opacity-40 cursor-not-allowed"
            style={{ backgroundColor: "#0A9E8C" }}
          >
            Choose file
          </button>
        </div>
      </div>
    </div>
  );
}
