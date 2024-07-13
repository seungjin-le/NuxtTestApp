<script setup>
import axios from "axios";
import dayjs from "dayjs";

const ListLoading = defineAsyncComponent(() => import("~/components/loading/ListLoading.vue"));
const DefaultButton = defineAsyncComponent(() => import("~/components/buttons/DefaultButton.vue"));
const MemberTaskList = defineAsyncComponent(() => import("~/components/list/MemberTaskList.vue"));
definePageMeta({
  title: "Asana Task",
  layout: "default",
});
const config = useRuntimeConfig();
const queryClient = useQueryClient();
const api_url = "https://app.asana.com/api/1.0";
const token = config.public.NUXT_ENV_API_KEY;
const currentGid = useState("currentGid", () => "");
const members = useState("members", () => []);
const sections = useState("sections", () => []);
const taskIsLoading = useState("taskIsLoading", () => false);
const memberIsLoading = useState("memberIsLoading", () => false);
const asana = useState("asana", () => []);
const copyTask = useState("copyTask", () => "");
const currentTab = useState("currentTab", () => 1);
const currentTask = useState("currentTask", () => []);
const isWeek = useState("isWeek", () => false);

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["projects"],
  queryFn: () => $fetch(`api/v1/projects`),
});

const resetCurrentTask = () => {
  currentTask.value = [];
};

