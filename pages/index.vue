<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

// import canvasDatagrid from "canvas-datagrid";
const Cell = defineAsyncComponent(() => import("@/components/items/TableCell.vue"));
const jsondata = ref([]);
const headers = ref([]);
const file = ref(null);

const datas = ref([
  {
    label: "메뉴 이름",
    key: "menuName",
    value: "menuName",
    selected: false,
  },
  {
    label: "1차 카테고리",
    key: "category1",
    value: "category1",
    selected: false,
  },
  {
    label: "2차 카테고리",
    key: "category2",
    value: "category2",
    selected: false,
  },

  {
    label: "메뉴 설명",
    key: "menuDesc",
    value: "menuDesc",
    selected: false,
  },
  {
    label: "메뉴 가격",
    key: "menuPrice",
    value: "menuPrice",
    selected: false,
  },
  {
    label: "메뉴 카테고리",
    key: "menuCategory",
    value: "menuCategory",
    selected: false,
  },
  {
    label: "메뉴 이미지",
    key: "menuImage",
    value: "menuImage",
    selected: false,
  },
  {
    label: "사용여부",
    key: "use_status",
    value: "use_status",
    selected: false,
  },
  {
    label: "성인인증",
    key: "adult_auth",
    value: "adult_auth",
    selected: false,
  },
  {
    label: "품절",
    key: "sold_out",
    value: "sold_out",
    selected: false,
  },
]);

const handleFileChange = (event) => {
  if (!event.target.files[0]) return;
  file.value = event.target.files[0];
  const reader = new FileReader();
  const form = JSON.parse(JSON.stringify(datas.value));
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
    headers.value = arr.map((item) => ({ field: item, label: item, value: JSON.parse(JSON.stringify(form)) }));

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

const firstCategory = [
  {
    label: "1-1",
    value: "category1_1",
    selected: false,
  },
  {
    label: "1-2",
    value: "category1_2",
    selected: false,
  },
  {
    label: "1-3",
    value: "category1_3",
    selected: false,
  },
  {
    label: "1-4",
    value: "category1_4",
    selected: false,
  },
  {
    label: "1-5",
    value: "category1_5",
    selected: false,
  },

  {
    label: "1-6",
    value: "category1_6",
    selected: false,
  },
  {
    label: "1-7",
    value: "category1_7",
    selected: false,
  },
];
const secondCategory = [
  {
    label: "2-1",
    value: "category2_1",
    selected: false,
  },
  {
    label: "2-2",
    value: "category2_2",
    selected: false,
  },
  {
    label: "2-3",
    value: "category2_3",
    selected: false,
  },
  {
    label: "2-4",
    value: "category2_4",
    selected: false,
  },
  {
    label: "2-5",
    value: "category2_5",
    selected: false,
  },
  {
    label: "2-6",
    value: "category2_6",
    selected: false,
  },
  {
    label: "2-7",
    value: "category2_7",
    selected: false,
  },
];

const handleSelectChange = (header, index, event) => {
  header.value.find((item) => (item.selected = item.value === event.target.value));

  jsondata.value.map((item) => {
    if (event.target.value === "category1") {
      item[header.field]["select"] = JSON.parse(JSON.stringify(firstCategory));
    } else if (event.target.value === "category2") {
      item[header.field]["select"] = JSON.parse(JSON.stringify(secondCategory));
    } else {
      item[header.field]["select"] = [];
    }
  });
};
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
                    if (!headers[index].sticky) {
                      headers.map((item, i) => {
                        item.sticky = i <= index;
                        item.width = i === 0 ? 0 : i <= index ? headerRefs[i].offsetLeft + 1 : 0;
                      });
                    } else {
                      headers.map((item, i) => (item.sticky = false));
                    }
                  }
                "
                :class="{
                  'sticky  bg-[gray] border-[12px] border-solid !border-[#000]': header.sticky,
                }"
              >
                {{ header.label }}

                <div class="relative" :style="{ zIndex: header.sticky ? 999 : 0 }">
                  <select
                    :name="`select_${index}`"
                    :id="`select_${index}`"
                    @change="(event) => handleSelectChange(header, index, event)"
                    :style="{ zIndex: header.sticky ? 999 : 0 }"
                  >
                    <option v-for="item in header.value" :value="item.value" :key="`${item.label}_${index}`">
                      {{ item.label }}
                    </option>
                  </select>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in jsondata" :key="`rows_${index}`" class="relative">
              <td
                v-for="(header, index) in headers"
                class="relative"
                :style="{
                  position: header.sticky ? 'sticky' : 'relative',
                  left: header.sticky ? header.width + 'px' : 0,
                  zIndex: header.sticky ? 999 : 0,
                  background: header.sticky ? 'white' : 'transparent',
                }"
              >
                <Cell
                  v-if="
                    header.value.find((item) => item.selected)?.value !== 'category2' &&
                    header.value.find((item) => item.selected)?.value !== 'category1'
                  "
                  v-model="row[header.field]"
                />
                <div v-else :style="{ zIndex: header.sticky ? 999 : 0 }">
                  <select>
                    <option
                      v-for="item in row[header.field]['select']"
                      :value="item?.value"
                      :key="`${item?.label}_${index}`"
                    >
                      {{ item?.label }}
                    </option>
                  </select>
                </div>
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
