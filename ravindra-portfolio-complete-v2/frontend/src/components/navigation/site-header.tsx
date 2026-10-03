import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ActionButton } from "@/components/ui/action-button";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function SiteHeader({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const active = useActiveSection(isHome ? SECTION_IDS : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-b border-border-strong bg-background/70 shadow-[0_10px_40px_-24px_oklch(0_0_0/90%)] backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8 md:h-20">
        <Link
          to="/"
          className="font-display text-sm font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition-colors hover:text-primary"
        >
          {name}
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={href(item.id)}
              aria-current={isHome && active === item.id ? "true" : undefined}
              className={cn(
                "group relative rounded-full px-3 py-2 text-sm transition-colors duration-300",
                isHome && active === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isHome && active === item.id
                    ? "border-primary/25 bg-primary/8"
                    : "border-transparent bg-transparent group-hover:border-border group-hover:bg-surface/60",
                )}
              />
              <span className="relative">{item.label}</span>
              <span
                className={cn(
                  "absolute inset-x-4 -bottom-px h-px origin-left bg-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isHome && active === item.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </nav>

        <ActionButton asChild variant="gold" size="sm" className="ml-auto hidden lg:ml-4 lg:inline-flex">
          <a href={href("contact")}>Let&apos;s Connect</a>
        </ActionButton>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center border-b border-border/60 text-base transition-colors",
                    isHome && active === item.id ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ActionButton asChild variant="gold" size="md" className="mt-5 w-full">
            <a href={href("contact")} onClick={() => setOpen(false)}>
              Let&apos;s Connect
            </a>
          </ActionButton>
        </nav>
      </div>
    </header>
  );
}
