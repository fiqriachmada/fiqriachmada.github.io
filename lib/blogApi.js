import { fetchFromAPI } from "./api";

export async function fetchBlogsData(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit || 30);
  if (params.query) query.set("query", params.query);

  const qs = query.toString();
  const endpoint = `/client/v1/blogs${qs ? `?${qs}` : ""}`;
  return await fetchFromAPI(endpoint);
}

export async function fetchBlogById(id) {
  return await fetchFromAPI(`/client/v1/blogs/${id}`);
}
