// export const API_URL =
//   "https://surrounding-jonis-fiqriachmada-9f4b3d45.koyeb.app/api";

import { fetchFromAPI } from "./api";

// import { fetchFromAPI } from "./api";

export async function fetchWorkDataById(id) {
  return await fetchFromAPI("/work/" + id);
}
