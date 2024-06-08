export default defineNuxtRouteMiddleware((to) => {
  // // skip middleware on server
  // if (import.meta.server) return
  // // skip middleware on client side entirely
  // if (import.meta.client) return
  // // or only skip middleware on initial client load
  // const nuxtApp = useNuxtApp()
  // if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
  const auth = useAuthStore()

  if (auth.isLoggedIn) {
    return navigateTo(auth.user?.is_admin === '1' ? '/admin' : '/', {
      replace: true,
    })
  }
})
