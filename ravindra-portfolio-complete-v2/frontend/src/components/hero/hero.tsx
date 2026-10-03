import { ArrowRight, Download, MapPin } from "lucide-react";

import { ActionButton } from "@/components/ui/action-button";
import { SocialIconLink } from "@/components/ui/social-icon-link";
import type { Profile, SocialLink } from "@/types/portfolio";

/** Floating technical labels — purely decorative, CSS transforms only. */
const TECH_LABELS = [
  { text: "JAVA", className: "-top-3 left-2 sm:-left-8", delay: "760ms", drift: "0s" },
  { text: "SPRING BOOT", className: "top-24 -right-3 sm:-right-10", delay: "840ms", drift: "-2s" },
  { text: "REST APIs", className: "bottom-28 -left-3 sm:-left-12", delay: "920ms", drift: "-4s" },
  { text: "MYSQL", className: "-bottom-3 right-6 sm:right-0", delay: "1000ms", drift: "-6s" },
  { text: "JWT", className: "top-1/2 -left-2 sm:-left-14", delay: "1080ms", drift: "-3s" },
];

function PortraitFrame({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px]">
      {/* soft gold glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-[3rem] bg-primary/10 blur-[90px]"
      />
      {/* cyan technical accent */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -bottom-12 h-40 w-40 rounded-full bg-accent/10 blur-[70px]"
      />
      {/* elegant corner details */}
      <div
        aria-hidden="true"
        className="absolute -top-4 -right-4 h-20 w-20 rounded-tr-[1.5rem] border-t border-r border-primary/45"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-4 -left-4 h-20 w-20 rounded-bl-[1.5rem] border-b border-l border-accent/45"
      />

      <div className="hero-zoom surface-panel relative overflow-hidden rounded-[1.75rem] p-2 shadow-[var(--shadow-elevated)] [animation-delay:520ms]">
        <div className="relative aspect-4/5 overflow-hidden rounded-[1.35rem] bg-surface">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={`${profile.name}, ${profile.title}`}
              width={760}
              height={950}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="(max-width: 640px) 320px, 380px"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="grid-backdrop flex h-full w-full flex-col items-center justify-center gap-4">
              <span className="grid size-28 place-items-center rounded-2xl border border-primary/25 bg-primary/8 font-display text-4xl font-semibold text-primary">
                RC
              </span>
              <span className="max-w-[80%] text-center font-mono text-[10px] leading-relaxed tracking-[0.22em] text-muted-foreground uppercase">
                {profile.shortName}
              </span>
            </div>
          )}

          {/* integration layers: vignette + scanline tint */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background via-background/12 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,transparent_35%,oklch(0_0_0/35%)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[1.35rem] ring-1 ring-primary/12 ring-inset"
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-3 py-3">
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
            Backend Engineering
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
            Pune, IN
          </span>
        </div>
      </div>

      <ul aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        {TECH_LABELS.map((label) => (
          <li
            key={label.text}
            className={`chip-in absolute ${label.className}`}
            style={{ animationDelay: label.delay }}
          >
            <span
              className="drift inline-flex rounded-full border border-border-strong bg-background/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase backdrop-blur-md"
              style={{ animationDelay: label.drift }}
            >
              {label.text}
            </span>
          </li>
        ))}
      </ul>

      {/* mobile: labels reflow into a readable row */}
      <ul
        aria-hidden="true"
        className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden"
      >
        {TECH_LABELS.map((label) => (
          <li key={label.text}>
            <span className="inline-flex rounded-full border border-border bg-surface/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {label.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AvailabilityBadge() {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/6 px-3.5 py-1.5">
      <span className="relative flex size-2">
        <span
          aria-hidden="true"
          className="status-ping absolute inline-flex size-2 rounded-full bg-accent"
        />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
        Open to software engineering opportunities
      </span>
    </span>
  );
}

export function Hero({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:px-8 md:pt-40 md:pb-28"
    >
      <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-16">
        <div className="min-w-0">
          <div className="hero-rise flex flex-wrap items-center gap-2.5 [animation-delay:60ms]">
            <AvailabilityBadge />
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              {profile.location}
            </span>
          </div>

          <h1 className="hero-rise mt-6 font-display text-[2.6rem] leading-[1.02] font-semibold tracking-tight text-balance [animation-delay:140ms] sm:text-6xl lg:text-7xl">
            <span className="text-gradient-gold">Ravindra</span>
            <br />
            Chimkar
          </h1>

          <p className="hero-rise mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg text-foreground/90 [animation-delay:240ms] sm:text-xl">
            {profile.roles.map((role, i) => (
              <span key={role} className="inline-flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="h-4 w-px bg-border-strong" />
                ) : null}
                {role}
              </span>
            ))}
          </p>

          <p className="hero-rise mt-5 max-w-lg text-base leading-relaxed text-muted-foreground [animation-delay:320ms]">
            {profile.tagline}
          </p>

          <ul className="hero-rise mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase [animation-delay:400ms]">
            {profile.techLine.map((tech, i) => (
              <li key={tech} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="text-primary/60">•</span> : null}
                {tech}
              </li>
            ))}
          </ul>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:480ms]">
            <ActionButton asChild variant="gold" size="lg" className="group">
              <a href="#projects">
                Explore Projects
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </ActionButton>
            <ActionButton asChild variant="outline" size="lg" className="group">
              <a href={profile.resumeUrl} download>
                <Download className="transition-transform duration-300 group-hover:translate-y-0.5" />
                Download Resume
              </a>
            </ActionButton>
          </div>

          <ul className="hero-rise mt-8 flex flex-wrap gap-2.5 [animation-delay:560ms]">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <SocialIconLink link={link} showLabel />
              </li>
            ))}
          </ul>
        </div>

        <PortraitFrame profile={profile} />
      </div>
    </section>
  );
}
