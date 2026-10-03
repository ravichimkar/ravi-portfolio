import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { SocialIconLink } from "@/components/ui/social-icon-link";
import { contactApi } from "@/api/contactApi";
import type { Profile, SocialLink } from "@/types/portfolio";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const fieldClass =
  "w-full rounded-xl border border-border bg-surface/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300 focus:border-accent/60";

export function Contact({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactForm) => {
    setStatus("idle");
    try {
      await contactApi.send(values);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id="contact" ariaLabel="Contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something reliable."
        description="Open to software engineering opportunities and backend collaborations."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal className="min-w-0">
          <div className="surface-panel h-full rounded-2xl p-6 sm:p-8">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-start gap-4 rounded-xl transition-colors"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-primary">
                <Mail className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                  Email
                </span>
                <span className="mt-1 block truncate text-sm transition-colors group-hover:text-accent">
                  {profile.email}
                </span>
              </span>
            </a>

            <div className="mt-6 flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent">
                <MapPin className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                  Location
                </span>
                <span className="mt-1 block text-sm">{profile.location}</span>
              </span>
            </div>

            <p className="mt-8 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
              Elsewhere
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <SocialIconLink link={link} showLabel />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80} className="min-w-0">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="surface-panel rounded-2xl p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm">
                  Name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={fieldClass}
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name ? (
                  <p id="name-error" role="alert" className="mt-2 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClass}
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email ? (
                  <p id="email-error" role="alert" className="mt-2 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="subject" className="mb-2 block text-sm">
                Subject
              </label>
              <input
                id="subject"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                className={fieldClass}
                placeholder="What is this about?"
                {...register("subject")}
              />
              {errors.subject ? (
                <p id="subject-error" role="alert" className="mt-2 text-xs text-destructive">
                  {errors.subject.message}
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mb-2 block text-sm">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`${fieldClass} resize-y`}
                placeholder="Tell me a bit about the role or project…"
                {...register("message")}
              />
              {errors.message ? (
                <p id="message-error" role="alert" className="mt-2 text-xs text-destructive">
                  {errors.message.message}
                </p>
              ) : null}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ActionButton type="submit" variant="gold" size="md" disabled={isSubmitting}>
                <Send />
                {isSubmitting ? "Sending…" : "Send Message"}
              </ActionButton>
              <p aria-live="polite" className="text-sm">
                {status === "success" ? (
                  <span className="text-accent">Thanks — your message has been captured.</span>
                ) : null}
                {status === "error" ? (
                  <span className="text-destructive">
                    Message could not be sent. Please email directly.
                  </span>
                ) : null}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
