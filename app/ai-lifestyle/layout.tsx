import Link from "next/link";

export default function AILifestyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#060F0E" }}
    >
      {/* Header */}
      <header
        className="h-[50px] flex items-center px-4 gap-3 shrink-0 border-b"
        style={{ backgroundColor: "#0A1A19", borderColor: "#1B3A3A" }}
      >
        <Link
          href="/hub"
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "#60D4C8" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Hub
        </Link>

        <h1
          className="text-[18px] font-semibold whitespace-nowrap"
          style={{ color: "#E2F5F2" }}
        >
          AI Lifestyle
        </h1>

        <span
          className="text-xs font-medium px-3 py-1 rounded whitespace-nowrap"
          style={{ backgroundColor: "#0D2929", color: "#60D4C8" }}
        >
          Rosewood Mayakoba
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
