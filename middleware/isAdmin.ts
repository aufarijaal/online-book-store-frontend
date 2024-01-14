export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (auth.user && !parseInt(auth.user.is_admin)) {
    return navigateTo("/", { replace: true });
  }
});
