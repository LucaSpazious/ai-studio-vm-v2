"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ArchetypeId, ToneId, SceneType } from "../utils/archetypes";

type Status = "idle" | "uploading" | "processing" | "completed" | "error";

interface GenerateParams {
  file: File;
  archetype: ArchetypeId;
  tone: ToneId;
  sceneType: SceneType;
  numVariations?: number;
}

interface LifestyleState {
  /* Upload */
  file: File | null;
  previewUrl: string | null;
  /* Archetype selection */
  archetype: ArchetypeId | null;
  tone: ToneId | null;
  sceneType: SceneType;
  /* Generation */
  status: Status;
  jobId: string | null;
  originalImageUrl: string | null;
  resultUrls: string[];
  selectedVariation: number;
  prompt: string | null;
  error: string | null;
  generationTimeMs: number | null;
}

interface LifestyleActions {
  setFile: (file: File | null) => void;
  setArchetype: (id: ArchetypeId) => void;
  setTone: (id: ToneId) => void;
  setSceneType: (scene: SceneType) => void;
  generate: (params: GenerateParams) => Promise<void>;
  selectVariation: (index: number) => void;
  reset: () => void;
  resetGeneration: () => void;
}

type LifestyleContextValue = LifestyleState & LifestyleActions;

const LifestyleContext = createContext<LifestyleContextValue | null>(null);

const INITIAL_STATE: LifestyleState = {
  file: null,
  previewUrl: null,
  archetype: null,
  tone: null,
  sceneType: "lobby",
  status: "idle",
  jobId: null,
  originalImageUrl: null,
  resultUrls: [],
  selectedVariation: 0,
  prompt: null,
  error: null,
  generationTimeMs: null,
};

export function LifestyleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LifestyleState>(INITIAL_STATE);

  const setFile = useCallback((file: File | null) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;
    setState((s) => {
      if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      return { ...s, file, previewUrl };
    });
  }, []);

  const setArchetype = useCallback((archetype: ArchetypeId) => {
    setState((s) => ({ ...s, archetype }));
  }, []);

  const setTone = useCallback((tone: ToneId) => {
    setState((s) => ({ ...s, tone }));
  }, []);

  const setSceneType = useCallback((sceneType: SceneType) => {
    setState((s) => ({ ...s, sceneType }));
  }, []);

  const selectVariation = useCallback((index: number) => {
    setState((s) => ({ ...s, selectedVariation: index }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => {
      if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      return INITIAL_STATE;
    });
  }, []);

  const resetGeneration = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "idle",
      jobId: null,
      resultUrls: [],
      selectedVariation: 0,
      prompt: null,
      error: null,
      generationTimeMs: null,
    }));
  }, []);

  const generate = useCallback(async (params: GenerateParams) => {
    setState((s) => ({ ...s, status: "uploading", error: null }));

    try {
      const form = new FormData();
      form.append("file", params.file);
      form.append("archetype", params.archetype);
      form.append("tone", params.tone);
      form.append("sceneType", params.sceneType);
      form.append("numVariations", String(params.numVariations ?? 4));

      setState((s) => ({ ...s, status: "processing" }));

      const res = await fetch("/api/ai-lifestyle/generate", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json() as {
        jobId: string;
        originalImageUrl: string;
        resultUrls: string[];
        prompt: string;
        generationTimeMs: number;
      };

      setState((s) => ({
        ...s,
        status: "completed",
        jobId: data.jobId,
        originalImageUrl: data.originalImageUrl,
        resultUrls: data.resultUrls,
        prompt: data.prompt,
        generationTimeMs: data.generationTimeMs,
        selectedVariation: 0,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState((s) => ({ ...s, status: "error", error: message }));
    }
  }, []);

  return (
    <LifestyleContext.Provider
      value={{ ...state, setFile, setArchetype, setTone, setSceneType, generate, selectVariation, reset, resetGeneration }}
    >
      {children}
    </LifestyleContext.Provider>
  );
}

export function useLifestyle(): LifestyleContextValue {
  const ctx = useContext(LifestyleContext);
  if (!ctx) throw new Error("useLifestyle must be used within LifestyleProvider");
  return ctx;
}
