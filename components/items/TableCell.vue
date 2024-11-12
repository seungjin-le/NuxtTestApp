<script setup>
const model = defineModel();
const input = ref(null);
</script>

<template>
  <div class="relative size-full z-[1]">
    <div
      class="absolute inset-0 size-full bg-blue-0 cursor-pointer focus:border-[green] transition-all"
      @dblclick="
        () => {
          model.editing = true;
          nextTick(() => {
            input.focus();
          });
        }
      "
      :class="{
        hidden: model.editing,
      }"
    />
    <input
      ref="input"
      @blur="() => (model.editing = false)"
      @keydown.enter="() => (model.editing = false)"
      type="text"
      v-model="model.value"
      class="active:outline-none outline-none bg-[#fff] disabled:bg-inherit transition-all size-full text-ellipsis px-[8px] py-[4px]"
      :class="{
        'bg-[#f00]': model.editing,
      }"
      :disabled="!model.editing"
    />
  </div>
</template>
