<script>
export default {
  name: "TextInput",
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
  },
  setup() {
    return {};
  },
  methods: {
    handleOnChange(e) {
      this.$emit("update", e.target.value);
    },
  },
};
</script>
<template>
  <div class="flex flex-row w-full gap-[10px]">
    <div class="max-w-[280px] flex-1 min-w-[280px] flex items-center justify-center">{{ label }}</div>
    <input
      class="border border-gray-300 px-[20px] py-[8px] w-full"
      :placeholder="placeholder"
      :value="value"
      autocomplete="off"
      @change="handleOnChange"
    />
  </div>
</template>
