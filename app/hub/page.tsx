import Link from "next/link";

const PRODUCTS = [
  {
    title: "Night Mode",
    description: "Transform day photos into stunning night scenes",
    href: "/studio",
    enabled: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 18A12 12 0 0114 4a12 12 0 1010 14z" />
      </svg>
    ),
  },
  {
    title: "AI Lifestyle",
    description: "Replace people with lifestyle archetypes",
    href: "/ai-lifestyle",
    enabled: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="11" r="5" />
        <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" />
      </svg>
    ),
  },
  {
    title: "People Bank",
    description: "Swap faces with real talent",
    href: "#",
    enabled: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="4" />
        <circle cx="22" cy="10" r="4" />
        <path d="M4 28c0-4.4 3.6-8 8-8 1.5 0 2.9.4 4 1.1A7.96 7.96 0 0120 20c4.4 0 8 3.6 8 8" />
      </svg>
    ),
  },
];

export default function HubPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#060F0E" }}
    >
      {/* Header */}
      <header
        className="h-[60px] flex items-center px-6 border-b shrink-0"
        style={{ borderColor: "#1B3A3A" }}
      >
        <span
          className="text-base font-semibold tracking-wide"
          style={{ color: "#E2F5F2" }}
        >
          VM AI Studio
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1
          className="text-2xl font-semibold mb-8"
          style={{ color: "#E2F5F2" }}
        >
          Choose your AI tool
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-3xl">
          {PRODUCTS.map((product) => (
            <div
              key={product.title}
              className="relative rounded-xl border p-6 flex flex-col gap-4 transition-colors"
              style={{
                backgroundColor: "#0D2929",
                borderColor: "#1B3A3A",
              }}
            >
              {/* Coming soon badge */}
              {!product.enabled && (
                <span
                  className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#1B3A3A", color: "#60D4C8" }}
                >
                  Coming soon
                </span>
              )}

              {/* Icon */}
              <div style={{ color: product.enabled ? "#0A9E8C" : "#60D4C8" }}>
                {product.icon}
              </div>

              {/* Text */}
              <div>
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: "#E2F5F2" }}
                >
                  {product.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#60D4C8" }}
                >
                  {product.description}
                </p>
              </div>

              {/* Button */}
              {product.enabled ? (
                <Link
                  href={product.href}
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#0A9E8C" }}
                >
                  Open
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium opacity-40 cursor-not-allowed"
                  style={{ backgroundColor: "#1B3A3A", color: "#60D4C8" }}
                >
                  Open
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center text-xs border-t"
        style={{ color: "#60D4C8", borderColor: "#1B3A3A", opacity: 0.6 }}
      >
        VM AI Studio · Visiting Media
      </footer>
    </div>
  );
}
