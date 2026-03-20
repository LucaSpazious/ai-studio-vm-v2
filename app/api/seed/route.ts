import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

const PROPERTY_ID = "rosewood-mayakoba";

const SEED_DATA = [
  {
    name: "Suites & Rooms",
    order: 0,
    children: [
      { name: "Deluxe Lagoon Suite", order: 0 },
      { name: "Ocean Front Suite", order: 1 },
      { name: "Presidential Suite", order: 2 },
      { name: "Overwater Bungalow", order: 3 },
    ],
  },
  {
    name: "Restaurants & Bars",
    order: 1,
    children: [
      { name: "Aqui Me Quedo", order: 0 },
      { name: "La Ceiba", order: 1 },
      { name: "Lobby Bar", order: 2 },
    ],
  },
  {
    name: "Common Areas",
    order: 2,
    children: [
      { name: "Main Lobby", order: 0 },
      { name: "Pool Area", order: 1 },
      { name: "Spa Entrance", order: 2 },
      { name: "Beach Club", order: 3 },
    ],
  },
  {
    name: "Exteriors",
    order: 3,
    children: [
      { name: "Main Entrance", order: 0 },
      { name: "Gardens", order: 1 },
      { name: "Dock", order: 2 },
    ],
  },
];

/** POST /api/seed — insert seed categories for Rosewood Mayakoba */
export async function POST() {
  const supabase = getServiceSupabase();

  // Clear existing data for this property
  await supabase
    .from("aistudio_categories")
    .delete()
    .eq("property_id", PROPERTY_ID);

  for (const root of SEED_DATA) {
    const { data: parent, error: parentErr } = await supabase
      .from("aistudio_categories")
      .insert({
        property_id: PROPERTY_ID,
        name: root.name,
        order: root.order,
        parent_id: null,
      })
      .select()
      .single();

    if (parentErr || !parent) {
      return NextResponse.json(
        { error: `Failed to insert ${root.name}: ${parentErr?.message}` },
        { status: 500 }
      );
    }

    if (root.children) {
      const children = root.children.map((c) => ({
        property_id: PROPERTY_ID,
        name: c.name,
        order: c.order,
        parent_id: parent.id,
      }));

      const { error: childErr } = await supabase
        .from("aistudio_categories")
        .insert(children);

      if (childErr) {
        return NextResponse.json(
          { error: `Failed to insert children of ${root.name}: ${childErr.message}` },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ success: true, message: "Seed data inserted" });
}
