"use client";

import Link from "next/link";

const STEPS = [
  { label: "Upload", href: "/ai-lifestyle/upload" },
  { label: "Archetype", href: "/ai-lifestyle/archetype" },
  { label: "Result", href: "/ai-lifestyle/result" },
];

interface StepIndicatorProps {
  currentStep: number; // 1, 2, or 3
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="w-8 h-px"
                style={{
                  backgroundColor: isCompleted ? "#0A9E8C" : "#1B3A3A",
                }}
              />
            )}
            <Link
              href={step.href}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{
                color: isActive
                  ? "#E2F5F2"
                  : isCompleted
                    ? "#0A9E8C"
                    : "#60D4C8",
                opacity: isActive || isCompleted ? 1 : 0.4,
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: isActive
                    ? "#0A9E8C"
                    : isCompleted
                      ? "#0A9E8C"
                      : "#1B3A3A",
                  color: isActive || isCompleted ? "#fff" : "#60D4C8",
                }}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6l2.5 2.5 4.5-5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </span>
              {step.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
