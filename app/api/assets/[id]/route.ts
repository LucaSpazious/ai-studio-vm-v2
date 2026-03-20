import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/** DELETE /api/assets/[id] — delete asset + storage files */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = getServiceSupabase();

  // Get asset to find storage paths
  const { data: asset, error: fetchErr } = await supabase
    .from("aistudio_assets")
    .select("day_storage_path, night_storage_path")
    .eq("id", id)
    .single();

  if (fetchErr || !asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  // Delete from storage
  if (asset.day_storage_path) {
    await supabase.storage
      .from("aistudio-day")
      .remove([asset.day_storage_path]);
  }
  if (asset.night_storage_path) {
    await supabase.storage
      .from("aistudio-night")
      .remove([asset.night_storage_path]);
  }

  // Delete from database
  const { error } = await supabase
    .from("aistudio_assets")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
