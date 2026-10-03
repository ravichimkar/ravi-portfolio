export const toDateText = (value: unknown) =>
  value == null ? "" : String(value).slice(0, 10);

export function mapProfile(row: any) {
  return {
    id: String(row.id ?? ""),
    name: row.name ?? "Ravindra Sopan Chimkar",
    shortName: row.name?.split(" ").slice(0, 2).join(" ") ?? "Ravindra Chimkar",
    title: row.professional_title ?? "",
    roles: [row.professional_title ?? "Software Engineer"],
    tagline: row.hero_headline ?? "",
    location: row.location ?? "",
    email: row.email ?? "",
    summary: row.summary ?? "",
    techLine: ["JAVA", "SPRING BOOT", "REST APIs", "MYSQL"],
    resumeUrl: row.resume_url ?? "",
    photoUrl: row.profile_image_url ?? "",
    heroHeadline: row.hero_headline ?? "",
    heroDescription: row.hero_description ?? "",
    availabilityStatus: row.availability ?? "",
  };
}

export function mapSocial(row: any) {
  return {
    id: String(row.id),
    label: row.platform ?? "",
    url: row.url ?? "",
    handle: row.platform ?? "",
    icon: row.icon ?? "mail",
    active: row.active !== false,
    published: row.active !== false,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function groupSkills(rows: any[]) {
  const groups = new Map<string, any>();
  for (const row of rows ?? []) {
    const label = row.category || "Other";
    if (!groups.has(label)) {
      groups.set(label, {
        id: `category-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label,
        description: "",
        skills: [],
        published: true,
        displayOrder: Number(row.display_order ?? 0),
      });
    }
    groups.get(label).skills.push({ name: row.name ?? "" });
  }
  return [...groups.values()];
}

export function mapExperience(row: any) {
  return {
    id: String(row.id),
    program: row.role ?? "",
    role: row.role ?? "",
    organization: row.company ?? "",
    location: row.location ?? "",
    startDate: toDateText(row.start_date),
    endDate: toDateText(row.end_date),
    type: "Training / Program",
    summary: row.description ?? "",
    focusAreas: [],
    published: row.published !== false,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapEducation(row: any) {
  return {
    id: String(row.id),
    institution: row.institution ?? "",
    degree: row.degree ?? "",
    field: row.field_of_study ?? "",
    startYear: String(row.start_year ?? ""),
    endYear: String(row.end_year ?? ""),
    score: row.cgpa == null ? "" : String(row.cgpa),
    description: row.description ?? "",
    published: row.published !== false,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapCertification(row: any) {
  return {
    id: String(row.id),
    name: row.name ?? "",
    issuer: row.issuer ?? "",
    date: toDateText(row.completion_date),
    skills: [],
    imageUrl: row.image_url ?? "",
    verificationUrl: row.credential_url ?? "",
    description: row.description ?? "",
    published: row.published !== false,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapAchievement(row: any) {
  return {
    id: String(row.id),
    title: row.title ?? "",
    organization: "",
    institution: "",
    description: row.description ?? "",
    date: toDateText(row.achievement_date),
    url: row.url ?? "",
    imageUrl: row.image_url ?? "",
    published: row.published !== false,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapProject(row: any) {
  const tech = String(row.technical_implementation ?? "")
    .split(/\n|,/).map((x) => x.trim()).filter(Boolean);
  return {
    id: String(row.id),
    slug: row.slug ?? "",
    name: row.title ?? "",
    architecture: row.architecture ?? "",
    shortDescription: row.short_description ?? "",
    overview: row.description ?? "",
    technologies: tech,
    keyFeatures: [],
    technicalImplementation: tech,
    challenges: String(row.challenges ?? "").split(/\n/).map((x) => x.trim()).filter(Boolean),
    githubUrl: row.github_url ?? "",
    liveDemoUrl: row.live_demo_url ?? "",
    featured: Boolean(row.featured),
    thumbnailUrl: row.thumbnail_url ?? "",
    published: row.status === "PUBLISHED",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function projectPayload(v: any) {
  const tech = Array.isArray(v.technologies) ? v.technologies.filter(Boolean).join("\n") : "";
  const features = Array.isArray(v.keyFeatures) ? v.keyFeatures.filter(Boolean).join("\n") : "";
  const overview = String(v.overview ?? "");
  const description = [overview, features ? `Key features:\n${features}` : "", tech ? `Technologies:\n${tech}` : ""]
    .filter(Boolean).join("\n\n");
  return {
    title: v.name,
    slug: v.slug,
    short_description: v.shortDescription,
    description,
    architecture: v.architecture,
    technical_implementation: Array.isArray(v.technicalImplementation) ? v.technicalImplementation.join("\n") : (v.technicalImplementation ?? tech),
    challenges: Array.isArray(v.challenges) ? v.challenges.join("\n") : (v.challenges ?? ""),
    github_url: v.githubUrl,
    live_demo_url: v.liveDemoUrl,
    thumbnail_url: v.thumbnailUrl,
    featured: Boolean(v.featured),
    status: v.published === false ? "DRAFT" : "PUBLISHED",
    display_order: Number(v.displayOrder ?? 0),
  };
}

export const mapResource = (type: string, row: any) => {
  switch (type) {
    case "projects": return mapProject(row);
    case "experience": return mapExperience(row);
    case "education": return mapEducation(row);
    case "certifications": return mapCertification(row);
    case "achievements": return mapAchievement(row);
    case "social-links": return mapSocial(row);
    default: return row;
  }
};
