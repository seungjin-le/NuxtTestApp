<script setup>
const { items } = defineProps({
  items: {
    type: Array,
    Required: false,
    default: () => [],
  },
  week: {
    type: Boolean,
    Required: false,
    default: false,
  },
});
watch(items, () => {
  console.log(items);
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

    <div ref="listContainer" class="overflow-y-auto w-full scrollbar-hide h-auth max-h-[600px]">
      <div v-for="(member, i) in items" :key="member.gid">
        <div
          v-for="(item, index) in week ? member?.weekTasks : member?.tasks"
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
      </div>
    </div>
    <div v-if="!items || items?.length === 0" class="flex items-center justify-center h-full flex-1">
      <div class="h-[50px] flex items-center justify-center">작업이 없습니다.</div>
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

<!-- :style="`max-height: ${height}px; min-height: ${height}px`" -->
