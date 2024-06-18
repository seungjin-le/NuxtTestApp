<script setup>
import TextArea from "@/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import Asana from "asana";

definePageMeta({
  title: "Index Page",
  layout: "default",
});

const title = useState("title", () => "zxcv");
const types = useState("types", () => "[개발]");
const contents = useState("contents", () => "태그1,태그2,태그3");
const total = useState("total", () => "");
const asana = useState("asana", () => {});

const handleOnClick = async () => {
  const type = types.value.replaceAll("[", "").replaceAll("]", "").trim();
  const arr = contents.value
    .split(/,|\n/)
    .filter((v) => v)
    .map((item) => `[${type}] : ${item}`.trim());
  total.value = `[ ${title.value} ] \n${arr.join("\n")}`;
  await getData();
};

const getData = async () => {
  const opt_fields = "name,due_on,start_on,completed";
  const opt_pretty = "true";
  const token = "";
  const project_gid = "1207597249449674";

  const { data } = await useFetch(
    `https://app.asana.com/api/1.0/projects/${project_gid}/tasks?opt_fields=${opt_fields}&opt_pretty=${opt_pretty}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(data);
  return data;
};
</script>

<template>
  <div class="flex flex-col w-full max-w-[1280px] mx-auto">
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
