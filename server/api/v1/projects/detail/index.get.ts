import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = config.public.NUXT_ENV_API_KEY;
  const api_url = "https://app.asana.com/api/1.0";
  const opt_pretty = "true";
  const gid = getQuery(event).gid;

  try {
    const res = await axios.get(`${api_url}/projects/${gid}/sections?opt_pretty=${opt_pretty}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return { error: "Failed to fetch project detail" };
  }
});
