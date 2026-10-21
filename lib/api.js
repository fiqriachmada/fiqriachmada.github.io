export async function fetchFromAPI(endpoint) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

  const url = `${apiUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${url}:`, res.status, res.statusText);
      throw new Error(`Failed to fetch (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error occurred while fetching:", error);
    throw error;
  }
}
