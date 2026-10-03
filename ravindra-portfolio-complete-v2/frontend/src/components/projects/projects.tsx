import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Github, Star } from "lucide-react";

import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group surface-panel relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 sm:p-8",
        featured ? "hover:border-primary/40" : "hover:border-accent/35",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          featured
            ? "bg-[radial-gradient(120%_80%_at_0%_0%,var(--color-primary)/8%,transparent_60%)]"
            : "bg-[radial-gradient(120%_80%_at_100%_0%,var(--color-accent)/8%,transparent_60%)]",
        )}
      />

      <div className="relative flex flex-wrap items-center gap-2">
        {featured ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] tracking-[0.18em] text-primary uppercase">
            <Star className="size-3" aria-hidden="true" />
            Featured
          </span>
        ) : null}
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {project.architecture}
        </span>
      </div>

      <h3
        className={cn(
          "relative mt-5 font-semibold text-balance",
          featured ? "text-2xl sm:text-3xl" : "text-xl",
        )}
      >
        {project.name}
      </h3>

      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
        {project.shortDescription}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <li key={tech}>
            <span className="inline-flex rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground/85">
              {tech}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative mt-8 flex flex-wrap items-center gap-3 pt-2">
        <ActionButton asChild variant={featured ? "gold" : "outline"} size="sm" className="group/btn">
          <Link to="/projects/$slug" params={{ slug: project.slug }}>
            View Details
            <ArrowUpRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </ActionButton>
        <ActionButton asChild variant="ghost" size="sm">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${project.name} source code on GitHub`}
          >
            <Github />
            GitHub
          </a>
        </ActionButton>
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" ariaLabel="Projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Backend systems built with Java, Spring Boot and MySQL — from microservices to layered monoliths."
      />

      {projects.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="No projects published yet" />
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {featured.map((project) => (
            <Reveal key={project.id}>
              <ProjectCard project={project} featured />
            </Reveal>
          ))}
          {rest.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((project, index) => (
                <Reveal key={project.id} delay={index * 80}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}
