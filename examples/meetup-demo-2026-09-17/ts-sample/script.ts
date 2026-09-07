// Tiny HTTP helper. Demo script for FixProve -- contains ONE planted
// hallucination: axios.getJson() does not exist (axios ships its own
// TypeScript types, so this should be a clean, direct catch).
import axios from "axios";

async function fetchUser(id: number) {
  // PLANTED HALLUCINATION: axios has no top-level getJson(). Real
  // pattern is axios.get(url).then(res => res.data).
  const data = await axios.getJson(`https://api.example.com/users/${id}`);
  return data;
}

fetchUser(1).then((u) => console.log(u));
