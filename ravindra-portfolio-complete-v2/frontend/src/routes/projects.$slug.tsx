import { createFileRoute, notFound } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Github } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteBackground } from "@/components/layout/site-background";
import { SiteHeader } from "@/components/navigation/site-header";
import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { ErrorState } from "@/components/ui/states";
import { ApiError } from "@/api/client";
import { publicQueries } from "@/lib/queries";
import type { Profile, Project, SocialLink } from "@/types/portfolio";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({
    params,
    context,
  }): Promise<{ project: Project; profile: Profile; socialLinks: SocialLink[] }> => {
    const [project, profile, socialLinks] = await Promise.all([
      context.queryClient
        .ensureQueryData(publicQueries.project(params.slug))
        .catch((error: unknown) => {
          if (error instanceof ApiError && error.status === 404) throw notFound();
          throw error;
        }),
      context.queryClient.ensureQueryData(publicQueries.profile()),
      context.queryClient.ensureQueryData(publicQueries.socialLinks()),
    ]);
    if (!project) throw notFound();
    return { project, profile, socialLinks };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project unavailable | Ravindra Chimkar" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { project } = loaderData;
    const title = `${project.name} — ${project.architecture} | Ravindra Chimkar`;
    return {
      meta: [
        { title },
        { name: "description", content: project.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: project.shortDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projects/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
    };
  },
  component: ProjectDetailPage,
  notFoundComponent: ProjectNotFound,
  errorComponent: ProjectError,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteBackground />
      <SiteHeader name="Ravindra Chimkar" />
      <main id="main" className="min-h-dvh">
        {children}
      </main>
    </>
  );
}

function ProjectNotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 sm:px-8">
        <ErrorState
          title="Project not found"
          description="This project doesn't exist or has been moved."
        >
          <ActionButton asChild variant="outline" size="sm">
            <Link to="/">Back to portfolio</Link>
          </ActionButton>
        </ErrorState>
      </div>
    </Shell>
  );
}

function ProjectError() {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 sm:px-8">
        <ErrorState description="This project could not be loaded right now.">
          <ActionButton asChild variant="outline" size="sm">
            <Link to="/">Back to portfolio</Link>
          </ActionButton>
        </ErrorState>
      </div>
    </Shell>
  );
}

function DetailList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Reveal className="surface-panel rounded-2xl p-6 sm:p-8">
      <h2 className="text-lg font-semibold">{heading}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function ProjectDetailPage() {
  const { project, profile, socialLinks }: {
    project: Project;
    profile: Profile;
    socialLinks: SocialLink[];
  } = Route.useLoaderData();

  return (
    <>
      <SiteBackground />
      <SiteHeader name={profile.shortName} />

      <main id="main" className="min-h-dvh">
        <article className="mx-auto w-full max-w-4xl px-5 pt-28 pb-20 sm:px-8 md:pt-36">
          <Link
            to="/"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to portfolio
          </Link>

          <Reveal>
            <p className="mt-8 font-mono text-xs tracking-[0.28em] text-primary uppercase">
              {project.architecture} architecture
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-balance sm:text-5xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {project.overview}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ActionButton asChild variant="gold" size="md">
                <a href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                  <Github />
                  View on GitHub
                </a>
              </ActionButton>
              {project.liveDemoUrl ? (
                <ActionButton asChild variant="outline" size="md">
                  <a href={project.liveDemoUrl} target="_blank" rel="noreferrer noopener">
                    Live Demo
                  </a>
                </ActionButton>
              ) : (
                <span className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm text-muted-foreground">
                  Live demo not available
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="mt-12">
            <h2 className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
              Technology stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <span className="inline-flex rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground/85">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <DetailList heading="Key features" items={project.keyFeatures} />
            <DetailList heading="Technical implementation" items={project.technicalImplementation} />
            <DetailList heading="Challenges" items={project.challenges} />
          </div>
        </article>
      </main>

      <SiteFooter profile={profile} socialLinks={socialLinks} />
    </>
  );
}
