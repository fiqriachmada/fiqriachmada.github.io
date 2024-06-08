export async function fetchFromAPI (endpoint) {
  const res = await fetch(`${process.env.API_URL}${endpoint}`, {
    cache: 'no-store'
    //   next: { revalidate: 30 },
  })
  if (!res.ok) {
    console.log('Falied to fecth')
    throw new Error('Failed to fetch')
  }
  return res.json()
}
