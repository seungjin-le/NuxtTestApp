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
  <div class="bg-[gray] w-full h-full min-h-[100vh] flex flex-col items-center justify-between">
    <div class="w-full flex flex-col items-center justify-start">
      <Header />
      <NuxtPage />
    </div>
    <Footer class="bg-[red] w-full" />
  </div>
</template>
