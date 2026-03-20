"use client";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "PLATFORM",
    items: [
      { label: "Dashboard", icon: <GridIcon /> },
      { label: "Properties", icon: <BuildingIcon /> },
    ],
  },
  {
    title: "PROPERTY",
    items: [
      { label: "AI Studio", icon: <SparklesIcon />, active: true },
      { label: "Gallery", icon: <ImageIcon /> },
      { label: "Settings", icon: <GearIcon /> },
    ],
  },
  {
    title: "ENABLEMENT",
    items: [
      { label: "Help Center", icon: <QuestionIcon /> },
      { label: "API Docs", icon: <CodeIcon /> },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="h-screen flex flex-col shrink-0 overflow-hidden"
      style={{
        width: collapsed ? 48 : 210,
        backgroundColor: "#1B3A3A",
        transition: "width 0.2s ease",
      }}
    >
      {/* Header + collapse */}
      <div className="flex items-center justify-between px-3 h-[50px] shrink-0">
        {!collapsed && (
          <span className="text-white/90 text-sm font-semibold tracking-wide whitespace-nowrap">
            VM
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-white/60 transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
          >
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 12L2 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold tracking-[0.08em] text-white/40 uppercase whitespace-nowrap">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <button
                key={item.label}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:bg-white/5 transition-colors whitespace-nowrap"
                style={item.active ? { backgroundColor: "#0D2929" } : undefined}
              >
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* ── Inline SVG icons (16×16) ── */

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14V3a1 1 0 011-1h4a1 1 0 011 1v11" /><path d="M9 7h3a1 1 0 011 1v6" /><path d="M2 14h12" /><path d="M5.5 5h1M5.5 7.5h1M5.5 10h1" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5L8 2z" /><path d="M12 10l.75 1.75L14.5 12.5l-1.75.75L12 15l-.75-1.75-1.75-.75 1.75-.75z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="12" height="12" rx="2" /><circle cx="5.5" cy="5.5" r="1" /><path d="M14 10l-3-3-7 7" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.5" /><path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" /><path d="M6 6a2 2 0 013.5 1.5c0 1-1.5 1.25-1.5 2.5" /><circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12M9 2l-2 12" />
    </svg>
  );
}
