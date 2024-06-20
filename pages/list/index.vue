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
const sections = useState("sections", () => []);
const filter = useState("filter", () => []);

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["projects"],
  queryFn: () =>
    $fetch(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json", "Content-Type": "application/json" },
    }),
});

const getTask = async (gid) => {
  const opt_pretty = "true";

  await axios
    .get(`${api_url}/projects/${gid}/sections?opt_pretty=${opt_pretty}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async ({ data }) => {
      sections.value = data.data;
      await getMembers({ gid });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const getMembers = async ({ gid }) => {
  if (!gid) return;
  const opt_fields = "members.name";
  const opt_pretty = "true";
  await getData({ gid });
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
      members.value.members.map((member) => {
        member.tasks = asana.value.filter(({ assignee }) => {
          return assignee?.gid === member.gid;
        });
      });
    })

    .catch((error) => {
      members.value = [];
    });
};

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

      filter.value = asana.value;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
const getAll = async () => {
  filter.value = asana.value;
};
</script>

<template>
  <div class="w-full h-auto bg-[gray]">
    <div class="flex flex-col max-w-[1280px] gap-[100px] mx-auto">
      <div>
        <div class="text-[32px] py-[20px]">Projects</div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,_1fr))] gap-[20px] max-w-[1280px] mx-auto">
          <div
            v-for="item in data?.data"
            @click="getTask(item.gid)"
            :key="item.gid"
            class="w-[200px] h-[200px] flex flex-col rounded-[8px] border-white border-[1px]"
          >
            <div class="flex-1 bg-[#3d3d3d]"></div>
            <div class="text-center py-[10px]">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="max-w-[1280px] w-full">
        <div class="text-[32px] py-[20px]">Task</div>
        <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,_1fr))] justify-start gap-[20px]">
          <div
            class="w-[200px] h-[200px] flex items-center justify-center text-white rounded-[8px] border-white border-[1px] bg-[#3d3d3d]"
            v-for="item in sections"
            :key="item.gid"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="max-w-[1280px] w-full pb-[40px]">
        <div class="text-[32px] py-[20px]">Members</div>
        <div class="w-full flex flex-col">
          <div
            class="h-[50px] overflow-hidden relative flex flex-col items-start justify-start px-[40px] text-white rounded-t-none border-white border-[1px] bg-[#3d3d3d] cursor-pointer transition-all"
            v-for="(item, index) in members?.members"
            :class="{
              'rounded-b-[8px]': index === members?.members.length - 1,
              'h-[550px]': item?.checked,
            }"
            :key="item.gid"
            @click="members.members[index].checked = !members.members[index]?.checked"
          >
            <div class="min-h-[50px] max-h-[50px] overflow-y-auto flex items-center justify-start">
              {{ item.name }}
            </div>

            <div class="w-full overflow-hidden border-[1px] border-white rounded-[8px] mt-[50px]">
              <div class="h-[50px] flex flex-row flex-1 border-b-[1px] border-b-white">
                <div class="max-w-[150px] min-w-[150px] flex-1 flex items-center justify-center">작업자</div>
                <div class="flex-1 flex items-center justify-center">작업내용</div>
                <div class="max-w-[100px] min-w-[100px] flex-1 flex items-center justify-center">종료일</div>
                <div class="max-w-[100px] min-w-[100px] flex-1 flex items-center justify-center">시작일</div>
                <div class="max-w-[100px] min-w-[100px] flex-1 flex items-center justify-center">완료여부</div>
              </div>
              <div class="overflow-y-auto max-h-[300px]">
                <div
                  v-for="(task, index) in item.tasks"
                  :key="task.gid"
                  class="h-[50px] flex flex-row items-center justify-center"
                  :class="{
                    'bg-[#3d3d3d]': index % 2 === 0,
                    'bg-[#2d2d2d]': index % 2 === 1,
                    'border-b-white border-b-[1px]': index !== item.tasks.length - 1,
                  }"
                >
                  <div class="max-w-[150px] min-w-[150px] flex-1 text-center">{{ task.assignee?.name }}</div>
                  <div class="flex-1">{{ task.name }}</div>
                  <div class="max-w-[100px] flex-1 text-center">{{ task.due_on }}</div>
                  <div class="max-w-[100px] flex-1 text-center">{{ task.start_on }}</div>
                  <div class="max-w-[100px] flex-1 text-center">{{ task.completed ? "완료" : "미완료" }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
