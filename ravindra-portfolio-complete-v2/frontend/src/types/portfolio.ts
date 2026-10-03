/**
 * Domain models for the portfolio.
 * These mirror the payloads the Spring Boot API will return later.
 */

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  handle: string;
  icon: "github" | "linkedin" | "leetcode" | "mail";
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  roles: string[];
  tagline: string;
  location: string;
  email: string;
  summary: string;
  techLine: string[];
  photoUrl?: string;
  resumeUrl: string;
}

export interface Skill {
  name: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  program: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  summary: string;
  focusAreas: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  score: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  skills?: string[];
  imageUrl?: string;
  verificationUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  institution?: string;
  description?: string;
}

export interface ProjectSection {
  heading: string;
  items: string[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  architecture: "Microservices" | "Monolithic" | string;
  shortDescription: string;
  overview: string;
  technologies: string[];
  keyFeatures: string[];
  technicalImplementation: string[];
  challenges: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  featured: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PortfolioData {
  profile: Profile;
  socialLinks: SocialLink[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  projects: Project[];
}
