"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "../components/StepIndicator";
import { useLifestyle } from "../context/LifestyleContext";
import {
  ARCHETYPES,
  SCENE_LABELS,
  type ArchetypeId,
  type ToneId,
  type SceneType,
} from "../utils/archetypes";
import { buildLifestylePrompt } from "../utils/promptBuilder";

const ARCHETYPE_IDS: ArchetypeId[] = ["family", "couple", "business", "friends", "solo", "group"];
const TONE_IDS: ToneId[] = ["casual", "luxury", "active", "romantic", "professional"];
const SCENE_IDS: SceneType[] = ["lobby", "room", "pool", "restaurant", "other"];

export default function ArchetypePage() {
  const {
    file, archetype, tone, sceneType,
    setArchetype, setTone, setSceneType, generate, status,
  } = useLifestyle();
  const router = useRouter();

  useEffect(() => {
    if (!file) router.replace("/ai-lifestyle/upload");
  }, [file, router]);

  if (!file) return null;

  const canGenerate = !!archetype && !!tone && status === "idle";
  const promptPreview = archetype && tone
    ? buildLifestylePrompt(archetype, tone, sceneType)
    : null;

  const handleGenerate = async () => {
    if (!archetype || !tone || !file) return;
    router.push("/ai-lifestyle/result");
    await generate({ file, archetype, tone, sceneType, numVariations: 4 });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b" style={{ borderColor: "#1B3A3A" }}>
        <StepIndicator currentStep={2} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Archetype grid */}
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#E2F5F2" }}>
              Select an archetype
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ARCHETYPE_IDS.map((id) => {
                const a = ARCHETYPES[id];
                const selected = archetype === id;
                return (
                  <button
                    key={id}
                    onClick={() => setArchetype(id)}
                    className="rounded-lg border p-4 flex flex-col items-center gap-2 transition-all text-center"
                    style={{
                      backgroundColor: selected ? "#0A9E8C" : "#0D2929",
                      borderColor: selected ? "#0A9E8C" : "#1B3A3A",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selected ? "white" : "#60D4C8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: selected ? "white" : "#E2F5F2" }}>
                      {a.label}
                    </span>
                    <span className="text-[10px] leading-tight" style={{ color: selected ? "rgba(255,255,255,0.7)" : "#60D4C8", opacity: selected ? 1 : 0.6 }}>
                      {a.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone pills */}
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#E2F5F2" }}>
              Tone
            </h2>
            <div className="flex flex-wrap gap-2">
              {TONE_IDS.map((id) => {
                const selected = tone === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTone(id)}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize"
                    style={{
                      backgroundColor: selected ? "#0A9E8C" : "#0D2929",
                      color: selected ? "white" : "#60D4C8",
                      border: `1px solid ${selected ? "#0A9E8C" : "#1B3A3A"}`,
                    }}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scene type */}
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#E2F5F2" }}>
              Scene type
            </h2>
            <div className="flex flex-wrap gap-2">
              {SCENE_IDS.map((id) => {
                const selected = sceneType === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSceneType(id)}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize"
                    style={{
                      backgroundColor: selected ? "#0A9E8C" : "#0D2929",
                      color: selected ? "white" : "#60D4C8",
                      border: `1px solid ${selected ? "#0A9E8C" : "#1B3A3A"}`,
                    }}
                  >
                    {SCENE_LABELS[id]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt preview */}
          {promptPreview && (
            <div>
              <h2 className="text-sm font-semibold mb-2" style={{ color: "#E2F5F2" }}>
                Generated prompt
              </h2>
              <div
                className="rounded-lg p-3 text-xs leading-relaxed"
                style={{ backgroundColor: "#0D2929", color: "#60D4C8" }}
              >
                {promptPreview}
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            disabled={!canGenerate}
            onClick={handleGenerate}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "#0A9E8C" }}
          >
            Generate image
          </button>
        </div>
      </div>
    </div>
  );
}
