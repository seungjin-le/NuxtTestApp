export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/") setPageLayout("list");
  // if (to.path !== "/") return navigateTo("/");
});
