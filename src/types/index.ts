export type UserRole = "admin" | "editor" | "super-admin";

export type ContentStatus = "draft" | "published" | "archived";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
  category?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SEOFields {
  seoTitle?: string;
  seoDescription?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
