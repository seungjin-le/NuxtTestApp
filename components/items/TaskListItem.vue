<script>
export default {
  name: "TaskListItem",
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {};
  },
};
</script>
<template>
  <div
    class="flex flex-row gap-[10px] [&>div]:flex-1 first:[&>div>div]:py-[12px] first:[&>div>div]:text-lg bg-[#fff] rounded-[5px]"
  >
    <div class="flex flex-col items-center justify-center gap-[10px]">
      <div>작업내용</div>
      <div>{{ task?.name || "-" }}</div>
    </div>
    <div class="flex flex-col items-center justify-center gap-[10px] max-w-[150px]">
      <div>작업자</div>
      <div>{{ task?.assignee?.name || "-" }}</div>
    </div>
    <div class="flex flex-col items-center justify-center gap-[10px] max-w-[150px]">
      <div>종료일</div>
      <div>{{ task?.due_on || "-" }}</div>
    </div>
    <div class="flex flex-col items-center justify-center gap-[10px] max-w-[150px]">
      <div>시작일</div>
      <div>{{ task?.start_on || "-" }}</div>
    </div>
    <div class="flex flex-col items-center justify-center gap-[10px] max-w-[150px]">
      <div>완료여부</div>
      <div>{{ task?.completed ? "완료" : "미완료" }}</div>
    </div>
  </div>
</template>
