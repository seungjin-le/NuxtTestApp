import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.NUXT_ENV_API_KEY;
  const api_url = "https://app.asana.com/api/1.0";
  const opt_fields = "members.name";
  const opt_pretty = "true";
  console.log(event);
  return await axios
    .get(`${api_url}/projects?opt_fields=${opt_fields}`, {
      headers: { Authorization: `Bearer ${apiKey}`, accept: "application/json", "Content-Type": "application/json" },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
});
