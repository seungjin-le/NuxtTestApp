<script>
export default {
  components: {
    Header: defineAsyncComponent(() => import("~/components/containers/Header.vue")),
    Footer: defineAsyncComponent(() => import("~/components/containers/Footer.vue")),
    Section: defineAsyncComponent(() => import("~/components/containers/Section.vue")),
  },
};
</script>

<template>
  <div class="bg-[#2d2d2d] w-full h-full min-h-[100vh] flex flex-col items-center justify-between">
    <Section>
      <NuxtPage />
    </Section>
  </div>
</template>
