// export async function fetchFromAPI (endpoint) {
//   const res = await fetch(`${process.env.API_URL}${endpoint}`, {
//     // cache: 'no-store'
//     next: { revalidate: 1 }
//   })
//   if (!res.ok) {
//     console.log('Falied to fecth')
//     throw new Error('Failed to fetch')
//   }
//   return res.json()
// }

export async function fetchFromAPI(endpoint) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      next: { revalidate: 1 },
    });

    if (!res.ok) {
      console.error("Failed to fetch:", res.statusText);
      throw new Error("Failed to fetch");
    }

    return await res.json();
  } catch (error) {
    console.error("Error occurred while fetching:", error);
    throw error; // Re-throw the error after logging it
  }
}
