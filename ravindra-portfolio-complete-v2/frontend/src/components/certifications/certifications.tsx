import { Award, ExternalLink } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/states";
import type { Certification } from "@/types/portfolio";

export function Certifications({ items }: { items: Certification[] }) {
  const [active, setActive] = useState<Certification | null>(null);

  return (
    <Section id="certifications" ariaLabel="Certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Certifications & programs"
        description="Verified programs and certificates completed across Java, cloud platforms and data foundations."
      />

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="No certifications published yet" />
        </div>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cert, index) => (
            <Reveal as="li" key={cert.id} delay={index * 60} className="min-w-0">
              <div className="group surface-panel flex h-full flex-col rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30">
                <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-primary">
                  <Award className="size-4.5" aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-base leading-snug font-semibold text-balance">
                  {cert.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.date ? (
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{cert.date}</p>
                ) : null}

                {cert.skills?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <li key={skill}>
                        <span className="inline-flex rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[11px] text-foreground/80">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                  {cert.imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setActive(cert)}
                      className="min-h-11 text-sm text-accent underline-offset-4 transition-colors hover:underline"
                    >
                      View certificate
                    </button>
                  ) : null}
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Verify
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      )}

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl border-border bg-popover">
          <DialogHeader>
            <DialogTitle>{active?.name}</DialogTitle>
            <DialogDescription>
              {active?.issuer}
              {active?.date ? ` · ${active.date}` : ""}
            </DialogDescription>
          </DialogHeader>
          {active?.imageUrl ? (
            <img
              src={active.imageUrl}
              alt={`${active.name} certificate issued by ${active.issuer}`}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg border border-border"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
