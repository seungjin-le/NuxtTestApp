<script setup>
defineProps({
  onClick: {
    type: Function,
    default: () => {},
    required: false,
  },
  text: {
    type: String,
    default: "",
    required: false,
  },

  width: {
    type: String,
    default: "80",
    required: false,
  },
  height: {
    type: String,
    default: "40",
    required: false,
  },
});
</script>

<template>
  <div
    class="cursor-pointer flex items-center justify-center border-[1px] rounded-[8px] text-white bg-[#2d2d2d]"
    :style="`min-width: ${width}px; max-width: ${width}px; min-height:${height}px; max-height:${height}px;`"
    @click="onClick"
  >
    {{ text }}
  </div>
</template>
