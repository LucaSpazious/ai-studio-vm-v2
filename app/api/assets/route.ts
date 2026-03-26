import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { isDemoId, getDemoAssets } from "@/lib/demo-data";

const PROPERTY_ID = "rosewood-mayakoba";

/** GET /api/assets?categoryId={id} — list assets for a category */
export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId is required" },
      { status: 400 }
    );
  }

  // Demo categories — return hardcoded assets directly
  if (isDemoId(categoryId)) {
    return NextResponse.json(getDemoAssets(categoryId));
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("aistudio_assets")
      .select("*")
      .eq("category_id", categoryId)
      .eq("property_id", PROPERTY_ID)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
