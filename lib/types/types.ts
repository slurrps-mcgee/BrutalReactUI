export interface ProjectImage {
  src: string;
  width?: number;
  height?: number;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface ProjectCardData {
  slug: string;
  title: string;
  subTitle: string;
  description: string;
  image: ProjectImage;
  chips: string[];
  demoURL?: string;
  githubURL?: string;
}

export interface Project extends ProjectCardData {
  overview: string;
  role: string;
  problem: string;
  constraints: string[];
  approach: string;
  tradeoffs: string;
  outcome: string;
  highlights: string[];
  deliveryNote: string;
}

export interface Experience {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface Skill {
  category: string;
  chips: string[];
}

export interface Hobby {
  symbol: string;
  label: string;
}

export interface TechnologyColumn {
  title: string;
  description: string;
}

export interface StatPill {
  value: string;
  label: string;
}

export interface SectionHeaderCopy {
  eyebrow?: string;
  title: string;
  description?: string;
}
