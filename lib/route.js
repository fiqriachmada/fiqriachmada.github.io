import { fetchWorkData, fetchWorkDataById } from '@/lib/workApi'

export async function GET (request) {
  // URL parsing untuk mendapatkan parameter (jika ada)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    let data = []
    if (id) {
      // Jika ada ID, ambil data berdasarkan ID
      data = await fetchWorkDataById(id)
    } else {
      // Jika tidak ada ID, ambil semua data
      data = await fetchWorkData()
    }

    console.log('data', data)

    return new Response(JSON.stringify({ data }))
  } catch (error) {
    console.log('error', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
