<script setup>
const Header = defineAsyncComponent(() => import("~/components/containers/Header.vue"));
const Footer = defineAsyncComponent(() => import("~/components/containers/Footer.vue"));
const Section = defineAsyncComponent(() => import("~/components/containers/Section.vue"));
</script>

<template>
  <div class="bg-[#2d2d2d] w-full min-h-[100dvh]">
    <div class="w-full max-w-[1320px] h-full min-h-[100vh] flex flex-col items-center justify-between mx-auto">
      <Section>
        <Header />
        <NuxtPage />
      </Section>
      <Footer />
    </div>
  </div>
</template>
