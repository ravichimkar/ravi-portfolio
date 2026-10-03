/** Lightweight decorative background optimized for smooth scrolling. */
export function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-background" />

      {/* Lightweight technical grid */}
      <div className="grid-backdrop absolute inset-0" />

      {/* Subtle gold ambient glow — radial gradient, no blur filter */}
      <div
        className="
          absolute
          -top-56
          left-1/2
          h-[520px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          bg-[radial-gradient(ellipse_at_center,oklch(0.8454_0.1313_87.95/7%),transparent_68%)]
        "
      />

      {/* Subtle cyan ambient glow */}
      <div
        className="
          absolute
          top-[28%]
          -right-48
          h-[480px]
          w-[480px]
          rounded-full
          bg-[radial-gradient(circle_at_center,oklch(0.7971_0.1339_211.53/5%),transparent_70%)]
        "
      />

      {/* Lower cyan ambient glow */}
      <div
        className="
          absolute
          bottom-[18%]
          -left-48
          h-[460px]
          w-[460px]
          rounded-full
          bg-[radial-gradient(circle_at_center,oklch(0.7971_0.1339_211.53/4%),transparent_70%)]
        "
      />

      {/* Lower gold ambient glow */}
      <div
        className="
          absolute
          right-[20%]
          bottom-[-120px]
          h-[420px]
          w-[680px]
          rounded-full
          bg-[radial-gradient(ellipse_at_center,oklch(0.8454_0.1313_87.95/5%),transparent_70%)]
        "
      />

      {/* Vertical depth */}
      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,transparent_0%,oklch(0_0_0/25%)_55%,transparent_100%)]
        "
      />

      {/* Lightweight static texture */}
      <div className="noise-overlay absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}