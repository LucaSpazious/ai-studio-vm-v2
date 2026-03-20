import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateLifestyleVariations } from "@/lib/replicate-lifestyle";
import { buildLifestylePrompt } from "@/app/ai-lifestyle/utils/promptBuilder";
import type { ArchetypeId, ToneId, SceneType } from "@/app/ai-lifestyle/utils/archetypes";

const HOTEL_ID = "rosewood-mayakoba";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const archetype = formData.get("archetype") as ArchetypeId | null;
  const tone = formData.get("tone") as ToneId | null;
  const sceneType = (formData.get("sceneType") as SceneType) || "lobby";
  const numVariations = parseInt(formData.get("numVariations") as string) || 4;

  if (!file || !archetype || !tone) {
    return NextResponse.json(
      { error: "file, archetype, and tone are required" },
      { status: 400 }
    );
  }

  const supabase = getServiceSupabase();
  const prompt = buildLifestylePrompt(archetype, tone, sceneType);
  const startTime = Date.now();

  // 1. Upload original to Storage
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `originals/${HOTEL_ID}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from("lifestyle-images")
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (uploadErr) {
    console.error("[lifestyle] Upload error:", uploadErr.message);
    return NextResponse.json(
      { error: `Upload failed: ${uploadErr.message}` },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("lifestyle-images")
    .getPublicUrl(storagePath);
  const originalImageUrl = urlData.publicUrl;

  // 2. Create job row
  const { data: job, error: jobErr } = await supabase
    .from("ai_lifestyle_jobs")
    .insert({
      hotel_id: HOTEL_ID,
      original_image_url: originalImageUrl,
      original_image_path: storagePath,
      archetype,
      tone,
      scene_type: sceneType,
      prompt_used: prompt,
      status: "processing",
      model_version: "black-forest-labs/flux-kontext-pro",
    })
    .select()
    .single();

  if (jobErr || !job) {
    console.error("[lifestyle] Job insert error:", jobErr?.message);
    return NextResponse.json(
      { error: `Job creation failed: ${jobErr?.message}` },
      { status: 500 }
    );
  }

  const jobId = job.id as string;
  console.log(`[lifestyle] Job ${jobId}: generating ${numVariations} variations`);

  // 3. Generate variations via Replicate
  try {
    const results = await generateLifestyleVariations(
      { inputImageUrl: originalImageUrl, prompt },
      numVariations
    );

    // 4. Upload results to Storage
    const resultUrls: string[] = [];
    for (let i = 0; i < results.length; i++) {
      const imgRes = await fetch(results[i].imageUrl);
      const imgBuf = Buffer.from(await imgRes.arrayBuffer());
      const resultPath = `results/${HOTEL_ID}/${jobId}/variation_${i}.jpg`;

      await supabase.storage
        .from("lifestyle-images")
        .upload(resultPath, imgBuf, { contentType: "image/jpeg", upsert: true });

      const { data: rUrl } = supabase.storage
        .from("lifestyle-images")
        .getPublicUrl(resultPath);
      resultUrls.push(rUrl.publicUrl);
    }

    const totalTime = Date.now() - startTime;
    const avgGenTime = results.reduce((s, r) => s + r.generationTimeMs, 0) / results.length;

    // 5. Update job
    await supabase
      .from("ai_lifestyle_jobs")
      .update({
        status: "done",
        result_image_urls: resultUrls,
        generation_time_ms: Math.round(avgGenTime),
      })
      .eq("id", jobId);

    console.log(`[lifestyle] Job ${jobId}: done in ${totalTime}ms`);

    return NextResponse.json({
      jobId,
      originalImageUrl,
      resultUrls,
      prompt,
      generationTimeMs: totalTime,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[lifestyle] Job ${jobId} error:`, message);

    await supabase
      .from("ai_lifestyle_jobs")
      .update({ status: "error", error_message: message })
      .eq("id", jobId);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
