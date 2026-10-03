import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/states";
import type { Experience } from "@/types/portfolio";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <Section id="experience" ariaLabel="Experience">
      <SectionHeading
        eyebrow="Experience"
        title="Professional experience"
        description="Industry-oriented engineering experience in Java full stack development."
      />

      <div className="mt-12">
        {items.length === 0 ? (
          <EmptyState title="No experience entries yet" />
        ) : (
          <ol className="relative border-l border-border pl-6 sm:pl-8">
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 80} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[31px] size-2.5 rounded-full bg-primary ring-4 ring-primary/15 sm:-left-[39px]"
                />
                <div className="surface-panel rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 sm:p-7">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{item.program}</h3>
                      <p className="mt-1 text-sm text-accent">{item.role}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.organization} · {item.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                      {item.startDate} – {item.endDate}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  <p className="mt-6 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                    Key areas
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {item.focusAreas.map((area) => (
                      <li key={area}>
                        <span className="inline-flex rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground/85">
                          {area}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </Section>
  );
}
