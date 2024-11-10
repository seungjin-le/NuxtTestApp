<!-- <script setup>
import * as XLSX from "xlsx";
import { XlsxRead, XlsxTable, XlsxSheets, XlsxJson, XlsxWorkbook, XlsxSheet, XlsxDownload } from "vue3-xlsx";
import { ref } from "vue";

const file = ref(null);
const items = ref([]);

const sheets = [{ name: "", data: [] }];
const collection = [{ a: 1, b: 2 }];
const selectedSheet = ref(null);
const onChange = (event) => {
  if (!event.target.files) return;

  file.value = event.target.files[0];
};
</script> -->

<script setup>
import * as XLSX from "xlsx";
import { ref } from "vue";

const file = ref(null);
const items = ref([]);
const headers = ref([]);
const onChange = (event) => {
  if (!event.target.files) return;

  file.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(jsonData);
    headers.value = jsonData[0];
    jsonData.shift();
    items.value = jsonData.map((row) => {
      return row.reduce((acc, val, index) => {
        acc[`${headers.value[index]}`] = val;
        return acc;
      }, {});
    });
  };
  reader.readAsArrayBuffer(file.value);
};
</script>

<template>
  <div class="flex-col-center w-full h-full">
    <input type="file" @change="onChange" />
    <div v-if="items.length" class="max-w-[1240px] max-h-[800px] overflow-auto size-full flex-1 text-nowrap">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, rowIndex) in items" :key="rowIndex">
            <td v-for="(value, colIndex) in item" :key="`${rowIndex}-${colIndex}`">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
table {
  width: 100%;
}
tr,
td {
  border: 1px solid #fff;
}
</style>
<!-- <template>
  <div class="flex-col-center w-full h-full">
    <input type="file" @change="onChange" />

    <div
      class="size-full [&_td]:px-[20px] [&_table]:border-collapse [&_tr]:border-1 [&_td]:border-1 [&_tr]:h-[28px] relative [&_*]:transition-all [&_span]:max-h-[300px] [&_span]:overflow-auto"
    >
      <xlsx-read :file="file">
        <xlsx-sheets>
          <template #default="{ sheets }">
            <div class="absolute top-full left-0 flex-row-center translate-y-[10px]">
              <div
                v-for="(sheet, index) in sheets"
                :key="sheet"
                @click="selectedSheet = sheet"
                class="px-[10px] rounded-[5px] border-t-1 text-center text-m2 transition-all"
                :class="{
                  'border-r-1': index !== 0,
                  'border-x-1': index === 0,
                  'bg-[#fff]': sheet === selectedSheet,
                  'cursor-pointer bg-[gray]': sheet !== selectedSheet,
                }"
              >
                {{ sheet }}
              </div>
            </div>
          </template>
        </xlsx-sheets>
        <div class="max-w-[100%] overflow-auto h-[1000px] max-h-[1000px]">
          <xlsx-table :sheet="selectedSheet" />
        </div>
      </xlsx-read>
    </div>
  </div>
</template> -->
