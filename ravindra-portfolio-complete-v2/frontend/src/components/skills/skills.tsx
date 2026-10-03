import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { SkillCategory } from "@/types/portfolio";

export function Skills({ categories }: { categories: SkillCategory[] }) {
  return (
    <Section id="skills" ariaLabel="Technical skills">
      <SectionHeading
        eyebrow="Skills"
        title="Technical toolkit"
        description="The languages, frameworks and tools used to build and ship backend applications."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal as="article" key={category.id} delay={index * 70} className="min-w-0">
            <div className="surface-panel h-full rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold">{category.label}</h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill.name}>
                    <span className="inline-flex rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground/85 transition-colors duration-300 hover:border-accent/45 hover:text-accent">
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
