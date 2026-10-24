import { fetchFromAPI } from "./api";
import type { ApiItemResponse, ApiListResponse, ListParams, WorkItem } from "@/types/api";

export async function fetchWorkData(params: ListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit || 50));

  const qs = query.toString();
  const endpoint = `/client/v1/works${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI<ApiListResponse<WorkItem>>(endpoint);
}

export async function fetchWorkDataById(id: string) {
  return await fetchFromAPI<ApiItemResponse<WorkItem>>(`/client/v1/works/${id}`);
}

export async function fetchCurrentWork() {
  return await fetchFromAPI<ApiItemResponse<WorkItem>>(`/client/v1/works/current`);
}
