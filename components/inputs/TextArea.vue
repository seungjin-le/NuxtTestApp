<script>
export default {
  name: "TextArea",
  emits: ["update"],
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Type ",
    },
    direction: {
      type: String,
      default: "row",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
  methods: {
    handleOnClick(e) {
      if (!this.readOnly) return;
      navigator.clipboard.writeText(e.target.value);
      alert("복사되었습니다.");
    },
  },
};
</script>
<template>
  <div class="flex w-full gap-[10px]" :class="{ 'flex-row': direction === 'row', 'flex-col': direction === 'col' }">
    <div :class="{ 'max-w-[280px] min-w-[280px] flex items-center justify-center': direction === 'row' }">
      {{ label }}
    </div>
    <textarea
      class="border border-gray-300 p-2 w-full min-h-[400px]"
      :class="{
        'cursor-pointer outline-none': readOnly,
        'resize-none': !readOnly,
        '': direction === 'col',
      }"
      :placeholder="placeholder"
      :value="value"
      autocomplete="off"
      :readOnly="readOnly"
      @change="!readOnly && $emit('update', $event.target.value)"
      @click="handleOnClick"
    />
  </div>
</template>
