import { fetchFromAPI } from "./api";

export async function fetchWorkData(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit || 50);

  const qs = query.toString();
  const endpoint = `/client/v1/works${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI(endpoint);
}

export async function fetchWorkDataById(id) {
  return await fetchFromAPI(`/client/v1/works/${id}`);
}

export async function fetchCurrentWork() {
  return await fetchFromAPI(`/client/v1/works/current`);
}
