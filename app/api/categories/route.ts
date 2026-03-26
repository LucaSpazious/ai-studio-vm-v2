import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { DEMO_CATEGORIES } from "@/lib/demo-data";

const PROPERTY_ID = "rosewood-mayakoba";

/** GET /api/categories — list all categories for the property */
export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("aistudio_categories")
      .select("*")
      .eq("property_id", PROPERTY_ID)
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json(DEMO_CATEGORIES);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEMO_CATEGORIES);
  }
}

/** POST /api/categories — create a new category */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, parent_id } = body as { name: string; parent_id?: string | null };

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Get the next order value
  const { data: existing } = await supabase
    .from("aistudio_categories")
    .select("order")
    .eq("property_id", PROPERTY_ID)
    .eq("parent_id", parent_id ?? null)
    .order("order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].order + 1 : 0;

  const { data, error } = await supabase
    .from("aistudio_categories")
    .insert({
      property_id: PROPERTY_ID,
      name: name.trim(),
      parent_id: parent_id || null,
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
