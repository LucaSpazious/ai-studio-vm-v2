export type ArchetypeId = "family" | "couple" | "business" | "friends" | "solo" | "group";
export type ToneId = "casual" | "luxury" | "active" | "romantic" | "professional";
export type SceneType = "lobby" | "room" | "pool" | "restaurant" | "other";

export interface Archetype {
  id: ArchetypeId;
  label: string;
  description: string;
  basePrompt: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  family: {
    id: "family",
    label: "Family",
    description: "Parents with kids enjoying the property",
    basePrompt:
      "A {tone_modifier} family — parents aged 30-45 and two children aged 6-12 — naturally posed in a hotel {scene}. They look relaxed and happy, wearing casual smart clothing appropriate for a resort. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
  couple: {
    id: "couple",
    label: "Couple",
    description: "Romantic couple exploring the hotel",
    basePrompt:
      "A {tone_modifier} couple in their early 30s, stylish and casually dressed, naturally posed in a hotel {scene}. They look relaxed and connected, with natural body language. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
  business: {
    id: "business",
    label: "Business",
    description: "Professional traveler at the property",
    basePrompt:
      "A {tone_modifier} business traveler aged 30-45, wearing professional attire and carrying a laptop bag, naturally posed in a hotel {scene}. They look confident and polished. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
  friends: {
    id: "friends",
    label: "Friends",
    description: "Group of friends having fun",
    basePrompt:
      "A {tone_modifier} group of 3 diverse friends in their late 20s, wearing casual colorful clothing, naturally posed and laughing together in a hotel {scene}. They look carefree and energetic. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
  solo: {
    id: "solo",
    label: "Solo",
    description: "Solo traveler discovering the space",
    basePrompt:
      "A {tone_modifier} solo female traveler in her 30s, wearing casual adventure clothing with a small backpack, naturally posed exploring a hotel {scene}. She looks independent and curious. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
  group: {
    id: "group",
    label: "Group",
    description: "Conference or event attendees",
    basePrompt:
      "A {tone_modifier} group of 5 diverse conference attendees aged 25-55, wearing business casual attire, naturally posed and networking in a hotel {scene}. They look engaged and professional. Photorealistic, natural lighting, candid feel. Preserve the exact hotel {scene} background, all furniture, lighting, shadows, and architectural details completely unchanged. Only replace the people.",
  },
};

export const TONE_MODIFIERS: Record<ToneId, string> = {
  casual: "relaxed, laid-back",
  luxury: "elegant, high-end, sophisticated",
  active: "energetic, sporty, dynamic",
  romantic: "warm, intimate, affectionate",
  professional: "polished, formal, corporate",
};

export const SCENE_LABELS: Record<SceneType, string> = {
  lobby: "lobby",
  room: "room",
  pool: "pool area",
  restaurant: "restaurant",
  other: "space",
};
