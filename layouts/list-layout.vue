<script>
export default {
  name: "ListLayout",
  components: {
    Header: () => import("~/components/containers/Header.vue"),
  },
};
</script>

<template>
  <div>
    <Header />

    <NuxtPage />
  </div>
</template>
