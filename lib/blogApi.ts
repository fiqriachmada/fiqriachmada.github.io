import { fetchFromAPI } from "./api";
import type { ApiItemResponse, ApiListResponse, BlogItem, ListParams } from "@/types/api";

export async function fetchBlogsData(params: ListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit || 30));
  if (params.query) query.set("query", params.query);

  const qs = query.toString();
  const endpoint = `/client/v1/blogs${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI<ApiListResponse<BlogItem>>(endpoint);
}

export async function fetchBlogById(id: string) {
  return await fetchFromAPI<ApiItemResponse<BlogItem>>(`/client/v1/blogs/${id}`);
}
