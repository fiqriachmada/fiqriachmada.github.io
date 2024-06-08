import { fetchFromAPI } from './api'

export async function fetchWorkData () {
  return await fetchFromAPI('/work')
}

export async function fetchWorkDataById (id) {
  return await fetchFromAPI('/work/' + id)
}
