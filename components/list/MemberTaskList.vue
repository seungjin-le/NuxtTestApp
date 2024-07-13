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

const handleCheckboxClick = (item) => {
  console.log(item);
  item.checked = !item.checked;
};
</script>

<template>
  <div class="w-full flex flex-col items-center justify-start border-[1px] border-white rounded-[8px] overflow-hidden">
    <div
      class="flex-1 w-full memberlistItem border-b-[1px] border-b-white [&>div]:border-r-[1px] [&>div]:border-b-white last:[&>div]:border-r-none"
    >
      <div class="memberlistItem max-w-[50px] min-w-[50px]">
        <label for="task_checked_all" class="w-[18px] h-[18px] bg-white rounded-[4px] flex items-center justify-center">
          <input id="task_checked_all" type="checkbox" class="hidden" />
        </label>
      </div>
      <div class="max-w-[150px] min-w-[150px] memberlistItem">작업자</div>
      <div class="memberlistItem">작업내용</div>
      <div class="max-w-[120px] min-w-[100px] memberlistItem">종료일</div>
      <div class="max-w-[120px] min-w-[100px] memberlistItem">시작일</div>
      <div class="max-w-[100px] min-w-[100px] memberlistItem">완료여부</div>
    </div>

    <div
      v-if="items && items?.length > 0"
      class="overflow-y-auto w-full scrollbar-hide h-auth max-h-[600px] flex flex-col gap-[20px]"
    >
      <div v-for="(member, i) in items" :key="member.gid">
        <div class="flex flex-row items-center justify-start">
          <div
            class="min-h-[50px] max-h-[50px] w-full bg-[#3d3d3d] flex items-center justify-start border-b-[1px] border-b-white text-[16px] font-bold px-[20px]"
          >
            {{ member.name }}({{ member.tasks.length }}개)
          </div>
        </div>
        <div
          v-for="(item, index) in week ? member?.weekTasks : member?.tasks"
          :key="`${member.gid}_${index}`"
          class="h-[50px] flex flex-row items-center justify-center [&>div]:border-r-[1px] [&>div]:border-b-white last:[&>div]:border-r-none [&>div]:h-[50px]"
          :class="{
            'bg-[#3d3d3d]': index % 2 === 0,
            'bg-[#2d2d2d]': index % 2 === 1,
            'border-b-white border-b-[1px]': index !== member.tasks.length - 1 || i !== items.length - 1,
          }"
        >
          <div class="memberlistItem max-w-[50px] min-w-[50px]">
            <div
              @click="handleCheckboxClick(item)"
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
          <div class="max-w-[150px] min-w-[150px] memberlistItem !justify-start px-[20px]">
            {{ item.assignee?.name || "-" }}
          </div>
          <div class="!justify-start px-[20px] memberlistItem">{{ item.name }}</div>
          <div class="max-w-[120px] memberlistItem">{{ item.due_on || "-" }}</div>
          <div class="max-w-[120px] memberlistItem">{{ item.start_on || "-" }}</div>
          <div class="max-w-[100px] memberlistItem">{{ item.completed ? "완료" : "미완료" }}</div>
        </div>
        <div
          v-if="!items || member?.tasks?.length === 0"
          class="flex items-center justify-center h-full flex-1 bg-[#3d3d3d]"
          :class="{
            'border-b-white border-b-[1px]': i !== items.length - 1,
          }"
        >
          <div class="h-[50px] flex items-center justify-center">작업이 없습니다.</div>
        </div>
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

<!-- :style="`max-height: ${height}px; min-height: ${height}px`" -->
