<script setup>
defineProps({
  item: {
    type: Object,
    required: false,
    default: () => ({
      checked: false,
    }),
  },
  onClick: {
    type: Function,
    required: false,
    default: () => ({}),
  },
});
</script>

<template>
  <div
    @click="onClick(item)"
    class="w-[20px] h-[20px] rounded-[4px] bg-[#3d3d3d] border-[1px] border-white relative [&>span]:transition-all cursor-pointer"
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
</template>