const getTask = async (gid) => {
  if (gid === currentGid.value || taskIsLoading.value) return;

  taskIsLoading.value = true;
  memberIsLoading.value = true;
  currentGid.value = gid;
  resetCurrentTask();

  await axios
    .get(`api/v1/projects/detail?gid=${gid}`)
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

  await getData({ gid });
  await axios
    .get(`api/v1/projects/members?gid=${gid}`)
    .then(({ data }) => {
      members.value = data;
      members.value.members.map((member) => {
        member.tasks = asana.value.filter(({ assignee }) => assignee?.gid === member.gid);

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

const getTaskList = async ({ gid }) => {
  if (!gid) return;
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
    .then(async ({ data }) => {})
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const getData = async ({ gid }) => {
  await axios
    .get(`api/v1/projects/tasks?gid=${gid}`)
    .then(({ data }) => {
      asana.value = data.data;
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
        copyTask.value += `${item.tag ? `[ ${item.tag} ] ` : ""}${task.name} \n`;
      });
    }
    if (done.length > 0) {
      copyTask.value += `[ 금주 예정 사항 ] \n`;
      done.map((task) => {
        copyTask.value += `${item.tag ? `[ ${item.tag} ] ` : ""}${task.name} \n`;
      });
    }
    if (completed.length > 0) {
      copyTask.value += `[ 전주 완료 사항 ] \n`;
      completed.map((task) => {
        copyTask.value += `${item.tag ? `[ ${item.tag} ] ` : ""}${task.name} \n`;
      });
    }
  } else {
    tasks.map((task) => {
      copyTask.value += `${item.tag ? `[ ${item.tag} ] ` : ""}${task.name} \n`;
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
  <div class="w-full h-auto [&_*]:text-whit py-[40px]">
    <div class="flex flex-col max-w-[1280px] gap-[50px] mx-auto px-[10px]">
      <div class="flex flex-row gap-[10px] items-start justify-center">
        <div class="flex-1 max-w-[50%] flex flex-col">
          <div>
            <div
              class="px-[20px] text-[32px] border-[1px] inline-block rounded-t-[8px] relative bg-[#3d3d3d] border-b-0 text-white"
            >
              Projects
              <div class="absolute top-full left-0 w-full h-[1px] bg-[#3d3d3d]" />
            </div>
          </div>
          <div
            class="flex flex-col items-center justify-center rounded-[8px] overflow-hidden bg-[#3d3d3d] border-[1px] border-white rounded-tl-none"
          >
            <div v-if="isLoading" class="w-full h-full flex flex-col items-center justify-center">
              <ListLoading />
            </div>
            <div
              v-else
              v-for="(item, index) in data?.data"
              @click="item.gid !== currentGid && getTask(item.gid)"
              :key="item.gid"
              class="h-[50px] text-white flex items-center justify-start b order- white bo rder -[1px] overflow-hidden px-[20px] transition-all w-full"
              :class="{
                'bg-[#2d2d2d] ': item.gid === currentGid,
                'bg-[#3d3d3d] cursor-pointer': item.gid !== currentGid,
                'border-t-[1px]': index !== 0,
              }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="max-w-[50%] w-full flex flex-col">
          <div
            class="flex flex-row min-h-[50px] max-h-[50px] [&>div]:text-[32px] [&>div]:px-[20px] [&>div]:border-[1px] [&>div]:!border-b-0 text-white [&>div]:border-white [&>div]:rounded-t-[8px] [&>div]:relative [&>div]:transition-all [&>div]:cursor-pointer"
          >
            <div
              @click="currentTab = 0"
              :class="{
                'bg-[#2d2d2d]': currentTab !== 0,
                'bg-[#3d3d3d]': currentTab === 0,
              }"
            >
              Task
              <div
                class="absolute top-full left-0 w-full h-[1px]"
                :class="{
                  'bg-[#3d3d3d]': currentTab === 0,
                  'hidden d': currentTab !== 0,
                }"
              />
            </div>
            <div
              @click="currentTab = 1"
              :class="{
                'bg-[#2d2d2d]': currentTab !== 1,
                'bg-[#3d3d3d]': currentTab === 1,
              }"
            >
              Members
              <div
                class="absolute top-full left-0 w-full h-[1px]"
                :class="{
                  'bg-[#3d3d3d]': currentTab === 1,
                  'hidden s': currentTab !== 1,
                }"
              />
            </div>
          </div>
          <div
            class="bg-[#3d3d3d] w-full flex border-[1px] border-white rounded-[8px] rounded-tl-none overflow-hidden"
            :class="{
              'min-h-[300px]': !currentGid,
            }"
          >
            <div class="w-full flex flex-col items-start justify-start relative" v-if="currentTab === 0">
              <div class="absolute top-0 left-0 w-full h-full z-2 text-white">
                <div class="relative w-full h-full">
                  <div class="z-[2] absolute w-full h-full bg-[#2d2d2d] opacity-40"></div>
                  <div class="z-[3] relative flex w-full h-full items-center justify-center text-[32px]">준비중</div>
                </div>
              </div>
              <div v-if="!currentGid" class="w-full h-full flex flex-col items-center justify-center text-white">
                프로젝트를 선택해주세요.
              </div>
              <div v-else-if="taskIsLoading" class="w-full h-full flex flex-col items-center justify-center">
                <ListLoading />
              </div>
              <div v-else class="w-full flex flex-col justify-start h-full">
                <div
                  class="h-[50px] flex items-center justify-start px-[20px] text-white border-white border-t-[1px] bg-[#3d3d3d] transition-all cursor-pointer"
                  :class="{
                    '!border-t-0 border-b-[1px]': index === 0 && index === sections.length - 1,
                    '!border-t-0 ': index === 0,
                  }"
                  v-for="(item, index) in sections"
                  :key="item.gid"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div class="w-full rounded-[8px] overflow-hidden bg-[#3d3d3d]" v-if="currentTab === 1">
              <div v-if="!currentGid" class="w-full h-full flex flex-col items-center justify-center text-white">
                프로젝트를 선택해주세요.
              </div>
              <div v-else-if="memberIsLoading" class="w-full h-full flex flex-col items-center justify-center">
                <ListLoading />
              </div>
              <div v-else class="w-full flex flex-col">
                <div
                  class="h-[50px] flex flex-col items-start justify-start text-white border-white border-t-[1px] transition-all"
                  v-for="(item, index) in members?.members"
                  :class="{
                    '!border-t-0 border-b-[1px]': index === 0 && index === sections.length - 1,
                    '!border-t-0 ': index === 0,
                  }"
                  :key="item.gid"
                >
                  <div
                    class="min-h-[50px] max-h-[50px] overflow-y-auto flex items-center justify-start cursor-pointer w-full px-[40px] transition-all"
                    :class="[item?.checked ? 'bg-[#2d2d2d]' : 'bg-[#3d3d3d]']"
                    @click="
                      () => {
                        item['checked'] = !item['checked'];
                        if (item['checked']) {
                          currentTask.push({ ...item });
                        } else {
                          currentTask = currentTask.filter((task) => task.gid !== item.gid);
                        }
                      }
                    "
                  >
                    <div class="flex flex-row items-center justify-center gap-[10px]">
                      <div class="flex items-center justify-center gap-[10px]">
                        <div
                          class="w-[20px] h-[20px] rounded-[4px] bg-[#3d3d3d] border-[1px] border-white relative [&>span]:transition-all"
                        >
                          <span
                            class="absolute top-1/2 translate-y-[-50%] left-[27%] w-[70%] h-[2px] bg-white -rotate-45 rounded-full"
                            :class="{
                              'opacity-0': !item.checked,
                              'opacity-100': item.checked,
                            }"
                          />
                          <span
                            class="absolute top-1/2 translate-y-[-50%] left-[3%] w-[50%] h-[2px] bg-white rotate-45 rounded-full"
                            :class="{
                              'opacity-0': !item.checked,
                              'opacity-100': item.checked,
                            }"
                          />
                        </div>
                      </div>
                      <div>
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[20px]">
        <div class="flex flex-row items-center justify-end w-full gap-[10px] [&_*]:text-white">
          <div
            class="max-h-[40px] overflow-hidden flex flex-row items-center justify-center border-[1px] rounded-[8px] w-[340px]"
          >
            <div class="flex-1 max-w-[60px] flex items-center justify-center border-r-[1px] h-[40px]">태그</div>
            <input
              type="text"
              :value="currentTask.tag || ''"
              @input="currentTask.tag = $event.target.value"
              class="min-w-[280px] flex-1 min-h-[40px] max-h-[40px] outline-none border-none rounded-[8px] bg-[#2d2d2d] px-[10px]"
            />
          </div>
          <DefaultButton text="복사" :onClick="() => handleOnClickCopyTask(currentTask)" />
          <DefaultButton
            text="최근 7일"
            :onClick="() => (isWeek = !isWeek)"
            :class="[isWeek ? 'bg-[#3d3d3d]' : 'bg-[#2d2d2d]']"
          />
          <DefaultButton
            text="전체"
            :onClick="() => (isWeek = !isWeek)"
            :class="[isWeek ? 'bg-[#2d2d2d]' : 'bg-[#3d3d3d]']"
          />
        </div>

        <div class="w-full flex-1 h-full [&_*]:text-white">
          <MemberTaskList :items="currentTask" :week="isWeek" />
        </div>
      </div>
      <div
        class="overflow-hidden transition-all mb-[40px] flex flex-col gap-[20px] items-end justify-end w-full"
        :class="[copyTask ? 'h-[600px]' : 'h-0']"
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
