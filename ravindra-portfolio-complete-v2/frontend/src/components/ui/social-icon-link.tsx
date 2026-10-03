import { Github, Linkedin, Mail, type LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types/portfolio";

function LeetCodeIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M14.5 3.5 8 10.2a2.6 2.6 0 0 0 0 3.6l3.6 3.7a2.6 2.6 0 0 0 3.7 0l1.9-1.9" />
      <path d="M10 12h9.5" />
      <path d="m14.5 3.5 2.6-2.5" />
    </svg>
  );
}

const icons = {
  github: Github,
  linkedin: Linkedin,
  leetcode: LeetCodeIcon,
  mail: Mail,
} as const;

export function SocialIconLink({
  link,
  className,
  showLabel = false,
}: {
  link: SocialLink;
  className?: string;
  showLabel?: boolean;
}) {
  const Icon = icons[link.icon];

  return (
    <a
      href={link.url}
      target={link.url.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer noopener"
      aria-label={`${link.label}${link.handle ? ` — ${link.handle}` : ""}`}
      className={cn(
        "group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full border border-border bg-surface/40 px-4 text-sm text-muted-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground hover:shadow-[0_10px_30px_-18px_oklch(0.7971_0.1339_211.53/60%)]",
        !showLabel && "w-11 justify-center px-0",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,oklch(0.8454_0.1313_87.95/10%),oklch(0.7971_0.1339_211.53/10%))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <Icon className="relative size-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent" />
      {showLabel ? <span className="relative">{link.label}</span> : null}
    </a>
  );
}

export { LeetCodeIcon };
