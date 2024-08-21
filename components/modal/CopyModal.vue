<script setup>
const { content } = defineProps({
  content: {
    type: String,
    required: false,
    default: "",
  },
});

const handleOnClickCopy = async () => {
  if (!content) return;

  await navigator.clipboard.writeText(content);
  alert("복사되었습니다.");
};
</script>

<template>
  <div class="fixed left-0 top-0 w-full h-full bg-black/50 flex justify-center items-center z-[999] copy_modal">
    <div class="w-[1000px] bg-[#3d3d3d] rounded-lg p-4 text-white flex flex-col items-start justify-start gap-[20px]">
      <h2 class="text-[24px] font-bold">Copy Tasks</h2>
      <textarea
        class="resize-none w-full rounded-lg p-[20px] py-[10px] bg-[#252525] h-[700px] max-h-[700px] overflow-y-auto"
        :value="content"
      />
      <div class="flex justify-end items-center gap-[20px]">
        <button class="bg-[#4d4d4d] rounded-lg p-[10px] text-[14px] font-bold" @click="handleOnClickCopy">Copy</button>
        <button class="bg-[#4d4d4d] rounded-lg p-[10px] text-[14px] font-bold" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.copy_modal {
  animation: checkbox 0.3s ease-in-out;
}

@keyframes checkbox {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
