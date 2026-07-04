import axios from "axios";

async function fetchUser(id: string) {
  const response = await axios.get(`/users/${id}`);
  await axios.post("/users", { id });
  await axios.delete(`/users/${id}`);
  return response.data;
}
