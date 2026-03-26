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
    title: "PROPERTY",
    items: [
      { label: "Dashboard", icon: <GridIcon /> },
      { label: "Properties", icon: <BuildingIcon /> },
    ],
  },
  {
    title: "TOOLS",
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
      className="h-screen flex flex-col shrink-0 overflow-hidden border-r"
      style={{
        width: collapsed ? 56 : 220,
        backgroundColor: "#0D1B2A",
        borderColor: "#1B2D45",
        transition: "width 0.2s ease",
      }}
    >
      {/* Logo area */}
      <div className="px-4 pt-5 pb-4 shrink-0 border-b" style={{ borderColor: "#1B2D45" }}>
        {!collapsed ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: "#0A9E8C" }}
              >
                VM
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-[0.12em] text-white/90 uppercase leading-none">
                  Visiting Media
                </span>
              </div>
            </div>
            <span
              className="text-[9px] font-semibold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded self-start"
              style={{ backgroundColor: "#0A9E8C20", color: "#0A9E8C" }}
            >
              AI Studio
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: "#0A9E8C" }}
            >
              VM
            </div>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto pt-4 pb-2">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed && (
              <p
                className="px-4 mb-2 text-[10px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap"
                style={{ color: "#5E7A8A" }}
              >
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <button
                key={item.label}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-2.5 py-2 text-[13px] font-medium transition-colors whitespace-nowrap"
                style={{
                  paddingLeft: collapsed ? 16 : 16,
                  paddingRight: 12,
                  backgroundColor: item.active ? "#132F4C" : "transparent",
                  color: item.active ? "#FFFFFF" : "#8BA3B8",
                  borderLeft: item.active ? "3px solid #0A9E8C" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.backgroundColor = "#132F4C50";
                    e.currentTarget.style.color = "#CFDCE6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#8BA3B8";
                  }
                }}
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

      {/* Collapse toggle at bottom */}
      <div
        className="shrink-0 border-t px-3 py-3 flex"
        style={{ borderColor: "#1B2D45", justifyContent: collapsed ? "center" : "flex-end" }}
      >
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-200"
            style={{
              color: "#5E7A8A",
              transform: collapsed ? "rotate(180deg)" : undefined,
            }}
          >
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
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
