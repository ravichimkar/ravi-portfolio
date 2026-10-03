import { GraduationCap, Users } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Achievement, Education } from "@/types/portfolio";

export function EducationAndLeadership({
  education,
  achievements,
}: {
  education: Education[];
  achievements: Achievement[];
}) {
  return (
    <Section id="education" ariaLabel="Education and leadership">
      <SectionHeading eyebrow="Education" title="Education & leadership" />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          {education.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <article className="surface-panel h-full rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-primary">
                    <GraduationCap className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug font-semibold">{item.institution}</h3>
                    <p className="mt-1.5 text-sm text-accent">{item.degree}</p>
                    <p className="text-sm text-muted-foreground">{item.field}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                        {item.startYear} – {item.endYear}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                        {item.score}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-4">
          {achievements.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <article className="surface-panel h-full rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/35 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent">
                    <Users className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                      Leadership
                    </p>
                    <h3 className="mt-2 text-lg leading-snug font-semibold">{item.title}</h3>
                    {item.institution ? (
                      <p className="mt-1.5 text-sm text-muted-foreground">{item.institution}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
