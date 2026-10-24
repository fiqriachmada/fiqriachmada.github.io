import { fetchFromAPI } from "./api";
import type { ApiItemResponse, ApiListResponse, ListParams, ProjectApiItem } from "@/types/api";

export async function fetchProjectsData(params: ListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit || 50));
  if (params.query) query.set("query", params.query);

  const qs = query.toString();
  const endpoint = `/client/v1/projects${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI<ApiListResponse<ProjectApiItem>>(endpoint);
}

export async function fetchProjectById(id: string) {
  return await fetchFromAPI<ApiItemResponse<ProjectApiItem>>(`/client/v1/projects/${id}`);
}
