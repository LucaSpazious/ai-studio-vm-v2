import {
  ARCHETYPES,
  TONE_MODIFIERS,
  SCENE_LABELS,
  type ArchetypeId,
  type ToneId,
  type SceneType,
} from "./archetypes";

/**
 * Build a complete prompt for AI Lifestyle generation.
 * Interpolates {tone_modifier} and {scene} into the archetype's base prompt.
 */
export function buildLifestylePrompt(
  archetypeId: ArchetypeId,
  toneId: ToneId,
  sceneType: SceneType
): string {
  const archetype = ARCHETYPES[archetypeId];
  const toneModifier = TONE_MODIFIERS[toneId];
  const sceneLabel = SCENE_LABELS[sceneType];

  return archetype.basePrompt
    .replace(/\{tone_modifier\}/g, toneModifier)
    .replace(/\{scene\}/g, sceneLabel);
}
