<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

// import canvasDatagrid from "canvas-datagrid";
const Cell = defineAsyncComponent(() => import("@/components/items/TableCell.vue"));
const jsondata = ref([]);
const headers = ref([]);
const file = ref(null);

const handleFileChange = (event) => {
  if (!event.target.files[0]) return;
  file.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    let arr = [];
    jsondata.value = XLSX.utils.sheet_to_json(worksheet);
    jsondata.value.map((item) => {
      Object.keys(item).forEach((key) => (arr.includes(key) ? null : arr.push(key)));
    });
    headers.value = arr.map((item) => ({ field: item, label: item }));

    jsondata.value = jsondata.value.map((item) => {
      headers.value.forEach((header) => {
        item[header.field] = { value: item[header.field] || "", editing: false };
      });
      return item;
    });
  };

  reader.readAsArrayBuffer(file.value);
};

const headerRefs = ref([]);

const datas = ref([
  {
    label: "메뉴 이름",
    key: "menuName",
  },
  {
    label: "메뉴 설명",
    key: "menuDesc",
  },
  {
    label: "메뉴 가격",
    key: "menuPrice",
  },
  {
    label: "메뉴 카테고리",
    key: "menuCategory",
  },
  {
    label: "메뉴 이미지",
    key: "menuImage",
  },
]);
</script>

<template>
  <div class="flex-col-center-start py-[30px] size-full flex-1 gap-[40px]">
    <input type="file" @change="handleFileChange" />

    <div class="flex-row-center size-full">
      <div class="max-w-[1240px] mx-auto max-h-[500px] w-[1240px] h-[500px] overflow-auto [&_th]:select-none">
        <table class="border-separate border-spacing-0">
          <thead class="sticky top-0">
            <tr>
              <th
                v-for="(header, index) in headers"
                class="cursor-pointer"
                :style="{ left: header?.width + 'px' }"
                :id="`header-${index}`"
                ref="headerRefs"
                @dblclick="
                  () => {
                    headers.map((item, i) => {
                      item.sticky = i <= index;
                      item.width = i === 0 ? 0 : i <= index ? headerRefs[i].offsetLeft + 1 : 0;
                    });
                  }
                "
                :class="{
                  'sticky  bg-[gray] border-[12px] border-solid !border-[#000]': header.sticky,
                }"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in jsondata" :key="`rows_${index}`" class="relative">
              <td v-for="(header, index) in headers" class="relative">
                <Cell v-model="row[header.field]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  height: 100%;
}

th,
td {
  text-wrap: nowrap;
  border: 1px solid #000;
  padding: 0;
}
</style>
