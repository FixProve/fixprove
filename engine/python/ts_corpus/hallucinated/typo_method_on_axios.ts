import axios from "axios";

async function broken() {
  return axios.getData("/x");
}
