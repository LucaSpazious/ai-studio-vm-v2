import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

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
}
