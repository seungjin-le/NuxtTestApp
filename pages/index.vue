<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

// import canvasDatagrid from "canvas-datagrid";

const jsondata = ref([]);
const headers = ref([]);
const file = ref(null);

const table = ref(null);

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

    // table.value = canvasDatagrid({
    //   parentNode: document.getElementById("gridctr"),
    //   data: jsondata.value,
    // });
  };

  reader.readAsArrayBuffer(file.value);
};

const headerRefs = ref([]);
</script>

<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <div class="max-w-[1240px] mx-auto max-h-[500px] overflow-auto w-[1240px] h-[500px] [&_th]:select-none">
      <table>
        <thead>
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
          <tr v-for="(row, index) in jsondata" :key="`rows_${index}`" ta @blur="() => (row.editing = false)">
            <td v-for="header in headers" class="relative" @blur="() => (row.editing = false)">
              <div
                class="absolute inset-0 size-full bg-blue-0 cursor-pointer focus:border-[green] transition-all"
                :class="{
                  'z-[-1]': row.editing === header.field,
                }"
                @dblclick="() => (row.editing = header.field)"
              />
              <input
                @blur="() => (row.editing = false)"
                @keydown.enter="() => (row.editing = false)"
                type="text"
                v-model="row[header.field]"
                class="active:outline-none outline-none bg-[#fff] disabled:bg-inherit transition-all w-auto"
                :class="{
                  'bg-[#f00]': row.editing === header.field,
                }"
                :disabled="row.editing !== header.field"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  height: 100%;
}
th {
  padding: 10px;
}
td > input {
  padding: 10px;
}
th,
td {
  text-wrap: nowrap;
  border: 1px solid #000;
}
</style>
