import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/about/about";
import { Certifications } from "@/components/certifications/certifications";
import { Contact } from "@/components/contact/contact";
import { EducationAndLeadership } from "@/components/education/education-leadership";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { Hero } from "@/components/hero/hero";
import { SiteBackground } from "@/components/layout/site-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { Projects } from "@/components/projects/projects";
import { PublicSection } from "@/components/public/public-section";
import { Skills } from "@/components/skills/skills";
import { ActionButton } from "@/components/ui/action-button";
import { SkeletonBlock, SkeletonLines } from "@/components/ui/skeletons";
import { publicQueries } from "@/lib/queries";

const TITLE = "Ravindra Chimkar | Software Engineer | Java Developer";
const DESCRIPTION =
  "Portfolio of Ravindra Chimkar, a Software Engineer and Java Developer focused on Java, Spring Boot, REST APIs, Microservices and MySQL.";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Prime the above-the-fold content; every section still owns its own query.
    const [profile, socialLinks] = await Promise.allSettled([
      context.queryClient.ensureQueryData(publicQueries.profile()),
      context.queryClient.ensureQueryData(publicQueries.socialLinks()),
    ]);
    return {
      profile: profile.status === "fulfilled" ? profile.value : undefined,
      socialLinks: socialLinks.status === "fulfilled" ? socialLinks.value : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ravindra Sopan Chimkar",
          jobTitle: "Software Engineer",
          description: DESCRIPTION,
          email: "mailto:ravichimkar2004@gmail.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
          knowsAbout: ["Java", "Spring Boot", "Microservices", "REST APIs", "MySQL", "Docker"],
          sameAs: [
            "https://github.com/ravichimkar",
            "https://www.linkedin.com/in/ravindra-chimkar/",
            "https://leetcode.com/u/ravi_chimkar/",
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HeroSkeleton() {
  return (
    <section aria-label="Introduction" className="mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:px-8 md:pt-40">
      <SkeletonBlock className="h-6 w-56" />
      <SkeletonBlock className="mt-6 h-14 w-full max-w-xl" />
      <SkeletonLines className="mt-6 max-w-lg" count={3} />
    </section>
  );
}

function HomePage() {
  const initial = Route.useLoaderData();
  const profileQuery = useQuery({
    ...publicQueries.profile(),
    ...(initial.profile ? { initialData: initial.profile } : {}),
  });
  const socialQuery = useQuery({
    ...publicQueries.socialLinks(),
    ...(initial.socialLinks ? { initialData: initial.socialLinks } : {}),
  });
  const skillsQuery = useQuery(publicQueries.skills());
  const experienceQuery = useQuery(publicQueries.experience());
  const projectsQuery = useQuery(publicQueries.projects());
  const certificationsQuery = useQuery(publicQueries.certifications());
  const educationQuery = useQuery(publicQueries.education());
  const achievementsQuery = useQuery(publicQueries.achievements());

  const profile = profileQuery.data;
  const socialLinks = socialQuery.data ?? [];

  return (
    <>
      <SiteBackground />
      <SiteHeader name={profile?.shortName ?? "Ravindra Chimkar"} />

      <main id="main">
        {profileQuery.isPending ? (
          <HeroSkeleton />
        ) : profile ? (
          <Hero profile={profile} socialLinks={socialLinks} />
        ) : (
          <section
            aria-label="Introduction"
            className="mx-auto w-full max-w-6xl px-5 pt-40 pb-16 text-center sm:px-8"
          >
            <p className="text-sm text-muted-foreground">
              The profile could not be loaded right now.
            </p>
            <div className="mt-5 flex justify-center">
              <ActionButton variant="outline" size="sm" onClick={() => profileQuery.refetch()}>
                Retry
              </ActionButton>
            </div>
          </section>
        )}

        {profile ? <About profile={profile} /> : null}

        <PublicSection
          id="skills"
          ariaLabel="Technical skills"
          eyebrow="Skills"
          title="Technical toolkit"
          isPending={skillsQuery.isPending}
          isError={skillsQuery.isError}
          data={skillsQuery.data}
          onRetry={() => skillsQuery.refetch()}
        >
          {(categories) => <Skills categories={categories} />}
        </PublicSection>

        <PublicSection
          id="experience"
          ariaLabel="Experience"
          eyebrow="Experience"
          title="Professional experience"
          isPending={experienceQuery.isPending}
          isError={experienceQuery.isError}
          data={experienceQuery.data}
          onRetry={() => experienceQuery.refetch()}
        >
          {(items) => <ExperienceTimeline items={items} />}
        </PublicSection>

        <PublicSection
          id="projects"
          ariaLabel="Projects"
          eyebrow="Projects"
          title="Selected work"
          isPending={projectsQuery.isPending}
          isError={projectsQuery.isError}
          data={projectsQuery.data}
          onRetry={() => projectsQuery.refetch()}
        >
          {(projects) => <Projects projects={projects} />}
        </PublicSection>

        <PublicSection
          id="certifications"
          ariaLabel="Certifications"
          eyebrow="Certifications"
          title="Certifications & programs"
          isPending={certificationsQuery.isPending}
          isError={certificationsQuery.isError}
          data={certificationsQuery.data}
          onRetry={() => certificationsQuery.refetch()}
          hideWhenEmpty={(items) => items.length === 0}
        >
          {(items) => <Certifications items={items} />}
        </PublicSection>

        <PublicSection
          id="education"
          ariaLabel="Education and leadership"
          eyebrow="Education"
          title="Education & leadership"
          isPending={educationQuery.isPending}
          isError={educationQuery.isError}
          data={educationQuery.data}
          onRetry={() => educationQuery.refetch()}
        >
          {(education) => (
            <EducationAndLeadership
              education={education}
              achievements={achievementsQuery.data ?? []}
            />
          )}
        </PublicSection>

        {profile ? <Contact profile={profile} socialLinks={socialLinks} /> : null}
      </main>

      {profile ? <SiteFooter profile={profile} socialLinks={socialLinks} /> : null}
    </>
  );
}
