<script setup>
import TextArea from "@/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";

definePageMeta({
  title: "Index Page",
  layout: "default",
});

const title = useState("title", () => "zxcv");
const types = useState("types", () => "[개발]");
const contents = useState("contents", () => "태그1,태그2,태그3");
const total = useState("total", () => "");

const handleOnClick = async () => {
  const type = types.value.replaceAll("[", "").replaceAll("]", "").trim();
  const arr = contents.value
    .split(/,|\n/)
    .filter((v) => v)
    .map((item) => `[${type}] : ${item}`.trim());
  total.value = `[ ${title.value} ] \n${arr.join("\n")}`;
  await getData();
};
</script>

<template>
  <div class="flex flex-col w-full max-w-[1280px] mx-auto h-auto">
    <TextInput label="프로젝트명" :value="title" placeholder="프로젝트명" @update="(value) => (title = value)" />
    <TextInput label="타입" :value="types" placeholder="타입" @update="(value) => (types = value)" />
    <TextArea label="내용" :value="contents" placeholder="내용" @update="(value) => (contents = value)" />

    <div class="py-[40px] w-full flex items-center justify-center">
      <button @click="handleOnClick" class="border-[1px] border-[blue] px-[14px] my-[8px] rounded-[5px]">
        보고서 만들기
      </button>
    </div>

    <TextArea direction="col" :value="total" class="h-[400px]" :readOnly="true" />
  </div>
</template>
