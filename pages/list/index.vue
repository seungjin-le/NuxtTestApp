<script setup>
import axios from "axios";
import { onBeforeMount } from "vue";
import TaskListItem from "~/components/items/TaskListItem.vue";

definePageMeta({
  title: "Nuxt.js Layouts",
  layout: "list-layout",
});
const asana = useState("asana", () => []);

const config = useRuntimeConfig();
const projects = useState("projects", () => []);
const handleOnClick = async () => {
  const type = types.value.replaceAll("[", "").replaceAll("]", "").trim();
  const arr = contents.value
    .split(/,|\n/)
    .filter((v) => v)
    .map((item) => `[${type}] : ${item}`.trim());
  total.value = `[ ${title.value} ] \n${arr.join("\n")}`;
  await getData();
};
const token = config.public.NUXT_ENV_API_KEY;

const api_url = "https://app.asana.com/api/1.0/projects";

const getProjects = async () => {
  // gid: '1207451637946400',
  // name: '[비유바움]주간보고',
  // resource_type: 'project'

  await axios
    .get(api_url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      projects.value = data.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const getData = async ({ gid }) => {
  const opt_fields = "name,due_on,start_on,completed,assignee.name";
  const opt_pretty = "true";

  // gid: '1207477415308894',
  // completed: true,
  // start_on: '2024-05-14'
  // due_on: '2024-05-24',
  // name: '개발 환경 구축',

  await axios
    .get(`${api_url}/${gid}/tasks?opt_pretty=${opt_pretty}&opt_fields=${opt_fields}`, {
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

onBeforeMount(async () => {
  await getProjects();
});
</script>

<template>
  <div class="w-full h-auto bg-[gray]">
    <div class="flex flex-col max-w-[1280px] gap-[100px] mx-auto">
      <div class="grid grid-cols-4 gap-[20px] max-w-[1280px] mx-auto">
        <div
          v-for="item in projects"
          @click="() => getData(item)"
          :key="item.gid"
          class="w-[200px] h-[200px] flex flex-col rounded-[8px] border-white border-[1px]"
        >
          <div class="flex-1 bg-[#3d3d3d]"></div>
          <div class="text-center py-[10px]">{{ item.name }}</div>
        </div>
      </div>

      <div class="w-full h-auto min-h-[400px] flex flex-col gap-[40px] max-w-[1280px] mx-auto">
        <TaskListItem v-for="item in asana" :key="item.gid" :task="item" />
      </div>
    </div>
  </div>
</template>
