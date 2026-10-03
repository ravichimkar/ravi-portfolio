import { Database, KeyRound, Layers, Rocket, Workflow } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Profile } from "@/types/portfolio";

const PILLARS = [
  {
    icon: Layers,
    label: "Backend",
    detail: "Java · Spring Boot services",
    note: "Layered services with clear boundaries.",
  },
  {
    icon: Workflow,
    label: "APIs",
    detail: "REST design & integration",
    note: "Predictable contracts and error handling.",
  },
  {
    icon: Database,
    label: "Database",
    detail: "MySQL modeling & tuning",
    note: "Considered schemas and query optimization.",
  },
  {
    icon: KeyRound,
    label: "Security",
    detail: "JWT authentication · RBAC",
    note: "Authenticated endpoints, role-scoped access.",
  },
  {
    icon: Rocket,
    label: "Deployment",
    detail: "Docker · Git · Maven",
    note: "Reproducible builds and environments.",
  },
];

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" ariaLabel="About">
      <SectionHeading
        eyebrow="About"
        title="Engineering backends that stay reliable as they grow."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Reveal className="min-w-0">
          <p className="text-lg leading-relaxed text-foreground/90">{profile.summary}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {[
              { term: "Focus", value: "Backend & full-stack development" },
              { term: "Core stack", value: "Java · Spring Boot · MySQL" },
              { term: "Approach", value: "Problem-solving grounded in DSA & OOP" },
              { term: "Based in", value: profile.location },
            ].map((row) => (
              <div key={row.term} className="border-l border-border pl-4">
                <dt className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                  {row.term}
                </dt>
                <dd className="mt-1.5 text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="grid min-w-0 gap-3">
          {PILLARS.map((pillar, index) => (
            <Reveal as="li" key={pillar.label} delay={index * 70}>
              <div className="group surface-panel relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_16px_40px_-30px_oklch(0.7971_0.1339_211.53/70%)]">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent/60 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                />
                <div className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/40">
                    <pillar.icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{pillar.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{pillar.detail}</p>
                  </div>
                </div>
                <p className="max-h-0 overflow-hidden text-xs leading-relaxed text-accent/80 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mt-3 group-hover:max-h-12 group-hover:opacity-100">
                  {pillar.note}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
