export async function fetchFromAPI(endpoint) {
  const res = await fetch(`${process.env.API_URL}${endpoint}`,{cache: 'no-store', next: { revalidate: 3 } }
);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}

