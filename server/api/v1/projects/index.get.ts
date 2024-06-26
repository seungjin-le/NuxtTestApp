import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = config.public.NUXT_ENV_API_KEY;
  const api_url = "https://app.asana.com/api/1.0";
  return await axios
    .get(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json", "Content-Type": "application/json" },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
});
