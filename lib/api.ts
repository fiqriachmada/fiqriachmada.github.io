export async function fetchFromAPI<T = unknown>(endpoint: string): Promise<T> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

  let finalEndpoint = endpoint;
  if (typeof window !== "undefined" && window.location.search) {
    const pageParams = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const val = pageParams.get(key);
      if (val) utmParams.set(key, val);
    }
    const utmStr = utmParams.toString();
    if (utmStr) {
      finalEndpoint += (finalEndpoint.includes("?") ? "&" : "?") + utmStr;
    }
  }

  const url = `${apiUrl}${finalEndpoint}`;
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

    return (await res.json()) as T;
  } catch (error) {
    console.error("Error occurred while fetching:", error);
    throw error;
  }
}
