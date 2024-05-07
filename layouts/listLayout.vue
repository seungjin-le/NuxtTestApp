<script>
export default {
  name: "ListLayout",
  layout: "list",
  head() {
    return {
      title: "Nuxt.js Layouts",
    };
  },
};
</script>
<template>
  <div>
    <div>List Layout</div>
    <slot />
  </div>
</template>
