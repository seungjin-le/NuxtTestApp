export default defineVueQueryPluginHook(({ queryClient, nuxt }) => {
  return {
    pluginReturn: {},
    vueQueryPluginOptions: { queryClient },
  };
});
