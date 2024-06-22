<script setup>
const { items } = defineProps({
  items: {
    type: Object,
    Required: false,
    default: () => ({
      tasks: [],
    }),
  },
  week: {
    type: Boolean,
    Required: false,
    default: false,
  },
});

const listContainer = ref(null);
const height = useState("height", () => 0);
const scrollHeight = useState("scrollHeight", () => 0);
watch(items, () => {
  if (items.tasks.length !== 0) {
    height.value = 50 * (items.tasks.length > 7 ? 7 : items.tasks.length);
  }
});

onMounted(() => {
  if (listContainer.value) {
    listContainer.value.addEventListener("scroll", () => {
      scrollHeight.value = listContainer.value.scrollTop;
    });
  }
});
</script>

<template>
  <div class="w-full flex flex-col items-center justify-start border-[1px] border-white rounded-[8px] overflow-hidden">
    <div
      class="flex-1 w-full memberlistItem border-b-[1px] border-b-white [&>div]:border-r-[1px] [&>div]:border-b-white last:[&>div]:border-r-none"
    >
      <div class="max-w-[150px] min-w-[150px] memberlistItem">작업자</div>
      <div class="memberlistItem">작업내용</div>
      <div class="max-w-[120px] min-w-[100px] memberlistItem">종료일</div>
      <div class="max-w-[120px] min-w-[100px] memberlistItem">시작일</div>
      <div class="max-w-[100px] min-w-[100px] memberlistItem">완료여부</div>
    </div>

    <div ref="listContainer" class="overflow-y-auto h-full w-full scrollbar-hide" :style="`max-height: ${height}px`">
      <div
        v-for="(item, index) in items.week ? items.weekTasks : items.tasks"
        :key="item.gid"
        class="h-[50px] flex flex-row items-center justify-center [&>div]:border-r-[1px] [&>div]:border-b-white last:[&>div]:border-r-none [&>div]:h-[50px]"
        :class="{
          'bg-[#3d3d3d]': index % 2 === 0,
          'bg-[#2d2d2d]': index % 2 === 1,
          'border-b-white border-b-[1px]': index !== items.tasks.length - 1,
        }"
      >
        <div class="max-w-[150px] min-w-[150px] memberlistItem">
          {{ item.assignee?.name || "-" }}
        </div>
        <div class="!justify-start px-[10px] memberlistItem">{{ item.name }}</div>
        <div class="max-w-[120px] memberlistItem">{{ item.due_on || "-" }}</div>
        <div class="max-w-[120px] memberlistItem">{{ item.start_on || "-" }}</div>
        <div class="max-w-[100px] memberlistItem">{{ item.completed ? "완료" : "미완료" }}</div>
      </div>
      <div v-if="!items.tasks || items.tasks.length === 0">
        <div class="h-[50px] flex items-center justify-center">작업이 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memberlistItem {
  flex: 1;
  max-height: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>