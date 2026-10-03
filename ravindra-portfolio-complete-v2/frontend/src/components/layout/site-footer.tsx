import { SocialIconLink } from "@/components/ui/social-icon-link";
import type { Profile, SocialLink } from "@/types/portfolio";

export function SiteFooter({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const links: SocialLink[] = [
    ...socialLinks,
    {
      id: "email",
      label: "Email",
      url: `mailto:${profile.email}`,
      handle: profile.email,
      icon: "mail",
    },
  ];

  return (
    <footer className="hairline mt-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-[0.16em] uppercase">
            {profile.shortName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.title}</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground/80 uppercase">
            Java <span className="text-primary/70">•</span> Spring Boot{" "}
            <span className="text-accent/70">•</span> MySQL
          </p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <SocialIconLink link={link} showLabel />
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {profile.shortName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
