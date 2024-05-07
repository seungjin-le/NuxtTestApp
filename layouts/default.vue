<script>
export default {
  name: "DefaultLayout",
  layout: "default",
  head() {
    return {
      title: "Nuxt.js Layouts",
    };
  },
};
</script>

<template>
  <div>
    <div>Default Layout</div>
    <slot />
  </div>
</template>
