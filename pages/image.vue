<script setup>
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const img = ref("");
const sliceImg = ref("");
const result = reactive({
  image: "",
  coordinates: {},
});
const editor = ref(null);
const position = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
});

const change = (data) => {};

const runtimeSlice = (data) => {
  result.image = data.image;
  result.coordinates = data.coordinates;
};

const changeFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  img.value = URL.createObjectURL(file);
};

const getCoordinates = () => {
  const { coordinates, canvas } = editor.value.getResult();

  position.width = coordinates.width;
  position.height = coordinates.height;
  position.left = coordinates.left;
  position.top = coordinates.top;

  sliceImg.value = canvas.toDataURL();
};
const version = ref(1);

const download = () => {
  if (version.value !== 3 && !sliceImg.value) return;
  if (version.value === 3 && !result.image) return;
  const a = document.createElement("a");

  a.href = version.value !== 3 ? sliceImg.value : result.image;
  a.download = "slice.png";
  a.click();
};
</script>

<template>
  <div class="size-full flex-1 flex-col-center gap-[20px]">
    <div class="flex-row-center gap-2">
      <button class="text-[24px] text-white border-1 px-[12px] py-[3px] rounded-[5px]" @click="version = 1">
        비율 고정
      </button>
      <button class="text-[24px] text-white border-1 px-[12px] py-[3px] rounded-[5px]" @click="version = 2">
        이미지고정
      </button>
      <button class="text-[24px] text-white border-1 px-[12px] py-[3px] rounded-[5px]" @click="version = 3">
        Version 3
      </button>
    </div>
    <div class="flex-row-center gap-2">
      <input type="file" @change="changeFile" />
      <button class="text-[24px] text-white border-1 px-[12px] py-[3px] rounded-[5px]" @click="getCoordinates">
        자르기
      </button>
      <button class="text-[24px] text-white border-1 px-[12px] py-[3px] rounded-[5px]" @click="download">
        다운로드
      </button>
    </div>
    <div class="flex-row-center gap-[20px] relative">
      <div v-if="version === 1">
        <Cropper
          ref="editor"
          class="w-[800px] h-[800px] bg-n40"
          :src="img"
          @change="change"
          :stencil-props="{
            aspectRatio: 16 / 4, // 시작 비율 16:4
            minAspectRatio: 16 / 4, // 최소 비율 16:4
            maxAspectRatio: 16 / 4, // 최대 비율 16:4
            // movable: false,
            // resizable: false,
          }"
        />
        <div class="absolute top-full translate-y-[20px] right-0 w-[300px] h-[300px] bg-n40 flex-row-center">
          <img v-if="sliceImg" :src="sliceImg" alt="sliceImg" />
        </div>
      </div>
      <div v-if="version === 2">
        <Cropper
          ref="editor"
          class="w-[800px] h-[800px] bg-n40"
          :src="img"
          @change="change"
          :stencil-size="{
            width: 500,
            height: 500,
          }"
          :stencil-props="{
            aspectRatio: 16 / 4, // 시작 비율 16:4
            movable: false,
            resizable: false,
          }"
          image-restriction="stencil"
        />
        <div class="absolute top-full translate-y-[20px] right-0 w-[300px] h-[300px] bg-n40 flex-row-center">
          <img v-if="sliceImg" :src="sliceImg" alt="sliceImg" />
        </div>
      </div>
      <div v-if="version === 3">
        <Cropper
          ref="editor"
          class="w-[800px] h-[800px] bg-n40"
          :src="img"
          @change="runtimeSlice"
          :debounce="false"
          :stencil-props="{
            aspectRatio: 16 / 4, // 시작 비율 16:4
            minAspectRatio: 16 / 4, // 최소 비율 16:4
            maxAspectRatio: 16 / 4, // 최대 비율 16:4
          }"
        />
        <div class="absolute top-full translate-y-[20px] right-0 bg-n40 flex-row-center">
          <Preview
            v-if="result.image"
            :width="result.coordinates.width"
            :height="result.coordinates.height"
            :image="result.image"
            :coordinates="result.coordinates"
          />
        </div>
      </div>
    </div>
  </div>
</template>
