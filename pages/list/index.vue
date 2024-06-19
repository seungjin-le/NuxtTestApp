<script setup>
import axios from "axios";
import TaskListItem from "~/components/items/TaskListItem.vue";

definePageMeta({
  title: "Nuxt.js Layouts",
  layout: "list-layout",
});
const config = useRuntimeConfig();
const queryClient = useQueryClient();
const api_url = "https://app.asana.com/api/1.0";
const token = config.public.NUXT_ENV_API_KEY;
const members = useState("members", () => []);
const { isLoading, isError, data, error } = useQuery({
  queryKey: ["projects"],
  queryFn: () =>
    $fetch(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json", "Content-Type": "application/json" },
    }),
});

const getMembers = async ({ gid }) => {
  if (!gid) return;
  const opt_fields = "members.name";
  const opt_pretty = "true";

  return await axios
    .get(`${api_url}/projects/${gid}?opt_fields=${opt_fields}&opt_pretty=${opt_pretty}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      members.value = data.data;
    })
    .catch((error) => {
      members.value = [];
    });
};
const memberss = useMutation(getMembers);

const asana = useState("asana", () => []);

const getData = async ({ gid }) => {
  const opt_fields = "name,due_on,start_on,completed,assignee.name";
  const opt_pretty = "true";

  await axios
    .get(`${api_url}/projects/${gid}/tasks?opt_pretty=${opt_pretty}&opt_fields=${opt_fields}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      asana.value = data.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
</script>

<template>
  <div class="w-full h-auto bg-[gray]">
    <div class="flex flex-col max-w-[1280px] gap-[100px] mx-auto">
      <div class="grid grid-cols-4 gap-[20px] max-w-[1280px] mx-auto">
        <div
          v-for="item in data?.data"
          @click="getMembers(item)"
          :key="item.gid"
          class="w-[200px] h-[200px] flex flex-col rounded-[8px] border-white border-[1px]"
        >
          <div class="flex-1 bg-[#3d3d3d]"></div>
          <div class="text-center py-[10px]">{{ item.name }}</div>
        </div>
      </div>

      <div class="max-w-[1280px] w-full grid grid-flow-col gap-[40px]">
        <div
          class="w-[200px] h-[200px] flex flex-col rounded-[8px] border-white border-[1px] bg-[#3d3d3d]"
          v-for="item in members?.members"
          :key="item.gid"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="w-full h-auto min-h-[400px] flex flex-col gap-[40px] max-w-[1280px] mx-auto">
        <TaskListItem v-for="item in asana" :key="item.gid" :task="item" />
      </div>
    </div>
  </div>
</template>
