import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/** PATCH /api/categories/[id] — rename or reorder */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) {
    updates.name = body.name.trim();
  }
  if (typeof body.order === "number") {
    updates.order = body.order;
  }
  if (body.parent_id !== undefined) {
    updates.parent_id = body.parent_id || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("aistudio_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/** DELETE /api/categories/[id] — delete category and children (cascade via DB) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = getServiceSupabase();

  // Delete children first (parent_id references won't cascade by default — it's SET NULL)
  // So we recursively delete children
  await deleteRecursive(supabase, id);

  return NextResponse.json({ success: true });
}

async function deleteRecursive(
  supabase: ReturnType<typeof getServiceSupabase>,
  parentId: string
) {
  // Find children
  const { data: children } = await supabase
    .from("aistudio_categories")
    .select("id")
    .eq("parent_id", parentId);

  if (children) {
    for (const child of children) {
      await deleteRecursive(supabase, child.id);
    }
  }

  // Delete the node itself
  await supabase.from("aistudio_categories").delete().eq("id", parentId);
}
