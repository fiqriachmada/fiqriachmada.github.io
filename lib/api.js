export async function fetchFromAPI(endpoint) {
  const res = await fetch(`${process.env.API_URL}${endpoint}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}
