<script>
import Header from "~/components/containers/Header.vue";
import Footer from "~/components/containers/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<template>
  <div class="bg-[#2d2d2d] w-full h-full min-h-[100vh] flex flex-col items-center justify-between">
    <NuxtPage />
  </div>
</template>
