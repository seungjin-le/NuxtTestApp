<script setup>
definePageMeta({
  title: "Index Page",
  layout: "default",
});
</script>

<script>
export default {
  setup() {
    this.asyncData();
    return {};
  },
  async asyncData() {
    console.log("zxcvxzcv");
    alert("xc,vmnbz");
  },
};
</script>

<template>
  <h1 class="bg-[#863939]">Home Page</h1>
  <div>sdfaskldf</div>
</template>
