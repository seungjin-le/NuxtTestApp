<script setup>
import axios from "axios";

const ListLoading = defineAsyncComponent(() => import("~/components/loading/ListLoading.vue"));
const DefaultButton = defineAsyncComponent(() => import("~/components/buttons/DefaultButton.vue"));
const MemberTaskList = defineAsyncComponent(() => import("~/components/list/MemberTaskList.vue"));
definePageMeta({
  title: "Nuxt.js Layouts",
  layout: "list-layout",
});
const config = useRuntimeConfig();
const queryClient = useQueryClient();
const api_url = "https://app.asana.com/api/1.0";
const token = config.public.NUXT_ENV_API_KEY;
const currentGid = useState("currentGid", () => "");
const members = useState("members", () => []);
const sections = useState("sections", () => []);
const filter = useState("filter", () => []);
const taskIsLoading = useState("taskIsLoading", () => false);
const memberIsLoading = useState("memberIsLoading", () => false);

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["projects"],
  queryFn: () =>
    $fetch(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json", "Content-Type": "application/json" },
    }),
});

const getTask = async (gid) => {
  if (gid === currentGid.value || taskIsLoading.value) return;

  const opt_pretty = "true";
  taskIsLoading.value = true;
  memberIsLoading.value = true;
  currentGid.value = gid;
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
  taskIsLoading.value = false;
};

const getMembers = async ({ gid }) => {
  if (!gid) return;
  const opt_fields = "members.name";
  const opt_pretty = "true";

  await getData({ gid });
  await axios
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
        member.week = false;
        member.weekTasks = member.tasks.filter((task) => {
          return (
            new Date(task.due_on) > new Date() &&
            new Date(task.due_on) < new Date(new Date().setDate(new Date().getDate() + 7))
          );
        });
      });
    })
    .catch((error) => {
      members.value = [];
    });
  memberIsLoading.value = false;
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
</script>

<template>
  <div class="w-full h-auto bg-[gray]">
    <div class="flex flex-col max-w-[1280px] gap-[50px] mx-auto px-[10px]">
      <div class="flex flex-row gap-[10px] items-start justify-center">
        <div class="flex-1 max-w-[50%]">
          <div class="text-[32px] py-[20px]">Projects</div>
          <ListLoading v-if="isLoading" />
          <div v-else class="flex flex-col max-w-[1280px] mx-auto">
            <div
              v-for="(item, index) in data?.data"
              @click="getTask(item.gid)"
              :key="item.gid"
              class="h-[50px] text-white flex items-center justify-start border-white border-[1px] overflow-hidden px-[20px] transition-all"
              :class="{
                'bg-[#3d3d3d] ': item.gid === currentGid,
                'bg-[#2d2d2d] cursor-pointer': item.gid !== currentGid,
                'rounded-b-[8px]': index === data?.data.length - 1,
                'rounded-t-[8px]': index === 0,
              }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <div class="max-w-[50%] w-full">
          <div class="text-[32px] py-[20px]">Task</div>
          <ListLoading v-if="taskIsLoading" />
          <div v-else class="w-full flex flex-col justify-start">
            <div
              class="h-[50px] flex items-center justify-center text-white border-white border-[1px] bg-[#2d2d2d]"
              :class="{
                'rounded-t-[8px]': index === 0,
                'rounded-b-[8px]': index === sections.length - 1,
              }"
              v-for="(item, index) in sections"
              :key="item.gid"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 w-full pb-[40px]">
        <div class="text-[32px] py-[20px]">Members</div>
        <ListLoading v-if="memberIsLoading" />
        <div v-else class="w-full flex flex-col">
          <div
            class="h-[50px] overflow-hidden relative flex flex-col items-start justify-start text-white rounded-t-none border-white border-[1px] bg-[#3d3d3d] transition-all"
            v-for="(item, index) in members?.members"
            :class="{
              'rounded-b-[8px]': index === members?.members.length - 1,
              'h-[550px]': item?.checked,
            }"
            :key="item.gid"
          >
            <div
              class="min-h-[50px] max-h-[50px] overflow-y-auto flex items-center justify-start cursor-pointer w-full px-[40px]"
              :class="{ 'border-b-[1px] ': item?.checked }"
              @click="members.members[index].checked = !members.members[index]?.checked"
            >
              {{ item.name }}
            </div>
            <div class="flex flex-row items-center justify-end w-full gap-[10px] py-[20px] px-[40px]">
              <DefaultButton text="최근 7일" :onClick="() => (item['week'] = true)" />
              <DefaultButton text="전체" :onClick="() => (item['week'] = false)" />
            </div>

            <div class="w-full flex-1 px-[40px] h-full">
              <MemberTaskList :items="item" :week="item.week || false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
