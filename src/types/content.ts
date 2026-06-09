/** Serializable shapes for UI components (from lean() MongoDB queries) */

export interface ServiceCard {
  slug?: string;
  title?: string;
  shortDescription?: string;
  featuredImage?: string;
}

export interface CaseStudyCard {
  slug?: string;
  title?: string;
  summary?: string;
  featuredImage?: string;
}

export interface TestimonialCard {
  _id?: unknown;
  name?: string;
  role?: string;
  content?: string;
  rating?: number;
  image?: string;
}

export interface CategoryItem {
  _id?: string;
  name?: string;
  slug?: string;
}

export interface BlogCard {
  _id?: unknown;
  slug?: string;
  title?: string;
  excerpt?: string;
  featuredImage?: string;
  publishDate?: Date | string;
  category?: { name?: string; slug?: string } | unknown;
}
