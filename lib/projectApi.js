import { fetchFromAPI } from "./api";

export async function fetchProjectsData(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit || 50);
  if (params.query) query.set("query", params.query);

  const qs = query.toString();
  const endpoint = `/client/v1/projects${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI(endpoint);
}

export async function fetchProjectById(id) {
  return await fetchFromAPI(`/client/v1/projects/${id}`);
}
