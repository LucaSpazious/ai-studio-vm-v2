/**
 * Demo data — shown when Supabase returns 0 categories.
 * Uses freely-licensed Unsplash hotel photos.
 */

export const DEMO_PROPERTY_ID = "demo-property";

export interface DemoCategory {
  id: string;
  property_id: string;
  parent_id: string | null;
  name: string;
  order: number;
  created_at: string;
}

export interface DemoAsset {
  id: string;
  category_id: string;
  property_id: string;
  name: string;
  day_url: string;
  night_url: string | null;
  status: string;
  created_at: string;
}

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: "demo-cat-suites",
    property_id: DEMO_PROPERTY_ID,
    parent_id: null,
    name: "Suites & Rooms",
    order: 0,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-cat-common",
    property_id: DEMO_PROPERTY_ID,
    parent_id: null,
    name: "Common Areas",
    order: 1,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-cat-exteriors",
    property_id: DEMO_PROPERTY_ID,
    parent_id: null,
    name: "Exteriors",
    order: 2,
    created_at: "2025-01-01T00:00:00Z",
  },
];

export const DEMO_ASSETS: DemoAsset[] = [
  // Suites & Rooms
  {
    id: "demo-asset-room-1",
    category_id: "demo-cat-suites",
    property_id: DEMO_PROPERTY_ID,
    name: "Presidential Suite.jpg",
    day_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-asset-room-2",
    category_id: "demo-cat-suites",
    property_id: DEMO_PROPERTY_ID,
    name: "Ocean View Room.jpg",
    day_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:01Z",
  },
  {
    id: "demo-asset-room-3",
    category_id: "demo-cat-suites",
    property_id: DEMO_PROPERTY_ID,
    name: "Deluxe King.jpg",
    day_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:02Z",
  },
  {
    id: "demo-asset-room-4",
    category_id: "demo-cat-suites",
    property_id: DEMO_PROPERTY_ID,
    name: "Junior Suite.jpg",
    day_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:03Z",
  },

  // Common Areas
  {
    id: "demo-asset-common-1",
    category_id: "demo-cat-common",
    property_id: DEMO_PROPERTY_ID,
    name: "Main Lobby.jpg",
    day_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-asset-common-2",
    category_id: "demo-cat-common",
    property_id: DEMO_PROPERTY_ID,
    name: "Infinity Pool.jpg",
    day_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:01Z",
  },
  {
    id: "demo-asset-common-3",
    category_id: "demo-cat-common",
    property_id: DEMO_PROPERTY_ID,
    name: "Restaurant.jpg",
    day_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:02Z",
  },

  // Exteriors
  {
    id: "demo-asset-ext-1",
    category_id: "demo-cat-exteriors",
    property_id: DEMO_PROPERTY_ID,
    name: "Main Entrance.jpg",
    day_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-asset-ext-2",
    category_id: "demo-cat-exteriors",
    property_id: DEMO_PROPERTY_ID,
    name: "Beach View.jpg",
    day_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:01Z",
  },
  {
    id: "demo-asset-ext-3",
    category_id: "demo-cat-exteriors",
    property_id: DEMO_PROPERTY_ID,
    name: "Garden Pathway.jpg",
    day_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    night_url: null,
    status: "done",
    created_at: "2025-01-01T00:00:02Z",
  },
];

export function getDemoAssets(categoryId: string): DemoAsset[] {
  return DEMO_ASSETS.filter((a) => a.category_id === categoryId);
}

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-");
}
