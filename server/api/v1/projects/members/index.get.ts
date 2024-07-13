import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = config.public.NUXT_ENV_API_KEY;
  const api_url = "https://app.asana.com/api/1.0";
  const opt_fields = "members.name";
  const opt_pretty = "true";

  const gid = getQuery(event).gid;

  try {
    const response = await axios.get(`${api_url}/projects/${gid}?opt_fields=${opt_fields}&opt_pretty=${opt_pretty}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return { error: "Failed to fetch project members" }; // 에러 메시지 반환
  }
});
