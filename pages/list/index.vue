<script setup>
import axios from "axios";
import dayjs from "dayjs";

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
const asana = useState("asana", () => []);
const copyTask = useState("copyTask", () => "");

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
            dayjs(task.due_on) > dayjs(new Date()) &&
            dayjs(task.due_on) < dayjs(new Date().setDate(new Date().getDate() + 7))
          );
        });
      });
    })
    .catch((error) => {
      members.value = [];
    });
  memberIsLoading.value = false;
};

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

const handleOnClickCopyTask = async (item) => {
  const tasks = item.week ? item.weekTasks : item.tasks;
  const completed = tasks.filter((task) => task.completed);
  const notCompleted = tasks.filter((task) => !task.completed);
  const notDone = notCompleted.filter((task) => dayjs(task.due_on) < dayjs(new Date()));
  const done = notCompleted.filter((task) => dayjs(task.due_on) > dayjs(new Date()));

  copyTask.value = ``;

  copyTask.value += `[ ${item.name} ] \n`;
  if (item.week) {
    if (notDone.length > 0) {
      copyTask.value += `[ 전주 미완료 사항 ] \n`;
      notDone.map((task) => {
        copyTask.value += `[ ${item.tag} ] ${task.name} \n`;
      });
    }
    if (done.length > 0) {
      copyTask.value += `[ 금주 예정 사항 ] \n`;
      done.map((task) => {
        copyTask.value += `[ ${item.tag} ] ${task.name} \n`;
      });
    }
    if (completed.length > 0) {
      copyTask.value += `[ 전주 완료 사항 ] \n`;
      completed.map((task) => {
        copyTask.value += `[ ${item.tag} ] ${task.name} \n`;
      });
    }
  } else {
    tasks.map((task) => {
      copyTask.value += `[ ${item.tag} ] ${task.name} \n`;
    });
  }

  // navigator.clipboard.writeText(item.name);
  // alert("복사되었습니다.");
};

const handleOnClickCopy = async () => {
  if (!copyTask.value) return;
  navigator.clipboard.writeText(copyTask.value);
  alert("복사되었습니다.");
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
              <div
                class="max-h-[40px] overflow-hidden flex flex-row items-center justify-center border-[1px] rounded-[8px] w-[340px]"
              >
                <div class="flex-1 max-w-[60px] flex items-center justify-center border-r-[1px] h-[40px]">태그</div>
                <input
                  type="text"
                  :value="item.tag"
                  @input="item.tag = $event.target.value"
                  class="min-w-[280px] flex-1 min-h-[40px] max-h-[40px] outline-none border-none rounded-[8px] bg-[#2d2d2d] text-white px-[10px]"
                />
              </div>
              <DefaultButton text="복사" :onClick="() => handleOnClickCopyTask(item)" />
              <DefaultButton
                text="최근 7일"
                :onClick="() => (item['week'] = true)"
                :class="{
                  'bg-[#3d3d3d]': item.week,
                  'bg-[#2d2d2d]': !item.week,
                }"
              />
              <DefaultButton text="전체" :onClick="() => (item['week'] = false)" />
            </div>

            <div class="w-full flex-1 px-[40px] h-full">
              <MemberTaskList :items="item" :week="item.week || false" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="overflow-hidden transition-all mb-[40px] flex flex-col gap-[20px] items-end justify-end w-full"
        :class="{
          'h-0 ': !copyTask,
          'h-[600px] ': copyTask,
        }"
      >
        <DefaultButton text="복사" :onClick="() => handleOnClickCopy()" />

        <textarea
          :value="copyTask"
          @input="copyTask = $event.target.value"
          class="resize-none w-full max-h-[500px] h-full p-[20px] bg-[#2d2d2d] text-white rounded-[8px] outline-none border-[1px] border-white"
        />
      </div>
    </div>
  </div>
</template>
