/** Generic envelope returned by the CMS client API (`/client/v1/*`). */
export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

/** Query params accepted by the list endpoints. */
export interface ListParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface WorkItem {
  id: string;
  name: string;
  position?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  startDate: string;
  endDate?: string | null;
}

export interface ProjectImage {
  id: string;
  imageUrl: string;
  isBanner?: boolean;
}

export interface ProjectApiItem {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  bannerUrl?: string | null;
  projectImages?: ProjectImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  author?: { firstName?: string | null; lastName?: string | null } | null;
  publishedAt?: string | null;
}
