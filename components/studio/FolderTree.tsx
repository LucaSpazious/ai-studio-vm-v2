"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { DEMO_CATEGORIES } from "@/lib/demo-data";

/* ── Types ── */
interface Category {
  id: string;
  property_id: string;
  parent_id: string | null;
  name: string;
  order: number;
  created_at: string;
}

interface TreeNode extends Category {
  children: TreeNode[];
}

export interface FolderTreeHandle {
  createRoot: () => void;
  createSub: () => void;
}

interface FolderTreeProps {
  mode: "day" | "night";
  onSelect?: (id: string | null) => void;
}

/* ── Helpers ── */
function buildTree(flat: Category[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const cat of flat) {
    map.set(cat.id, { ...cat, children: [] });
  }
  for (const node of Array.from(map.values())) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sort = (arr: TreeNode[]) => {
    arr.sort((a, b) => a.order - b.order);
    arr.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

/* ── Component ── */
const FolderTree = forwardRef<FolderTreeHandle, FolderTreeProps>(function FolderTree({ mode, onSelect }, ref) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [creatingUnder, setCreatingUnder] = useState<string | null>(null); // parent_id for new node
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const isNight = mode === "night";

  /* ── Fetch (falls back to demo data when Supabase returns 0 or fails) ── */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      // Use demo if: non-200, not an array, or empty array
      if (!res.ok || !Array.isArray(data) || data.length === 0) {
        setCategories(DEMO_CATEGORIES);
      } else {
        setCategories(data);
      }
    } catch {
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const tree = buildTree(categories);

  /* ── Actions ── */
  const handleCreate = async (parentId: string | null) => {
    const name = newName.trim();
    if (!name) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parent_id: parentId }),
    });

    if (res.ok) {
      setCreatingUnder(null);
      setNewName("");
      if (parentId) setExpanded((s) => new Set(s).add(parentId));
      await fetchCategories();
    }
  };

  const handleRename = async (id: string) => {
    const name = editValue.trim();
    if (!name) {
      setEditingId(null);
      return;
    }

    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setEditingId(null);
      await fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedId === id) {
        setSelectedId(null);
        onSelect?.(null);
      }
      await fetchCategories();
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const select = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  /* ── Create root category ── */
  const startCreateRoot = () => {
    setCreatingUnder("__root__");
    setNewName("");
  };

  /* ── Create subfolder under selected ── */
  const startCreateSub = (parentId: string) => {
    setExpanded((s) => new Set(s).add(parentId));
    setCreatingUnder(parentId);
    setNewName("");
  };

  useImperativeHandle(ref, () => ({
    createRoot: () => startCreateRoot(),
    createSub: () => {
      if (selectedId) startCreateSub(selectedId);
      else startCreateRoot();
    },
  }));

  /* ── Colors ── */
  const c = {
    text: isNight ? "#E2F5F2" : "#374151",
    textMuted: isNight ? "#60D4C8" : "#9CA3AF",
    hover: isNight ? "#0D2929" : "#F3F4F6",
    selected: isNight ? "#1B3A3A" : "#EFF6FF",
    border: isNight ? "#1B3A3A" : "#E5E7EB",
    inputBg: isNight ? "#0A1A19" : "#FFFFFF",
    accent: "#0A9E8C",
  };

  /* ── Render node ── */
  const renderNode = (node: TreeNode, depth: number) => {
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedId === node.id;
    const isEditing = editingId === node.id;
    const hasChildren = node.children.length > 0;
    const isRoot = node.parent_id === null;

    return (
      <div key={node.id}>
        <div
          className="group flex items-center gap-1 py-1.5 pr-2 cursor-pointer rounded-md text-sm transition-colors"
          style={{
            paddingLeft: `${depth * 16 + 8}px`,
            backgroundColor: isSelected ? c.selected : undefined,
            color: c.text,
          }}
          onMouseEnter={(e) => {
            if (!isSelected)
              e.currentTarget.style.backgroundColor = c.hover;
          }}
          onMouseLeave={(e) => {
            if (!isSelected)
              e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={() => select(node.id)}
        >
          {/* Expand/collapse chevron */}
          <button
            className="shrink-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
            style={{ visibility: hasChildren || isRoot ? "visible" : "hidden" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-150"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                opacity: 0.5,
              }}
            >
              <path d="M3 2l4 3-4 3" />
            </svg>
          </button>

          {/* Folder icon */}
          <FolderIcon open={isExpanded && hasChildren} isNight={isNight} />

          {/* Name or edit input */}
          {isEditing ? (
            <InlineInput
              value={editValue}
              onChange={setEditValue}
              onConfirm={() => handleRename(node.id)}
              onCancel={() => setEditingId(null)}
              colors={c}
            />
          ) : (
            <span className="truncate flex-1 select-none">{node.name}</span>
          )}

          {/* Action buttons (visible on hover) */}
          {!isEditing && (
            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
              <ActionButton
                title="Add subfolder"
                onClick={(e) => {
                  e.stopPropagation();
                  startCreateSub(node.id);
                }}
                colors={c}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 3v6M3 6h6" />
                </svg>
              </ActionButton>
              <ActionButton
                title="Rename"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(node.id);
                  setEditValue(node.name);
                }}
                colors={c}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 1.5l2 2-7 7H1.5V8.5z" />
                </svg>
              </ActionButton>
              <ActionButton
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(node.id);
                }}
                colors={c}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h8M4.5 3V2h3v1M3 3v7a1 1 0 001 1h4a1 1 0 001-1V3" />
                </svg>
              </ActionButton>
            </div>
          )}
        </div>

        {/* Children */}
        {isExpanded && node.children.map((child) => renderNode(child, depth + 1))}

        {/* Inline create under this node */}
        {creatingUnder === node.id && isExpanded && (
          <div
            className="flex items-center gap-1 py-1.5 pr-2"
            style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
          >
            <span className="w-4" />
            <FolderIcon open={false} isNight={isNight} />
            <InlineInput
              value={newName}
              onChange={setNewName}
              onConfirm={() => handleCreate(node.id)}
              onCancel={() => {
                setCreatingUnder(null);
                setNewName("");
              }}
              colors={c}
              placeholder="Folder name…"
            />
          </div>
        )}
      </div>
    );
  };

  /* ── Main render ── */
  if (loading) {
    return (
      <div className="p-4">
        <p className="text-xs" style={{ color: c.textMuted }}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ borderColor: c.border }}
      >
        <span
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: c.textMuted }}
        >
          Categories
        </span>
        <button
          onClick={startCreateRoot}
          className="p-1 rounded transition-colors hover:opacity-80"
          title="New root category"
          style={{ color: c.accent }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 && !creatingUnder && (
          <div className="px-3 py-8 text-center">
            <p className="text-xs mb-2" style={{ color: c.textMuted }}>
              No categories yet
            </p>
            <button
              onClick={startCreateRoot}
              className="text-xs font-medium px-3 py-1.5 rounded transition-colors"
              style={{ color: "#fff", backgroundColor: c.accent }}
            >
              Create first category
            </button>
          </div>
        )}

        {tree.map((node) => renderNode(node, 0))}

        {/* Inline create for root */}
        {creatingUnder === "__root__" && (
          <div className="flex items-center gap-1 py-1.5 pr-2" style={{ paddingLeft: "8px" }}>
            <span className="w-4" />
            <FolderIcon open={false} isNight={isNight} />
            <InlineInput
              value={newName}
              onChange={setNewName}
              onConfirm={() => handleCreate(null)}
              onCancel={() => {
                setCreatingUnder(null);
                setNewName("");
              }}
              colors={c}
              placeholder="Category name…"
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default FolderTree;

/* ── Sub-components ── */

function FolderIcon({ open, isNight }: { open: boolean; isNight: boolean }) {
  const color = open
    ? "#0A9E8C"
    : isNight
      ? "#60D4C8"
      : "#9CA3AF";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      {open ? (
        <>
          <path
            d="M1.5 3.5A1 1 0 012.5 2.5h3l1.5 1.5h4.5a1 1 0 011 1v0H2.5a1 1 0 00-1 1v0z"
            fill={color}
            opacity="0.3"
          />
          <path
            d="M1.5 6a1 1 0 011-1h9a1 1 0 011 1l-.75 5a1 1 0 01-1 1H3.25a1 1 0 01-1-1z"
            fill={color}
            opacity="0.6"
          />
        </>
      ) : (
        <path
          d="M1.5 3.5A1 1 0 012.5 2.5h3l1.5 1.5h4.5a1 1 0 011 1v5.5a1 1 0 01-1 1h-9a1 1 0 01-1-1z"
          fill={color}
          opacity="0.5"
        />
      )}
    </svg>
  );
}

function InlineInput({
  value,
  onChange,
  onConfirm,
  onCancel,
  colors,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  colors: { inputBg: string; text: string; border: string; accent: string };
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirm();
        if (e.key === "Escape") onCancel();
      }}
      onBlur={onConfirm}
      placeholder={placeholder}
      className="flex-1 min-w-0 text-sm px-1.5 py-0.5 rounded border outline-none"
      style={{
        backgroundColor: colors.inputBg,
        color: colors.text,
        borderColor: colors.accent,
      }}
    />
  );
}

function ActionButton({
  title,
  onClick,
  children,
  colors,
}: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  colors: { textMuted: string; hover: string };
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="p-1 rounded transition-colors"
      style={{ color: colors.textMuted }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}
