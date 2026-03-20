import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

const PROPERTY_ID = "rosewood-mayakoba";

/** POST /api/upload — upload a photo to day or night bucket */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const categoryId = formData.get("categoryId") as string | null;
  const mode = formData.get("mode") as "day" | "night" | null;

  if (!file || !categoryId || !mode) {
    return NextResponse.json(
      { error: "file, categoryId, and mode are required" },
      { status: 400 }
    );
  }

  if (mode !== "day" && mode !== "night") {
    return NextResponse.json(
      { error: "mode must be 'day' or 'night'" },
      { status: 400 }
    );
  }

  const supabase = getServiceSupabase();
  const bucket = mode === "day" ? "aistudio-day" : "aistudio-night";
  const storagePath = `${PROPERTY_ID}/${categoryId}/${file.name}`;

  // Upload to Supabase Storage (upsert to allow re-uploads)
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Upsert asset: check if same name + category already exists
  const { data: existing } = await supabase
    .from("aistudio_assets")
    .select("id")
    .eq("category_id", categoryId)
    .eq("name", file.name)
    .eq("property_id", PROPERTY_ID)
    .limit(1);

  const urlField = mode === "day" ? "day_url" : "night_url";
  const pathField = mode === "day" ? "day_storage_path" : "night_storage_path";

  if (existing && existing.length > 0) {
    // Update existing asset
    const { data, error } = await supabase
      .from("aistudio_assets")
      .update({
        [urlField]: publicUrl,
        [pathField]: storagePath,
      })
      .eq("id", existing[0].id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Insert new asset
  const { data, error } = await supabase
    .from("aistudio_assets")
    .insert({
      category_id: categoryId,
      property_id: PROPERTY_ID,
      name: file.name,
      [urlField]: publicUrl,
      [pathField]: storagePath,
      status: "done",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
