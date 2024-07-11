export default defineNuxtRouteMiddleware((to, from) => {
  console.log("asdasd");
  if (to.params.id === "1") return abortNavigation();

  if (to.path !== "/") return navigateTo("/");
});
