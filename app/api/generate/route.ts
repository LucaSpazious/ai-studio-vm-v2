import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { getServiceSupabase } from "@/lib/supabase";

const NIGHT_PROMPT =
  "Convert this hotel space to nighttime lighting only. Keep every wall, ceiling, floor, furniture and architectural element exactly as it is. Only change: interior lighting to warm ambient, existing windows to show night outside. Photorealistic. No new windows, no city views where there are walls.";

/** POST /api/generate — generate night versions for selected assets */
export async function POST(req: NextRequest) {
  const { assetIds } = (await req.json()) as { assetIds: string[] };

  if (!assetIds?.length) {
    return NextResponse.json({ error: "assetIds required" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  const results: { id: string; status: string; night_url?: string; error?: string }[] = [];

  for (const assetId of assetIds) {
    // Get asset
    const { data: asset, error: fetchErr } = await supabase
      .from("aistudio_assets")
      .select("*")
      .eq("id", assetId)
      .single();

    if (fetchErr || !asset) {
      results.push({ id: assetId, status: "error", error: "Asset not found" });
      continue;
    }

    if (!asset.day_url) {
      results.push({ id: assetId, status: "error", error: "No day_url" });
      continue;
    }

    // Mark as processing
    await supabase
      .from("aistudio_assets")
      .update({ status: "processing" })
      .eq("id", assetId);

    try {
      console.log(`[generate] Starting ${assetId}: ${asset.name}`);

      const output = (await replicate.run("black-forest-labs/flux-kontext-pro", {
        input: {
          input_image: asset.day_url,
          prompt: NIGHT_PROMPT,
          strength: 0.55,
          guidance_scale: 6,
          num_inference_steps: 35,
          output_quality: 95,
        },
      })) as { url: () => URL };

      const resultUrl = output.url().toString();
      console.log(`[generate] Done ${assetId}: ${resultUrl}`);

      // Upload to night bucket
      const imgRes = await fetch(resultUrl);
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      const storagePath = `${asset.property_id}/${asset.category_id}/${asset.name}`;

      await supabase.storage
        .from("aistudio-night")
        .upload(storagePath, imgBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      const { data: urlData } = supabase.storage
        .from("aistudio-night")
        .getPublicUrl(storagePath);

      // Update asset
      await supabase
        .from("aistudio_assets")
        .update({
          night_url: urlData.publicUrl,
          night_storage_path: storagePath,
          status: "done",
        })
        .eq("id", assetId);

      results.push({ id: assetId, status: "done", night_url: urlData.publicUrl });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[generate] Error ${assetId}:`, message);

      await supabase
        .from("aistudio_assets")
        .update({ status: "error" })
        .eq("id", assetId);

      results.push({ id: assetId, status: "error", error: message });
    }
  }

  return NextResponse.json({ results });
}
